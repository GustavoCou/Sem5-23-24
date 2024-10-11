import { expect } from 'chai';
import BridgeService from "../../../src/services/bridgeService";
import { Result } from "../../../src/core/logic/Result";
import IBridgeRepo from "../../../src/services/IRepos/IBridgeRepo";
import IFloorRepo from "../../../src/services/IRepos/IFloorRepo";
import IBuildingRepo from "../../../src/services/IRepos/IBuildingRepo";
import { Bridge } from "../../../src/domain/Bridge/Bridge";
import { Floor } from "../../../src/domain/Floor/Floor";
import { Building } from "../../../src/domain/Building/Building";
import { BridgeId } from '../../../src/domain/Bridge/BridgeId';
import { FloorID } from '../../../src/domain/Floor/FloorID';
import { BuildingId } from '../../../src/domain/Building/BuildingId';
import { BuildingName } from '../../../src/domain/Building/BuildingName';
import Container from 'typedi';
import * as sinon from 'sinon';
import config from '../../../config';
import { BuildingDescription } from '../../../src/domain/Building/BuildingDescription';
import { BuildingSize } from '../../../src/domain/Building/BuildingSize';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import { BridgePosition } from '../../../src/domain/Bridge/BridgePosition';
import { Entity } from '../../../src/core/domain/Entity';
import { IDomainEvent } from '../../../src/core/domain/events/IDomainEvent';
import BridgeError from '../../../src/exceptions/bridgeException';


class BridgeRepoMock implements IBridgeRepo {
    listAll(): Promise<Bridge[]> {
        return Promise.resolve(this.bridges);
    }


    updateOne(bridge: Bridge): Promise<Bridge> {
        const index = this.bridges.findIndex(b => b.bridgeId === bridge.bridgeId);
        if (index !== -1) {
            this.bridges[index].props = bridge.props; // Atualize apenas a propriedade props
            return Promise.resolve(this.bridges[index]); // Retorne a ponte atualizada
        } else {
            throw new Error('Bridge not found.');
        }
    }


    private bridges: any[] = [];

    async findById(bridgeId: string) {
        return this.bridges.find(bridge => bridge.bridgeId === bridgeId);
    }

    listAllWithBuilding(building: Building): Promise<Bridge[]> {
        return Promise.resolve(this.bridges.filter(bridge => bridge.buildingX === building.id || bridge.buildingY === building.id));
    }



    addBridge(bridge: any) {
        this.bridges.push(bridge);
    }

    bridgeWithFloors(floorId1: string, floorId2: string): Promise<Boolean> {
        const bridgeExists = this.bridges.some(bridge =>
            (bridge.floorIdX === floorId1 && bridge.floorIdY === floorId2) ||
            (bridge.floorIdX === floorId2 && bridge.floorIdY === floorId1)
        );
        return Promise.resolve(bridgeExists);
    }

    save(bridge: Bridge): Promise<Bridge> {
        this.bridges.push(bridge);
        return Promise.resolve(bridge);
    }

    findAndGiveBridge(bridgeId: string | BridgeId): Promise<Bridge> {

        const bridge = this.bridges.find(bridge => {
            if (!bridge) return false;  // n tem em conta undefined

            const currentBridgeId = bridge.props?.bridgeId || bridge.bridgeId;
            return currentBridgeId === bridgeId;
        });
        return Promise.resolve(bridge);
    }






    // getBridgeBetweenBuildingsId(buildingX: string, buildingY: string): Promise<Bridge[]> {

    //     const bridgesBetween = this.bridges.filter(bridge => {
    //   
    //         if (!bridge || !bridge.props) {
    //             console.log("Found problematicas:", bridge);
    //             return false; 
    //         }

    //         try {
    //        
    //             if (!bridge.props.buildingX || !bridge.props.buildingY) {
    //                 console.log("Bridge s propriedades:", bridge);
    //             }

