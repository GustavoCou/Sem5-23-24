import { expect } from 'chai';
import { Result } from "../../../src/core/logic/Result";
import { Container } from 'typedi';
import IElevatorRepo from "../../../src/services/IRepos/IElevatorRepo";
import IBuildingRepo from "../../../src/services/IRepos/IBuildingRepo";
import IFloorRepo from "../../../src/services/IRepos/IFloorRepo";
import { Floor } from '../../../src/domain/Floor/Floor';
import { Building } from '../../../src/domain/Building/Building';
import { BuildingName } from '../../../src/domain/Building/BuildingName';
import ElevatorService from "../../../src/services/elevatorService";
import Config from '../../../config';
import config from '../../../config';
import { Elevator } from '../../../src/domain/Elevator/Elevator';
import { BuildingDescription } from '../../../src/domain/Building/BuildingDescription';
import { BuildingSize } from '../../../src/domain/Building/BuildingSize';
import { FloorDescription } from '../../../src/domain/Floor/FloorDescription';
import { FloorSize } from '../../../src/domain/Floor/FloorSize';
import { FloorMapa } from '../../../src/domain/Floor/FloorMapa';
import { BuildingId } from '../../../src/domain/Building/BuildingId';
import 'mocha';
// Mock ElevatorRepo
class ElevatorRepoMock implements IElevatorRepo {
    async save(elevator: Elevator): Promise<Elevator> {

        this.elevators.push(elevator);

        return elevator;
    }
    addElevator(elevator: any) {
        this.elevators.push(elevator);
    }

    async findId(elevatorId: string): Promise<Boolean> {
        return !!this.elevators.find(elevator => elevator.elevatorId === elevatorId);
    }
    async countElevatorsByBuilding(buildingId: string): Promise<number> {

        const count = this.elevators.filter(elevator =>
            elevator.buildingId && elevator.buildingId.props && elevator.buildingId.props.buildingId && elevator.buildingId.props.buildingId.value === buildingId
        ).length;
        return count;
    }


    findByBuildingId(buildingId: BuildingId | string): Promise<Result<{ elevatorList: Elevator[] }>> {
        throw new Error('Method not implemented.');
    }
    exists(t: Elevator): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    private elevators: any[] = [];

    async findBySerialNumber(serialNumber: string) {

        return this.elevators.find(elevator => elevator.elevatorSerialNumber === serialNumber);
    }




    async findBuildingElevator(buildingId: string) {
        return this.elevators.find(elevator => elevator.buildingId === buildingId);
    }
}

// Mock BuildingRepo
class BuildingRepoMock implements IBuildingRepo {
    async save(building: Building): Promise<Building> {
        throw new Error('Method not implemented.');
    }
    findByName(name: string | BuildingName): Promise<Building> {
        throw new Error('Method not implemented.');
    }
    listAll(): Promise<Building[]> {
        throw new Error('Method not implemented.');
    }
    updateOne(building: Building): Promise<Building> {
        throw new Error('Method not implemented.');
    }
    exists(t: Building): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    private buildings: any[] = [];

    async findById(buildingId: string) {
        const foundBuilding = this.buildings.find(building => building.id === buildingId);
        return foundBuilding;
    }

    // public addBuilding(building: any) {
    //     this.buildings.push(building);
    // }

    public addBuilding(building: any) {

        const mockBuilding = {
            ...building,
            name: BuildingName.create("A1").getValue(),
            description: BuildingDescription.create("Test Building Description").getValue(),
            size: BuildingSize.create(10, 10).getValue()
        };
        this.buildings.push(mockBuilding);
    }
}


// Mock FloorRepo
class FloorRepoMock implements IFloorRepo {
    save(floor: Floor): Promise<Floor> {
        throw new Error('Method not implemented.');
    }
    updateOne(floor: Floor): Promise<Floor> {
        throw new Error('Method not implemented.');
    }
    countFloorsByBuilding(buildingId: string): Promise<number> {
        throw new Error('Method not implemented.');
    }
    exists(t: Floor): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    public addFloor(floor: any) {
        this.floors.push(floor);
    }



    findFloorsByBuilding(buildingId: string): Promise<Floor[]> {
        throw new Error('Method not implemented.');
    }

    getAll(): Promise<Floor[]> {
        throw new Error('Method not implemented.');
    }

    private floors: any[] = [];

