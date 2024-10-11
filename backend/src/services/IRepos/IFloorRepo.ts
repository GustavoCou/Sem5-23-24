import { Repo } from "../../core/infra/Repo";
import { Result } from "../../core/logic/Result";
import { Floor } from "../../domain/Floor/Floor";
import { FloorID } from "../../domain/Floor/FloorID";

export default interface IFloorRepo extends Repo<Floor> {
    save(floor: Floor): Promise<Floor>;
    findByDomainId(floorId: FloorID | string): Promise<Floor>;
    findFloorsByBuilding(buildingId: string): Promise<Floor[]>;
    updateOne(floor: Floor): Promise<Floor>
    getAll(): Promise<Floor[]>;
    countFloorsByBuilding(buildingId: string): Promise<number>;
    existFloorByBuildingAndFloorId(buildingId: string, floorId: FloorID | String): Promise<Floor>
}