    //             console.log("aaaaa", bridge.props.buildingX.toString());
    //             console.log(bridge.props.buildingY.toString());

    //             return (bridge.props.buildingX.toString() === buildingX && bridge.props.buildingY.toString() === buildingY) ||
    //                 (bridge.props.buildingX.toString() === buildingY && bridge.props.buildingY.toString() === buildingX)
    //         } catch (error) {
    //             console.error("Error processing bridge:", error);
    //         }
    //     });

    //     return Promise.resolve(bridgesBetween);
    // }

    getBridgeBetweenBuildingsId(buildingX: string, buildingY: string): Promise<Bridge[]> {
        const bridgesBetween = this.bridges.filter(bridge => {
            if (!bridge) {
                //    console.log("Found problematic bridge:", bridge);
                return false;
            }

            let bridgeProps = bridge.props || bridge;

            try {

                return (bridgeProps.buildingX.toString() === buildingX && bridgeProps.buildingY.toString() === buildingY) ||
                    (bridgeProps.buildingX.toString() === buildingY && bridgeProps.buildingY.toString() === buildingX);
            } catch (error) {
                console.error("Error processing bridge:", error);
            }
        });

        return Promise.resolve(bridgesBetween);
    }

    exists(t: Bridge): Promise<boolean> {
        return Promise.resolve(this.bridges.some(bridge => bridge.bridgeId === t.bridgeId));
    }

}

class FloorRepoMock implements IFloorRepo {
    private floors: any[] = [];

    public addFloor(floor: any) {
        this.floors.push(floor);
    }
    save(floor: Floor): Promise<Floor> {
        throw new Error('Method not implemented.');
    }


    async findByDomainId(floorId: string) {
        return this.floors.find(floor => floor.id === floorId);
    }
    findFloorsByBuilding(buildingId: string): Promise<Floor[]> {
        throw new Error('Method not implemented.');
    }
    updateOne(floor: Floor): Promise<Floor> {
        throw new Error('Method not implemented.');
    }
    getAll(): Promise<Floor[]> {
        throw new Error('Method not implemented.');
    }
    countFloorsByBuilding(buildingId: string): Promise<number> {
        throw new Error('Method not implemented.');
    }
    exists(t: Floor): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

}

