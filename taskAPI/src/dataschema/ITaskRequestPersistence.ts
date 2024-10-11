import {TaskType} from "../domain/Tasks/TaskType";
import {TaskId} from "../domain/Tasks/TaskId";
import {TaskStatus} from "../domain/TaskRequests/TaskStatus";

export interface ITaskRequestPersistence {
  domainId: string,
  requesterUser: string;
  robot: string;
  task: string;
  status: TaskStatus;
  date: Date;
}
