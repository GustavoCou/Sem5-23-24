
import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import {Result} from "../../src/core/logic/Result";
import TaskRequestController from "../../src/controllers/taskRequestController";
import TaskRequestService from "../../src/services/taskRequestService";
import ITaskRequestService from "../../src/services/IServices/ITaskRequestService";

describe('TaskRequest API Integration Tests', function () {
  const sandbox = sinon.createSandbox();

  beforeEach(function() {
    this.timeout(10000);
    Container.reset();
  
    
    let taskSchema = require("../../src/persistence/schemas/taskSchema").default;
		Container.set("taskSchema", taskSchema);

    let taskRepoClass = require("../../src/repos/taskRepo").default;
    let taskRepoInstance = Container.get(taskRepoClass);
      Container.set("taskRepo", taskRepoInstance);

    let taskRequestSchema = require("../../src/persistence/schemas/taskRequestSchema").default;
    Container.set("taskRequestSchema", taskRequestSchema);

    let taskRequestRepoClass = require("../../src/repos/taskRequestRepo").default;
    let taskRequestRepoInstance = Container.get(taskRequestRepoClass);
    Container.set("taskRequestRepo", taskRequestRepoInstance);


      let httpRequestServiceClass = require("../../src/services/httpRequestService").default;
      let httpRequestServiceInstance = Container.get(httpRequestServiceClass);
      Container.set("HttpRequestService", httpRequestServiceInstance);


    let TaskRequestServiceClass = require("../../src/services/taskRequestService").default;
    let TaskRequestServiceInstance = Container.get(TaskRequestServiceClass);
    Container.set("TaskRequestService", TaskRequestServiceInstance);

    let TaskRequestControllerClass = require("../../src/controllers/taskRequestController").default;
    let taskRequestControllerInstance=Container.get(TaskRequestControllerClass);
    Container.set("taskRequestController", taskRequestControllerInstance);


  });
 
  afterEach(function() {
    sinon.restore();
		sandbox.restore();
	});
 
  it('should create a Task ', async function() {

    // Arrange
    let bodytest =   {
        "robot": "0001",
        "type": "securityTask",
        "building": "B",
        "floors": ["B2","B1"],
        "emergencyContact": {
            "name": "44",
            "phone": 123456789
        }
    };

    let req: Partial<Request> = {};
		req.body = bodytest;
        let res: Partial<Response> = {
			json: sinon.spy()
        };
		let next: Partial<NextFunction> = () => {};


    let taskRequestServiceInstance = Container.get("TaskRequestService");
  
    const taskRequestStub = sinon.stub(taskRequestServiceInstance, "createTaskAndRequest").returns(Result.ok({id: "658ca339aef2bcf938d19b81",
              requesterUser: "RequestedUser",
              robot: "0001",
              task: "73f0c3d7-46f9-405c-b834-8c3bc6f78c6b",
              status: "Pending",
              date: "2023-12-27T22:20:41.276Z"
      }));
    const ctrl = new TaskRequestController(taskRequestServiceInstance as ITaskRequestService);

    // Act
    await ctrl.createTaskRequest(<Request>req, <Response>res, <NextFunction>next);

    // Assert


    sinon.assert.calledOnce(taskRequestStub);
    sinon.assert.calledWith(taskRequestStub, sinon.match({
        building: "B",
        emergencyContact: { name: "44", phone: 123456789 },
        floors: ["B2", "B1"],
        robot: "0001",
        type: "securityTask"
    }  ));

  });

});



