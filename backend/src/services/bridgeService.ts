import { Inject, Service } from "typedi";
import config from "../../config";

import { Result } from "../core/logic/Result";
import { FloorID } from "../domain/Floor/FloorID";
import IFloorRepo from "./IRepos/IFloorRepo";
import { Bridge } from "../domain/Bridge/Bridge";
import IBridgeDTO from "../dto/IBridgeDTO";
import IBridgeService from "./IServices/IBridgeService";
import IBridgeRepo from './IRepos/IBridgeRepo';
import { BridgeMap } from "../mappers/BridgeMap";
import { BridgeId } from "../domain/Bridge/BridgeId";
import { IFloorDTO } from "../dto/IFloorDTO";
import IBridgeInformationDTO from "../dto/IBridgeInformationDTO";
import { BridgeMapInformation } from "../mappers/BridgeMapInformation";
import { BuildingId } from "../domain/Building/BuildingId";
import { BridgePosition } from "../domain/Bridge/BridgePosition";
import { Floor } from "../domain/Floor/Floor";
import { Building } from "../domain/Building/Building";
import IBuildingRepo from "./IRepos/IBuildingRepo";
import BridgeError from '../exceptions/bridgeException';


@Service()
export default class BridgeService implements IBridgeService {
    constructor(
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo,
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo,
        @Inject(config.repos.bridge.name) private bridgeRepo: IBridgeRepo
    ) { }


    public async createBridge(bridgeDTO: IBridgeDTO): Promise<Result<IBridgeDTO>> {
        try {


            const bridgeOrError = await this.getBridge(bridgeDTO.bridgeId);
            if (!bridgeOrError.isFailure) {
                return Result.fail<IBridgeDTO>(new BridgeError("Bridge already exist"));
            }

            const floorOrError = await this.getFloorId(bridgeDTO.floorIdX, bridgeDTO.floorIdY);
            if (!floorOrError) {
                return Result.fail<IBridgeDTO>(new BridgeError("Invalid Id Floor"));
            }

            const checkSameBuilding = await this.sameBuilding(bridgeDTO.floorIdX, bridgeDTO.floorIdY);
            if (!checkSameBuilding) {
                return Result.fail<IBridgeDTO>(new BridgeError("Floors are in the same building. Bridge not created"));
            }

            const checkBridgeBetweenFloors = await this.bridgeBetweenFloors(bridgeDTO.floorIdX, bridgeDTO.floorIdY);
            if (checkBridgeBetweenFloors) {
                return Result.fail<IBridgeDTO>(new BridgeError("Floors are already connected"));
            }

            const buildingResults = await this.getBuildingByFloor(bridgeDTO.floorIdX, bridgeDTO.floorIdY);
            if (!buildingResults) {

                return Result.fail<IBridgeDTO>(new BridgeError("Not possible to get the building"));
            }
            const [building1, building2] = buildingResults.getValue();

            bridgeDTO.buildingX = building1.id.toString();
            bridgeDTO.buildingY = building2.id.toString();




            const bridgeOuErro = await Bridge.create(bridgeDTO);

            if (bridgeOuErro.isFailure) {
                return Result.fail<IBridgeDTO>(new BridgeError(bridgeOuErro.errorValue()));
            }

            const bridgeResult = bridgeOuErro.getValue();

            await this.bridgeRepo.save(bridgeResult);

            const bridgeDTOResult = BridgeMap.toDTO(bridgeResult) as IBridgeDTO;

            return Result.ok<IBridgeDTO>(bridgeDTO);
        } catch (error) {
            throw error;
        }
    }

    public async getBuildingByFloor(floorId1: string, floorId2: string): Promise<Result<BuildingId[]>> {

        try {


            let floorIdsList: BuildingId[] = [];

            const item = await this.floorRepo.findByDomainId(floorId1);
            const item2 = await this.floorRepo.findByDomainId(floorId2);

            if (!item && !item2) {
                return Result.fail<BuildingId[]>(new BridgeError("Get building by floor failed"));
            }

            floorIdsList.push(await BuildingId.create(item.building.id.toString()).getValue());
            floorIdsList.push(await BuildingId.create(item2.building.id.toString()).getValue());




            return Result.ok<BuildingId[]>(floorIdsList);

        } catch (error) {
            throw error;

        }
    }


