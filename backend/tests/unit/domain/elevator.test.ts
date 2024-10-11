import { expect } from 'chai';
import { Elevator } from '../../../src/domain/Elevator/Elevator';
import { ElevatorBrand } from '../../../src/domain/Elevator/ElevatorBrand';
import { ElevatorDescription } from '../../../src/domain/Elevator/ElevatorDescription';
import { ElevatorModel } from '../../../src/domain/Elevator/ElevatorModel';
import { ElevatorPosition } from '../../../src/domain/Elevator/ElevatorPosition';
import { ElevatorSerialNumber } from '../../../src/domain/Elevator/ElevatorSerialNumber';
import { FloorID } from '../../../src/domain/Floor/FloorID';
import { BuildingId } from '../../../src/domain/Building/BuildingId';
import { ElevatorId } from '../../../src/domain/Elevator/ElevatorId';

describe('Elevator', () => {
    let validElevatorProps: {
        buildingId: string;
        elevatorPosition: ElevatorPosition;
        elevatorId: string;
        floorIds: string[];
        elevatorBrand: string;
        elevatorModel: string;
        elevatorSerialNumber: string;
        elevatorDescription: string;
        elevatorUniqueCodBuilding: number;
    };

    beforeEach(() => {

        const buildingId = BuildingId.create('B1').getValue().toString();
        const floor1Result = FloorID.create('F1');
        const floor2Result = FloorID.create('F2');
        const floor3Result = FloorID.create('F3');

        const floor1String = floor1Result.getValue().toString();
        const floor2String = floor2Result.getValue().toString();
        const floor3String = floor3Result.getValue().toString();


        const elevatorPositionResult = ElevatorPosition.create({
            posX: 10,
            posY: 20
        });


        validElevatorProps = {

            buildingId: buildingId,
            elevatorPosition: elevatorPositionResult.getValue(),
            floorIds: [floor1String, floor2String, floor3String],
            elevatorBrand: ElevatorBrand.create('Dutch').getValue().toString(),
            elevatorModel: ElevatorModel.create('ModeloXPTO').getValue().toString(),
            elevatorSerialNumber: ElevatorSerialNumber.create('1234567890').getValue().toString(),
            elevatorDescription: ElevatorDescription.create('Descricao').getValue().toString(),
            elevatorId: '1234',
            elevatorUniqueCodBuilding: 1,

        };
    });

    it('should create an elevator instance with valid properties', () => {
        const elevatorResult = Elevator.create(validElevatorProps);

        expect(elevatorResult.isSuccess).to.be.true;
        const elevator = elevatorResult.getValue();
        expect(elevator.buildingId.toString()).to.equal(validElevatorProps.buildingId);

        expect(elevator.elevatorPosition.posX).to.equal(validElevatorProps.elevatorPosition.posX);
        expect(elevator.elevatorPosition.posY).to.equal(validElevatorProps.elevatorPosition.posY);
        expect(elevator.elevatorId.toString()).to.equal(validElevatorProps.elevatorId);
        validElevatorProps.floorIds.forEach(floorId => {
            expect(elevator.floorIds.map(f => f.toString())).to.include(floorId);
        });

        expect(elevator.elevatorBrand.toString()).to.equal(validElevatorProps.elevatorBrand);
        expect(elevator.elevatorModel.toString()).to.equal(validElevatorProps.elevatorModel);
        expect(elevator.elevatorSerialNumber.toString()).to.equal(validElevatorProps.elevatorSerialNumber);
        expect(elevator.elevatorDescription.toString()).to.equal(validElevatorProps.elevatorDescription);
        expect(elevator.elevatorUniqueCodBuilding).to.equal(validElevatorProps.elevatorUniqueCodBuilding);
    });

    it('should not create an elevator with a brand but without a model', () => {
        const invalidElevatorProps = {
            ...validElevatorProps,
            elevatorBrand: ElevatorBrand.create('Dutch').getValue().toString(),
            elevatorModel: '' // Modelo vazio
        };

        const elevatorResult = Elevator.create(invalidElevatorProps);
        expect(elevatorResult.isSuccess).to.be.false;
        expect(elevatorResult.error).to.equal('The model of the brand is needed.');
    });


    it('should not create an elevator with a non-existent floor', () => {
        const invalidFloorId = 'INVALID_FLOOR_ID';

        const invalidElevatorProps = {
            ...validElevatorProps,
            floorIds: [invalidFloorId]
        };

        const elevatorResult = Elevator.create(invalidElevatorProps);

        expect(elevatorResult.isSuccess).to.be.false;
        expect(elevatorResult.error).to.equal('Invalid floor id. Floor does not exist');
    });
    it('should not create an elevator with a brand exceeding 50 characters', () => {
        const invalidElevatorBrand = 'A'.repeat(51);

        const invalidElevatorProps = {
            ...validElevatorProps,
            elevatorBrand: invalidElevatorBrand
        };

        const elevatorResult = Elevator.create(invalidElevatorProps);
        expect(elevatorResult.isSuccess).to.be.false;
        expect(elevatorResult.error).to.equal('Elevator Brand invalid');
    });


    it('should not create an elevator with a serial number using letters', () => {
        const invalidElevatorSerialNumber = 'ABCD';

        const invalidElevatorProps = {
            ...validElevatorProps,
            elevatorSerialNumber: invalidElevatorSerialNumber
        };

        const elevatorResult = Elevator.create(invalidElevatorProps);
        expect(elevatorResult.isSuccess).to.be.false;
        expect(elevatorResult.error).to.equal('Elevator serial number invalid.');
    });


    it('should not create an elevator with a serial number exceeding 50 characters', () => {
        const invalidElevatorSerialNumber = '1'.repeat(51);

        const invalidElevatorProps = {
            ...validElevatorProps,
            elevatorSerialNumber: invalidElevatorSerialNumber
        };

        const elevatorResult = Elevator.create(invalidElevatorProps);
        expect(elevatorResult.isSuccess).to.be.false;
        expect(elevatorResult.error).to.equal('Elevator serial number invalid.');
    });

    it('should not create an elevator with a description exceeding 250 characters', () => {
        const invalidElevatorDescription = 'A'.repeat(251);

        const invalidElevatorProps = {
            ...validElevatorProps,
            elevatorDescription: invalidElevatorDescription
        };

        const elevatorResult = Elevator.create(invalidElevatorProps);

        expect(elevatorResult.isSuccess).to.be.false;

        expect(elevatorResult.error).to.equal('Elevator description invalid.');
    });

    it('should not create an elevator without an id', () => {
        const invalidElevatorId = '' //vazio

        const invalidElevatorProps = {
            ...validElevatorProps,
            elevatorId: invalidElevatorId
        };

        const elevatorResult = Elevator.create(invalidElevatorProps);
        expect(elevatorResult.isSuccess).to.be.false;
        expect(elevatorResult.error).to.equal('Invalid Id');
    });

    it('should not create an elevator with an id bigger then 4 numbers', () => {
        const invalidElevatorId = '12345';

        const invalidElevatorProps = {
            ...validElevatorProps,
            elevatorId: invalidElevatorId
        };

        const elevatorResult = Elevator.create(invalidElevatorProps);
        expect(elevatorResult.isSuccess).to.be.false;
        expect(elevatorResult.error).to.equal('Invalid Id');
    });


    it('should not create an elevator with an id with letters', () => {
        const invalidElevatorId = 'ABC';

        const invalidElevatorProps = {
            ...validElevatorProps,
            elevatorId: invalidElevatorId
        };

        const elevatorResult = Elevator.create(invalidElevatorProps);
        expect(elevatorResult.isSuccess).to.be.false;
        expect(elevatorResult.error).to.equal('Invalid Id');
    });


});
