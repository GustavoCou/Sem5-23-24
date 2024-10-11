/*import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../src/core/logic/Result';
import FloorController from "../src/controllers/floorController";
import IFloorService from '../src/services/IServices/IFloorService';
import FloorRepo from '../src/repos/floorRepo';
import BuildingRepo from '../src/repos/buildingRepo';
import IBuildingRepo from '../src/services/IRepos/IBuildingRepo';
import FloorService from '../src/services/FloorService';
import IFloorRepo from '../src/services/IRepos/IFloorRepo';
import { Model } from 'mongoose';
import { error } from 'console';
import { IFloorDTO } from '../src/dto/IFloorDTO';


describe('floor controller', function () {
  let buildingRepoInstance;

  beforeEach(function() {
		this.timeout(10000);

		Container.reset();
    sinon.restore();

		// Schemas de building, elevator e floor
        let buildingSchemaInstance = require("../src/persistence/schemas/buildingSchema").default;
        Container.set('buildingSchema', buildingSchemaInstance);

        let floorSchemaInstance = require("../src/persistence/schemas/FloorSchema").default;
        Container.set("floorSchema", floorSchemaInstance);

        // Repositorios floor, builing e elevador
        let floorRepoInstance = new FloorRepo(floorSchemaInstance);
        Container.set("FloorRepo", floorRepoInstance);

        buildingRepoInstance = new BuildingRepo(buildingSchemaInstance);
        Container.set('BuildingRepo', buildingRepoInstance);

        // repositorios -> containee
        const floorRepo = Container.get('floorRepo') as IFloorRepo;
        const buildingRepo = Container.get('BuildingRepo') as IBuildingRepo;

        // registar uma instancia do servico
        const floorService = new FloorService(floorRepo, buildingRepo);
        Container.set('FloorService', floorService);
  });*/

  /*it('createFloor: returns floor created', async function () {
    const mockBuilding = {
      id: "A",
      "name": "Sample Building",
      "description": "someDiscription"
    };
    sinon.stub(buildingRepoInstance, 'findById').resolves(mockBuilding);
		// Arrange
    let body = { "floorDescription": "Salas T",
    "floorSize": {"width": 9, "depth": 9 },
    "floorMapa": {
      "maze": {
        "size": {
          "width": 9,
          "depth": 5
        },
      "mapper": [ ],
      "exits": [ ],
      "elevators": [ ],
      "exitLocation": [5, 5]
      },
      "ground": {
        "size": {
          "width": 9, 
          "height": 5, 
          "depth": 3
        },
        "segments": {
          "width": 1,
          "height": 1, 
          "depth": 1
        },
        "primaryColor": "white",
        "maps": {
          "color": {
            "url": " " 
          },
          "ao": {
            "url": " ",      
            "intensity": 1 
          },
          "displacement": {
            "url": " ",
            "scale": 1,
            "bias": 1
          },
          "normal": {
            "url": " ",
            "type": 1,
            "scale": {
              "x": 9,
              "y": 5
            }
          },
          "bump": {
            "url": " ",
            "scale": 1
          },
          "roughness": {
            "url": " ",
            "rough": 1
          }
        },
        "wrapS": 1,   
        "wrapT": 1,  
        "repeat": {
          "u": 1,     
          "v": 1      
        },
        "magFilter": 1,  
        "minFilter": 1,  
        "secondaryColor": "black"
      },
      "wall": {
        "segments": {
          "width": 1,  
          "height": 1
        },
        "primaryColor": "gray", 
        "maps": {
          "color": {
            "url": " " 
          },
          "ao": {
            "url": " ",      
            "intensity": 1 
          },
          "displacement": {
            "url": " ",
            "scale": 1,
            "bias": 1
          },
          "normal": {
            "url": " ",
            "type": 1,
            "scale": {
              "x": 9,
              "y": 5
            }
          },
          "bump": {
            "url": " ",
            "scale": 1
          },
          "roughness": {
            "url": " ",
            "rough": 1
          }
        },
        "wrapS": 1,   
        "wrapT": 1,   
        "repeat": {
          "u": 1,     
          "v": 1      
        },
        "magFilter": 1,  
        "minFilter": 1,  
        "secondaryColor": "black" 
      },
      "player": {
        "initialPosition": [2, 2],  
        "initialDirection": 0      
      }
    },
    "building": "A" };
    let req: Partial<Request> = { };
    req.body = body;
    let res: Partial<Response> = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };
		let next: Partial<NextFunction> = () => {console.log("Next function called with error:", error);};
    
    let floorSchemaInstance = require("../src/persistence/schemas/floorSchema").default;
    Container.set("floorSchema", floorSchemaInstance);
    let floorRepoClass = require("../src/repos/floorRepo").default;
    let floorRepoInstance = Container.get(floorRepoClass);
    Container.set("floorRepo", floorRepoInstance);
    let floorServiceClass = require("../src/services/floorService").default;
    let floorServiceInstance = Container.get(floorServiceClass);
    Container.set("floorService", floorServiceInstance);
    floorServiceInstance = Container.get("floorService");
    sinon.stub(floorServiceInstance, "createFloor").returns(Result.ok<IFloorDTO>({
        "id": "Floor A50",
        "floorDescription": req.body.floorDescription,
        "floorSize": req.body.floorSize,
        "floorMapa": req.body.floorMapa,
        "building": "A"
    }));
    const ctrl = new FloorController(floorServiceInstance as IFloorService);
    await ctrl.createFloor(<Request>req, <Response>res, <NextFunction>next);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match({
      "id": "Floor A50",
      "floorDescription": req.body.floorDescription,
      "floorSize": req.body.floorSize,
      "floorMapa": req.body.floorMapa,
      "building": "A"
    }));
  });*/
//});*/