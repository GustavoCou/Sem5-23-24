import { Response, Request,NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from '../../config';
import { Result } from "../core/logic/Result";

import { IRobotTypeDTO } from '../dto/IRobotTypeDTO';
import IRobotTypeController from './IControllers/IRobotTypeController';
import IRobotTypeService from '../services/IServices/IRobotTypeService';
import IRobotTypeRepo from '../services/IRepos/IRobotTypeRepo';

@Service()
export default class RobotTypeController implements IRobotTypeController {
    constructor(
        @Inject(config.services.robotType.name) private robotTypeServiceInstance: IRobotTypeService,
        @Inject(config.repos.robotType.name) private robotTypeRepoInstance: IRobotTypeRepo
    ) { }

    public async createRobotType(req: Request, res: Response, next: NextFunction) {
        try {           
            const robotTypeTrue  = await this.robotTypeServiceInstance.createRobotType(req.body as IRobotTypeDTO) as Result<IRobotTypeDTO>;

            if (robotTypeTrue.isFailure) {
                return res.status(402).json().send();
            }
            const robotTypeDTO =robotTypeTrue.getValue();
            return res.status(201).json(robotTypeDTO);
        } catch (e) {
            return next(e);
        }

    }

    public async updateRobotType(req: Request, res: Response, next: NextFunction){
        
        try {

            if( !(await this.robotTypeRepoInstance.exists(req.body.id))){
                return res.status(400).json({ error: 'RobotType não encontrado' }).send(); 
            }

          
            const robotTypeTrue  = (await this.robotTypeServiceInstance.updateRobotType(req.body as IRobotTypeDTO));
    
            if (robotTypeTrue.isFailure) {
                return res.status(404).send();
            }
            
            const robotTypeDTO =robotTypeTrue.getValue();
            return res.status(201).json(robotTypeDTO);


        } catch (e) {
            return next(e);
        }
        
    }

    public async listRobotType(req: Request, res: Response, next: NextFunction){

        try {
          
            const robotTypeTrue  = (await this.robotTypeServiceInstance.ListRobotType());
    
            if (robotTypeTrue.isFailure) {
                res.status(404).send();
            }
            
            const robotTypeDTO =robotTypeTrue.getValue();
            return res.status(201).json(robotTypeDTO);


        } catch (e) {
            return next(e);
        }
    }

}
