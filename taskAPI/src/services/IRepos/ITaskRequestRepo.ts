import { Repo } from "../../core/infra/Repo";
import { TaskRequest } from "../../domain/TaskRequests/TaskRequest";
import { TaskSearchCriteria } from "../../utils/OtherUtils";
import { TaskStatus } from "../../domain/TaskRequests/TaskStatus";

export default interface ITaskRequestRepo extends Repo<TaskRequest> {
  save(taskRequest: TaskRequest): Promise<TaskRequest>;
  findById(id: string): Promise<TaskRequest>;
  findPendingRequest(): Promise<TaskRequest[]>;
  filteredPendingRequest(criteria: TaskSearchCriteria): Promise<TaskRequest[]>;
  findAproveRequest(): Promise<TaskRequest[]>;
  updateStatusById(id: string, newStatus: TaskStatus): Promise<TaskRequest>;
}
