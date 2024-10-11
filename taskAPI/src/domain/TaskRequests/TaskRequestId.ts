import {UniqueEntityID} from "../../../../backend/src/core/domain/UniqueEntityID";
import {ValueObject} from "../../../../backend/src/core/domain/ValueObject";
import {Result} from "../../../../backend/src/core/logic/Result";
import {Guard} from "../../../../backend/src/core/logic/Guard";

interface TaskRequestIdProps {
  TaskId: UniqueEntityID;
}

export class TaskRequestId extends ValueObject<TaskRequestIdProps> {
  get id(): UniqueEntityID {
    return this.props.TaskId;
  }

  private constructor(id: TaskRequestIdProps) {
    super(id);
  }

  public static create(id: string): Result<TaskRequestId> {
    const guardResult = Guard.againstNullOrUndefined(id, 'id');

    if (!guardResult.succeeded) {
      return Result.fail<TaskRequestId>(guardResult.message);
    } else {
      const idPattern = /^[A-Za-z0-9]+$/;


      const uniqueID = new UniqueEntityID(id);
      return Result.ok<TaskRequestId>(new TaskRequestId({ TaskId: uniqueID }));
    }
  }
}
