import { Repo } from "../../core/infra/Repo";
import { Result } from "../../core/logic/Result";
import { BuildingId } from "../../domain/Building/BuildingId";
import { Elevator } from "../../domain/Elevator/Elevator";
import { ElevatorSerialNumber } from "../../domain/Elevator/ElevatorSerialNumber";
import IElevatorDTO from "../../dto/IElevatorDTO";

export default interface IElevatorRepo extends Repo<Elevator> {
    findBySerialNumber(elevatorSerialNumber: string): Promise<Boolean>;
    findBuildingElevator(buildingId: string): Promise<boolean>;
    save(elevator: Elevator): Promise<Elevator>;
    findByBuildingId(buildingId: BuildingId | string): Promise<Result<{ elevatorList: Elevator[] }>>;
    findId(elevatorId: string): Promise<Boolean>;
    countElevatorsByBuilding(buildingId: string): Promise<number>;
}