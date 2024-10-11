import * as sinon from 'sinon';
import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { Result } from '../src/core/logic/Result';
import BridgeController from "../src/controllers/bridgeController";
import IBridgeService from "../src/services/IServices/IBridgeService";
import IBridgeDTO from '../src/dto/IBridgeDTO';
import config from '../config';
import BridgeError from '../src/exceptions/bridgeException';


describe('BridgeController', function () {

    let bridgeServiceInstance;
    let bridgeController;
    let req;
    let res;
    let next;
    let sandbox;

    beforeEach(function () {

        sandbox = sinon.createSandbox();

        this.timeout(10000);
        Container.reset();
        sinon.restore();


        bridgeController = new BridgeController(bridgeServiceInstance);

        // Mock BridgeService
        bridgeServiceInstance = {
            createBridge: sandbox.stub(),
            getAll: sandbox.stub(),
            getAllFloorsWithBridges: sandbox.stub(),
            getBridge: sandbox.stub(),
            updateBridge: sandbox.stub(),
            listBridgesOfBuildings: sandbox.stub()
        };
        Container.set(config.services.bridge.name, bridgeServiceInstance);

        // Mock Request and Response
        req = { body: {}, params: {} } as Partial<Request>;
        res = {
            json: sandbox.stub().returnsThis(),
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub().returnsThis()
        } as Partial<Response>;
        next = sinon.stub() as Partial<NextFunction>;
    });


    afterEach(function () {
        // Restore all the stubs
        sandbox.restore();
    });


    it('listBridgesBetweenBuilding: should return 404 when no bridges found between buildings', async function () {
        const buildingXId = 'idX';
        const buildingYId = 'idY';
        const errorMessage = "No bridges found between buildings";

        req.params.buildingX = buildingXId;
        req.params.buildingY = buildingYId;

        bridgeServiceInstance.listBridgesOfBuildings.resolves(Result.fail(errorMessage));

        const jsonStub = sinon.stub().returnsThis();
        const sendStub = sinon.stub().returnsThis();
        const statusStub = sinon.stub().returns({ json: jsonStub, send: sendStub });
        res.status = statusStub;
        res.json = jsonStub;
        res.send = sendStub;
        bridgeController = new BridgeController(bridgeServiceInstance);
        await bridgeController.listBridgesBetweenBuilding(req as Request, res as Response, next as NextFunction);

        sinon.assert.calledWith(statusStub, 404);
        sinon.assert.calledWith(jsonStub, { error: errorMessage });
    });

    it('listBridgesBetweenBuilding: should return 201 with bridges DTOs for valid buildings', async function () {
        const buildingXId = 'A1';
        const buildingYId = 'A2';
        const bridgesDTO = [{
            bridgePositionX: {
                posX: 10,
                posY: 10
            },
            bridgePositionY: {
                posX: 5,
                posY: 5
            },
            bridgeId: "A2",
            floorIdX: "F2",
            floorIdY: "F2",
            buildingX: "A1",
            buildingY: "A2"
        }];

        req.params.buildingX = buildingXId;
        req.params.buildingY = buildingYId;

        bridgeServiceInstance.listBridgesOfBuildings.resolves(Result.ok(bridgesDTO));

        const jsonStub = sinon.stub().returnsThis();
        const statusStub = sinon.stub().returns({ json: jsonStub });
        res.status = statusStub;
        res.json = jsonStub;

        bridgeController = new BridgeController(bridgeServiceInstance);

        await bridgeController.listBridgesBetweenBuilding(req as Request, res as Response, next as NextFunction);

        sinon.assert.calledWith(statusStub, 201);
        sinon.assert.calledWith(jsonStub, bridgesDTO);
    });


    it('updateBridge: should successfully update a bridge and return updated data', async function () {
        const bridgeId = 'A2';

        const bridgeToFound = {
            bridgePositionX: {
                posX: 10,
                posY: 10
            },
            bridgePositionY: {
                posX: 5,
                posY: 5
            },
            bridgeId: "A2",
            floorIdX: "F2",
            floorIdY: "F2",
            buildingX: "A1",
            buildingY: "A2"
        }



        const updatedBridge = {
            bridgePositionX: {
                posX: 10,
                posY: 10
            },
            bridgePositionY: {
                posX: 5,
                posY: 5
            },
            bridgeId: "A2",
            floorIdX: "F1",
            floorIdY: "F2",
            buildingX: "A1",
            buildingY: "A2"
        }



        req.params.bridgeId = bridgeId;
        req.body = updatedBridge;


        bridgeServiceInstance.getBridge.resolves(Result.ok(bridgeToFound));
        bridgeServiceInstance.updateBridge.resolves(Result.ok(updatedBridge));
        bridgeController = new BridgeController(bridgeServiceInstance);
        const jsonStub = sinon.stub().returnsThis();
        const statusStub = sinon.stub().returns({ json: jsonStub });
        res.status = statusStub;
        res.json = jsonStub;

        await bridgeController.updateBridge(req as Request, res as Response, next as NextFunction);

        sinon.assert.calledWith(statusStub, 201);
        sinon.assert.calledWith(jsonStub, updatedBridge);
    });

    it('updateBridge: should return 400 when bridge ID does not exist', async function () {
        const bridgeId = 'nonExistingBridgeId';

        req.params.bridgeId = bridgeId;

        bridgeServiceInstance.getBridge.resolves(Result.fail('Bridge ID doesn´t exist'));
        bridgeController = new BridgeController(bridgeServiceInstance);

        const jsonStub = sinon.stub().returnsThis();
        const sendStub = sinon.stub().returnsThis();
        const statusStub = sinon.stub().returns({ json: jsonStub, send: sendStub });
        res.status = statusStub;
        res.json = jsonStub;
        res.send = sendStub;

        await bridgeController.updateBridge(req as Request, res as Response, next as NextFunction);

        sinon.assert.calledWith(statusStub, 400); //400 bad request -> sintaxe n esta correta
        sinon.assert.calledWith(jsonStub, { error: 'Bridge ID doesn´t exist' });
    });




    it('listFloorsWithBridge: should return 404 when no bridges are found for the building', async function () {
        const buildingId = 'buildingWithNoBridges';

        req.params.buildingX = buildingId;

        bridgeServiceInstance.getAllFloorsWithBridges.resolves(Result.fail("This building has no bridge"));

        bridgeController = new BridgeController(bridgeServiceInstance);

        const jsonStub = sinon.stub().returnsThis();
        const statusStub = sinon.stub().returns({ json: jsonStub });
        res.status = statusStub;
        res.json = jsonStub;

        await bridgeController.listFloorsWithBridge(req as Request, res as Response, next as NextFunction);

        sinon.assert.calledWith(res.status, 404);
        sinon.assert.calledWith(res.json, { error: "This building has no bridge" });
    });


    it('listFloorsWithBridge: should return 201 with bridge DTOs for valid building', async function () {
        const buildingId = 'A2';
        const bridgeInformationDTO = [{
            bridgePositionX: {
                posX: 10,
                posY: 10
            },
            bridgePositionY: {
                posX: 5,
                posY: 5
            },
            bridgeId: "B1B2",
            floorIdX: "F1",
            floorIdY: "F2",
            buildingX: "A1",
            buildingY: "A2"
        }]


        req.params.buildingX = buildingId;

        bridgeServiceInstance.getAllFloorsWithBridges.resolves(Promise.resolve(Result.ok(bridgeInformationDTO)));



        bridgeController = new BridgeController(bridgeServiceInstance);

        const jsonStub = sinon.stub().returnsThis();
        const statusStub = sinon.stub().returns({ json: jsonStub });
        res.status = statusStub;
        res.json = jsonStub;



        await bridgeController.listFloorsWithBridge(req as Request, res as Response, next as NextFunction);

        sinon.assert.calledWith(res.status, 201);
        sinon.assert.calledWith(res.json, bridgeInformationDTO);
    });


    it('listFloorsWithBridge: should return 404 for a not valid building', async function () {
        const buildingId = 'InvalidBuilding';


        req.params.buildingX = buildingId;

        bridgeServiceInstance.getAllFloorsWithBridges.resolves(Promise.resolve(Result.fail("Invalid building")));


        bridgeController = new BridgeController(bridgeServiceInstance);

        const jsonStub = sinon.stub().returnsThis();
        const statusStub = sinon.stub().returns({ json: jsonStub });
        res.status = statusStub;
        res.json = jsonStub;



        await bridgeController.listFloorsWithBridge(req as Request, res as Response, next as NextFunction);

        sinon.assert.calledWith(res.status, 404);
        sinon.assert.calledWith(res.json, { error: "Invalid building" });
    });



    it('listBridges: should return a list of bridges', async function () {

        const bridgesArray = [
            { bridgePositionX: { posX: 10, posY: 20 }, bridgePositionY: { posX: 15, posY: 25 }, bridgeId: 'B1', floorIdX: 'F1', floorIdY: 'F2', buildingX: 'BX', buildingY: 'BY' },
            { bridgePositionX: { posX: 20, posY: 30 }, bridgePositionY: { posX: 25, posY: 35 }, bridgeId: 'B2', floorIdX: 'F3', floorIdY: 'F4', buildingX: 'BX', buildingY: 'BY' },
        ];

        // const successfulResult = {
        //     isFailure: false,
        //     getValue: () => bridgesArray
        // };
        bridgeServiceInstance.getAll.resolves(Promise.resolve(Result.ok(bridgesArray)));


        bridgeController = new BridgeController(bridgeServiceInstance);



        const jsonStub = sinon.stub().returnsThis();
        const statusStub = sinon.stub().returns({ json: jsonStub });
        res.status = statusStub;
        res.json = jsonStub;


        await bridgeController.listBridges(req as Request, res as Response, next as NextFunction);
        //console.log('statusStub called:', statusStub.called);
        //console.log('statusStub call count:', statusStub.callCount);
        //  statusStub.getCalls().forEach((call, index) => {
        //    console.log(`statusStub call ${index} with args:`, call.args);
        //});
        //console.log('jsonStub called:', jsonStub.called);
        //console.log('jsonStub call count:', jsonStub.callCount);
        //jsonStub.getCalls().forEach((call, index) => {
        //  console.log(`jsonStub call ${index} with args:`, call.args);
        //});

        sinon.assert.calledWith(statusStub, 201);
        sinon.assert.calledWith(jsonStub, bridgesArray);
    });

    it('listBridges: should return 404 when no bridges are found', async function () {
        const errorMessage = "No bridges found";

        bridgeServiceInstance.getAll.resolves(Result.fail(errorMessage));

        bridgeController = new BridgeController(bridgeServiceInstance);

        const jsonStub = sinon.stub().returnsThis();
        const sendStub = sinon.stub().returnsThis(); // Added in case you use res.send()
        const statusStub = sinon.stub().returns({ json: jsonStub, send: sendStub });
        res.status = statusStub;
        res.json = jsonStub;
        res.send = sendStub;

        await bridgeController.listBridges(req as Request, res as Response, next as NextFunction);

        sinon.assert.calledWith(statusStub, 404); // Check for 404 status
        sinon.assert.calledWith(jsonStub, { error: errorMessage });






        it('createBridge: should return 201 when creation is successful', async function () {
            // Arrange
            const bridgeDTO: IBridgeDTO = {
                bridgePositionX: {
                    posX: 10,
                    posY: 10
                },
                bridgePositionY: {
                    posX: 5,
                    posY: 5
                },
                bridgeId: "B1B2",
                floorIdX: "F1",
                floorIdY: "F2",
                buildingX: "A1",
                buildingY: "A2"
            };
            req.body = bridgeDTO;
            const result = Result.ok<IBridgeDTO>(bridgeDTO);
            bridgeServiceInstance.createBridge.resolves(result);

            // Act
            const controller = new BridgeController(bridgeServiceInstance as IBridgeService);
            await controller.createBridge(req as Request, res as Response, next as NextFunction);

            // Assert
            sinon.assert.calledWith(res.status, 201);
            sinon.assert.calledWith(res.json, bridgeDTO);
        });
    });

    it('createBridge: should handle failure scenario from the service', async function () {

        const mockFailureResult = {
            isFailure: true,
            errorValue: () => 'Bridge creation failed. Return status 404.'
        };
        const mockBridgeService = {
            createBridge: sinon.stub().returns(mockFailureResult)
        };



        //vai substituir uma instancia do service
        Container.set(config.services.bridge.name, mockBridgeService);

        const mockReq = {
            body: {
                bridgePositionX: {
                    posX: 10,
                    posY: 10
                },
                bridgePositionY: {
                    posX: 5,
                    posY: 5
                },
                bridgeId: "XXXXXX",
                floorIdX: "F1",
                floorIdY: "F2",
                buildingX: "A1",
                buildingY: "A2"
            }
        } as Request;
        const mockRes = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
            send: sinon.stub().returnsThis()
        } as unknown as Response;
        const mockNext = sinon.stub();

        // mockRes.json = sinon.stub().callsFake((data) => {
        //   console.log('res.json called with:', data);
        // return mockRes;
        //});


        const bridgeController = new BridgeController(mockBridgeService as IBridgeService);
        await bridgeController.createBridge(mockReq, mockRes, mockNext);

        sinon.assert.calledWith(mockRes.status, 404);
        sinon.assert.calledWith(mockRes.json, 'Bridge creation failed. Return status 404.');
    });

});