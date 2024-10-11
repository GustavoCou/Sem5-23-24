import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IFloorController from "./IControllers/IFloorController";
import IFloorService from "../services/IServices/IFloorService";
import { IFloorDTO } from "../dto/IFloorDTO";
import { IFloorMapDTO } from "../dto/IFloorMapDTO";

import { Result } from "../core/logic/Result";

@Service()
export default class FloorController implements IFloorController {
    constructor(
        @Inject(config.services.floor.name) private floorServiceInstance: IFloorService,
    ) { }

    public async createFloor(req: Request, res: Response, next: NextFunction) {
        try {
            const floorOrError = await this.floorServiceInstance.createFloor(req.body as IFloorDTO) as Result<IFloorDTO>;

            if (floorOrError.isFailure) {
                return res.status(402).json().send();
            }

            const floorDTO = floorOrError.getValue();
            return res.status(201).json( floorDTO);
        } catch (e) {
            return next(e);
        }
    };
    
    public async uploadMap(req: Request, res: Response, next: NextFunction) {
        try {

            const floorMapa : IFloorMapDTO = JSON.parse((req as any).file.buffer.toString());

            const mapOrError = await this.floorServiceInstance.uploadMap( req.body as IFloorDTO, floorMapa ) as Result<IFloorDTO>;

            if (mapOrError.isFailure) {
                return res.status(402).json(mapOrError.error);
            }

            const floorDTO = mapOrError.getValue();
            return res.json( mapOrError.getValue() ).status(201);
        } catch (e) {
            console.error(e);
            return next(e);
        }
    };

    public async getFloor(req: Request, res: Response, next: NextFunction) {
        try {
            const floorTrue  = await this.floorServiceInstance.getFloor();

            if (floorTrue.isFailure) {
                res.status(404).send();
            }
            
            const floorDTO =floorTrue.getValue();
            return res.status(201).json(floorDTO);

        } catch (e) {
            return next(e);
        }
    }

    public async getFloorByBuilding(req: Request, res: Response, next: NextFunction) {
        try {
            const floorOrError = (await this.floorServiceInstance.getFloorByBuilding(req.params.building)) as Result<IFloorDTO[]>;
      
            if (floorOrError.isFailure) {
              return res.status(402).send();
            }
      
            const tripDTO = floorOrError.getValue();
            return res.json(tripDTO).status(201);
        } catch (e) {
            return next(e);
        }
    }

    public async updateFloor(req: Request, res: Response, next: NextFunction) {       
        try {
            const floorOrError = await this.floorServiceInstance.updateFloor(req.body as IFloorDTO) as Result<IFloorDTO>;
      
            if (floorOrError.isFailure) {
                if (floorOrError.error === 'Building mismatch') {
                    return res.status(400).json({ error: 'Building mismatch' });
                } else {
                    return res.status(404).send();
                }
            }
      
            const roleDTO = floorOrError.getValue();
            return res.status(201).json( roleDTO );
        } catch (e) {
            return next(e);
        }
    };  
    
    public async countFloorsByBuilding(req: Request, res: Response, next: NextFunction) {
        try {
            const buildingId = req.params.building;
    
            const countOrError = await this.floorServiceInstance.countFloorsByBuilding(buildingId);
    
            if (countOrError.isFailure) {
                return res.status(402).send();
            }
    
            const count = countOrError.getValue();
            return res.json({ count }).status(200);
        } catch (e) {
            console.error(e);
            return next(e);
        }
    } 

    public async countTotalFloorsByBuildings(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.floorServiceInstance.countTotalFloorsByBuildings();

            if (result.isFailure) {
                return res.status(402).send();
            }

            const counts = result.getValue();
            return res.status(200).json(counts);
        } catch (error) {
            next(error);
        }
    }

    public async getBuildingsInFloorRange(req: Request, res: Response, next: NextFunction) {
        const minFloors = parseInt(req.query.minFloors as string);
        const maxFloors = parseInt(req.query.maxFloors as string);

      
        try {
          const buildings = await this.floorServiceInstance.getBuildingsInFloorRange(minFloors, maxFloors);
          //const buildings = await this.floorServiceInstance.getFloorsInFloorRange(minFloors, maxFloors);
          return res.status(200).json(buildings);
        } catch (error) {
          next(error);
        }
    }

    public async existFloor(req: Request, res: Response, next: NextFunction) {

        try {

            const floorTrue  = await this.floorServiceInstance.existFloor(req.params.building as string,req.params.id as string) as Result<boolean>;

            if (floorTrue.isFailure) {
                res.status(400).json(floorTrue.errorValue()).send();
            }

            return res.status(200).json(floorTrue.getValue());


        } catch (e) {
            return next(e);
        }
    }
}