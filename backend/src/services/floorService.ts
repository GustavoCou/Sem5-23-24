import { Container, Service, Inject } from 'typedi';
import config from "../../config";
import { IFloorDTO } from "../dto/IFloorDTO";
import { Floor } from "../domain/Floor/Floor";
import IFloorRepo from "./IRepos/IFloorRepo";
import IFloorService from "./IServices/IFloorService";
import { Result } from "../core/logic/Result";
import { FloorMap } from "../mappers/FloorMap";
import IBuildingRepo from './IRepos/IBuildingRepo';
import { Building } from '../domain/Building/Building';
import { FloorDescription } from '../domain/Floor/FloorDescription';
import { FloorSize } from '../domain/Floor/FloorSize';
import { FloorID } from '../domain/Floor/FloorID';
import { FloorMapa } from '../domain/Floor/FloorMapa';
import { IFloorMapDTO } from '../dto/IFloorMapDTO';
import { floor, isEmpty } from 'lodash';


@Service()
export default class FloorService implements IFloorService {
  constructor(
    @Inject(config.repos.floor.name) private floorRepo: IFloorRepo,
    @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo,
  ) { }

  public async createFloor(floorDTO: IFloorDTO): Promise<Result<IFloorDTO>> {
    try {
      const floorDocument = await this.floorRepo.findByDomainId(floorDTO.id);
      const found = !!floorDocument;

      if (found) {
        return Result.fail<IFloorDTO>("Floor already exists with id = " + floorDTO.id);
      }

      const floorDescriptionOrError = FloorDescription.create(floorDTO.floorDescription);
      if (floorDescriptionOrError.isFailure) {
        return Result.fail<IFloorDTO>('Descrição inválida');
      }

      const floorDescription = floorDescriptionOrError.getValue();

      // Verificar se a descrição excede o limite de 250 caracteres
      if (floorDescription.value.length > 250) {
        return Result.fail<IFloorDTO>('Floor Description não deve ter mais do que 250 caracteres');
      }

      const floorSizeOrError = FloorSize.create(floorDTO.floorSize.width, floorDTO.floorSize.depth);
      if (floorSizeOrError.isFailure) {
        return Result.fail<IFloorDTO>(floorSizeOrError.errorValue());
      }

      const width = Number(floorDTO.floorSize.width);

      // Verificar se a largura está entre 0 e 10
      if (width < 0 || width > 10) {
        return Result.fail<IFloorDTO>('Floor Size must be between 0 and 10');
      }

      const depth = Number(floorDTO.floorSize.depth);

      // Verificar se a profundidade está entre 0 e 10
      if (depth < 0 || depth > 10) {
        return Result.fail<IFloorDTO>('Floor Size must be between 0 and 10');
      }

      const buildingOrError = await this.getBuilding(floorDTO.building);
      if (buildingOrError.isFailure) {
        return Result.fail<IFloorDTO>(buildingOrError.errorValue());
      }

      const floorMapaOrError = FloorMapa.create(floorDTO.floorMapa);
      if (floorMapaOrError.isFailure) {
          return Result.fail<IFloorDTO>(floorMapaOrError.errorValue());
      }

      const id = FloorID.create(floorDTO.id);

      const floorOrError = await Floor.create({
        ...floorDTO,
        floorDescription: floorDescriptionOrError.getValue(),
        floorSize: floorSizeOrError.getValue(),
        building: buildingOrError.getValue(),
        floorMapa: floorMapaOrError.getValue(),
      }, id.getValue());

      if (floorOrError.isFailure) {
        return Result.fail<IFloorDTO>(floorOrError.errorValue());
      }

      const floorResult = floorOrError.getValue();

      await this.floorRepo.save(floorResult);

      const floorDTOResult = FloorMap.toDTO(floorResult) as IFloorDTO;

      return Result.ok<IFloorDTO>(floorDTOResult);
    } catch (e) {
      console.error("An error occurred:", e);
      return Result.fail<IFloorDTO>("An unexpected error occurred. Please try again later.");
    }
  }

  public async  existFloor(buildingId :string ,floorId: string): Promise<Result<boolean>>{

    const floor = await this.floorRepo.existFloorByBuildingAndFloorId(buildingId,floorId);

    const found = !!floor;

    if(found){
      return Result.ok<boolean>(found);
    }


    return Result.ok<boolean>(false);
  }




  public async updateFloor(floorDTO: IFloorDTO): Promise<Result<IFloorDTO>> {
      const floorUpdate = await this.floorRepo.findByDomainId(floorDTO.id);
 
      if (floorUpdate === null) {
        return Result.fail<IFloorDTO>("Floor not found");
      }

      if (floorUpdate.building.id.toString() !== floorDTO.building) {
        return Result.fail<IFloorDTO>('Building mismatch');
      }

      try {
        if(floorDTO.floorDescription != null || floorDTO.floorDescription == '') {
          await floorUpdate.setDescription(floorDTO.floorDescription);
        }

        if(floorDTO.floorSize.width != null || floorDTO.floorSize.depth != null) {
          await floorUpdate.setSize(floorDTO.floorSize.width, floorDTO.floorSize.depth);
        }

        await this.floorRepo.updateOne(floorUpdate);

        return Result.ok<IFloorDTO>(floorDTO);
    } catch (e) {
      console.error("An error occurred:", e);
      return Result.fail<IFloorDTO>("An unexpected error occurred. Please try again later.");
    }
  }

