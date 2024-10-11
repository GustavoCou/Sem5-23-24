import {Mapper} from "../core/infra/Mapper";


import {TaskRequest} from "../domain/TaskRequests/TaskRequest";

import {ITaskRequestDTO} from "../dto/ITaskRequestDTO";
import {TaskRequestId} from "../domain/TaskRequests/TaskRequestId";


export class TaskRequestMap extends Mapper<TaskRequest> {


  public static toDTO(taskRequest: TaskRequest): ITaskRequestDTO {

    return {
      id: taskRequest.id.toString(),
      requesterUser: taskRequest.requesterUser,
      robot: taskRequest.robot,
      task: taskRequest.task.id.toString(),
      status: taskRequest.status,
      date: taskRequest.date
    } as ITaskRequestDTO;
  }

  public static async toDomain(raw: ITaskRequestDTO): Promise<TaskRequest> {

    const taskRequestId = TaskRequestId.create(raw.id);

    let taskRequestProps = {
      requesterUser: raw.requesterUser,
      robot: raw.robot,
      task: raw.task,
      status: raw.status,
      date: raw.date
    }


    const TaskRequestOrError = TaskRequest.create(taskRequestProps as ITaskRequestDTO,taskRequestId.getValue().id);

    TaskRequestOrError.isFailure ? console.log(TaskRequestOrError.error) : '';

    return TaskRequestOrError.isSuccess ? TaskRequestOrError.getValue() : null;
  }

  public static toPersistence(taskRequest: TaskRequest): any {

    return {
      domainId: taskRequest.id.toString(),
      requesterUser: taskRequest.requesterUser,
      robot: taskRequest.robot,
      task: taskRequest.task.id.toString(),
      status: taskRequest.status,
      date: taskRequest.date,
    };
  }
}
