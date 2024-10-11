import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { RobotTypeModel } from "./RobotTypeModel";
import { RobotTypeBrand } from "./RobotTypeBrand";
import { RobotTypeId } from "./RobotTypeId";
import { RobotTypeTasks } from "./RobotTypeTasks";
import { Result } from "../../core/logic/Result";

export interface RobotTypeProps {
    robotModel: RobotTypeModel;
    brand: RobotTypeBrand;
    tasks: RobotTypeTasks;
}

export class RobotType extends AggregateRoot<RobotTypeProps> {

    get id(): UniqueEntityID {
        return this._id;
    }

    get model(): string {
        return this.props.robotModel.value;
    }

    get brand(): string {
        return this.props.brand.value;
    }

    get tasks(): string {
        return this.props.tasks.tasks;
    }  

    private constructor(props: RobotTypeProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: RobotTypeProps, id: RobotTypeId): Result<RobotType> {
        const guardedProps = [
            { argument: props.robotModel, argumentName: 'robotModel' },
            { argument: props.brand, argumentName: 'brand' },
            { argument: props.tasks, argumentName: 'tasks' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<RobotType>(guardResult.message)
        }
        else {
            const robotType = new RobotType({ ...props }, id.id);
            return Result.ok<RobotType>(robotType);
        }
    }

    public async setModel(robotModel: string): Promise<Boolean> {
        const newModel = await RobotTypeModel.create(robotModel);
        this.props.robotModel = newModel.getValue();

        if (newModel.isSuccess) {
            return newModel.isSuccess;

        } else {

            throw newModel.errorValue();
        }
    }

    public async setBrand(brand: string): Promise<Boolean> {
        const newBrand = await RobotTypeBrand.create(brand);
        this.props.brand = newBrand.getValue();

        if (newBrand.isSuccess) {
            return newBrand.isSuccess;

        } else {

            throw newBrand.errorValue();
        }
    }
}