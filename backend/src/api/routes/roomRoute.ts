import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import winston = require('winston');
import config from "../../../config";
import IRoomController from '../../controllers/IControllers/IRoomController';

const route = Router();

export default (app: Router) => {
	app.use('/room', route);

	const ctrl = Container.get(config.controllers.room.name) as IRoomController;

	route.post(
		'/create',
		celebrate(
			{
				body: Joi.object({
					roomId: Joi.string().required(),
					description: Joi.string().required(),
					size: Joi.object({
						width: Joi.number().required(),
						depth: Joi.number().required()
					}),
					position: Joi.object({
						posX: Joi.number().required(),
						posY: Joi.number().required()
					}),
					roomType: Joi.string().required(),
					floor: Joi.string().required()
				}),
			}),

		(req, res, next) => ctrl.createRoom(req, res, next)
	);

	route.get(
		'/:id',
		async (req: Request, res: Response, next: NextFunction) => {
			await ctrl.existRoom(req, res, next);

		}
	);
	// route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, user_controller.getMe);
};
