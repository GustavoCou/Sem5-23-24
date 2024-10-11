import { Response, Request, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from '../../config';


import { IRoomDTO } from '../dto/IRoomDTO';
import IRoomController from './IControllers/IRoomController';
import IRoomService from '../services/IServices/IRoomService';
import {Result} from "../core/logic/Result";


@Service()
export default class RoomController implements IRoomController {
    constructor(
        @Inject(config.services.room.name) private roomServiceInstance: IRoomService
    ) { }

    public async createRoom(req: Request, res: Response, next: NextFunction) {
        try {
            const roomTrue = (await this.roomServiceInstance.CreateRoom(req.body as IRoomDTO));

            if (roomTrue.isFailure) {
                return res.status(400).send(roomTrue.error);
            }

            const roomDTO = roomTrue.getValue();

            return res.json(roomDTO).status(201);
        }
        catch (e) {
            return next(e);
        }
    }

    public async existRoom(req: Request, res: Response, next: NextFunction) {

        try {

            const roomTrue  = await this.roomServiceInstance.existRoom(req.params.id as string) as Result<boolean>;

            if (roomTrue.isFailure) {
                res.status(400).json(roomTrue.errorValue()).send();
            }

            return res.status(200).json(roomTrue.getValue());


        } catch (e) {
            return next(e);
        }
    }
}
