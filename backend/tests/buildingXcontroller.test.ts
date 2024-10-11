
import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../src/core/logic/Result';
import IBuildingDTO from "../src/dto/IBuildingDTO"
import buildingController from "../src/controllers/buildingController"
import IBuildingService from "../src/services/IServices/IBuildingService"
import IBuildingRepo from "../src/services/IRepos/IBuildingRepo"
import {Building} from "../src/domain/Building/Building"
describe('Building API Integration Tests', function () {
  const sandbox = sinon.createSandbox();

  beforeEach(function() {
    this.timeout(10000);
    Container.reset();
  
    
    let buildingSchema = require("../src/persistence/schemas/buildingSchema").default;
		Container.set("buildingSchema", buildingSchema);

    let buildingRepoClass = require("../src/repos/buildingRepo").default;
    let buildingRepoInstance = Container.get(buildingRepoClass);
      Container.set("BuildingRepo", buildingRepoInstance);

      
    let buildingServiceClass = require("../src/services/buildingService").default;
    let buildingServiceInstance = Container.get(buildingServiceClass);
    Container.set("BuildingService", buildingServiceInstance);
    

    let buildingControllerClass = require("../src/controllers/buildingController").default;
    let buildingControllerInstance=Container.get(buildingControllerClass);
    Container.set("buildingController", buildingControllerInstance);


  });
 
  afterEach(function() {
    sinon.restore();
		sandbox.restore();
	});
 
  it('should create a new building', async function() {

    // Arrange
    let bodytest =   { "id": '1521',  "name": 'Building1', "description": 'Building1', "width": 5,"depth": 5};

    let req: Partial<Request> = {};
		req.body = bodytest;
        let res: Partial<Response> = {
			json: sinon.spy()
        };
		let next: Partial<NextFunction> = () => {};
    
    let buildingRepoInstance = Container.get("BuildingRepo");
  
    let buildingServiceInstance = Container.get("BuildingService");
  
    const buildingStub = sinon.stub(buildingServiceInstance, "CreateBuilding").returns(Result.ok({"id": "1521", "name": req.body.name, "description": req.body.description, "width": req.body.width, "depth": req.body.depth}));
    const ctrl = new buildingController(buildingServiceInstance as IBuildingService,buildingRepoInstance as IBuildingRepo);

    // Act
    await ctrl.createBuilding(<Request>req, <Response>res, <NextFunction>next);

    // Assert

 
    sinon.assert.calledOnce(buildingStub);
    sinon.assert.calledWith(buildingStub, sinon.match( {"id": "1521", "name": req.body.name, "description": req.body.description, "width": req.body.width, "depth": req.body.depth}));

  });
  

  it('should update an existing building', async function() {
    this.timeout(90000);
    // Arrange

    let buildingRepoInstance = Container.get("BuildingRepo");
    let buildingServiceInstance = Container.get("BuildingService");

    const ctrl1 = new buildingController(buildingServiceInstance as IBuildingService,buildingRepoInstance as IBuildingRepo);



    let bodytest1 =   { "id": '1521',  "name": 'Building1', "description": 'Building1', "width": 5,"depth": 5};

    let req1: Partial<Request> = {};
     req1.body = bodytest1;
         let res1: Partial<Response> = {};
     let next1: Partial<NextFunction> = () => {};

     await ctrl1.createBuilding(<Request>req1, <Response>res1, <NextFunction>next1);

    let bodytest =  { "id": '1521',  "name": "Building update", "description": 'Description of new update', "width": 7,"depth": 5};

  
     let req: Partial<Request> = {};
     req.body = bodytest;
         let res: Partial<Response> = {};
     let next: Partial<NextFunction> = () => {};
     

     const buildingStub = sinon.stub(buildingServiceInstance, "updateBuilding").returns(Result.ok({"id": "1621", "name": req.body.name, "description": req.body.description, "width": req.body.width, "depth": req.body.depth}));  
     const ctrl = new buildingController(buildingServiceInstance as IBuildingService,buildingRepoInstance as IBuildingRepo);


    // Act
   await ctrl.updateBuilding(<Request>req, <Response>res, <NextFunction>next);

    // Assert

 
    sinon.assert.calledOnce(buildingStub);
    sinon.assert.calledWith(buildingStub, sinon.match({"id": "1521", "name": req.body.name, "description": req.body.description, "width": req.body.width, "depth": req.body.depth}));
    
  });

  it('should get a list of buildings', async () => {
   
    let bodytest =   { "id": '1621',  "name": 'Building1', "description": 'Building1', "width": 5,"depth": 5};
    
    let req: Partial<Request> = {};
     req.body=bodytest;
     let res: Partial<Response> = {
       json: sinon.spy()
         };
     let next: Partial<NextFunction> = () => {};
     
     let buildingRepoInstance = Container.get("BuildingRepo");
     let buildingServiceInstance = Container.get("BuildingService");

    
     const buildingStub = sinon.stub(buildingServiceInstance, "ListBuilding").returns(Result.ok({"id": "1521", "name": req.body.name, "description": req.body.description, "width": req.body.width, "depth": req.body.depth}));
     const ctrl = new buildingController(buildingServiceInstance as IBuildingService,buildingRepoInstance as IBuildingRepo);
 
     await ctrl.listBuilding(<Request>req, <Response>res, <NextFunction>next);;

     sinon.assert.calledOnce(buildingStub);

    


     
  });
});



