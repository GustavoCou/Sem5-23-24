import { expect } from 'chai';

import { Building, BuildingProps } from '../../../src/domain/Building/Building';
import { BuildingName } from '../../../src/domain/Building/BuildingName';
import { BuildingDescription } from '../../../src/domain/Building/BuildingDescription';
import { BuildingSize } from '../../../src/domain/Building/BuildingSize';
import { BuildingId } from '../../../src/domain/Building/BuildingId';
import BuildingService from '../../../src/services/BuildingService';
import  IBuildingDTO  from '../../../src/dto/IBuildingDTO';
import { BuildingMap } from '../../../src/mappers/BuildingMap';

interface PersistenceProps{
  id : string,
  name : string,
  description: string,
  width: number,
  depth : number
}



// Mock IBuildingRepo 
 export class BuildingRepoMock {
  
   persistenceInstance : PersistenceProps[];

 public constructor (){
  this.persistenceInstance =[];
 }
 

 public findById(id: string): Promise<Building | null> {
    
    for(let i=0; i<this.persistenceInstance.length;i++){
      
      if(this.persistenceInstance[i].id === id){
          BuildingMap.toDomain(this.persistenceInstance[i]);
        const temp:BuildingProps ={
            name: BuildingName.create(this.persistenceInstance[i].name).getValue(),
            description: BuildingDescription.create(this.persistenceInstance[i].description).getValue(),
            size: BuildingSize.create(this.persistenceInstance[i].width,this.persistenceInstance[i].depth).getValue(),

        }
        const tempid= BuildingId.create(this.persistenceInstance[i].id).getValue();
        return Promise.resolve(Building.create(temp,tempid).getValue()) ;
      }
     
    }
    return Promise.resolve(null);
  }

  public save(building: Building): Promise<void> {
    
    const buildingPersistence : PersistenceProps ={
       id: building.id.toString(),
       name: building.name,
       description: building.description,
       width: building.width,
       depth: building.depth
    }

    this.persistenceInstance.push(buildingPersistence);
    return Promise.resolve();
  }

  public listAll(): Promise<Building[]> {
    
    let buildingList :Building[]= [];
    for(let i=0; i<this.persistenceInstance.length;i++){
     
  
             const temp:BuildingProps ={
            name: BuildingName.create(this.persistenceInstance[i].name).getValue(),
            description: BuildingDescription.create(this.persistenceInstance[i].description).getValue(),
            size: BuildingSize.create(this.persistenceInstance[i].width,this.persistenceInstance[i].depth).getValue(),

        }
        const tempid= BuildingId.create(this.persistenceInstance[i].id).getValue();
        buildingList.push((Building.create(temp,tempid).getValue()));
      
     
    }
  
    return Promise.resolve(buildingList);
  }

  public updateOne(building: Building): Promise<void> {
    const index = this.persistenceInstance.findIndex(item => item.id === building.id.toString());
  
    if (index !== -1) {
      this.persistenceInstance[index] = {
        id: building.id.toString(),
        name: building.name,
        description: building.description,
        width: building.width,
        depth: building.depth
      };
      return Promise.resolve();
    }
  
    return Promise.reject("Building not found");
  }
  
}

describe('BuildingService', () => {
  let buildingService: BuildingService;

  beforeEach(() => {
    const buildingRepo = new BuildingRepoMock() as any;
    buildingService = new BuildingService(buildingRepo);
  });

  it('should create a building', async () => {
    const buildingDTO: IBuildingDTO = {
      id: '1',
      name: 'Building Name',
      description: 'Building Description',
      width: 10,
      depth: 5,
    };

    const result = await buildingService.CreateBuilding(buildingDTO);

    expect(result.isSuccess).to.be.true;
    expect(result.getValue().id).to.equal(buildingDTO.id);
  });

  it('should list buildings', async () => {

    const buildingDTO1: IBuildingDTO = {
      id: '1',
      name: 'Building Name',
      description: 'Building Description',
      width: 10,
      depth: 5,
    };

    const result1 = await buildingService.CreateBuilding(buildingDTO1);
    const buildingDTO2: IBuildingDTO = {
      id: '2',
      name: 'Building Name',
      description: 'Building Description',
      width: 10,
      depth: 5,
    };

    const result2 = await buildingService.CreateBuilding(buildingDTO2);


    const result = await buildingService.ListBuilding();

    expect(result.isSuccess).to.be.true;
    expect(result.getValue().length).to.equal(2); 
  });

  it('should update a building', async () => {
    
    const buildingDTO1: IBuildingDTO = {
      id: '1',
      name: 'Building Name',
      description: 'Building Description',
      width: 10,
      depth: 5,
    };

    const result1 = await buildingService.CreateBuilding(buildingDTO1);

    const buildingDTO: IBuildingDTO = {
      id: '1',
      name: 'updated',
      description: 'Updated Building Description',
      width: 8,
      depth: 10,
    };

    const result = await buildingService.updateBuilding(buildingDTO);

    expect(result.isSuccess).to.be.true;
    expect(result.getValue().id).to.be.equal(buildingDTO.id);
    expect(result.getValue().name).to.be.equal(buildingDTO.name);
    expect(result.getValue().description).to.be.equal(buildingDTO.description);
    expect(result.getValue().width).to.be.equal(buildingDTO.width);
    expect(result.getValue().depth).to.be.equal(buildingDTO.depth);
  });
});