    async findByDomainId(floorId: string) {
        return this.floors.find(floor => floor.id === floorId);
    }
}
describe('ElevatorService', () => {
    let elevatorService: ElevatorService;

    beforeEach(() => {
        // Mockar os repositórios
        const mockElevatorRepo = new ElevatorRepoMock();
        const mockBuildingRepo = new BuildingRepoMock();
        const mockFloorRepo = new FloorRepoMock();

        // // Adicionar dados fictícios ao BuildingRepoMock
        mockBuildingRepo.addBuilding({ id: "1804" });
        mockBuildingRepo.addBuilding({ id: "A3" });
        mockBuildingRepo.addBuilding({ id: "A5" });
        mockFloorRepo.addFloor({ id: "AB" });

        // Adicionar dados fictícios ao FloorRepoMock
        mockFloorRepo.addFloor({ id: "123", building: { id: "A3" } });
        mockFloorRepo.addFloor({ id: "1", building: { id: "A5" } });
        mockFloorRepo.addFloor({ id: "2", building: { id: "A5" } });
        mockFloorRepo.addFloor({ id: "3", building: { id: "A5" } });
        mockFloorRepo.addFloor({ id: "5", building: { id: "1804" } });
        mockBuildingRepo.addBuilding({ id: "AA" });
        mockFloorRepo.addFloor({ id: "1", building: { id: "AA" } });
        mockFloorRepo.addFloor({ id: "1", building: { id: "ABC" } });
        mockBuildingRepo.addBuilding({ id: "AB" });
        mockFloorRepo.addFloor({ id: "10", building: { id: "TESTE" } });

        mockElevatorRepo.addElevator({
            buildingId: "1804",
            floorIds: ["43"],
            elevatorPosition: { posX: 10, posY: 20 },
            elevatorBrand: "BrandTest",
            elevatorModel: "ModelTest",
            elevatorId: "8989",
            elevatorSerialNumber: "9989",
            elevatorDescription: "Test elevator",
            elevatorUniqueCodBuilding: 1
        });

        Container.set(config.repos.elevator.name, mockElevatorRepo);
        Container.set(config.repos.building.name, mockBuildingRepo);
        Container.set(config.repos.floor.name, mockFloorRepo);

        elevatorService = Container.get(ElevatorService);
    });




    it('should fail if floor does not exist', async () => {
        const elevatorDTO = {
            buildingId: "1804",
            floorIds: ["43"],
            elevatorPosition: { posX: 10, posY: 20 },
            elevatorBrand: "BrandTest",
            elevatorModel: "ModelTest",
            elevatorId: "1249",
            elevatorSerialNumber: "123456",
            elevatorDescription: "Test elevator",
            elevatorUniqueCodBuilding: 1
        };

        const result = await elevatorService.createElevator(elevatorDTO);
        expect(result.isFailure).to.be.true;
        expect(result.error).to.equal("The Floor dont exist");
    });

    it('should create an elevator with valid DTO', async () => {
        const elevatorDTO = {
            buildingId: "A3",
            floorIds: ["123"],
            elevatorPosition: { posX: 10, posY: 20 },
            elevatorBrand: "BrandTest",
            elevatorModel: "ModelTest",
            elevatorId: "3000",
            elevatorSerialNumber: "11001",
            elevatorDescription: "Test elevator",
            elevatorUniqueCodBuilding: 1

        };
        const result = await elevatorService.createElevator(elevatorDTO);
        expect(result.isSuccess).to.be.true;

    });

    it('should fail if the floor doesn´t belong to the building', async () => {
        const elevatorDTO2 = {
            buildingId: "AA",
            floorIds: ["5"],
            elevatorPosition: { posX: 10, posY: 20 },
            elevatorBrand: "BrandTest",
            elevatorModel: "ModelTest",
            elevatorId: "1587",
            elevatorSerialNumber: "12",
            elevatorDescription: "Test elevator",
            elevatorUniqueCodBuilding: 1
        };


        const result = await elevatorService.createElevator(elevatorDTO2);
        //     //         expect(result.isFailure).to.be.true;
        //     //         expect(result.error).to.equal("Floor and building doesn´t match");
        //     //     });

        //     //     it('should fail if building does not exist', async () => {
        //     //         const elevatorDTO3 = {
        //     //             buildingId: "212100",
        //     //             floorIds: ["5"],
        //     //             elevatorId: "1232",
        //     //             elevatorPosition: { posX: 10, posY: 20 },
        //     //             elevatorBrand: "BrandTest",
        //     //             elevatorModel: "ModelTest",
        //     //             elevatorSerialNumber: "1234533",
        //     //             elevatorDescription: "Test elevator",
        //     //             elevatorUniqueCodBuilding: 1
        //     //         };

        //     //         const result = await elevatorService.createElevator(elevatorDTO3);
        //     //         expect(result.isFailure).to.be.true;
        //     //         expect(result.error).to.equal("Building insert not valid");
        //     //     });
        expect(result.isSuccess).to.be.false;
        expect(result.error).to.equal("Floor and building doesn´t match");


    });
    it('should fail if trying to create an elevator with a duplicated Serial Number', async () => {
        const elevatorDTO1 = {
            buildingId: "1804",
            floorIds: ["5"],
            elevatorPosition: { posX: 10, posY: 20 },
            elevatorBrand: "BrandTest",
            elevatorModel: "ModelTest",
            elevatorId: "1111",
            elevatorSerialNumber: "9989",
            elevatorDescription: "Test elevator",
            elevatorUniqueCodBuilding: 1
        };

        const result1 = await elevatorService.createElevator(elevatorDTO1);
        expect(result1.isSuccess).to.be.false;

        expect(result1.error).to.equal("Serial Number Already Exists");

    });

    it('should fail if trying to create an elevator with a duplicated Id', async () => {
        const elevatorDTO1 = {
            buildingId: "1804",
            floorIds: ["5"],
            elevatorPosition: { posX: 10, posY: 20 },
            elevatorBrand: "BrandTest",
            elevatorModel: "ModelTest",
            elevatorId: "8989",
            elevatorSerialNumber: "1989",
            elevatorDescription: "Test elevator",
            elevatorUniqueCodBuilding: 1
        };

        const result1 = await elevatorService.createElevator(elevatorDTO1);
        expect(result1.isSuccess).to.be.false;

        expect(result1.error).to.equal("Elevator Id already exist");

    });

    it('should fail if trying to create an elevator with an invalid Id', async () => {
        const elevatorDTO1 = {
            buildingId: "1804",
            floorIds: ["5"],
            elevatorPosition: { posX: 10, posY: 20 },
            elevatorBrand: "BrandTest",
            elevatorModel: "ModelTest",
            elevatorId: "aqw",
            elevatorSerialNumber: "1989",
            elevatorDescription: "Test elevator",
            elevatorUniqueCodBuilding: 1
        };

        const result1 = await elevatorService.createElevator(elevatorDTO1);
        expect(result1.isSuccess).to.be.false;

        expect(result1.error).to.equal("Invalid Id");

    });

    it('should fail if trying to create an elevator without a valid building', async () => {
        const elevatorDTO1 = {
            buildingId: "A55",
            floorIds: ["5"],
            elevatorPosition: { posX: 10, posY: 20 },
            elevatorBrand: "BrandTest",
            elevatorModel: "ModelTest",
            elevatorId: "7843",
            elevatorSerialNumber: "1989",
            elevatorDescription: "Test elevator",
            elevatorUniqueCodBuilding: 1
        };

        const result1 = await elevatorService.createElevator(elevatorDTO1);
        expect(result1.isSuccess).to.be.false;

        expect(result1.error).to.equal("Building doesn´t exist");

    });

    it('should correctly count elevators by building when creating a new elevator', async () => {

        const elevator1 = {
            buildingId: "A5",
            floorIds: ["1"],
            elevatorPosition: { posX: 10, posY: 20 },
            elevatorBrand: "BrandTest",
            elevatorModel: "ModelTest",
            elevatorId: "5000",
            elevatorSerialNumber: "5000",
            elevatorDescription: "Test elevator",
            elevatorUniqueCodBuilding: 1
        };

        const elevator2 = {
            buildingId: "A5",
            floorIds: ["2"],
            elevatorPosition: { posX: 15, posY: 25 },
            elevatorBrand: "BrandTest2",
            elevatorModel: "ModelTest2",
            elevatorId: "6000",
            elevatorSerialNumber: "6000",
            elevatorDescription: "Test elevator 2",
            elevatorUniqueCodBuilding: 2
        };


        await elevatorService.createElevator(elevator1);
        await elevatorService.createElevator(elevator2);


        const elevator3 = {
            buildingId: "A5",
            floorIds: ["3"],
            elevatorPosition: { posX: 20, posY: 30 },
            elevatorBrand: "BrandTest3",
            elevatorModel: "ModelTest3",
            elevatorId: "7000",
            elevatorSerialNumber: "7000",
            elevatorDescription: "Test elevator 3",
            elevatorUniqueCodBuilding: 3
        };
        const result = await elevatorService.createElevator(elevator3);


        expect(result.isSuccess).to.be.true;
        expect(result.getValue().elevatorUniqueCodBuilding).to.equal(3);
    });
});
