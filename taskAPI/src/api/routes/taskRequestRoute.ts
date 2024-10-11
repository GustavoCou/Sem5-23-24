import { NextFunction, Request, Response, Router } from "express";
import { Container } from "typedi";
import config from "../../../config";
import { celebrate, Joi, Segments } from "celebrate";
import ITaskRequestController from "../../controllers/IControllers/ITaskRequestController";
import { TaskSearchCriteria } from "../../utils/OtherUtils";


const route = Router();

export default (app: Router) => {
	app.use('/task', route);

	const ctrl = Container.get(config.controllers.taskRequest.name) as ITaskRequestController;
	const { celebrate, Joi, Segments } = require('celebrate');

	route.post('',
		celebrate({
			body: Joi.object({
				userId: Joi.string().required(),

				type: Joi.string().required(), //   'securityTask'  or 'pickupDeliveryTask'
				robot: Joi.string().required(),
				building: Joi.string(),
				floors: Joi.array().items(Joi.string()),
				emergencyContact: Joi.object({
					name: Joi.string(),
					phone: Joi.number(),
				}),

				pickupRoom: Joi.string(),
				deliveryRoom: Joi.string(),

				pickupContact: Joi.object({
					name: Joi.string(),
					phone: Joi.number()
				}),
				deliveryContact: Joi.object({
					name: Joi.string(),
					phone: Joi.number()
				}),
				confirmationCode: Joi.string(),
				descriptionDelivery: Joi.string().max(1000),
			})

		}),
		(req, res, next) => ctrl.createTaskRequest(req, res, next));

	route.get('/pending',
		async (req: Request, res: Response, next: NextFunction) => {
			await ctrl.listPendingTaskRequests(req, res, next);
		}
	);

	route.post('/filteredTasks',
		async (req: Request<{}, {}, {}, TaskSearchCriteria>, res: Response, next: NextFunction) => {
			await ctrl.filteredPendingTaskRequests(req, res, next);
		}
	);

	route.get('/aprove',
		async (req: Request, res: Response, next: NextFunction) => {
			await ctrl.listAproveTaskRequests(req, res, next);
		}
	);

	route.put('/:id/status',
		async (req: Request, res: Response, next: NextFunction) => {
			await ctrl.updateTaskRequestStatus(req, res, next);
		}
	);
}
