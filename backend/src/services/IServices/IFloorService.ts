import { Result } from "../../core/logic/Result";
import { IFloorDTO } from "../../dto/IFloorDTO";
import { IFloorMapDTO } from "../../dto/IFloorMapDTO";

export default interface IFloorService {
    createFloor(floorDTO: IFloorDTO): Promise<Result<IFloorDTO>>;
    updateFloor(floorDTO: IFloorDTO): Promise<Result<IFloorDTO>>;
    getFloor(): Promise<Result<IFloorDTO[]>>;
    getFloorByBuilding(buildingId: string): Promise<Result<IFloorDTO[]>>;
    uploadMap(floorDTO: IFloorDTO,map : IFloorMapDTO) : Promise<Result<IFloorDTO>>;
    countFloorsByBuilding(buildingId: string): Promise<Result<number>>;
    countTotalFloorsByBuildings(): Promise<Result<{ buildingId: string; totalFloors: number }[]>>;
    getBuildingsInFloorRange(minFloors: number, maxFloors: number): Promise<Result<{ buildingId: string; totalFloors: number }[]>>;
    getFloorsInFloorRange(minFloors: number, maxFloors: number): Promise<Result<{ buildingId: string; floors: IFloorDTO[] }[]>>;
    existFloor(buildingId :string ,floorId: string): Promise<Result<boolean>>;

}