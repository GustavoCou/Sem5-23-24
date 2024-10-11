import {UniqueEntityID} from '../../../../backend/src/core/domain/UniqueEntityID';
import {TaskStatus} from './TaskStatus';
import {AggregateRoot} from '../../../../backend/src/core/domain/AggregateRoot';
import {TaskId} from "../Tasks/TaskId";
import {ITaskRequestDTO} from "../../dto/ITaskRequestDTO";
import {Result} from "../../../../backend/src/core/logic/Result";
import {Guard} from "../../core/logic/Guard"

export interface TaskRequestProps {
  requesterUser: string;
  robot: string;
  task: TaskId;
  status: TaskStatus;
  date: Date;
}

export class TaskRequest extends AggregateRoot<TaskRequestProps> {

  get id(): UniqueEntityID {
    return this._id;
  }

  get requesterUser(): string {
    return this.props.requesterUser;
  }

  get robot(): string {
    return this.props.robot;
  }

  get task(): TaskId {
    return this.props.task;
  }

  get status(): TaskStatus {
    return this.props.status;
  }

  get date(): Date {
    return this.props.date;
  }

  private constructor(props: TaskRequestProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public updateStatus(newStatus: TaskStatus) {
    this.props.status = newStatus;
  }

  public static create(props: ITaskRequestDTO, id?: UniqueEntityID): Result<TaskRequest> {

    const guardedProps = [
      { argument: props.requesterUser, argumentName: 'requesterUser' },
      { argument: props.robot, argumentName: 'robot' },
      { argument: props.task, argumentName: 'task' },
      { argument: props.status, argumentName: 'status' },
      { argument: props.date, argumentName: 'date' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<TaskRequest>(guardResult.message);
    }



    const taskRequest = new TaskRequest({
        requesterUser: props.requesterUser,
        robot: props.robot,
        task: TaskId.create(props.task).getValue(),
        status: TaskStatus.Pending,
        date: props.date
      },
      id)

    return Result.ok<TaskRequest>(taskRequest);
  }

}
