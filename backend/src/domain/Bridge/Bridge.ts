import { Result } from "../../core/logic/Result"
import { AggregateRoot } from "../../core/domain/AggregateRoot"
import { BridgeId } from "./BridgeId";
import { BridgePosition } from "./BridgePosition";
import { FloorID } from "../Floor/FloorID";
import IBridgeDTO from "../../dto/IBridgeDTO";
import { Building } from "../Building/Building";
import { BuildingId } from "../Building/BuildingId";
import { Floor } from "../Floor/Floor";

interface BridgeProps {
    floorIdX: FloorID;
    floorIdY: FloorID;
    bridgePositionX: BridgePosition;
    bridgePositionY: BridgePosition;
    bridgeId: BridgeId;
    buildingX: BuildingId;
    buildingY: BuildingId
}

export class Bridge extends AggregateRoot<BridgeProps>{

    // set bridgeId(value: BridgeId) {
    // this.props.bridgeId = value;
    //}

    get bridgeId(): BridgeId {
        return this.props.bridgeId;
    }

    get bridgePositionX(): BridgePosition {
        return this.props.bridgePositionX;
    }

    get bridgePositionY(): BridgePosition {
        return this.props.bridgePositionY;
    }

    get buildingY(): BuildingId {
        return this.props.buildingY;
    }

    get buildingX(): BuildingId {
        return this.props.buildingX;
    }
    //set bridgePosition(value: BridgePosition) {
    //this.props.elevatorPosition = value;
    //}

    get floorIdX(): FloorID {
        return this.props.floorIdX;
    }

    get floorIdY(): FloorID {
        return this.props.floorIdY;
    }


    private constructor(props: BridgeProps) {
        super(props);
    }

    public static create(bridgeDTO: IBridgeDTO): Result<Bridge> {

        const bridgePositionResultX = BridgePosition.create({
            posX: bridgeDTO.bridgePositionX.posX,
            posY: bridgeDTO.bridgePositionX.posY
        });
        const bridgePositionResultY = BridgePosition.create({
            posX: bridgeDTO.bridgePositionY.posX,
            posY: bridgeDTO.bridgePositionY.posY
        });
        if (!bridgePositionResultX.isSuccess) {
            return Result.fail<Bridge>("Bridge Position invalid.");
        }

        if (!bridgePositionResultY.isSuccess) {
            return Result.fail<Bridge>("Bridge Position invalid.");
        }



        const floorIdXResult = FloorID.create(bridgeDTO.floorIdX);
        if (!floorIdXResult.isSuccess) {
            return Result.fail<Bridge>("Floor ID X is not valid");
        }

        const floorIdYResult = FloorID.create(bridgeDTO.floorIdY);
        if (!floorIdYResult.isSuccess) {
            return Result.fail<Bridge>("Floor ID Y is not valid");
        }

        const bridgeIdResult = BridgeId.create(bridgeDTO.bridgeId);
        if (!bridgeIdResult.isSuccess) {
            return Result.fail<Bridge>("Not a valid ID");
        }

        const bridgeXResult = BuildingId.create(bridgeDTO.buildingX);
        if (!bridgeXResult.isSuccess) {
            return Result.fail<Bridge>("Building invalid");
        }

        const bridgeYResult = BuildingId.create(bridgeDTO.buildingY);
        if (!bridgeYResult.isSuccess) {
            return Result.fail<Bridge>("Building invalid");
        }

        const bridge = new Bridge({
            bridgePositionX: bridgePositionResultX.getValue(),
            bridgePositionY: bridgePositionResultY.getValue(),
            bridgeId: bridgeIdResult.getValue(),
            floorIdX: floorIdXResult.getValue(),
            floorIdY: floorIdYResult.getValue(),
            buildingX: bridgeXResult.getValue(),
            buildingY: bridgeYResult.getValue(),

        });

        return Result.ok<Bridge>(bridge);
    }
}




