import { Inject, Service } from "typedi";
import config from "../../config";
import IElevatorDTO from "../dto/IElevatorDTO";
import { NextFunction, Request, Response } from "express";
import IElevatorController from "./IControllers/IElevatorController";
import { Result } from "../core/logic/Result";
import IElevatorService from "../services/IServices/IElevatorService";

@Service()
export default class ElevatorController implements IElevatorController {
    constructor(
        @Inject(config.services.elevator.name) private elevatorServiceInstance: IElevatorService
    ) { }

    public async createElevator(req: Request, res: Response, next: NextFunction) {
        try {
            const elevatorTrue = (await this.elevatorServiceInstance.createElevator(req.body as IElevatorDTO)) as Result<IElevatorDTO>;

            if (elevatorTrue.isFailure) {
                return res.status(404).json(elevatorTrue.errorValue()).send();
            }

            const elevatorDTO = elevatorTrue.getValue();
            return res.status(201).json(elevatorDTO);


        } catch (e) {

            return next(e);
        }
    }

    public async getFloorsServed(req: Request, res: Response, next: NextFunction) {
        try {
            const floorsServed = (await this.elevatorServiceInstance.getFloorsServed(req.params.building as string));

            if (floorsServed.isFailure) {
                return res.status(404).json(floorsServed.errorValue()).send();
            }

            const floorDTO = floorsServed.getValue();
            return res.status(201).json(floorDTO);
        } catch (e) {
            return next(e);
        }
    }

    public async getElevatorsByBuilding(req: Request, res: Response, next: NextFunction) {
        try {
            const buildingElevators = (await this.elevatorServiceInstance.getElevatorsByBuilding(req.params.building as string));

            if (buildingElevators.isFailure) {
                return res.status(404).json(buildingElevators.errorValue()).send();
            }

            const elevatorDTO = buildingElevators.getValue();
            return res.status(201).json(elevatorDTO);

        } catch (e) {
            return next(e);
        }
    }
}