import { Inject, Service } from "typedi";
import config from "../../config";
import IElevatorService from "./IServices/IElevatorService";
import { Result } from "../core/logic/Result";
import IElevatorDTO from "../dto/IElevatorDTO";
import IElevatorRepo from "./IRepos/IElevatorRepo";
import { Elevator } from "../domain/Elevator/Elevator";
import { ElevatorMap } from "../mappers/ElevatorMap";
import IBuildingRepo from './IRepos/IBuildingRepo';

import { BuildingId } from "../domain/Building/BuildingId";
import { FloorID } from "../domain/Floor/FloorID";
import IFloorRepo from "./IRepos/IFloorRepo";
import { ElevatorSerialNumber } from "../domain/Elevator/ElevatorSerialNumber";
import { IFloorDTO } from "../dto/IFloorDTO";
import { FloorMap } from "../mappers/FloorMap";
import { ElevatorId } from "../domain/Elevator/ElevatorId";


@Service()
export default class ElevatorService implements IElevatorService {
    constructor(
        @Inject(config.repos.elevator.name) private elevatorRepo: IElevatorRepo,
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo,
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo,
    ) { }

    public async createElevator(elevatorDTO: IElevatorDTO): Promise<Result<IElevatorDTO>> {

        try {

            const countElevators = await this.countElevatorsByBuilding(elevatorDTO.buildingId);

            elevatorDTO.elevatorUniqueCodBuilding = countElevators + 1;

            const elevatorOuErro = await Elevator.create(elevatorDTO);


            if (elevatorOuErro.isFailure) {

                return Result.fail<IElevatorDTO>(elevatorOuErro.errorValue());
            }

            const elevatorResult = elevatorOuErro.getValue();

            const idOrError = await this.checkId(elevatorDTO.elevatorId);

            if (idOrError.isFailure) {

                return Result.fail<IElevatorDTO>("Elevator Id already exist");
            }

            const buildingOrError = await this.getBuilding(elevatorDTO.buildingId);

            if (buildingOrError.isFailure) {

                return Result.fail<IElevatorDTO>("Building doesn´t exist");

            }


            const serialNumberOrError = await this.checkSerialNumber(elevatorDTO.elevatorSerialNumber);

            if (serialNumberOrError.isFailure) {

                return Result.fail<IElevatorDTO>("Serial Number Already Exists");

            }

            const floorOrError = await this.getFloorId(elevatorDTO.floorIds);


            if (floorOrError.isFailure) {

                return Result.fail<IElevatorDTO>("The Floor dont exist");

            }


            const floorSameBuilding = await this.checkFloorAndBuilding(elevatorDTO.floorIds, elevatorDTO.buildingId);


            if (!floorSameBuilding) {

                return Result.fail<IElevatorDTO>("Floor and building doesn´t match");
            }

            const sameFloor = await this.checkFloorIds(elevatorDTO.floorIds);


            if (!sameFloor) {

                return Result.fail<IElevatorDTO>("The elevator has duplicated floors");
            }

            await this.elevatorRepo.save(elevatorResult);

            const elevatorDTOResult = ElevatorMap.toDTO(elevatorResult) as IElevatorDTO;

            return Result.ok<IElevatorDTO>(elevatorDTOResult);
        } catch (e) {


            throw e;
        }
    }
    private async checkFloorIds(floorIds: string[]): Promise<boolean> {

        try {

            const uniqueFloorIds = new Set();
            for (const floorId of floorIds) {
                if (uniqueFloorIds.has(floorId)) {
                    return false;
                }
                uniqueFloorIds.add(floorId);
            }
            return true;
        } catch (e) {
            throw e;

        }
    }


    private async countElevatorsByBuilding(buildingId: string): Promise<any> {

        try {

            const numberOfElevators = await this.elevatorRepo.countElevatorsByBuilding(buildingId);

            return numberOfElevators;

        } catch (e) {
            throw e;
        }
    }


    private async checkId(elevatorId: string): Promise<Result<ElevatorId>> {

        try {
            const checkId = await this.elevatorRepo.findId(elevatorId);
            const found = !!checkId;


            if (found) {

                return Result.fail<ElevatorId>("Elevator Id already exist");
            } else {
                const checkIdResult = ElevatorId.create(elevatorId);

                return Result.ok<ElevatorId>(checkIdResult.getValue());
            }

        } catch (e) {
            throw e;
        }
    }


    private async checkFloorAndBuilding(floorIds: string[], buildingId: string): Promise<Boolean> {

        try {

            let boolean = true;

            for (let i = 0; i < floorIds.length; i++) {
                const item = await this.floorRepo.findByDomainId(floorIds[i].toString());

                // if (item.building.id.toString() != buildingId) {

                //     Result.fail<IElevatorDTO>("Floor" + floorIds[i].toString() + "doesnt belong to the builing" + buildingId);

                //     return false;

                // } else {

                //     return true;
                // }

                if (item.building.id.toString() != buildingId) {
                    boolean = false;
                }
            }

            if (boolean == false) {
                Result.fail<IElevatorDTO>("A Floor doesnt belong to the builing");
                return false;

            }
            return true;
        } catch (e) {
            throw e;

        }
    }


