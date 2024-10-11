import { expect } from 'chai';
import { SinonSandbox, createSandbox, SinonStub } from 'sinon';
import { instance, mock } from 'ts-mockito';
import ITaskRepo from '../../../src/services/IRepos/ITaskRepo';
import ITaskRequestRepo from '../../../src/services/IRepos/ITaskRequestRepo';
import IHttpRequestsService from '../../../src/services/IServices/IHttpRequestsService';
import { Result } from '../../../src/core/logic/Result';
import { ICreateTaskDTO } from '../../../src/dto/CreateTaskDTO';
import { TaskRequest } from '../../../src/domain/TaskRequests/TaskRequest';
import { ITaskRequestDTO } from '../../../src/dto/ITaskRequestDTO';
import { Task } from '../../../src/domain/Tasks/Task';
import TaskRequestService from '../../../src/services/taskRequestService';
import HttpRequestService from "../../../src/services/httpRequestService";
import TaskRepo from "../../../src/repos/taskRepo";
import TaskRequestRepo from "../../../src/repos/taskRequestRepo";
import {TaskRequestId} from "../../../src/domain/TaskRequests/TaskRequestId";
import {TaskStatus} from "../../../src/domain/TaskRequests/TaskStatus";
import {UniqueEntityID} from "../../../src/core/domain/UniqueEntityID";

