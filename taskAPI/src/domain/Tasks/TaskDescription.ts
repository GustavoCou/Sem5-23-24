import { ValueObject } from '../../../../backend/src/core/domain/ValueObject';
import { Result } from '../../../../backend/src/core/logic/Result';
import { Guard } from '../../../../backend/src/core/logic/Guard';

export interface TaskDescriptionProps {
  value: string;
}

export class TaskDescription extends ValueObject<TaskDescriptionProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: TaskDescriptionProps) {
    super(props);
  }

  public static create(description: string): Result<TaskDescription> {
    const guardResult = Guard.againstNullOrUndefined(description, 'description');
    if (!guardResult.succeeded) {
      return Result.ok<TaskDescription>(new TaskDescription({ value: '' }));
    } else {
      if (description.length > 1000) {
        Result.fail<TaskDescription>('The maximum length of the description is 1000');
      }
      return Result.ok<TaskDescription>(new TaskDescription({ value: description }));
    }
  }
}
