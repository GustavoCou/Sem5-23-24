import { Document, Model } from "mongoose";
import { Mapper } from "../core/infra/Mapper";
import IBridgeDTO from "../dto/IBridgeDTO";
import { Bridge } from "../domain/Bridge/Bridge";
import { IBridgePersistence } from "../dataschema/IBridgePersistence";
import { BridgePosition } from "../domain/Bridge/BridgePosition";

export class BridgeMap extends Mapper<Bridge>{

    public static toDTO(bridge: Bridge): IBridgeDTO {
        return {
            bridgePositionX: {
                posX: bridge.bridgePositionX.props.posX,
                posY: bridge.bridgePositionX.props.posY
            },
            bridgePositionY: {
                posX: bridge.bridgePositionY.props.posX,
                posY: bridge.bridgePositionY.props.posY
            },
            bridgeId: bridge.bridgeId.toString(),
            floorIdX: bridge.floorIdX.toString(),
            floorIdY: bridge.floorIdY.toString(),
            buildingX: bridge.buildingX.toString(),
            buildingY: bridge.buildingY.toString()

        } as IBridgeDTO;
    }


    public static toDomain(bridge: any | Model<IBridgePersistence & Document>): Bridge {
           
        const bridgeOuErro = Bridge.create(
            bridge,
        );
      
        bridgeOuErro.isFailure ? console.log(bridgeOuErro.error) : '';

        return bridgeOuErro.isSuccess ? bridgeOuErro.getValue() : null;
    }

    public static toPersistence(bridge: Bridge): any {
        return {

            bridgePositionX: {
                posX: bridge.bridgePositionX.props.posX,
                posY: bridge.bridgePositionX.props.posY
            },
            bridgePositionY: {
                posX: bridge.bridgePositionY.props.posX,
                posY: bridge.bridgePositionY.props.posY
            },
            bridgeId: bridge.bridgeId.toString(),
            floorIdX: bridge.floorIdX.toString(),
            floorIdY: bridge.floorIdY.toString(),
            buildingX: bridge.buildingX.toString(),
            buildingY: bridge.buildingY.toString(),
        }
    }
}