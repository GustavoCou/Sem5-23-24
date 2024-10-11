import { TaskRequest, TaskRequestProps } from "../../../src/domain/TaskRequests/TaskRequest";
import { UniqueEntityID } from "../../../src/core/domain/UniqueEntityID";
import { TaskId } from "../../../src/domain/Tasks/TaskId";
import { TaskStatus } from "../../../src/domain/TaskRequests/TaskStatus";
import { ITaskRequestDTO } from "../../../src/dto/ITaskRequestDTO";
import { Result } from "../../../src/core/logic/Result";
import { expect } from 'chai';

describe('TaskRequest', () => {
    let validTaskRequestProps: TaskRequestProps;
    let validTaskRequestDTO: ITaskRequestDTO;

    beforeEach(() => {
        validTaskRequestProps = {
            requesterUser: 'user123',
            robot: 'robot456',
            task: TaskId.create('task789').getValue(),
            status: TaskStatus.Pending,
            date: new Date(),
        };

        validTaskRequestDTO = {
            requesterUser: 'user123',
            robot: 'robot456',
            task: 'task789',
            status: TaskStatus.Pending,
            date: new Date(),
        };
    });

    it('should create a task request correctly', () => {
        const taskRequestResult = TaskRequest.create(validTaskRequestDTO);

        expect(taskRequestResult.isSuccess).to.be.true;
        const taskRequest = taskRequestResult.getValue();
        expect(taskRequest.requesterUser).to.equal('user123');
        expect(taskRequest.robot).to.equal('robot456');
        expect(taskRequest.task.id.toString()).to.equal(TaskId.create('task789').getValue().id.toString());
        expect(taskRequest.status).to.equal(TaskStatus.Pending);
        // Agrega más expectativas según tus necesidades
    });

    it('should fail when creating a task request with missing requesterUser properties', () => {
        validTaskRequestDTO.requesterUser = undefined;

        const taskRequestResult = TaskRequest.create(validTaskRequestDTO);

        expect(taskRequestResult.isFailure).to.be.true;
        expect(taskRequestResult.error).to.equal('requesterUser is null or undefined');
    });

    it('should fail when creating a task request with missing robot properties', () => {
        validTaskRequestDTO.robot = undefined;

        const taskRequestResult = TaskRequest.create(validTaskRequestDTO);

        expect(taskRequestResult.isFailure).to.be.true;
        expect(taskRequestResult.error).to.equal('robot is null or undefined');
    });

    it('should fail when creating a task request with missing task properties', () => {
        validTaskRequestDTO.task = undefined;

        const taskRequestResult = TaskRequest.create(validTaskRequestDTO);

        expect(taskRequestResult.isFailure).to.be.true;
        expect(taskRequestResult.error).to.equal('task is null or undefined');
    });

    it('should fail when creating a task request with missing status properties', () => {
        validTaskRequestDTO.status = undefined;

        const taskRequestResult = TaskRequest.create(validTaskRequestDTO);

        expect(taskRequestResult.isFailure).to.be.true;
        expect(taskRequestResult.error).to.equal('status is null or undefined');
    });

    it('should fail when creating a task request with missing date properties', () => {
        validTaskRequestDTO.date = undefined;

        const taskRequestResult = TaskRequest.create(validTaskRequestDTO);

        expect(taskRequestResult.isFailure).to.be.true;
        expect(taskRequestResult.error).to.equal('date is null or undefined');
    });
});
