import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { RoomSize } from "./RoomSize";
import { RoomPosition } from "./RoomPosition";
import { RoomDescription } from "./RoomDescription";
import { RoomId } from "./RoomId";
import { Result } from "../../core/logic/Result";
import { RoomType } from "./RoomType";
import { Floor } from "../Floor/Floor";

export interface RoomProps {
    description: RoomDescription;
    size: RoomSize;
    position: RoomPosition;
    roomType: RoomType;
    floor: Floor;
}

export class Room extends AggregateRoot<RoomProps> {

    get description(): string { return this.props.description.value; }
    get width(): number { return this.props.size.width; }
    get depth(): number { return this.props.size.depth; }
    get posX(): number { return this.props.position.posX; }
    get posY(): number { return this.props.position.posY; }
    get roomType(): string { return this.props.roomType.value; }
    get floor(): Floor { return this.props.floor; }

    private constructor(props: RoomProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: RoomProps, id: RoomId): Result<Room> {
        const guardedProps = [
            { argument: props.description, argumentName: 'description' },
            { argument: props.size, argumentName: 'size' },
            { argument: props.position, argumentName: 'position' },
            { argument: props.roomType, argumentName: 'roomType' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<Room>(guardResult.message)
        }
        else {
            const room = new Room({ ...props }, id.id);

            return Result.ok<Room>(room);
        }
    }

}