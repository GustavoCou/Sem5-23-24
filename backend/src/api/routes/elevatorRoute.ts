import { NextFunction, Request, Response, Router } from "express";
import Container from "typedi";
import IElevatorController from '../../controllers/IControllers/IElevatorController';

import config from "../../../config";
import { celebrate, Joi } from "celebrate";

const route = Router();

export default (app: Router) => {

    app.use('/elevator', route);

    const ctrl = Container.get(config.controllers.elevator.name) as IElevatorController;

    route.post('',
        celebrate({
            body: Joi.object({
                elevatorId: Joi.string().required(),
                floorIds: Joi.array().items(Joi.string()),
                elevatorPosition: Joi.object({
                    posX: Joi.number().required(),
                    posY: Joi.number().required()
                }),

                buildingId: Joi.string().required(),
                elevatorBrand: Joi.string().max(50), //sem required pq nao é obrigatorio
                elevatorModel: Joi.string().max(50),//da para fazer uma condicao tipo when?
                elevatorSerialNumber: Joi.string().max(50),
                elevatorDescription: Joi.string().max(250)
            })

        }),


        (req, res, next) => ctrl.createElevator(req, res, next));

    route.get(
        '/get/:building',
        async (req: Request, res: Response, next: NextFunction) => {
            await ctrl.getFloorsServed(req, res, next);
        }
    );

    route.get(
        '/list/:building',
        async (req: Request, res: Response, next: NextFunction) => {
            await ctrl.getElevatorsByBuilding(req, res, next);
        }
    );
}