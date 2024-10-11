import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

import { celebrate, Joi } from 'celebrate';
import winston = require('winston');

import config from "../../../config";
import IBuildingController from '../../controllers/IControllers/IBuildingController';




body: Joi.object({
                id: Joi.string().required(),
                serialNumber: Joi.string().required(),
                nickName: Joi.string().required(),
                inhibited: Joi.boolean().required()
            })
const route = Router();

export default (app: Router) => {
  app.use('/building', route);
  const ctrl = Container.get(config.controllers.building.name) as IBuildingController;

  route.post(
    '/create',
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        name: Joi.string(),
        description: Joi.string(),
        width: Joi.number().required(),
        depth: Joi.number().required()   
      }),
    }),

    (req, res, next) => ctrl.createBuilding(req, res, next)
  );

  route.get(
    '/list',
    async (req: Request, res: Response, next: NextFunction) => {
      await ctrl.listBuilding(req, res, next);
    }
  );
    route.get(
        '/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            await ctrl.existBuilding(req, res, next);
        }
    );
  route.put('/edit',
  celebrate({
    body: Joi.object({      
      id: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      width: Joi.number().required(),
      depth: Joi.number().required()
    })
  }),
  async (req: Request, res: Response, next: NextFunction) => {ctrl.updateBuilding(req,res,next)  }
);
route.patch('/edit',
celebrate({
    body: Joi.object({
      id:Joi.string().required(),
      name: Joi.string(),
      description: Joi.string(),
      width: Joi.number(),
      depth: Joi.number()
    })
    }),
    async (req: Request, res: Response, next: NextFunction) =>{ctrl.updateBuilding(req,res,next) }
);

  // route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, user_controller.getMe);
};
