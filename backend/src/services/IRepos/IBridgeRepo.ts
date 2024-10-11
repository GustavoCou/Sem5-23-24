import { Repo } from "../../core/infra/Repo";
import { Bridge } from "../../domain/Bridge/Bridge";
import { BridgeId } from "../../domain/Bridge/BridgeId";
import { Building } from "../../domain/Building/Building";


export default interface IBridgeRepo extends Repo<Bridge> {
    findById(bridgeId: string): Promise<Boolean>;
    bridgeWithFloors(floorId1: string, floorId2: string): Promise<Boolean>;
    save(bridge: Bridge): Promise<Bridge>;
    listAll(): Promise<Bridge[]>;
    listAllWithBuilding(building: Building): Promise<Bridge[]>;
    findAndGiveBridge(bridgeId: BridgeId | string): Promise<Bridge>;
    updateOne(bridge: Bridge): Promise<Bridge>
    getBridgeBetweenBuildingsId(buildingX: string, buildingY: string): Promise<Bridge[]>;
}