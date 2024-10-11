import {Inject, Service} from "typedi";

import {Document, Model} from "mongoose";
import ITaskRepo from "../services/IRepos/ITaskRepo";
import {ITaskPersistence} from "../dataschema/ITaskPersistence";
import {Task} from "../domain/Tasks/Task";
import {TaskMap} from "../mappers/TaskMap";
import {TaskId} from "../domain/Tasks/TaskId";
import {ITaskDTO} from "../dto/ITaskDTO";
import {throws} from "node:assert";


@Service()
export default class TaskRepo implements ITaskRepo {
  private models: any;

  constructor(
    @Inject('taskSchema') private taskSchema: Model<ITaskPersistence & Document>,
  ) {
  }

  findById(id: string): Promise<Task> {
    throw new Error("Method not implemented.");
  }

  exists(t: Task): Promise<boolean> {
    throw new Error("Method not implemented.");
  }


  private createBaseQuery(): any {
    return {
      where: {},
    }
  }

  public async save(task: Task): Promise<Task> {

    try {

      const rawTask: any = TaskMap.toPersistence(task);

      const taskCreated = await this.taskSchema.create(rawTask);

      return TaskMap.toDomain(taskCreated);

    } catch (err) {
       throw new Error("error to save the Task ") ;
    }
  }

}
