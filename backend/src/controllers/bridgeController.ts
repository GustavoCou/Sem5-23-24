import { Inject, Service } from "typedi";
import config from "../../config";
import { NextFunction, Request, Response } from "express";
import { Result } from "../core/logic/Result";
import IBridgeService from "../services/IServices/IBridgeService";
import IBridgeController from "./IControllers/IBridgeController";
import IBridgeDTO from "../dto/IBridgeDTO";
import BridgeError from "../exceptions/bridgeException";

@Service()
export default class BridgeController implements IBridgeController {
    constructor(
        @Inject(config.services.bridge.name) private bridgeServiceInstance: IBridgeService
    ) { }

    public async createBridge(req: Request, res: Response, next: NextFunction) {
        try {
            const bridgeTrue = (await this.bridgeServiceInstance.createBridge(req.body as IBridgeDTO)) as Result<IBridgeDTO>;

            //adicionou o return aqui
            if (bridgeTrue.isFailure) {
                return res.status(404).json(bridgeTrue.errorValue()).send();
            }

            const bridgeDTO = bridgeTrue.getValue();
            return res.status(201).json(bridgeDTO);


        } catch (error) {
            return next(new BridgeError('Error on creating bridge'));
        }
    }



    public async listBridges(req: Request, res: Response, next: NextFunction) {

        try {

            const bridgeTrue = (await this.bridgeServiceInstance.getAll());

            if (bridgeTrue.isFailure) {
                res.status(404).json({ error: bridgeTrue.errorValue() }).send();;
            }

            const bridgeDTO = bridgeTrue.getValue();
            return res.status(201).json(bridgeDTO);


        } catch (error) {
            return next(new BridgeError('Error on listing bridges'));
        }
    }


    public async listFloorsWithBridge(req: Request, res: Response, next: NextFunction) {

        const buildingToGetFloor = req.params.buildingX;



        try {

            const bridgeTrue = (await this.bridgeServiceInstance.getAllFloorsWithBridges(buildingToGetFloor));

            if (bridgeTrue.isFailure) {
                res.status(404).json({ error: bridgeTrue.errorValue() }).send();;
            }

            const bridgeDTO = bridgeTrue.getValue();

            return res.status(201).json(bridgeDTO);


        } catch (error) {
            return next(new BridgeError('Error on listingBridges'));
        }
    }


    public async updateBridge(req: Request, res: Response, next: NextFunction) {

        const bridgeIdentification = req.params.bridgeId;


        try {


            const checkExistBridge = await this.bridgeServiceInstance.getBridge(bridgeIdentification);

            if (checkExistBridge.isFailure) {

                return res.status(400).json({ error: 'Bridge ID doesn´t exist' }).send();
            }

            const bridgeExist = (await this.bridgeServiceInstance.updateBridge(req.body as IBridgeDTO));

            if (bridgeExist.isFailure) {
                return res.status(404).json({ error: bridgeExist.errorValue() }).send();
            }


            const bridgeDTO = bridgeExist.getValue();
            return res.status(201).json(bridgeDTO);


        } catch (error) {
            return next(new BridgeError('Error on updating bridge'));
        }

    }

    public async listBridgesBetweenBuilding(req: Request, res: Response, next: NextFunction) {

        const buildingX = req.params.buildingX;
        const buildingY = req.params.buildingY;


        try {

            const bridgeTrue = (await this.bridgeServiceInstance.listBridgesOfBuildings(buildingX, buildingY));

            if (bridgeTrue.isFailure) {
                res.status(404).json({ error: bridgeTrue.errorValue() }).send();;
            }

            const bridgeDTO = bridgeTrue.getValue();

            return res.status(201).json(bridgeDTO);


        } catch (error) {
            return next(new BridgeError('Error on listing bridge'));
        }

    }

}