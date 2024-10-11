import { TaskProps} from "../../../src/domain/Tasks/Task";
import {TaskType} from "../../../src/domain/Tasks/TaskType";
import {UniqueEntityID} from "../../../src/core/domain/UniqueEntityID";
import {Task} from "../../../src/domain/Tasks/Task";
import {TaskContact} from "../../../src/domain/Tasks/TaskContact";
import {TaskDescription} from "../../../src/domain/Tasks/TaskDescription";
import {ITaskDTO} from "../../../src/dto/ITaskDTO";

import { expect } from 'chai';

describe('Task', () => {
    let validSecurityTaskProps: TaskProps;
    let validSecurityTaskDTO: ITaskDTO;
    let validPickupDeliveryTaskProps: TaskProps;
    let validPickupDeliveryTaskDTO: ITaskDTO;

    beforeEach(() => {

        validSecurityTaskProps = {
            type: TaskType.SECURITY_TASK,
            building: 'Edificio 1',
            floors: ['Piso 1', 'Piso 2'],
            emergencyContact: TaskContact.create('Nome de contato', 123456789).getValue()

        };

        validSecurityTaskDTO = {
            type: TaskType.SECURITY_TASK,
            building: 'Edificio 1',
            floors: ['Piso 1', 'Piso 2'],
            emergencyContact: {
                name: 'Nombre de contacto',
                phone: 123456789,
            },
        };


        validPickupDeliveryTaskProps = {
            type: TaskType.PICK_UP_DELIVERY_TASK,
            pickupRoom: 'Sala 1',
            deliveryRoom: 'Sala 2',
            pickupContact: TaskContact.create('Nome de pickupContact', 123456789).getValue(),
            deliveryContact: TaskContact.create('Nome de deliveryContact', 655432987).getValue(),
            confirmationCode: 'ABC123',
            descriptionDelivery: TaskDescription.create('Descripción de entrega').getValue(),
        };

        validPickupDeliveryTaskDTO = {
            type: TaskType.PICK_UP_DELIVERY_TASK,
            pickupRoom: 'Sala 1',
            deliveryRoom: 'Sala 2',
            pickupContact: {
                name: 'Contacto de recogida',
                phone: 987654321,
            },
            deliveryContact: {
                name: 'Contacto de entrega',
                phone: 555555555,
            },
            confirmationCode: 'ABC123',
            descriptionDelivery: 'Descripción de entrega',
        };


    });

    it('should create a security task correctly and task Security', () => {
        const taskResult = Task.create(validSecurityTaskDTO );

        expect(taskResult.isSuccess).to.be.true;
        const task = taskResult.getValue();
        expect(task.type).to.equal(TaskType.SECURITY_TASK);

    });

    it('should fail when creating a security task with missing floors properties', () => {
        validSecurityTaskDTO.floors = undefined;

        const taskResult = Task.create(validSecurityTaskDTO);

        expect(taskResult.isFailure).to.be.true;
        expect(taskResult.error).to.equal('Building, floors, and emergencyContact are required for securityTask.');
    });

    it('should fail when creating a security task with missing building properties', () => {
        validSecurityTaskDTO.building = undefined;

        const taskResult = Task.create(validSecurityTaskDTO);

        expect(taskResult.isFailure).to.be.true;
        expect(taskResult.error).to.equal('Building, floors, and emergencyContact are required for securityTask.');
    });

    it('should fail when creating a security task with missing  type properties', () => {
        validSecurityTaskDTO.type = undefined;

        const taskResult = Task.create(validSecurityTaskDTO);

        expect(taskResult.isFailure).to.be.true;
        expect(taskResult.error).to.equal('type is null or undefined');
    });

    it('should fail when creating a security task with missing  emergencyContact properties', () => {
        validSecurityTaskDTO.emergencyContact = undefined;

        const taskResult = Task.create(validSecurityTaskDTO);

        expect(taskResult.isFailure).to.be.true;
        expect(taskResult.error).to.equal('Building, floors, and emergencyContact are required for securityTask.');
    });

    it('should fail when creating a security task with missing  emergencyContact  name properties', () => {
        validSecurityTaskDTO.emergencyContact.name = undefined;

        const taskResult = Task.create(validSecurityTaskDTO);

        expect(taskResult.isFailure).to.be.true;
        expect(taskResult.error).to.equal('Contact must have name and phone number');
    });

    it('should fail when creating a security task with missing  emergencyContact  phone properties', () => {
        validSecurityTaskDTO.emergencyContact.phone = undefined;

        const taskResult = Task.create(validSecurityTaskDTO);

        expect(taskResult.isFailure).to.be.true;
        expect(taskResult.error).to.equal('Contact must have name and phone number');
    });

    it('should fail when creating a security task with missing  emergencyContact  phone properties', () => {
        validSecurityTaskDTO.emergencyContact.phone = undefined;

        const taskResult = Task.create(validSecurityTaskDTO);

        expect(taskResult.isFailure).to.be.true;
        expect(taskResult.error).to.equal('Contact must have name and phone number');
    });

    it('should fail when creating a security task with the incorrect size  phone number properties', () => {
        validSecurityTaskDTO.emergencyContact.phone = 123;

        const taskResult = Task.create(validSecurityTaskDTO);

        expect(taskResult.isFailure).to.be.true;
        expect(taskResult.error).to.equal('Número de telefone inválido. (9 numeros)');
    });



    ///// pick up Delivery task
    it('should create a pickup and delivery task correctly', () => {
        const taskResult = Task.create(validPickupDeliveryTaskDTO);

        expect(taskResult.isSuccess).to.be.true;
        const task = taskResult.getValue();
        expect(task.type).to.equal(TaskType.PICK_UP_DELIVERY_TASK);
        // Agrega más expectativas según tus necesidades
    });

    it('should fail when creating a pickup and delivery task with missing pickupRoom properties', () => {
        validPickupDeliveryTaskDTO.pickupRoom = undefined;

        const taskResult = Task.create(validPickupDeliveryTaskDTO);

        expect(taskResult.isFailure).to.be.true;
        expect(taskResult.error).to.equal('pickupRoom, pickupContact, deliveryRoom, deliveryContact, confirmationCode, and descriptionDelivery are required for securityTask.');
    });

    it('should fail when creating a pickup and delivery task with missing pickupContact properties', () => {
        validPickupDeliveryTaskDTO.pickupContact = undefined;

        const taskResult = Task.create(validPickupDeliveryTaskDTO);

        expect(taskResult.isFailure).to.be.true;
        expect(taskResult.error).to.equal('pickupRoom, pickupContact, deliveryRoom, deliveryContact, confirmationCode, and descriptionDelivery are required for securityTask.');
    });

    it('should fail when creating a pickup and delivery task with missing deliveryRoom properties', () => {
        validPickupDeliveryTaskDTO.deliveryRoom = undefined;

        const taskResult = Task.create(validPickupDeliveryTaskDTO);

        expect(taskResult.isFailure).to.be.true;
        expect(taskResult.error).to.equal('pickupRoom, pickupContact, deliveryRoom, deliveryContact, confirmationCode, and descriptionDelivery are required for securityTask.');
    });

    it('should fail when creating a pickup and delivery task with missing deliveryContact properties', () => {
        validPickupDeliveryTaskDTO.deliveryContact = undefined;

        const taskResult = Task.create(validPickupDeliveryTaskDTO);

        expect(taskResult.isFailure).to.be.true;
        expect(taskResult.error).to.equal('pickupRoom, pickupContact, deliveryRoom, deliveryContact, confirmationCode, and descriptionDelivery are required for securityTask.');
    });

    it('should fail when creating a pickup and delivery task with missing confirmationCode properties', () => {
        validPickupDeliveryTaskDTO.confirmationCode = undefined;

        const taskResult = Task.create(validPickupDeliveryTaskDTO);

        expect(taskResult.isFailure).to.be.true;
        expect(taskResult.error).to.equal('pickupRoom, pickupContact, deliveryRoom, deliveryContact, confirmationCode, and descriptionDelivery are required for securityTask.');
    });

    it('should fail when creating a pickup and delivery task with missing descriptionDelivery properties', () => {
        validPickupDeliveryTaskDTO.descriptionDelivery = undefined;

        const taskResult = Task.create(validPickupDeliveryTaskDTO);

        expect(taskResult.isFailure).to.be.true;
        expect(taskResult.error).to.equal('pickupRoom, pickupContact, deliveryRoom, deliveryContact, confirmationCode, and descriptionDelivery are required for securityTask.');
    });




});
