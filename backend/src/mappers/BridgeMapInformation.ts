import { Mapper } from "../core/infra/Mapper";
import { Bridge } from "../domain/Bridge/Bridge";
import { BridgeId } from "../domain/Bridge/BridgeId";
import { Floor } from "../domain/Floor/Floor";
import { FloorID } from "../domain/Floor/FloorID";
import IBridgeInformationDTO from "../dto/IBridgeInformationDTO";

export class BridgeMapInformation extends Mapper<any>{

    public static toDTO(bridge: Bridge, floor1: Floor, floor2: Floor): IBridgeInformationDTO {
        return {
            bridgeId: bridge.bridgeId.toString(),
            //floorDescription: floor1.floorDescription.toString(),
            floorId: floor1.id.toString(),
            linksToFloor: floor2.id.toString(),
            buildingId: floor1.building.id.toString(),
            linksToBuilding: floor2.building.id.toString()


        } as IBridgeInformationDTO;
    }

}