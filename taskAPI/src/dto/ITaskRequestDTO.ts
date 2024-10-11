import {TaskId} from "../domain/Tasks/TaskId";
import {TaskStatus} from "../domain/TaskRequests/TaskStatus";

export interface ITaskRequestDTO {
  id?: string
  requesterUser: string;
  robot: string;
  task: string;
  status: TaskStatus;
  date: Date;
}