  private async getBuilding(BuildingId: string): Promise<Result<Building>> {

    const building = await this.buildingRepo.findById(BuildingId);
    const found = !!building;

    if (found) {
      return Result.ok<Building>(building);
    } else {
      return Result.fail<Building>("Couldn't find building by id =" + BuildingId);
    }
  }

    public async  uploadMap(floorDTO: IFloorDTO,map : IFloorMapDTO) : Promise<Result<IFloorDTO>>{
      
      const existsBuilding = await this.buildingRepo.exists(floorDTO.building as any);
     
      if(!existsBuilding){
        return Result.fail<IFloorDTO>("Building not exists");
      }
      
      let floor = await this.floorRepo.findByDomainId(floorDTO.id as any);

      if(floor==null){
        return Result.fail<IFloorDTO>("floor not exists");
      }
           
      if(floor.uploadMap(map).isFailure){
        return Result.fail<IFloorDTO>("Error in the creation the mapper ");
      };

      this.floorRepo.updateOne(floor);
 
      return Result.ok<IFloorDTO>(FloorMap.toDTO(floor));  
  }

  public async getFloor(): Promise<Result<IFloorDTO[]>> {
    try {
      const floors: Floor[] = await this.floorRepo.getAll();
      const floorDTO: IFloorDTO[] = [];

      for(var i = 0; i < floors.length; i++) {
        const getFloor: Floor = floors[i];
        var floorDTOSingle = await FloorMap.toDTO(getFloor);
        floorDTO.push(floorDTOSingle);
      }

    return Result.ok <IFloorDTO[]>(floorDTO);
    } catch(e) {
      console.error("An error occurred:", e);
    }
  }

  public async getFloorByBuilding(buildingId: string): Promise<Result<IFloorDTO[]>> {
    try {
      const floors = await this.floorRepo.findFloorsByBuilding(buildingId);
  
      if (floors === null) {
        return Result.fail<IFloorDTO[]>('No floors found for the building');
      } else {
        const floorDTOs: IFloorDTO[] = [];
        for (const floor of floors) {
          const floorDTO = await FloorMap.toDTO(floor);
          floorDTOs.push(floorDTO);
        }
        return Result.ok<IFloorDTO[]>(floorDTOs);
      }
    } catch (e) {
      console.error("An error occurred:", e);
    }
  }
  
  public async countFloorsByBuilding(buildingId: string): Promise<Result<number>> {
    try {
        const count = await this.floorRepo.countFloorsByBuilding(buildingId);
        return Result.ok<number>(count);
    } catch (e) {
      console.error("An error occurred:", e);
    }
  }

  public async countTotalFloorsByBuildings(): Promise<Result<{ buildingId: string; totalFloors: number }[]>> {
    try {
        const buildings = await this.buildingRepo.listAll();
        const counts: { buildingId: string; totalFloors: number }[] = [];

        for (const building of buildings) {
            const count = await this.floorRepo.countFloorsByBuilding(building.id.toString());
            counts.push({ buildingId: building.id.toString(), totalFloors: count });
        }

        return Result.ok(counts);
    } catch (e) {
      console.error("An error occurred:", e);
    }
}

public async getBuildingsInFloorRange(minFloors: number, maxFloors: number): Promise<Result<{ buildingId: string; floorIds: string[]; totalFloors: number }[]>> {
  try {
    const result = await this.countTotalFloorsByBuildings(); // Obtenha o total de pisos por edifício

    if (result.isFailure) {
      return Result.fail<{ buildingId: string; floorIds: string[]; totalFloors: number }[]>("Failed to get building counts");
    }

    const buildingCounts = result.getValue();
    const groupedBuildings: { [key: string]: { buildingId: string; floorIds: string[]; totalFloors: number } } = {};

    for (const count of buildingCounts) {
      if (count.totalFloors >= minFloors && count.totalFloors <= maxFloors) {
        const floors = await this.floorRepo.findFloorsByBuilding(count.buildingId);

        if (!groupedBuildings[count.buildingId]) {
          groupedBuildings[count.buildingId] = {
            buildingId: count.buildingId,
            floorIds: [],
            totalFloors: count.totalFloors,
          };
        }

        for (const floor of floors) {
          groupedBuildings[count.buildingId].floorIds.push(floor.id.toString());
        }
      }
    }

    const filteredBuildings = Object.values(groupedBuildings);

    return Result.ok<{ buildingId: string; floorIds: string[]; totalFloors: number }[]>(filteredBuildings);
  } catch (error) {
    throw error;
  }
}


public async getFloorsInFloorRange(minFloors: number, maxFloors: number): Promise<Result<{ buildingId: string; floors: IFloorDTO[] }[]>> {
  try {
    const result = await this.countTotalFloorsByBuildings(); // Obtenha o total de pisos por edifício

    if (result.isFailure) {
      return Result.fail<{ buildingId: string; floors: IFloorDTO[] }[]>("Failed to get building counts");
    }

    const buildingCounts = result.getValue();
    const filteredBuildings: { buildingId: string; floors: IFloorDTO[] }[] = [];

    for (const count of buildingCounts) {
      if (count.totalFloors >= minFloors && count.totalFloors <= maxFloors) {
        const floors = await this.floorRepo.findFloorsByBuilding(count.buildingId);
        const floorDTOs: IFloorDTO[] = [];

        for (const floor of floors) {
          const floorDTO = await FloorMap.toDTO(floor);
          floorDTOs.push(floorDTO);
        }

        filteredBuildings.push({ buildingId: count.buildingId, floors: floorDTOs });
      }
    }

    return Result.ok<{ buildingId: string; floors: IFloorDTO[] }[]>(filteredBuildings);
  } catch (error) {
    throw error;
  }
}



}