    private async getBuilding(buildingId: string): Promise<Result<BuildingId>> {

        try {
            const building = await this.buildingRepo.findById(buildingId);
            const found = !!building;


            if (found) {

                const buildingIdInstance = BuildingId.create(buildingId);

                if (buildingIdInstance.isFailure) {
                    return Result.fail<BuildingId>(buildingIdInstance.errorValue());
                }

                return Result.ok<BuildingId>(buildingIdInstance.getValue());
            } else {
                return Result.fail<BuildingId>("Building doesn't exist!");

            }


        } catch (e) {
            throw e;
        }
    }

    private async checkSerialNumber(elevatorSerialNumber: string): Promise<Result<ElevatorSerialNumber>> {

        try {

            if (elevatorSerialNumber != undefined) {

                const serialNumber = await this.elevatorRepo.findBySerialNumber(elevatorSerialNumber);
                const found = !!serialNumber;

                if (found) {
                    return Result.fail<ElevatorSerialNumber>("Serial Number Already Exists");
                } else {
                    const serialNumberInstance = ElevatorSerialNumber.create(elevatorSerialNumber);
                    return Result.ok<ElevatorSerialNumber>(serialNumberInstance.getValue());
                }
            } return Result.ok<ElevatorSerialNumber>(null);


        } catch (e) {
            throw e;
        }
    }



    private async getFloorId(floorIds: string[]): Promise<Result<FloorID[]>> {

        try {
            let floorIdsList: FloorID[] = [];
            for (let i = 0; i < floorIds.length; i++) {
                const item = await this.floorRepo.findByDomainId(floorIds[i].toString());

                if (!item) {
                    return Result.fail<FloorID[]>("The Floor id: " + floorIds[i] + " dont exist");
                }

                floorIdsList.push(await FloorID.create(item.id.toString()).getValue());


            }

            return Result.ok<FloorID[]>(floorIdsList);
        }

        catch (e) {
            throw e;
        }
    }

    public async getFloorsServed(buildingId: BuildingId | string): Promise<Result<{ elevatorId: string, floors: IFloorDTO[] }[]>> {

        const elevatorsResult = await this.elevatorRepo.findByBuildingId(buildingId);

        if (elevatorsResult.isFailure || !elevatorsResult.getValue().elevatorList || elevatorsResult.getValue().elevatorList.length === 0) {
            console.error("Building with id =", buildingId, "doesn't exist or has no elevators.");
            return Result.fail<{ elevatorId: string, floors: IFloorDTO[] }[]>("Building with id = " + buildingId + " has no elevators.");
        }

        const elevators = elevatorsResult.getValue().elevatorList;

        let result: { elevatorId: string, floors: IFloorDTO[] }[] = [];

        for (let i = 0; i < elevators.length; i++) {
            const elevatorId = elevators[i].elevatorUniqueCodBuilding.toString();
            const floorsServed = elevators[i].floorIds;

            let floorInfoList: IFloorDTO[] = [];

            for (let j = 0; j < floorsServed.length; j++) {
                const floorDocument = await this.floorRepo.findByDomainId(floorsServed[j]);
                const floorInfo = await FloorMap.toDTO(floorDocument);

                // Exclude the floor mapper from the DTO if needed
                floorInfo.floorMapa = undefined;

                floorInfoList.push(floorInfo);
            }

            result.push({
                elevatorId: elevatorId,
                floors: floorInfoList,
            });
        }

        const flattenedResult: { elevatorId: string, floors: IFloorDTO[] }[] = result.reduce((acc, val) => acc.concat(val), []);

        return Result.ok<{ elevatorId: string, floors: IFloorDTO[] }[]>(result);
    }

    public async getElevatorsByBuilding(buildingId: BuildingId | string): Promise<Result<IElevatorDTO[]>> {
        const idX = buildingId instanceof BuildingId ? (<BuildingId>buildingId).id.toString() : buildingId;
        const buildingOrError = await this.getBuilding(idX);

        if (buildingOrError.isFailure) {
            return Result.fail<IElevatorDTO[]>("Building " + idX + " does not exist");
        }

        let elevatorDTO: IElevatorDTO[] = [];
        const elevatorsDocument = await this.elevatorRepo.findByBuildingId(buildingId);

        if (elevatorsDocument.isFailure) {
            return Result.fail<IElevatorDTO[]>("Building with id = " + buildingId + " doesn't have any elevators.");
        }
        else {
            const elevatorList = elevatorsDocument.getValue().elevatorList;

            for (let i = 0; i < elevatorList.length; i++) {
                elevatorDTO.push(await ElevatorMap.toDTO(elevatorList[i]))
            }

            return Result.ok<IElevatorDTO[]>(elevatorDTO);
        }
    }
}