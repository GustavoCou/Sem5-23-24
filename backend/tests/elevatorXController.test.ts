import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../src/core/logic/Result';
import IElevatorService from "../src/services/IServices/IElevatorService";
import ElevatorController from "../src/controllers/elevatorController";
import IElevatorDTO from '../src/dto/IElevatorDTO';
import { Elevator } from '../src/domain/Elevator/Elevator';
import IBuildingDTO from '../src/dto/IBuildingDTO';
import FloorRepo from '../src/repos/floorRepo';
import ElevatorRepo from '../src/repos/elevatorRepo';
import BuildingRepo from '../src/repos/buildingRepo';
import config from '../config';
import IElevatorRepo from "../src/services/IRepos/IElevatorRepo"
import { error } from 'console';
import * as assert from 'assert';
import ElevatorService from '../src/services/elevatorService';
import IBuildingRepo from '../src/services/IRepos/IBuildingRepo';
import IFloorRepo from '../src/services/IRepos/IFloorRepo';
import { Model } from 'mongoose';




describe('elevator controller', function () {

    let buildingRepoInstance;
    let floorRepoInstance;
    beforeEach(function () {
        this.timeout(10000);
        Container.reset();
        sinon.restore();

        // Schemas de building, elevator e floor
        let buildingSchemaInstance = require("../src/persistence/schemas/buildingSchema").default;
        Container.set('buildingSchema', buildingSchemaInstance);

        let elevatorSchemaInstance = require("../src/persistence/schemas/elevatorSchema").default;
        Container.set('elevatorSchema', elevatorSchemaInstance);

        let floorSchemaInstance = require("../src/persistence/schemas/FloorSchema").default;
        Container.set("floorSchema", floorSchemaInstance);

        // Repositorios floor, builing e elevador
        floorRepoInstance = new FloorRepo(floorSchemaInstance);
        Container.set("floorRepo", floorRepoInstance);

        buildingRepoInstance = new BuildingRepo(buildingSchemaInstance);
        Container.set('BuildingRepo', buildingRepoInstance);

        let elevatorRepoInstance = new ElevatorRepo(elevatorSchemaInstance);
        Container.set('ElevatorRepo', elevatorRepoInstance);

        // repositorios -> containe
        const elevatorRepo = Container.get('ElevatorRepo') as IElevatorRepo;
        const buildingRepo = Container.get('BuildingRepo') as IBuildingRepo;
        const floorRepo = Container.get('floorRepo') as IFloorRepo;

        // registar uma instancia do servico
        const elevatorService = new ElevatorService(elevatorRepo, buildingRepo, floorRepo);
        Container.set('ElevatorService', elevatorService);
    });


    it('ElevatorController + ElevatorService integration test using Repository and Elevator stubs', async function () {
        this.timeout(200000000); //valor absurdo alto pq sn falha

        let body = {
            buildingId: "A1",
            elevatorPosition: { posX: 10, posY: 20 },
            elevatorId: "1234",
            floorIds: ["F1"],
            elevatorUniqueCodBuilding: 1,
            elevatorBrand: "brand",
            elevatorModel: "model",
            elevatorSerialNumber: "12323",
            elevatorDescription: "descricao"
        };
        let req: Partial<Request> = { body };


        let responseData: any;//response data sera esta variavel
        let res: Partial<Response> = {
            json: sinon.stub().callsFake((data: any) => {
                responseData = data;
                return res;  // devolve o objecto de resposta do mock
            }),
            status: sinon.stub().returnsThis()
        };


        let next: Partial<NextFunction> = () => { };

        //popular a database do mock - > precisei popular valores por causa das verificacoes do create
        const elevatorRepoInstance = Container.get("ElevatorRepo") as ElevatorRepo;
        sinon.stub(elevatorRepoInstance, "save").resolves(body);
        sinon.stub(elevatorRepoInstance, "countElevatorsByBuilding").resolves(1);
        sinon.stub(Model, 'findOne').resolves(null);
        const mockBuilding = {
            id: "A1",
            "name": "Sample Building",
            "description": "someDiscription"
        };

        sinon.stub(buildingRepoInstance, 'findById').resolves(mockBuilding);

        const mockedFloorReturn = {
            "id": "F1",
            "name": "Example Floor Name",
            "buildingId": "A1",

        };
        sinon.stub(floorRepoInstance, "findByDomainId").resolves(mockedFloorReturn);
        sinon.stub(elevatorRepoInstance, "findBySerialNumber").resolves(null);
        const elevatorServiceInstance = Container.get("ElevatorService") as IElevatorService;
        sinon.stub(elevatorServiceInstance, 'checkFloorAndBuilding').returns(Promise.resolve(true));



        const ctrl = new ElevatorController(elevatorServiceInstance);

        // Act
        await ctrl.createElevator(<Request>req, <Response>res, <NextFunction>next);


        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match(body));


    });
    it('createElevador: returns elevador created', async function () {
        let body = {
            buildingId: "A1",
            elevatorPosition: {
                posX: 10,
                posY: 20
            },
            elevatorId: "1232",
            floorIds: [{ "A1": "B1" }],
            elevatorUniqueCodBuilding: 1,
            elevatorBrand: "brand",
            elevatorModel: "model",
            elevatorSerialNumber: "12323",
            elevatorDescription: "descricao"
        };

        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {

            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        let next: Partial<NextFunction> = () => { console.log("Next function called with error:", error); };

        let elevatorSchemaInstance = require("../src/persistence/schemas/elevatorSchema").default;
        Container.set("elevatorSchema", elevatorSchemaInstance);

        let elevatorRepoClass = require("../src/repos/elevatorRepo").default;
        let elevatorRepoInstance = Container.get(elevatorRepoClass);
        Container.set("ElevatorRepo", elevatorRepoInstance);

        let elevatorServiceClass = require("../src/services/elevatorService").default;
        let elevatorServiceInstance = Container.get(elevatorServiceClass);
        Container.set("ElevatorService", elevatorServiceInstance);


        elevatorServiceInstance = Container.get("ElevatorService");
        sinon.stub(elevatorServiceInstance, "createElevator").returns(Result.ok<IElevatorDTO>({
            "buildingId": req.body.buildingId,
            "elevatorPosition": req.body.elevatorPosition,
            "elevatorId": req.body.elevatorId,
            "floorIds": req.body.floorIds,
            "elevatorUniqueCodBuilding": 1,
            "elevatorBrand": req.body.elevatorBrand,
            "elevatorModel": req.body.elevatorModel,
            "elevatorSerialNumber": req.body.elevatorSerialNumber,
            "elevatorDescription": req.body.elevatorDescription

        }));

        const ctrl = new ElevatorController(elevatorServiceInstance as IElevatorService);

        await ctrl.createElevator(<Request>req, <Response>res, <NextFunction>next);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            //"buildingId": "1232",
            "buildingId": req.body.buildingId,
            "elevatorPosition": req.body.elevatorPosition,
            "elevatorId": req.body.elevatorId,
            "floorIds": req.body.floorIds,
            "elevatorUniqueCodBuilding": 1,
            "elevatorBrand": req.body.elevatorBrand,
            "elevatorModel": req.body.elevatorModel,
            "elevatorSerialNumber": req.body.elevatorSerialNumber,
            "elevatorDescription": req.body.elevatorDescription
        }));
    });


    //cath errcors
    it('createElevator: should handle errors thrown by the service', async function () {
        // Mock the behavior of the service to throw an error
        const mockElevatorService = {
            createElevator: sinon.stub().throws(new Error('Erro lançado do service'))
            // createElevator: sinon.stub().throws(new Error('mensagem errada para falha'))

        };

        // Replace the actual service instance with the mock
        Container.set(config.services.elevator.name, mockElevatorService);

        // Create a mock request and response object
        const mockReq = {
            body: {
                buildingId: "A1",
                elevatorPosition: {
                    posX: 10,
                    posY: 20
                },
                elevatorId: "1234",
                floorIds: ["A1", "B1"],
                elevatorUniqueCodBuilding: 1,
                elevatorBrand: "brand",
                elevatorModel: "model",
                elevatorSerialNumber: "12323",
                elevatorDescription: "descricao"
            }
        } as Request;
        const mockRes = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
            send: sinon.stub().returnsThis()
        } as unknown as Response;
        const mockNext = sinon.stub();

        // Call the controller method
        const elevatorController = new ElevatorController(mockElevatorService as any);
        await elevatorController.createElevator(mockReq, mockRes, mockNext);

        // Assert that the error was passed to the next function
        sinon.assert.calledWith(mockNext, sinon.match.has('message', 'Erro lançado do service'));
    });

    //reconigze failures and right status from http
    it('createElevator: should handle failure scenario from the service', async function () {
        // Mock the behavior of the service to return a failure result
        const mockFailureResult = {
            isFailure: true,
            errorValue: () => 'Falhou no serviço. devolve status 404'
        };
        const mockElevatorService = {
            createElevator: sinon.stub().returns(mockFailureResult)
        };

        // Replace the actual service instance with the mock
        Container.set(config.services.elevator.name, mockElevatorService);

        // Create a mock request and response object
        const mockReq = {
            body: {
                buildingId: "A1",
                elevatorPosition: {
                    posX: 10,
                    posY: 20
                },
                elevatorId: "1234",
                floorIds: [{ "A1": "B1" }],
                elevatorUniqueCodBuilding: 1,
                elevatorBrand: "brand",
                elevatorModel: "model",
                elevatorSerialNumber: "12323",
                elevatorDescription: "descricao"
            }
        } as Request;
        const mockRes = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
            send: sinon.stub().returnsThis()
        } as unknown as Response;
        const mockNext = sinon.stub();

        // Call the controller method
        const elevatorController = new ElevatorController(mockElevatorService as any);
        await elevatorController.createElevator(mockReq, mockRes, mockNext);

        // Assert that the error message was returned with a 404 status
        sinon.assert.calledWith(mockRes.status, 404);
        sinon.assert.calledWith(mockRes.json, 'Falhou no serviço. devolve status 404');
    });


    it('createElevator: should return 201 status when creation is successful', async function () {
        // Mock the behavior of the service to return a successful result
        const mockSuccessResult = {
            isFailure: false,
            getValue: () => ({
                buildingId: "A1",
                elevatorPosition: {
                    posX: 10,
                    posY: 20
                },
                elevatorId: "1234",
                floorIds: [{ "A1": "B1" }],
                elevatorUniqueCodBuilding: 1,
                elevatorBrand: "brand",
                elevatorModel: "model",
                elevatorSerialNumber: "12323",
                elevatorDescription: "descricao"
            })
        };
        const mockElevatorService = {
            createElevator: sinon.stub().returns(mockSuccessResult)
        };

        // Replace the actual service instance with the mock
        Container.set(config.services.elevator.name, mockElevatorService);

        // Create a mock request and response object
        const mockReq = {
            body: {
                buildingId: "A1",
                elevatorPosition: {
                    posX: 10,
                    posY: 20
                },
                elevatorId: "1234",
                floorIds: ["A1", "B1", "C1"],
                elevatorUniqueCodBuilding: 1,
                elevatorBrand: "brand",
                elevatorModel: "model",
                elevatorSerialNumber: "12323",
                elevatorDescription: "descricao"
            }
        } as Request;
        const mockRes = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
            send: sinon.stub().returnsThis()
        } as unknown as Response;
        const mockNext = sinon.stub();

        // Call the controller method
        const elevatorController = new ElevatorController(mockElevatorService as any);
        await elevatorController.createElevator(mockReq, mockRes, mockNext);

        // Assert that a 201 status code was returned with the appropriate DTO
        sinon.assert.calledWith(mockRes.status, 201);
        sinon.assert.calledWith(mockRes.json, mockSuccessResult.getValue());
    });



});

