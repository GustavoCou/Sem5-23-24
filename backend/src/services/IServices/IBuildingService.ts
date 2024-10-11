import { Result } from "../../core/logic/Result";
import  IBuildingDTO  from "../../dto/IBuildingDTO";
import {BuildingId} from "../../domain/Building/BuildingId";

export default interface IBuildingService  {
  CreateBuilding(BuildingDTO: IBuildingDTO): Promise<Result<IBuildingDTO>>;
  ListBuilding(): Promise<Result<IBuildingDTO[]>>;
  updateBuilding(BuildingDTO: IBuildingDTO): Promise<Result<IBuildingDTO>>
  existBuilding(buildingId: string): Promise<Result<boolean>>;
}