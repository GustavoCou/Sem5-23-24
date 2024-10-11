import { Document, Model } from "mongoose";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Mapper } from "../core/infra/Mapper";
import { IElevatorPersistence } from "../dataschema/IElevatorPersistence";
import { Elevator } from "../domain/Elevator/Elevator";
import IElevatorDTO from "../dto/IElevatorDTO";
import { ElevatorBrand } from "../domain/Elevator/ElevatorBrand";
import { ElevatorId } from "../domain/Elevator/ElevatorId";

export class ElevatorMap extends Mapper<Elevator>{

    public static toDTO(elevator: Elevator): IElevatorDTO {
        return {
            floorIds: elevator.floorIds.map(id => id.toString()),
            elevatorUniqueCodBuilding: elevator.elevatorUniqueCodBuilding,
            elevatorId: elevator.elevatorId.toString(),
            elevatorPosition: {
                posX: elevator.elevatorPosition.props.posX,
                posY: elevator.elevatorPosition.props.posY
            },
            buildingId: elevator.buildingId.toString(),
            elevatorBrand: elevator.elevatorBrand.toString(),
            elevatorModel: elevator.elevatorModel.toString(),
            elevatorSerialNumber: elevator.elevatorSerialNumber.toString(),
            elevatorDescription: elevator.elevatorDescription.toString()

        } as IElevatorDTO;
    }


    public static toDomain(elevator: any | Model<IElevatorPersistence & Document>): Elevator {
        const elevatorOuErro = Elevator.create(
            elevator,
        );

        elevatorOuErro.isFailure ? console.log(elevatorOuErro.error) : '';

        return elevatorOuErro.isSuccess ? elevatorOuErro.getValue() : null;
    }

    public static toPersistence(elevator: Elevator): any {
        let floorIdsString = elevator.floorIds.map(floor => floor.id.toString());
        
        return {

            floorIds: floorIdsString,
            elevatorId: elevator.elevatorId.toString(),
            elevatorPosition: {
                posX: elevator.elevatorPosition.props.posX,
                posY: elevator.elevatorPosition.props.posY
            },
            buildingId: elevator.buildingId.toString(),
            elevatorBrand: elevator.elevatorBrand.toString(),
            elevatorModel: elevator.elevatorModel.toString(),
            elevatorSerialNumber: elevator.elevatorSerialNumber.toString(),
            elevatorDescription: elevator.elevatorDescription.toString(),
            elevatorUniqueCodBuilding: elevator.elevatorUniqueCodBuilding,
        }
    }
}