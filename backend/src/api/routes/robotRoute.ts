import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

import { celebrate, Joi } from 'celebrate';
import winston = require('winston');

import config from "../../../config";
import IRobotController from '../../controllers/IControllers/IRobotController';





const route = Router();

export default (app: Router) => {
    app.use('/robot', route);
    const ctrl = Container.get(config.controllers.robot.name) as IRobotController;

    route.post(
        '/create',
        celebrate({
            body: Joi.object({
                id: Joi.string().required(),
                serialNumber: Joi.string().required(),
                nickName: Joi.string().required(),
                description: Joi.string().required(),
                robotTypeId: Joi.string().required(),
            }),
        }),
        
        (req, res, next) => {
            req.body.inhibited = false;
            ctrl.createRobot(req, res, next)
        }
    );

    route.get(
        '/list',
        async (req: Request, res: Response, next: NextFunction) => {
            await ctrl.listRobot(req, res, next);
        }
    );

    route.put('/edit',
        celebrate({
            body: Joi.object({
                id: Joi.string().required(),
                serialNumber: Joi.string().required(),
                nickName: Joi.string().required(),
                description: Joi.string().required(),
                robotTypeId: Joi.string().required(),
                inhibited: Joi.boolean().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => { ctrl.updateRobot(req, res, next) }
    );
    route.patch('/edit',
        celebrate({
            body: Joi.object({
                id: Joi.string().required(),
                serialNumber: Joi.string(),
                nickName: Joi.string(),
                description: Joi.string(),
                robotTypeId: Joi.string(),
                inhibited: Joi.boolean()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => { ctrl.updateRobot(req, res, next) }
    );
    route.patch('/inhibit',
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        inhibited: Joi.boolean()
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => { ctrl.updateRobot(req, res, next) }
  );

    route.get(
        '/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            await ctrl.existRobot(req, res, next);
        }
    );
    // route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, user_controller.getMe);
};
