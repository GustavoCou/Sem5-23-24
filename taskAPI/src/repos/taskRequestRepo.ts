import { Document, Model, Types } from "mongoose";
import { ITaskRequestPersistence } from "../dataschema/ITaskRequestPersistence";
import { Inject, Service } from "typedi";
import ITaskRequestRepo from "../services/IRepos/ITaskRequestRepo";
import { TaskRequest } from "../domain/TaskRequests/TaskRequest";
import { TaskMap } from "../mappers/TaskMap";
import { TaskRequestMap } from "../mappers/TaskRequestMap";
import { TaskStatus } from "../domain/TaskRequests/TaskStatus";
import TaskError from "../api/taskError/taskError";
import { TaskSearchCriteria } from "../utils/OtherUtils";

@Service()
export default class TaskRequestRepo implements ITaskRequestRepo {
	private models: any;

	constructor(
		@Inject('taskRequestSchema') private taskRequestSchema: Model<ITaskRequestPersistence & Document>,
	) {
	}

	public async save(taskRequest: TaskRequest): Promise<TaskRequest> {
		try {
			const rawTaskRequest: any = TaskRequestMap.toPersistence(taskRequest);


			const taskRequestCreated = await this.taskRequestSchema.create(rawTaskRequest);

			return TaskRequestMap.toDomain(taskRequestCreated);
		} catch (err) {
			throw new Error("error to save the Task Request");
		}
	}
	public async findById(id: string): Promise<TaskRequest> {
		throw new Error("Method not implemented.");
	}
	public async exists(t: TaskRequest): Promise<boolean> {
		throw new Error("Method not implemented.");
	}

	public async findPendingRequest(): Promise<TaskRequest[]> {
		try {
			const pendingTasks = await this.taskRequestSchema.find({ status: TaskStatus.Pending });

			let taskRequest: TaskRequest[] = [];

			for (let i = 0; i < pendingTasks.length; i++) {
				taskRequest.push(await TaskRequestMap.toDomain(pendingTasks.pop()));
			}

			return taskRequest;

		} catch (e) {
			throw new TaskError("Error on listing the pending tasks");
		}
	}

	public async filteredPendingRequest(criteria: TaskSearchCriteria): Promise<TaskRequest[]> {
		try {
			let taskRequestsDocument: (ITaskRequestPersistence & Document<any, any, any> & { _id: Types.ObjectId; })[] = [];

			if ('status' in criteria) {
				taskRequestsDocument = await this.taskRequestSchema.find({ status: criteria.status });
			}

			if ('robotType' in criteria) {
				taskRequestsDocument = await this.taskRequestSchema.find({ robot: criteria.robotType });
			}

			if ('userId' in criteria) {
				taskRequestsDocument = await this.taskRequestSchema.find({ requesterUser: criteria.userId });
			}

			let taskRequests: TaskRequest[] = [];

			for (let i = 0; i < taskRequestsDocument.length; i++) {
				taskRequests.push(await TaskRequestMap.toDomain(taskRequestsDocument.pop()));
			}

			return taskRequests;

		} catch (e) {
			throw new TaskError("Error on listing the pending tasks");
		}
	}

	public async findAproveRequest(): Promise<TaskRequest[]> {
		try {
			const aproveTasks = await this.taskRequestSchema.find({ status: TaskStatus.Approved });

			let taskRequest: TaskRequest[] = [];

			for (let i = 0; i < aproveTasks.length; i++) {

				taskRequest.push(await TaskRequestMap.toDomain(aproveTasks.pop()));

			}
			return taskRequest;

		} catch (e) {
			throw new TaskError("Error on listing the aprove tasks");
		}
	}

	public async updateStatusById(id: string, newStatus: TaskStatus): Promise<TaskRequest> {
		try {
			const taskRequestToUpdate = await this.taskRequestSchema.findById(id);

			if (!taskRequestToUpdate) {
				throw new Error("Task Request not found.");
			}

			if (!Object.values(TaskStatus).includes(newStatus)) {
				throw new Error(`Invalid status: ${newStatus}`);
			}

			taskRequestToUpdate.status = newStatus;

			await taskRequestToUpdate.save();

			return TaskRequestMap.toDomain(taskRequestToUpdate);
		} catch (err) {
			throw new Error("Error updating the Task Request status.");
		}
	}
}

