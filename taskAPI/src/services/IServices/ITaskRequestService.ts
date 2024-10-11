
import { Result } from "../../core/logic/Result";

import { ITaskRequestDTO } from "../../dto/ITaskRequestDTO";
import { ITaskDTO } from "../../dto/ITaskDTO";
import { ICreateTaskDTO } from "../../dto/CreateTaskDTO";
import { TaskSearchCriteria } from "../../utils/OtherUtils";
import { TaskStatus } from "../../domain/TaskRequests/TaskStatus";

export default interface ITaskRequestService {
  createTaskAndRequest(createTaskDTO: ICreateTaskDTO): Promise<Result<ITaskRequestDTO>>;
  // getTaskRequest (task: string): Promise<Result<TaskRequestDTO>>;
  listPendingTaskRequests(): Promise<Result<{ taskRequestDto: ITaskRequestDTO[] }>>;
  listAproveTaskRequests(): Promise<Result<{ taskRequestDto: ITaskRequestDTO[] }>>;
  updateTaskRequestStatus(id: string, newStatus: TaskStatus): Promise<Result<ITaskRequestDTO>>;
  filteredPendingTaskRequests(criteria: TaskSearchCriteria): Promise<Result<{ taskRequestDto: ITaskRequestDTO[] }>>
}
