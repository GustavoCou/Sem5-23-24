import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { RobotId } from "./RobotId";
import { NickName } from "./NickName";
import { RobotSerialNumber } from "./RobotSerialNumber";
import { RobotDescription } from "./RobotDescription";
import { RobotTypeId } from "../RobotType/RobotTypeId";



export interface RobotProps {
    serialNumber: RobotSerialNumber;
    nickName: NickName;
    description: RobotDescription;
    robotTypeId: RobotTypeId;
    inhibited: boolean;

}

export class Robot extends AggregateRoot<RobotProps> {
    get id(): UniqueEntityID {
        return this._id;
    }



    get serialNumber() {
        return this.props.serialNumber.value;
    }
    get nickName() {
        return this.props.nickName.value;
    }
    get description() {
        return this.props.description.value;
    }
    get robotTypeId() {
        return this.props.robotTypeId.id.toString();
    }

    get inhibited() {
        return this.props.inhibited;
    }


    private constructor(props: RobotProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: RobotProps, id: RobotId): Result<Robot> {

        const guardedProps = [

            { argument: props.serialNumber, argumentName: 'serialNumber' },
            { argument: props.nickName, argumentName: 'nickName' },
            { argument: props.description, argumentName: 'description' },
            { argument: props.robotTypeId, argumentName: 'robotTypeId' },
            { argument: props.inhibited, argumentName: 'inhibited' }

        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<Robot>(guardResult.message)
        }
        else {
            const robot = new Robot({
                ...props
            }, id.id);

            return Result.ok<Robot>(robot);
        }
    }

    public async setSerialNumber(serialNumber: string): Promise<Result<void>> {
        try {
            const newSerialNumber = await RobotSerialNumber.create(serialNumber);
            this.props.serialNumber = newSerialNumber.getValue();
            return Result.ok<void>();
        } catch (error) {
            return Result.fail<void>(error.message);
        }
    }

    public async setInhibited(inhibited: boolean): Promise<Result<void>> {
        try {
            this.props.inhibited = inhibited;
            return Result.ok<void>();
        } catch (error) {
            return Result.fail<void>(error.message);
        }
    }

    public async setNickName(nickName: string): Promise<Result<void>> {
        try {
            const newNickName = NickName.create(nickName);
            this.props.nickName = newNickName.getValue();
            return Result.ok<void>();
        } catch (error) {
            return Result.fail<void>(error.message);
        }
    }
    public async setDescription(description: string): Promise<Result<void>> {
        try {
            const newDescription = RobotDescription.create(description);
            this.props.description = newDescription.getValue();
            return Result.ok<void>();
        } catch (error) {
            return Result.fail<void>(error.message);
        }
    }
    public async setrobotTypeId(robotTypeId: string): Promise<Result<void>> {
        try {
            const newrobotTypeId = RobotTypeId.create(robotTypeId);
            this.props.robotTypeId = newrobotTypeId.getValue();
            return Result.ok<void>();
        } catch (error) {
            return Result.fail<void>(error.message);
        }
    }
}
