import { ValueObject } from '../../../../backend/src/core/domain/ValueObject';
import { Guard } from '../../../../backend/src/core/logic/Guard';
import { Result } from '../../../../backend/src/core/logic/Result';
import { UniqueEntityID } from '../../../../backend/src/core/domain/UniqueEntityID';

interface TaskIdProps {
  TaskId: UniqueEntityID;
}

export class TaskId extends ValueObject<TaskIdProps> {
  get id(): UniqueEntityID {
    return this.props.TaskId;
  }

  private constructor(id: TaskIdProps) {
    super(id);
  }

  public static create(id: string): Result<TaskId> {
    const guardResult = Guard.againstNullOrUndefined(id, 'id');

    if (!guardResult.succeeded) {
      return Result.fail<TaskId>(guardResult.message);
    } else {



      const uniqueID = new UniqueEntityID(id);
      return Result.ok<TaskId>(new TaskId({ TaskId: uniqueID }));
    }
  }
}
