import { Response, Request, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from '../../config';


import  IRobotDTO  from '../dto/IRobotDTO';
import IRobotController from './IControllers/IRobotController';
import IRobotService from '../services/IServices/IRobotService';
import IrobotRepo from '../services/IRepos/IRobotRepo';
import {Result} from "../core/logic/Result";

@Service()
export default class RobotController implements IRobotController {
    constructor(
        @Inject(config.services.robot.name) private robotServiceInstance: IRobotService,
        @Inject(config.repos.robot.name) private robotRepoInstance: IrobotRepo
    ) { }

    public async createRobot(req: Request, res: Response, next: NextFunction) {

        try {

           const robotTrue = (await this.robotServiceInstance.CreateRobot(req.body as IRobotDTO));
            if (robotTrue.isFailure) {
                res.status(404).send();
            }
           const robotDTO = robotTrue.getValue();
            return res.status(201).json(robotDTO);


        } catch (e) {
            return next(e);
        }

    }

    public async updateRobot(req: Request, res: Response, next: NextFunction) {

        try {

            if (!(await this.robotRepoInstance.exists(req.body.id))) {
                return res.status(400).json({ error: 'robot not found' }).send();
            }


            const robotTrue = (await this.robotServiceInstance.updateRobot(req.body as IRobotDTO));

            if (robotTrue.isFailure) {
                return res.status(404).send();
            }

            const robotDTO = robotTrue.getValue();
            return res.status(201).json(robotDTO);


        } catch (e) {
            return next(e);
        }

    }

    public async listRobot(req: Request, res: Response, next: NextFunction) {
        
        try {
            

            const robotTrue = (await this.robotServiceInstance.ListRobot());
            

            if (robotTrue.isFailure) {
               
                res.status(404).send();
            }

            const robotDTO = robotTrue.getValue();
            return res.status(201).json(robotDTO);


        } catch (e) {
            return next(e);
        }
    }
    public async inhibitRobot(req: Request, res: Response, next: NextFunction) {

        try {

            if (!(await this.robotRepoInstance.exists(req.body.id))) {
                return res.status(400).json({ error: 'robot not found' }).send();
            }


            const robotTrue = (await this.robotServiceInstance.updateInhibitedStatus(req.body as IRobotDTO));

            if (robotTrue.isFailure) {
                return res.status(404).send();
            }

            const robotDTO = robotTrue.getValue();
            return res.status(201).json(robotDTO);


        } catch (e) {
            return next(e);
        }

    }

    public async existRobot(req: Request, res: Response, next: NextFunction) {

        try {

            const robotTrue  = await this.robotServiceInstance.existRobot(req.params.id as string) as Result<boolean>;

            if (robotTrue.isFailure) {
                res.status(400).json(robotTrue.errorValue()).send();
            }

            return res.status(200).json(robotTrue.getValue());


        } catch (e) {
            return next(e);
        }
    }
}