class BuildingRepoMock implements IBuildingRepo {
    private buildings: any[] = [];
    public addBuilding(building: any) {

        const mockBuilding = {
            ...building,
            name: BuildingName.create("A1").getValue(),
            description: BuildingDescription.create("Test Building Description").getValue(),
            size: BuildingSize.create(10, 10).getValue()
        };
        this.buildings.push(mockBuilding);
    }
    save(building: Building): Promise<Building> {
        throw new Error('Method not implemented.');
    }
    async findById(buildingId: string) {
        return this.buildings.find(building => building.id === buildingId);
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

}



describe('BridgeService', () => {
    let bridgeService: BridgeService;
    let createStub;
    //let listAllStub;
    let mockBridgeRepo: BridgeRepoMock;


    beforeEach(() => {
        mockBridgeRepo = new BridgeRepoMock();
        const mockFloorRepo = new FloorRepoMock();
        const mockBuildingRepo = new BuildingRepoMock();

        createStub = sinon.stub(FloorID, 'create').callsFake((id) => {
            return {
                isSuccess: true,
                getValue: () => id
            };
        });


        //listAllStub = sinon.stub(BridgeRepoMock.prototype, 'listAll');



        //(FloorID as any) = MockFloorID;

        // // Adicionar dados fictícios ao BuildingRepoMock
        mockBuildingRepo.addBuilding({ id: "A1" });
        mockBuildingRepo.addBuilding({ id: "A2" });
        mockBuildingRepo.addBuilding({ id: "A3" });
        mockBuildingRepo.addBuilding({ id: "A4" });
        mockBuildingRepo.addBuilding({ id: "A5" });
        mockBuildingRepo.addBuilding({ id: "A7" });

        // Adicionar dados fictícios ao FloorRepoMock
        mockFloorRepo.addFloor({ id: "F1", building: { id: "A1" } });
        mockFloorRepo.addFloor({ id: "F2", building: { id: "A1" } });
        mockFloorRepo.addFloor({ id: "F3", building: { id: "A1" } });
        mockFloorRepo.addFloor({ id: "F4", building: { id: "A2" } });
        mockFloorRepo.addFloor({ id: "F5", building: { id: "A2" } });
        mockFloorRepo.addFloor({ id: "F6", building: { id: "A3" } });
        mockFloorRepo.addFloor({ id: "F7", building: { id: "A4" } });
        mockFloorRepo.addFloor({ id: "F8", building: { id: "A5" } });





        mockBridgeRepo.addBridge({
            bridgeId: "F7F8",
            floorIdX: "F7",
            floorIdY: "F8",
            bridgePositionX: { posX: 10, posY: 20 },
            bridgePositionY: { posX: 10, posY: 20 },
            buildingX: "A4",
            buildingY: "A5"

        });

        mockBridgeRepo.addBridge({
            bridgeId: "FF38",
            floorIdX: "F5",
            floorIdY: "F8",
            bridgePositionX: { posX: 10, posY: 20 },
            bridgePositionY: { posX: 10, posY: 20 },
            buildingX: "A2",
            buildingY: "A5"

        });


        mockBridgeRepo.addBridge({
            bridgeId: "F3F8",
            props: {
                floorIdX: "F3",
                floorIdY: "F8",
                bridgePositionX: { posX: 10, posY: 20 },
                bridgePositionY: { posX: 10, posY: 20 },
                buildingX: "A1",
                buildingY: "A5"
            }
        });

        mockBridgeRepo.addBridge({
            bridgeId: "F6F7",
            props: {
                floorIdX: "F6",
                floorIdY: "F1",
                bridgePositionX: { posX: 10, posY: 20 },
                bridgePositionY: { posX: 10, posY: 20 },
                buildingX: "A3",
                buildingY: "A1"
            }
        });



        Container.set(config.repos.bridge.name, mockBridgeRepo);
        Container.set(config.repos.building.name, mockBuildingRepo);
        Container.set(config.repos.floor.name, mockFloorRepo);

        bridgeService = new BridgeService(mockFloorRepo, mockBuildingRepo, mockBridgeRepo);
    });


    afterEach(() => {
        // volta ao  metodo original depois de fazer cada test
        createStub.restore();

        //listAllStub.restore();
    });


    //TESTE PARA CRIAR BRIDGE
    //criar com tudo valido
    it('should create a bridge with valid DTO', async () => {
        const bridgeDTO = {
            bridgeId: "A1A2",
            floorIdX: "F1",
            floorIdY: "F4",
            bridgePositionX: { posX: 10, posY: 20 },
            bridgePositionY: { posX: 10, posY: 20 },
            buildingX: "A1",
            buildingY: "A2"

        };
        const result = await bridgeService.createBridge(bridgeDTO);
        expect(result.isSuccess).to.be.true;

    });

    //criar ponte entre dois pisos do mesmo edificio
    it('should fail if trying to create a bridge between two floors of the same building', async () => {
        const bridgeDTO = {
            bridgeId: "A1A2",
            floorIdX: "F1",
            floorIdY: "F2",
            bridgePositionX: { posX: 10, posY: 20 },
            bridgePositionY: { posX: 10, posY: 20 },
            buildingX: "A1",
            buildingY: "A1"

        };

        const result = await bridgeService.createBridge(bridgeDTO);
        expect(result.isFailure).to.be.true;

        if (result.error instanceof BridgeError) {
            const bridgeError = result.error as BridgeError;
            expect(bridgeError.message).to.equal("Floors are in the same building. Bridge not created");
        } else {
            expect(result.error).to.equal("Floors are in the same building. Bridge not created");
        }
    });


    //tenta criar quando nao existe piso
    it('should fail if a floor does not exist', async () => {
        const bridgeDTO = {
            bridgeId: "A1A2",
            floorIdX: "F50",
            floorIdY: "F4",
            bridgePositionX: { posX: 10, posY: 20 },
            bridgePositionY: { posX: 10, posY: 20 },
            buildingX: "A1",
            buildingY: "A2"

        };

        const result = await bridgeService.createBridge(bridgeDTO);
        if (result.error instanceof BridgeError) {
            const bridgeError = result.error as BridgeError;
            expect(bridgeError.message).to.equal("Invalid Id Floor");
        } else {
            expect(result.error).to.equal("Invalid Id Floor");
        }

    });



    //tenta criar com ids duplicados
    it('should fail if trying to create a bridge with a duplicated Id', async () => {


        const bridgeDTO1 = {
            bridgeId: "F7F8",
            floorIdX: "F1",
            floorIdY: "F4",
            bridgePositionX: { posX: 10, posY: 20 },
            bridgePositionY: { posX: 10, posY: 20 },
            buildingX: "A1",
            buildingY: "A2"

        };
        const result = await bridgeService.createBridge(bridgeDTO1);

        if (result.error instanceof BridgeError) {
            const bridgeError = result.error as BridgeError;
            expect(bridgeError.message).to.equal("Bridge already exist");
        } else {
            expect(result.error).to.equal("Bridge already exist");
        }

    });

    //tenta criar entre pisos ja ligados (mas em reverso)
    it('should fail if trying to create a bridge with floors already connected in opposite ways', async () => {
        const bridgeDTO = {
            bridgeId: "PP22",
            floorIdX: "F8",
            floorIdY: "F7",
            bridgePositionX: { posX: 10, posY: 20 },
            bridgePositionY: { posX: 10, posY: 20 },
            buildingX: "A5",
            buildingY: "A4"

        };


        const result = await bridgeService.createBridge(bridgeDTO);

        if (result.error instanceof BridgeError) {
            const bridgeError = result.error as BridgeError;
            expect(bridgeError.message).to.equal("Floors are already connected");
        } else {
            expect(result.error).to.equal("Floors are already connected");
        }
    }
    );

    //ten criar com pisos ja ligados (ordem normal)
    it('should fail if trying to create a bridge with same floors', async () => {
        const bridgeDTO = {
            bridgeId: "A1A7",
            floorIdX: "F7",
            floorIdY: "F8",
            bridgePositionX: { posX: 10, posY: 20 },
            bridgePositionY: { posX: 10, posY: 20 },
            buildingX: "A4",
            buildingY: "A5"

        };


        const result = await bridgeService.createBridge(bridgeDTO);

        expect(result.isSuccess).to.be.false;
        if (result.error instanceof BridgeError) {
            const bridgeError = result.error as BridgeError;
            expect(bridgeError.message).to.equal("Floors are already connected");
        } else {
            expect(result.error).to.equal("Floors are already connected");
        }

    });


    //TESTES PARA LISTAR PISOS DE UM DETERMINADO EDIFICIO COM PONTES
    //edificio existe mas pisos sem pontes
    it('should return an error when the building has no floors with bridges ', async () => {

        const result = await bridgeService.getAllFloorsWithBridges("A7");


        expect(result.isFailure).to.be.true;
        if (result.error instanceof BridgeError) {
            const bridgeError = result.error as BridgeError;
            expect(bridgeError.message).to.equal("This building has no bridge");
        } else {
            expect(result.error).to.equal("This building has no bridge");
        }

    });

    //edificio existe e retorna os pisos onde tem pontes
    it('should return the floors of a building with bridges', async () => {

        //tem duas pontes
        const result = await bridgeService.getAllFloorsWithBridges("A5");

        expect(result.isSuccess).to.be.true;

        const bridgeInformationDTOs = result.getValue().bridgeInformationDTO;
        expect(bridgeInformationDTOs.length).to.equal(2); //duas pontes em mock  

        const bridgeIds = bridgeInformationDTOs.map(dto => dto.bridgeId);
        expect(bridgeIds).to.include.members(["F7F8", "FF38"]);

    });

    //edificio nao existe na procura de pisos com pontes
    it('should return an error when the building doesnt exist ', async () => {

        const result = await bridgeService.getAllFloorsWithBridges("A10");


        expect(result.isFailure).to.be.true;
        if (result.error instanceof BridgeError) {
            const bridgeError = result.error as BridgeError;
            expect(bridgeError.message).to.equal("Invalid building");
        } else {
            expect(result.error).to.equal("Invalid building");
        }

    });



    //TESTES PARA O GET LIST: retorna toda a lista de bridges ou se for dado um par de edificios entre esses eds
    //sem identificar ed: lista vazia
    it('should return a failure result if there are no bridges to list (getAll)', async () => {

        (bridgeService as any).bridgeRepo.bridges = [];

        const result = await bridgeService.getAll();

        expect(result.isFailure).to.be.true;
        if (result.error instanceof BridgeError) {
            const bridgeError = result.error as BridgeError;
            expect(bridgeError.message).to.equal("No bridges to list");
        } else {
            expect(result.error).to.equal("No bridges to list");
        }

    });

    //sem identificar edificio: retorna uma lista de todas as bridges existentes
    it('should return a successful result with a list of bridge DTOs', async () => {

        const bridge1 = {
            props: {
                bridgeId: BridgeId.create("F1F7").getValue(),
                floorIdX: FloorID.create("F1").getValue(),
                floorIdY: FloorID.create("F7").getValue(),
                bridgePositionX: BridgePosition.create({ posX: 10, posY: 20 }).getValue(),
                bridgePositionY: BridgePosition.create({ posX: 10, posY: 20 }).getValue(),
                buildingX: BuildingId.create("A1").getValue(),
                buildingY: BuildingId.create("A4").getValue()
            },

        };

        const bridge2 = {
            props: {
                bridgeId: BridgeId.create("F1F8").getValue(),
                floorIdX: FloorID.create("F1").getValue(),
                floorIdY: FloorID.create("F8").getValue(),
                bridgePositionX: BridgePosition.create({ posX: 10, posY: 20 }).getValue(),
                bridgePositionY: BridgePosition.create({ posX: 10, posY: 20 }).getValue(),
                buildingX: BuildingId.create("A1").getValue(),
                buildingY: BuildingId.create("A5").getValue()
            },

        };


        (bridgeService as any).bridgeRepo.bridges = [bridge1.props, bridge2.props];

        const result = await bridgeService.getAll();

        expect(result.isSuccess).to.be.true;
        expect(result.getValue().length).to.equal(2);
    });

    //c/indicacao de edificio: retorna as pontes existentes entre eles
    it('should return bridges when both specific buildings have bridges between them', async () => {
        const bridge1 = {
            props: {
                bridgeId: BridgeId.create("F1F7").getValue(),
                floorIdX: FloorID.create("F2").getValue(),
                floorIdY: FloorID.create("F7").getValue(),
                bridgePositionX: BridgePosition.create({ posX: 10, posY: 20 }).getValue(),
                bridgePositionY: BridgePosition.create({ posX: 10, posY: 20 }).getValue(),
                buildingX: BuildingId.create("A1").getValue().toString(),
                buildingY: BuildingId.create("A4").getValue().toString()
            },

        };
        const bridge2 = {
            props: {
                bridgeId: BridgeId.create("F3F7").getValue(),
                floorIdX: FloorID.create("F3").getValue(),
                floorIdY: FloorID.create("F7").getValue(),
                bridgePositionX: BridgePosition.create({ posX: 10, posY: 20 }).getValue(),
                bridgePositionY: BridgePosition.create({ posX: 10, posY: 20 }).getValue(),
                buildingX: BuildingId.create("A1").getValue().toString(),
                buildingY: BuildingId.create("A4").getValue().toString()
            },

        };

        (bridgeService as any).bridgeRepo.bridges = [bridge1.props, bridge2.props];

        const result = await bridgeService.listBridgesOfBuildings("A1", "A4");



        expect(result.isSuccess).to.be.true;
        const actualBridgeIds = result.getValue().map(bridge => bridge.bridgeId);
        const expectedBridgeIds = ['F1F7', 'F3F7'];  //id de bridges que espero receber

        expect(actualBridgeIds).to.deep.equal(expectedBridgeIds); //comparar os ids de retorno da lista
        expect(result.getValue().length).to.equal(2);//comparar o tamanho
    });



    //c/indicacao edificio: sem pontes entre os dois
    it('should return an empty list when there are no bridges between specific buildings', async () => {

        const result = await bridgeService.listBridgesOfBuildings("A1", "A7");

        if (result.error instanceof BridgeError) {
            const bridgeError = result.error as BridgeError;
            expect(bridgeError.message).to.equal("No bridges to list");
        } else {
            expect(result.error).to.be.equal("No bridges to list");
        }
    });




    //c/indicacao de edificio: invalid id building
    it('should return an error with invalid building ids', async () => {
        const invalidBuildingId1 = "Invalid1";
        const invalidBuildingId2 = "Invalid2";

        const result = await bridgeService.listBridgesOfBuildings(invalidBuildingId1, invalidBuildingId2);
        expect(result.isFailure).to.be.true;
        if (result.error instanceof BridgeError) {
            const bridgeError = result.error as BridgeError;
            expect(bridgeError.message).to.equal("Invalid building");
        } else {
            expect(result.error).to.equal("Invalid building");
        }

    });



    //TESTES PARA O EDITAR UMA PONTE
    //editar para um id que nao existe
    it('should not accept update a bridge with an invalid id', async () => {

        const bridgeDTO = {
            bridgeId: "XXXX",
            floorIdX: "F6",
            floorIdY: "F8",
            bridgePositionX: { posX: 10, posY: 20 },
            bridgePositionY: { posX: 10, posY: 20 },
            buildingX: "A3",
            buildingY: "A5"
        };

        const result = await bridgeService.updateBridge(bridgeDTO);

        expect(result.isSuccess).to.be.false;

        if (result.error instanceof BridgeError) {
            const bridgeError = result.error as BridgeError;
            expect(bridgeError.message).to.equal("Bridge does not exist");
        } else {
            expect(result.error).to.equal("Bridge does not exist");
        }

    });

    //edita com sucesso o id de um floor
    it('should update a bridge with a different floorId', async () => {

        const bridgeDTO = {
            bridgeId: "F6F7",
            floorIdX: "F6",
            floorIdY: "F8",
            bridgePositionX: { posX: 10, posY: 20 },
            bridgePositionY: { posX: 10, posY: 20 },
            buildingX: "A3",
            buildingY: "A5"
        };

        const result = await bridgeService.updateBridge(bridgeDTO);

        //para verificar se a atualizacao foi bem sucedida vai buscar a ponte pelo id
        const updatedBridge = await (Container.get(config.repos.bridge.name) as BridgeRepoMock).findAndGiveBridge(bridgeDTO.bridgeId);

        expect(updatedBridge.props.floorIdX).to.equal(bridgeDTO.floorIdX);
        expect(updatedBridge.props.floorIdY).to.equal(bridgeDTO.floorIdY);
        expect(updatedBridge.props.buildingX.toString()).to.equal(bridgeDTO.buildingX);
        expect(updatedBridge.props.buildingY.toString()).to.equal(bridgeDTO.buildingY);
    });
});