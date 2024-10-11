import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

import { celebrate, Joi } from 'celebrate';
import winston = require('winston');

import config from "../../../config";
import IRobotTypeController from '../../controllers/IControllers/IRobotTypeController';

const route = Router();

export default (app: Router) => {
    app.use('/robotType', route);
    const ctrl = Container.get(config.controllers.robotType.name) as IRobotTypeController;

    route.post(
        '/create',
        celebrate({
            body: Joi.object({
                id: Joi.string().required(),
                robotModel: Joi.string().required(),
                brand: Joi.string().required(),
                tasks: Joi.string().required(),
            }),
        }),

        (req, res, next) => ctrl.createRobotType(req, res, next)
    );

    route.get(
        '/list',
        async (req: Request, res: Response, next: NextFunction) => {
            await ctrl.listRobotType(req, res, next);
        }
    );

    route.put('/edit',
        celebrate({
            body: Joi.object({
                id: Joi.string().required(),
                robotModel: Joi.string().required(),
                brand: Joi.string().required(),
                tasks: Joi.string().required(),
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => { ctrl.updateRobotType(req, res, next) }
    );
    route.patch('/edit',
        celebrate({
            body: Joi.object({
                id: Joi.string().required(),
                robotModel: Joi.string().required(),
                brand: Joi.string().required(),
                tasks: Joi.string().required(),
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => { ctrl.updateRobotType(req, res, next) }
    );

    // route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, user_controller.getMe);
};
