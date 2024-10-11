import { Inject, Service } from "typedi";
import { Elevator } from "../domain/Elevator/Elevator";
import IElevatorDTO from "../dto/IElevatorDTO";
import { ElevatorMap } from "../mappers/ElevatorMap";
import { IElevatorPersistence } from "../dataschema/IElevatorPersistence";
import { Document, Model } from "mongoose";
import { BuildingId } from "../domain/Building/BuildingId";
import { Result } from "../core/logic/Result";


@Service()
export default class ElevatorRepo implements IElevatorDTO {
    private models: any;

    constructor(
        @Inject('elevatorSchema') private elevatorSchema: Model<IElevatorPersistence & Document>,

    ) { }
    floorIds: string[];
    elevatorId: string;
    elevatorUniqueCodBuilding: number;
    elevatorPosition: { posX: number; posY: number; };
    buildingId: string;
    elevatorBrand: string;
    elevatorModel: string;
    elevatorSerialNumber: string;
    elevatorDescription: string;

    private createBaseQuery(): any {
        return {
            where: {},
        }
    }

    private async save(elevator: Elevator): Promise<Elevator> {

        const query = { elevatorId: elevator.elevatorId.toString() };

        const elevatorDocument = await this.elevatorSchema.findOne(query);

        try {
            if (elevatorDocument === null) {
                const rawElevator: any = ElevatorMap.toPersistence(elevator);

                const elevatorCreated = await this.elevatorSchema.create(rawElevator);

                return ElevatorMap.toDomain(elevatorCreated);
            } else {
                elevatorDocument.floorIds = elevator.floorIds.map(id => id.toString());
                elevatorDocument.elevatorId = elevator.elevatorId.toString();
                elevatorDocument.elevatorPosition = {
                    posX: elevator.elevatorPosition.props.posX,
                    posY: elevator.elevatorPosition.props.posY
                }
                elevatorDocument.buildingId = elevator.buildingId.toString();
                elevatorDocument.elevatorBrand = elevator.elevatorBrand.toString();
                elevatorDocument.elevatorModel = elevator.elevatorModel.toString();
                elevatorDocument.elevatorSerialNumber = elevator.elevatorSerialNumber.toString();
                elevatorDocument.elevatorDescription = elevator.elevatorDescription.toString();
                elevatorDocument.elevatorUniqueCodBuilding = elevator.elevatorUniqueCodBuilding;

                await elevatorDocument.save();

                return elevator;
            }
        } catch (e) {
            throw e;
        }
    }


    public async findId(elevatorId: string): Promise<Boolean> {
        const query = { elevatorId: elevatorId };
        const elevatorDocument = await this.elevatorSchema.findOne(query);
        return elevatorDocument !== null;

    }

    //not in use -> check if the building has already an elevator
    public async findBuildingElevator(buildingId: string): Promise<boolean> {
        const query = { buildingId: buildingId };
        const elevatorDocument = await this.elevatorSchema.findOne(query);
        return elevatorDocument !== null;
    }

    public async countElevatorsByBuilding(buildingId: string): Promise<number> {
        const query = { buildingId: buildingId };
        const elevatorCount = await this.elevatorSchema.countDocuments(query);
        return elevatorCount;
    }


    public async findBySerialNumber(elevatorSerialNumber: string): Promise<Boolean> {
        const query = { elevatorSerialNumber: elevatorSerialNumber };
        const elevatorDocument = await this.elevatorSchema.findOne(query);

        return elevatorDocument !== null;
    }

    public async findByBuildingId(buildingId: BuildingId | string): Promise<Result<{ elevatorList: Elevator[] }>> {
        const idX = buildingId instanceof BuildingId ? (<BuildingId>buildingId).id.toValue() : buildingId;

        const query = { buildingId: idX };
        const elevatorsDocument = await this.elevatorSchema.find(query);

        let elevatorList: Elevator[] = [];

        if (elevatorsDocument != null) {
            for (let i = 0; i < elevatorsDocument.length; i++) {
                const elevatorInstance = await ElevatorMap.toDomain(elevatorsDocument[i]);
                elevatorList.push(elevatorInstance);
            }

            return Result.ok<{ elevatorList: Elevator[] }>({ elevatorList });
        }
        else {
            return Result.fail<{ elevatorList: Elevator[], token: string }>("No elevators found for building " + buildingId + ".");
        }
    }
}