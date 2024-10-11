import { Repo } from "../../core/infra/Repo";
import { Building } from "../../domain/Building/Building";
import { BuildingId } from "../../domain/Building/BuildingId";
import { BuildingName } from "../../domain/Building/BuildingName";

export default interface IBuildingRepo extends Repo<Building> {
    save(building: Building): Promise<Building>;
    findById (buildingId: BuildingId | string): Promise<Building>;
    findByName (name: BuildingName | string): Promise<Building>;  
    listAll(): Promise<Building[]>
    updateOne (building: Building ): Promise<Building>; 
  }