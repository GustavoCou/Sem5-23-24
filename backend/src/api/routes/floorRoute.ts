import { NextFunction, Response, Router } from "express";
import { celebrate, Joi } from "celebrate";
import multer from "multer";

import { Container } from 'typedi';
import IFloorController from "../../controllers/IControllers/IFloorController";

import config from "../../../config";
import { Request } from "express-jwt";

const route = Router();


const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/json') {
      return cb(new Error('The file must be type JSON'));
    }
    cb(null, true);
  },
});


export default (app: Router) => {
  app.use('/floor', route);

  const ctrl = Container.get(config.controllers.floor.name) as IFloorController;

  route.post('/create',
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        floorDescription: Joi.string().max(250),
        floorSize: Joi.object({
          width: Joi.number().required(),
          depth: Joi.number().required()
        }),
          building: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.createFloor(req, res, next));
    
  route.patch('/uploadmap', upload.single('file'),
    celebrate({
      body: Joi.object({
        id: Joi.string().required().max(50),
          building: Joi.string().required(),
      })
    }), (req , res,next) => {ctrl.uploadMap(req, res, next);
  });

  route.get('/get', 
    async (req: Request, res: Response, next: NextFunction) => {
    await ctrl.getFloor(req, res, next);
  });

  route.get('/get/:building',
    async (req: Request, res: Response, next: NextFunction) => {
    await ctrl.getFloorByBuilding(req, res, next);
  });

  route.get('/count',
    async (req: Request, res: Response, next: NextFunction) => {
    await ctrl.countTotalFloorsByBuildings(req, res, next);
  });

  route.get('/count/:building',
    async (req: Request, res: Response, next: NextFunction) => {
    await ctrl.countFloorsByBuilding(req, res, next);
  }); 

 route.get('/floorsInRange',
    async (req: Request, res: Response, next: NextFunction) => {
    await ctrl.getBuildingsInFloorRange(req, res, next);
  });

  route.put('/edit',
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        floorDescription: Joi.string().max(250),
        floorSize: Joi.object({
          width: Joi.number().required(),
          depth: Joi.number().required()
        }),
        building: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.updateFloor(req, res, next));

  route.patch('/edit',
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        floorDescription: Joi.string().max(250),
        floorSize: Joi.object({
          width: Joi.number().required(),
          depth: Joi.number().required()
        }),
        building: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.updateFloor(req, res, next));

       route.get(
         '/:building/:id',
         async (req: Request, res: Response, next: NextFunction) => {
             await ctrl.existFloor(req, res, next);
         }
     );

}

