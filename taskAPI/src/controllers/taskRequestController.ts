
import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import ITaskRequestController from "./IControllers/ITaskRequestController";
import ITaskRequestService from "../services/IServices/ITaskRequestService";
import { ICreateTaskDTO } from "../dto/CreateTaskDTO";
import { ITaskRequestDTO } from "../dto/ITaskRequestDTO";
import TaskError from "../api/taskError/taskError"
import { Result } from "../core/logic/Result";
import IHttpRequestsService from "../services/IServices/IHttpRequestsService";
import { build } from "joi";


@Service()
export default class TaskRequestController implements ITaskRequestController {
  constructor(
    @Inject(config.services.taskRequest.name) private serviceInstance: ITaskRequestService
  ) {
  }

  public async createTaskRequest(req: Request, res: Response, next: NextFunction) {

    try {
      const taskOrError = await this.serviceInstance.createTaskAndRequest(req.body as ICreateTaskDTO) as Result<ITaskRequestDTO>;

      if (taskOrError.isFailure) {
        return res.status(400).json(taskOrError.error.toString()).send();
      }

      const taskRequestDTO = taskOrError.getValue();
      return res.json(taskRequestDTO).status(200);
    } catch (e) {
      return next(e);
    }
  }


  public async listPendingTaskRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const pendingTasks = (await this.serviceInstance.listPendingTaskRequests());


      if (pendingTasks.isFailure) {
        res.status(404).json({ error: pendingTasks.errorValue() }).send();;
      }

      const taskRequestDTO = pendingTasks.getValue();
      return res.status(201).json(taskRequestDTO);

    } catch (error) {
      return next(new TaskError('Error on listing tasks'));
    }
  }

  public async filteredPendingTaskRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const pendingTasks = (await this.serviceInstance.filteredPendingTaskRequests(req.body));

      if (pendingTasks.isFailure) {
        res.status(404).json({ error: pendingTasks.errorValue() }).send();;
      }

      const taskRequestDTO = pendingTasks.getValue();
      return res.status(201).json(taskRequestDTO);

    } catch (error) {
      return next(new TaskError('Error on listing tasks'));
    }
  }

  public async listAproveTaskRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const aproveTasks = (await this.serviceInstance.listAproveTaskRequests());


      if (aproveTasks.isFailure) {
        res.status(404).json({ error: aproveTasks.errorValue() }).send();;
      }

      const taskRequestDTO = aproveTasks.getValue();
      return res.status(200).json(taskRequestDTO);

    } catch (error) {
      return next(new TaskError('Error on listing tasks'));
    }
  }

  public async updateTaskRequestStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = req.params.id; // assume que você está passando o ID na URL
      const newStatus = req.body.status; // assume o novo status no corpo da solicitação

      const result = await this.serviceInstance.updateTaskRequestStatus(taskId, newStatus);

      if (result.isFailure) {
        return res.status(400).json(result.error.toString()).send();
      }

      const updatedTaskRequestDTO = result.getValue();
      return res.json(updatedTaskRequestDTO).status(200);

    } catch (e) {
      return next(e);
    }
  }
}