describe('TaskRequestService', () => {
    let sandbox: SinonSandbox;
    let taskRepoMock: ITaskRepo;
    let taskRepoInstance: ITaskRepo;
    let taskRequestRepoMock: ITaskRequestRepo;
    let taskRequestRepoInstance: ITaskRequestRepo;
    let httpRequestMock: IHttpRequestsService;
    let httpRequestInstance: IHttpRequestsService;
    let taskRequestService: TaskRequestService;


    beforeEach(() => {
        sandbox = createSandbox();

        // Stub para IHttpRequestsService
        httpRequestMock = mock(HttpRequestService);
        httpRequestInstance = instance(httpRequestMock);


        // Stub para ITaskRepo
        taskRepoMock = mock(TaskRepo);
        taskRepoInstance = instance(taskRepoMock)

        // Mock para ITaskRequestRepo
        taskRequestRepoMock = mock(TaskRequestRepo);
        taskRequestRepoInstance= instance(taskRequestRepoMock)

        //  de TaskRequestService
        taskRequestService = new TaskRequestService(
            taskRepoInstance,
            taskRequestRepoInstance,
            httpRequestInstance
        );
    });


    afterEach(() => {
        sandbox.restore();
    });

    it('should create task and request successfully for SECURITY_TASK', async () => {
        // Arrange
        const createTaskDTO: ICreateTaskDTO = {
            "robot": "Robot1",
            "type": "securityTask",
            "building": "Office Building",
            "floors": ["Floor1", "Floor2"],
            "emergencyContact": {
                "name": "John Doe",
                "phone": 235698741
            }
        }

        const task: Task = Task.create({type: 'securityTask',
            building: 'Office Building',
            floors: ['Floor1', 'Floor2'],
            emergencyContact: {
                name: 'John Doe',
                phone: 235698741,
            }}).getValue()

        const taskRequest = TaskRequest.create({
                requesterUser: 'RequestedUser',
                robot: createTaskDTO.robot,
                status: TaskStatus.Pending,
                task: new UniqueEntityID().toString(),
                date: new Date(),
            } as ITaskRequestDTO

        ).getValue();



        const getRequestStub: SinonStub<[string], Promise<boolean>> = sandbox.stub(httpRequestInstance, 'getRequest');
        getRequestStub.withArgs('robot/Robot1').resolves(Promise.resolve(true));
        getRequestStub.withArgs('building/Office Building').resolves(true);
        getRequestStub.withArgs('floor/Office Building/Floor1').resolves(true);
        getRequestStub.withArgs('floor/Office Building/Floor2').resolves(true);



        const saveTaskStub: SinonStub<[Task], Promise<Task>> = sandbox.stub(taskRepoInstance , 'save');
        saveTaskStub.resolves(task);

        const saveTaskRequestStub: SinonStub<[TaskRequest], Promise<TaskRequest>> = sandbox.stub(taskRequestRepoInstance, 'save');
        saveTaskRequestStub.resolves(taskRequest);

        // Act
        const result: Result<ITaskRequestDTO> = await taskRequestService.createTaskAndRequest(createTaskDTO);

        // Assert
        expect(result.isSuccess).to.be.true;
        expect(getRequestStub.called).to.be.true;
        expect(saveTaskRequestStub.calledOnce).to.be.true;
        expect(saveTaskStub.calledOnce).to.be.true;
    });

    it('should create task and request successfully for PICK_UP_DELIVERY_TASK', async () => {
        // Arrange
        const createTaskDTO: ICreateTaskDTO = {
            robot: 'Robot2',
            type: 'pickupDeliveryTask',
            pickupRoom: 'RoomA',
            deliveryRoom: 'RoomB',
            pickupContact: {
                name: 'Jane Doe',
                phone: 985647589,
            },
            deliveryContact: {
                name: 'Bob Smith',
                phone: 985647589,
            },
            confirmationCode: 'ABC123',
            descriptionDelivery: 'Handle with care',
        };

        const task: Task = Task.create({  type: 'pickupDeliveryTask',
            pickupRoom: 'RoomA',
            deliveryRoom: 'RoomB',
            pickupContact: {
                name: 'Jane Doe',
                phone: 985647589,
            },
            deliveryContact: {
                name: 'Bob Smith',
                phone: 975123654,
            },
            confirmationCode: 'ABC123',
            descriptionDelivery: 'Handle with care',
        }).getValue()

        const taskRequest = TaskRequest.create({
                requesterUser: 'RequestedUser',
                robot: createTaskDTO.robot,
                status: TaskStatus.Pending,
                task: new UniqueEntityID().toString(),
                date: new Date(),
            } as ITaskRequestDTO

        ).getValue();

        const getRequestStub: SinonStub<[string], Promise<boolean>> = sandbox.stub(httpRequestInstance, 'getRequest');
        getRequestStub.withArgs('robot/Robot2').resolves(Promise.resolve(true));
        getRequestStub.withArgs('room/RoomB').resolves(true);
        getRequestStub.withArgs('room/RoomA').resolves(true);


        const saveTaskStub: SinonStub<[Task], Promise<Task>> = sandbox.stub(taskRepoInstance , 'save');
        saveTaskStub.resolves(task);

        const saveTaskRequestStub: SinonStub<[TaskRequest], Promise<TaskRequest>> = sandbox.stub(taskRequestRepoInstance, 'save');
        saveTaskRequestStub.resolves(taskRequest);

        // Act
        const result: Result<ITaskRequestDTO> = await taskRequestService.createTaskAndRequest(createTaskDTO);

        // Assert
        expect(result.isSuccess).to.be.true;
        expect(getRequestStub.called).to.be.true;
        expect(saveTaskRequestStub.calledOnce).to.be.true;
        expect(saveTaskStub.calledOnce).to.be.true;
    });


    it('should fail to create Security task and request when Building does not exist', async () => {
        // Arrange
        const createTaskDTO: ICreateTaskDTO = {
            robot: 'Robot2',
            type: 'pickupDeliveryTask',
            pickupRoom: 'RoomA',
            deliveryRoom: 'RoomB',
            pickupContact: {
                name: 'Jane Doe',
                phone: 985647589,
            },
            deliveryContact: {
                name: 'Bob Smith',
                phone: 975123654,
            },
            confirmationCode: 'ABC123',
            descriptionDelivery: 'Handle with care',
        };



        const getRequestStub: SinonStub<[string], Promise<boolean>> = sandbox.stub(httpRequestInstance, 'getRequest');
        getRequestStub.withArgs('robot/Robot2').resolves(false);

        // Act
        const result: Result<ITaskRequestDTO> = await taskRequestService.createTaskAndRequest(createTaskDTO);

        // Assert
        expect(result.isFailure).to.be.true;
        expect(result.error).to.match(/not exist/);
        expect(getRequestStub.calledOnceWithExactly('robot/Robot2')).to.be.true;
    });


    it('should fail to create Security task and request when building does not exist', async () => {
        // Arrange
        const createTaskDTO: ICreateTaskDTO = {
            robot: 'Robot1',
            type: 'securityTask',
            building: 'Office Building',
            floors: ['Floor1', 'Floor2'],
            emergencyContact: {
                name: 'John Doe',
                phone: 235698741,
            },
        };



        const getRequestStub: SinonStub<[string], Promise<boolean>> = sandbox.stub(httpRequestInstance, 'getRequest');
        getRequestStub.withArgs('robot/Robot1').resolves(Promise.resolve(true));
        getRequestStub.withArgs('building/Office Building').resolves(false);

        // Act
        const result: Result<ITaskRequestDTO> = await taskRequestService.createTaskAndRequest(createTaskDTO);
        // Assert
        expect(result.isFailure).to.be.true;
        expect(result.error).to.equal('The building: Office Building not exist.');
    });

    it('should fail to create Security  task and request when floor does not exist', async () => {
        // Arrange
        const createTaskDTO: ICreateTaskDTO = {
            robot: 'Robot1',
            type: 'securityTask',
            building: 'Office Building',
            floors: ['Floor1'],
            emergencyContact: {
                name: 'John Doe',
                phone: 235698741,
            },
        };



        const getRequestStub: SinonStub<[string], Promise<boolean>> = sandbox.stub(httpRequestInstance, 'getRequest');
        getRequestStub.withArgs('robot/Robot1').resolves(Promise.resolve(true));
        getRequestStub.withArgs('building/Office Building').resolves(true);
        getRequestStub.withArgs('floor/Office Building/Floor1').resolves(false);

        // Act
        const result: Result<ITaskRequestDTO> = await taskRequestService.createTaskAndRequest(createTaskDTO);
        // Assert
        expect(result.isFailure).to.be.true;
        expect(result.error).to.equal('The floor: Floor1 not exist.');
    });

    it('should fail to create PickUp Delivery task and request when PickUp Room does not exist', async () => {
        // Arrange
        const createTaskDTO: ICreateTaskDTO = {
            robot: 'Robot2',
            type: 'pickupDeliveryTask',
            pickupRoom: 'RoomA',
            deliveryRoom: 'RoomB',
            pickupContact: {
                name: 'Jane Doe',
                phone: 985647589,
            },
            deliveryContact: {
                name: 'Bob Smith',
                phone: 975123654,
            },
            confirmationCode: 'ABC123',
            descriptionDelivery: 'Handle with care',
        };

        const getRequestStub: SinonStub<[string], Promise<boolean>> = sandbox.stub(httpRequestInstance, 'getRequest');
        getRequestStub.withArgs('robot/Robot2').resolves(Promise.resolve(true));
        getRequestStub.withArgs('room/RoomB').resolves(true);
        getRequestStub.withArgs('room/RoomA').resolves(false);

        // Act
        const result: Result<ITaskRequestDTO> = await taskRequestService.createTaskAndRequest(createTaskDTO);

        // Assert
        expect(result.isFailure).to.be.true;
        expect(result.error).to.equal('The Room: RoomA not exist.');
    });

    it('should fail to create PickUp Delivery task and request when Delivery Room does not exist', async () => {
        // Arrange
        const createTaskDTO: ICreateTaskDTO = {
            robot: 'Robot2',
            type: 'pickupDeliveryTask',
            pickupRoom: 'RoomA',
            deliveryRoom: 'RoomB',
            pickupContact: {
                name: 'Jane Doe',
                phone: 985647589,
            },
            deliveryContact: {
                name: 'Bob Smith',
                phone: 975123654,
            },
            confirmationCode: 'ABC123',
            descriptionDelivery: 'Handle with care',
        };

        const getRequestStub: SinonStub<[string], Promise<boolean>> = sandbox.stub(httpRequestInstance, 'getRequest');
        getRequestStub.withArgs('robot/Robot2').resolves(Promise.resolve(true));
        getRequestStub.withArgs('room/RoomA').resolves(true);


        // Act
        const result: Result<ITaskRequestDTO> = await taskRequestService.createTaskAndRequest(createTaskDTO);

        // Assert

        expect(result.error).to.equal('The Room: RoomB not exist.');
    });
});
