import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

import { Result } from "../../core/logic/Result";
import { FloorID } from "./FloorID"
import { FloorDescription } from "./FloorDescription";
import { FloorSize } from "./FloorSize";
import { Guard } from "../../core/logic/Guard";
import { floor } from "lodash";
import { IFloorMapDTO } from "../../dto/IFloorMapDTO";
import { Building } from "../Building/Building";
import { FloorMapa } from "./FloorMapa";
import { FloorMap } from "../../mappers/FloorMap";

export interface FloorProps {
    floorDescription: FloorDescription;
    floorSize: FloorSize;
    floorMapa: FloorMapa;
    building: Building;
}

export class Floor extends AggregateRoot<FloorProps> {

    get id(): UniqueEntityID {
        return this._id;
    }

    get floorDescription(): FloorDescription {
        return this.props.floorDescription;
    }

    get floorSize(): FloorSize {
        return this.props.floorSize;
    }

    get floorMapa(): FloorMapa {
        return this.props.floorMapa;
    }

    get building(): Building {
        return this.props.building;
    }

    private constructor(props: FloorProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: FloorProps, id: FloorID): Result<Floor> {
        const guardedProps = [
            { argument: props.floorDescription, argumentName: 'floorDescription' },
            { argument: props.floorSize, argumentName: 'floorSize' },
            { argument: props.floorMapa, argumentName: 'floorMapa' },
            { argument: props.building, argumentName: 'building' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<Floor>(guardResult.message)
        }
        else {
            const floor = new Floor({
                ...props
            }, id.id);

            return Result.ok<Floor>(floor);
        }
    }

    public uploadMap(map: IFloorMapDTO): Result<FloorMap> {

        const floorMap = FloorMapa.create(map);

        if (floorMap.error) {
            Result.fail<FloorMap>("Error in the creation the mapper ");
        }
        this.props.floorMapa = floorMap.getValue();
        return Result.ok<FloorMap>(floorMap);
    }

    public async setDescription(description: string): Promise<Boolean> {
        const newDescription = await FloorDescription.create(description);
        this.props.floorDescription = newDescription.getValue();

        if (newDescription.isSuccess) {
            return newDescription.isSuccess;
        } else {
            throw newDescription.errorValue();
        }
    }

    public async setSize(width?: number, depth?: number): Promise<Boolean> {
        var newSize: Result<FloorSize>;

        if (width != null && depth != null) {
            newSize = FloorSize.create(width, depth);
        } else if (width != null) {
            newSize = FloorSize.create(width, this.props.floorSize.depth);
        } else {
            newSize = FloorSize.create(this.props.floorSize.width, depth);
        }

        if (newSize.isSuccess) {
            this.props.floorSize = newSize.getValue();
            return newSize.isSuccess;
        } else {
            throw newSize.errorValue();
        }
    }
}