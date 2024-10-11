import { NextFunction, Request, Response, Router } from "express";
import Container from "typedi";
import IBridgeController from '../../controllers/IControllers/IBridgeController';

import config from "../../../config";
import { celebrate, Joi } from "celebrate";

const route = Router();

export default (app: Router) => {

    app.use('/bridge', route);

    const ctrl = Container.get(config.controllers.bridge.name) as IBridgeController;

    route.post('',
        celebrate({
            body: Joi.object({
                bridgePositionX: Joi.object({
                    posX: Joi.number().required(),
                    posY: Joi.number().required()
                }),
                bridgePositionY: Joi.object({
                    posX: Joi.number().required(),
                    posY: Joi.number().required()
                }),
                bridgeId: Joi.string().max(4).required(), //ponte é A1B1
                floorIdX: Joi.string().required(),
                floorIdY: Joi.string().required()
            })

        }),


        (req, res, next) => ctrl.createBridge(req, res, next));



    route.get('/:buildingX',
        async (req: Request, res: Response, next: NextFunction) => {

            await ctrl.listFloorsWithBridge(req, res, next);
        }
    );


    route.get('',
        async (req: Request, res: Response, next: NextFunction) => {

            await ctrl.listBridges(req, res, next);
        }
    );

    route.get('/:buildingX/:buildingY',
        async (req: Request, res: Response, next: NextFunction) => {

            await ctrl.listBridgesBetweenBuilding(req, res, next);
        }
    );

    route.patch('/:bridgeId',
        celebrate({
            params: Joi.object({
                bridgeId: Joi.string().max(4).required()
            }),
            body: Joi.object({
                bridgePositionX: Joi.object({
                    posX: Joi.number().optional(),
                    posY: Joi.number().optional()
                }).optional(),
                bridgePositionY: Joi.object({
                    posX: Joi.number().optional(),
                    posY: Joi.number().optional()
                }).optional(),
                floorIdX: Joi.string().optional(),
                floorIdY: Joi.string().optional()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => { ctrl.updateBridge(req, res, next) }
    );

    route.put('/:bridgeId',
        celebrate({
            params: Joi.object({
                bridgeId: Joi.string().max(4).required()
            }),
            body: Joi.object({
                bridgePositionX: Joi.object({
                    posX: Joi.number().required(),
                    posY: Joi.number().required()
                }).required(),
                bridgePositionY: Joi.object({
                    posX: Joi.number().required(),
                    posY: Joi.number().required()
                }).required(),
                floorIdX: Joi.string().required(),
                floorIdY: Joi.string().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => { ctrl.updateBridge(req, res, next) }
    );
}