    public async sameBuilding(floorId1: string, floorId2: string): Promise<Boolean> {

        try {
            const item1 = await this.floorRepo.findByDomainId(floorId1);
            const item2 = await this.floorRepo.findByDomainId(floorId2);

            if (item1.building.id.toString() == item2.building.id.toString()) {
                Result.fail<IBridgeDTO>(new BridgeError("Floors are in the same building"));
                return false;
            } else {
                return true;
            }
        } catch (error) {
            throw error;

        }
    }



    public async getBridge(bridgeId: string): Promise<Result<BridgeId>> {

        try {
            const bridge = await this.bridgeRepo.findById(bridgeId);


            if (!bridge) {

                return Result.fail<BridgeId>(new BridgeError("The bridge already exist"));

            }

            const bridgeIdInstance = BridgeId.create(bridgeId);


            if (bridgeIdInstance.isFailure) {
                return Result.fail<BridgeId>(new BridgeError("Not possible to create Bridge id"));
            }

            return Result.ok<BridgeId>(bridgeIdInstance.getValue());

        } catch (error) {
            throw error;
        }
    }


    private async getFloorId(floorId1: string, floorId2: string): Promise<Boolean> {

        try {
            const floor1 = await this.floorRepo.findByDomainId(floorId1);

            const floor2 = await this.floorRepo.findByDomainId(floorId2);

            const found1 = !!floor1;
            const found2 = !!floor2;

            if (found1 && found2) {

                const floor1Instance = FloorID.create(floorId1);
                const floor2Instance = FloorID.create(floorId2);

                Result.ok<FloorID>(floor1Instance.getValue());
                Result.ok<FloorID>(floor2Instance.getValue());

                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw error;
        }
    }

    private async bridgeBetweenFloors(floorId1: string, floorId2: string): Promise<boolean> {
        try {

            const bridgeFloors = await this.bridgeRepo.bridgeWithFloors(floorId1, floorId2);

            if (bridgeFloors) {
                return true;

            } else {
                return false;
            }
        } catch (error) {
            throw error;
        }



    }


    public async getAllFloorsWithBridges(building: string): Promise<Result<{ bridgeInformationDTO: IBridgeInformationDTO[] }>> {


        try {

            const checkBuilding = await this.buildingRepo.findById(building.toString());

            const found = !!checkBuilding;


            if (!found) {
                return Result.fail<{ bridgeInformationDTO: IBridgeInformationDTO[] }>(new BridgeError("Invalid building"));

            }


            const bridges: Bridge[] = await this.bridgeRepo.listAllWithBuilding(checkBuilding);

            if (bridges.length == 0) {
                return Result.fail<{ bridgeInformationDTO: IBridgeInformationDTO[] }>(new BridgeError("This building has no bridge"));

            }
            const bridgeInformationDTO: IBridgeInformationDTO[] = [];

            for (let i = 0; i < bridges.length; i++) {

                const getBridge: Bridge = await bridges[i];

                const floorX = await this.floorRepo.findByDomainId(getBridge.floorIdX.toString());
                const floorY = await this.floorRepo.findByDomainId(getBridge.floorIdY.toString());

                if (floorX.building.id.toString() == building) {

                    let information = (await BridgeMapInformation.toDTO(getBridge, floorX, floorY));
                    bridgeInformationDTO.push(information);

                } else {
                    let information2 = (await BridgeMapInformation.toDTO(getBridge, floorY, floorX));

                    bridgeInformationDTO.push(information2);
                }
            }
            return Result.ok<{ bridgeInformationDTO: IBridgeInformationDTO[] }>({ bridgeInformationDTO });

        } catch (error) {
            throw error;
        }
    }

    public async updateBridge(bridgeDTO: IBridgeDTO): Promise<Result<{ bridgeDTO: IBridgeDTO }>> {

        const bridgeToUpdate = await this.bridgeRepo.findAndGiveBridge(bridgeDTO.bridgeId);



        try {

            if (bridgeToUpdate === null || bridgeToUpdate == undefined) {
                return Result.fail<{ bridgeDTO: IBridgeDTO }>(new BridgeError("Bridge does not exist"));
            }


            if (bridgeDTO.floorIdX != null) {

                bridgeToUpdate.props.floorIdX = await FloorID.create(bridgeDTO.floorIdX).getValue();

            }

            if (bridgeDTO.floorIdY != null) {
                bridgeToUpdate.props.floorIdY = await FloorID.create(bridgeDTO.floorIdY).getValue();
            }

            const floorOrError = await this.getFloorId(bridgeDTO.floorIdX, bridgeDTO.floorIdY);

            if (!floorOrError) {
                return Result.fail<{ bridgeDTO: IBridgeDTO }>(new BridgeError("Floor does not exist"));
            }

            if (bridgeDTO.bridgePositionX != null) {
                bridgeToUpdate.props.bridgePositionX = await BridgePosition.create(bridgeDTO.bridgePositionX).getValue();
            }

            if (bridgeDTO.bridgePositionY != null) {
                bridgeToUpdate.props.bridgePositionY = await BridgePosition.create(bridgeDTO.bridgePositionY).getValue();
            }

            const checkSameBuilding = await this.sameBuilding(bridgeDTO.floorIdX, bridgeDTO.floorIdY);
            if (!checkSameBuilding) {
                return Result.fail<{ bridgeDTO: IBridgeDTO }>(new BridgeError("Floors are in the same building. Bridge not updated"));
            }

            const checkBridgeBetweenFloors = await this.bridgeBetweenFloors(bridgeDTO.floorIdX, bridgeDTO.floorIdY);
            if (checkBridgeBetweenFloors) {
                return Result.fail<{ bridgeDTO: IBridgeDTO }>(new BridgeError("Floors are already connected"));
            }



            const buildingResults = await this.getBuildingByFloor(bridgeDTO.floorIdX, bridgeDTO.floorIdY);

            const [building1, building2] = buildingResults.getValue();

            bridgeDTO.buildingX = building1.id.toString();
            bridgeDTO.buildingY = building2.id.toString();

            bridgeToUpdate.props.buildingY = await BuildingId.create(bridgeDTO.buildingY).getValue();

            bridgeToUpdate.props.buildingX = await BuildingId.create(bridgeDTO.buildingX).getValue();

            await this.bridgeRepo.updateOne(bridgeToUpdate);
            return Result.ok<{ bridgeDTO: IBridgeDTO }>({ bridgeDTO });
        } catch (error) {
            throw error;
        }
    }


    public async getAll(): Promise<Result<IBridgeDTO[]>> {

        try {

            const bridges = await this.bridgeRepo.listAll();

            if (bridges.length != 0) {

                const toDTO = bridges.map((bridges) => BridgeMap.toDTO(bridges) as IBridgeDTO);

                return Result.ok<IBridgeDTO[]>(toDTO)
            } else {
                return Result.fail<IBridgeDTO[]>(new BridgeError("No bridges to list"));
            }

        } catch (error) {
            throw error;

            //return Result.fail<>
        }
    }

    public async listBridgesOfBuildings(buildingX: string, buildingY: string): Promise<Result<IBridgeDTO[]>> {

        try {


            const checkBuilding = await this.buildingRepo.findById(buildingX.toString());
            const checkBuilding2 = await this.buildingRepo.findById(buildingY.toString());

            const found = !!checkBuilding;
            const found2 = !!checkBuilding2;


            if (!found) {
                return Result.fail<IBridgeDTO[]>(new BridgeError("Invalid building"));

            }

            if (!found2) {
                return Result.fail<IBridgeDTO[]>(new BridgeError("Invalid building"));

            }
            const bridges = await this.bridgeRepo.getBridgeBetweenBuildingsId(checkBuilding.id.toString(), checkBuilding2.id.toString());

            if (bridges.length != 0) {

                const toDTO = bridges.map((bridges) => BridgeMap.toDTO(bridges) as IBridgeDTO);

                return Result.ok<IBridgeDTO[]>(toDTO)
            } else {
                return Result.fail<IBridgeDTO[]>(new BridgeError("No bridges to list"));
            }

        } catch (error) {
            throw error;
        }
    }
}