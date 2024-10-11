import { Result } from "../../core/logic/Result";
import { BuildingId } from "../../domain/Building/BuildingId";
import IElevatorDTO from "../../dto/IElevatorDTO";
import { IFloorDTO } from "../../dto/IFloorDTO";

export default interface IElevatorService {
    createElevator(elevatorDTO: IElevatorDTO): Promise<Result<IElevatorDTO>>;
    getFloorsServed(buildingId: string): Promise<Result<{ elevatorId: string, floors: IFloorDTO[] }[]>>;
    getElevatorsByBuilding(buildingId: BuildingId | string): Promise<Result<IElevatorDTO[]>>;
}