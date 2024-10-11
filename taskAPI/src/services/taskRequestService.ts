import { Inject, Service } from "typedi";
import config from "../../config";
import { Result } from "../core/logic/Result";
import { ITaskRequestDTO } from "../dto/ITaskRequestDTO";

import ITaskRepo from "./IRepos/ITaskRepo";
import ITaskRequestRepo from "./IRepos/ITaskRequestRepo";
import ITaskRequestService from "./IServices/ITaskRequestService";
import { ICreateTaskDTO } from "../dto/CreateTaskDTO";
import { Task } from "../domain/Tasks/Task";
import { TaskRequest } from "../domain/TaskRequests/TaskRequest";
import { TaskStatus } from "../domain/TaskRequests/TaskStatus";
import { TaskRequestMap } from "../mappers/TaskRequestMap";
import { CreateTaskDtoMap } from "../mappers/CreateTaskDtoMap";
import IHttpRequestsService from "./IServices/IHttpRequestsService";
import { TaskType } from "../domain/Tasks/TaskType";
import TaskError from "../api/taskError/taskError";
import { TaskSearchCriteria } from "../utils/OtherUtils";

@Service()
export default class TaskRequestService implements ITaskRequestService {

    constructor(
        @Inject(config.repos.task.name) private taskRepo: ITaskRepo,
        @Inject(config.repos.taskRequest.name) private taskRequestRepo: ITaskRequestRepo,
        @Inject(config.services.http.name) private httpRequest: IHttpRequestsService
    ) { }

    public async createTaskAndRequest(createTaskDTO: ICreateTaskDTO): Promise<Result<ITaskRequestDTO>> {

        try {

            let task = Task.create(CreateTaskDtoMap.toTaskDTO(createTaskDTO))

            if (task.isFailure) {
                return Result.fail<ITaskRequestDTO>(task.error)
            }

            if (task.getValue().type == TaskType.SECURITY_TASK) {



                const existRobot: boolean = await this.httpRequest.getRequest(`robot/${createTaskDTO.robot}`);

                if (!existRobot) {
                    return Result.fail<ITaskRequestDTO>("The Robot: " + createTaskDTO.robot + " not exist.");
                }

                const existBuilding: boolean = await this.httpRequest.getRequest(`building/${task.getValue().building}`);


                if (!existBuilding) {
                    return Result.fail<ITaskRequestDTO>("The building: " + task.getValue().building + " not exist.");
                }

                for (const floor of task.getValue().floors) {
                    const existFloor: boolean = await this.httpRequest.getRequest(`floor/${task.getValue().building}/${floor}`);

                    if (!existFloor) {
                        return Result.fail<ITaskRequestDTO>("The floor: " + floor + " not exist.");
                    }
                }
            } else {
                const existRobot: boolean = await this.httpRequest.getRequest(`robot/${createTaskDTO.robot}`);

                if (!existRobot) {
                    return Result.fail<ITaskRequestDTO>("The Robot: " + createTaskDTO.robot + " not exist.");
                }

                const existDelivery: boolean = await this.httpRequest.getRequest(`room/${task.getValue().pickupRoom}`);
                if (!existDelivery) {
                    return Result.fail<ITaskRequestDTO>("The Room: " + task.getValue().pickupRoom + " not exist.");
                }
                const existPickup: boolean = await this.httpRequest.getRequest(`room/${task.getValue().deliveryRoom}`);

                if (!existPickup) {
                    return Result.fail<ITaskRequestDTO>("The Room: " + task.getValue().deliveryRoom + " not exist.");
                }
            }


            let taskRequest = TaskRequest.create({
                requesterUser: createTaskDTO.userId,
                robot: createTaskDTO.robot,
                status: TaskStatus.Pending,
                task: task.getValue().id.toString(),
                date: new Date(),
            } as ITaskRequestDTO);

            if (taskRequest.isFailure) {
                return Result.fail<ITaskRequestDTO>(task.error)
            }

            const taskSaved = this.taskRepo.save(task.getValue());


            const taskRequestSaved = await this.taskRequestRepo.save(taskRequest.getValue())


            return Result.ok<ITaskRequestDTO>(TaskRequestMap.toDTO(taskRequestSaved));

        } catch (err) {

            return Result.fail<ITaskRequestDTO>(err);

        }
    }


    public async listPendingTaskRequests(): Promise<Result<{ taskRequestDto: ITaskRequestDTO[] }>> {
        try {

            const tasks: TaskRequest[] = await this.taskRequestRepo.findPendingRequest();


            if (tasks.length == 0) {
                return Result.fail<{ taskRequestDto: ITaskRequestDTO[] }>(new TaskError("Não existem requisiçoes pendentes"));

            }
            const taskRequestDto: ITaskRequestDTO[] = tasks.map(task => TaskRequestMap.toDTO(task));

            console.log(taskRequestDto);

            return Result.ok<{ taskRequestDto: ITaskRequestDTO[] }>({ taskRequestDto });


        } catch (e) {
            return Result.fail<{ taskRequestDto: ITaskRequestDTO[] }>(e);
        }
    }

    public async filteredPendingTaskRequests(criteria: TaskSearchCriteria): Promise<Result<{ taskRequestDto: ITaskRequestDTO[] }>> {
        try {
            const tasks: TaskRequest[] = await this.taskRequestRepo.filteredPendingRequest(criteria);

            if (tasks.length == 0) {
                return Result.fail<{ taskRequestDto: ITaskRequestDTO[] }>(new TaskError("Não existem requisições para o critério pedido."));

            }
            const taskRequestDto: ITaskRequestDTO[] = tasks.map(task => TaskRequestMap.toDTO(task));

            return Result.ok<{ taskRequestDto: ITaskRequestDTO[] }>({ taskRequestDto });
        } catch (e) {
            return Result.fail<{ taskRequestDto: ITaskRequestDTO[] }>(e);
        }
    }
    public async listAproveTaskRequests(): Promise<Result<{ taskRequestDto: ITaskRequestDTO[] }>> {
        try {

            const tasks: TaskRequest[] = await this.taskRequestRepo.findAproveRequest();


            if (tasks.length == 0) {
                return Result.fail<{ taskRequestDto: ITaskRequestDTO[] }>(new TaskError("Não existem requisiçoes aprovadas"));

            }
            const taskRequestDto: ITaskRequestDTO[] = tasks.map(task => TaskRequestMap.toDTO(task));

            return Result.ok<{ taskRequestDto: ITaskRequestDTO[] }>({ taskRequestDto });


        } catch (e) {
            return Result.fail<{ taskRequestDto: ITaskRequestDTO[] }>(e);
        }
    }

    public async updateTaskRequestStatus(id: string, newStatus: string): Promise<Result<ITaskRequestDTO>> {
        try {
            const updatedTaskRequest = await this.taskRequestRepo.updateStatusById(id,
                newStatus === 'Approved' ? TaskStatus.Approved :
                    newStatus === 'Disapproved' ? TaskStatus.Disapproved :
                        TaskStatus.Pending
            );

            if (!updatedTaskRequest) {
                throw new Error(`Failed to update TaskRequest with ID: ${id}`);
            }

            return Result.ok<ITaskRequestDTO>(TaskRequestMap.toDTO(updatedTaskRequest));
        } catch (err) {
            return Result.fail<ITaskRequestDTO>(err);
        }
    }
}
