import {Repo} from "../../core/infra/Repo";
import {Task} from "../../domain/Tasks/Task";

export default interface ITaskRepo extends Repo<Task> {
  save(task: Task): Promise<Task>;
  findById (id: string): Promise<Task>;
}
