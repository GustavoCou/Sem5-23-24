import { Response, Request,NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from '../../config';


import  IBuildingDTO  from '../dto/IBuildingDTO';
import IBuildingController from './IControllers/IBuildingController';
import IBuildingService from '../services/IServices/IBuildingService';
import IBuildingRepo from '../services/IRepos/IBuildingRepo';
import { Result } from "../core/logic/Result";
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

@Service()
export default class BuildingController implements IBuildingController {
    constructor(
        @Inject(config.services.building.name) private buildingServiceInstance: IBuildingService,
        @Inject(config.repos.building.name) private buildingRepoInstance: IBuildingRepo
    ) {
    }

    public async existBuilding(req: Request, res: Response, next: NextFunction) {

        try {

            const buildingTrue  = await this.buildingServiceInstance.existBuilding(req.params.id as string) as Result<boolean>;

            if (buildingTrue.isFailure) {
                res.status(400).json(buildingTrue.errorValue()).send();
            }

            return res.status(200).json(buildingTrue.getValue());


        } catch (e) {
            return next(e);
        }
    }

    public async createBuilding(req: Request, res: Response, next: NextFunction)
   {

        try {
      
            
            const buildingTrue  = await this.buildingServiceInstance.CreateBuilding(req.body as IBuildingDTO) as Result<IBuildingDTO>;

            if (buildingTrue.isFailure) {
                res.status(400).json(buildingTrue.errorValue()).send();
            }
            
            const buildingDTO =buildingTrue.getValue();
            return res.status(201).json(buildingDTO);


        } catch (e) {
            return next(e);
        }

    }

    public async updateBuilding(req: Request, res: Response, next: NextFunction){
        
       
        try {

            const buildingTrue  = (await this.buildingServiceInstance.updateBuilding(req.body as IBuildingDTO));
    
            if (buildingTrue.isFailure) {
                return res.status(404).json(buildingTrue.error);
            }
            
            const buildingDTO =buildingTrue.getValue();
            return res.status(201).json(buildingDTO);


        } catch (e) {
            return next(e);
        }
        
    }

    public async listBuilding(req: Request, res: Response, next: NextFunction){

        try {
          
            const buildingTrue  = (await this.buildingServiceInstance.ListBuilding());
    
            if (buildingTrue.isFailure) {
                res.status(404).send();
            }
            
            const buildingDTO =buildingTrue.getValue();
            return res.status(201).json(buildingDTO);


        } catch (e) {
            return next(e);
        }
    }

}
