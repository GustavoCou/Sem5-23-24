import { NextFunction, Request, Response } from "express";

export default interface IBridgeController {
    createBridge(req: Request, res: Response, next: NextFunction);
    listFloorsWithBridge(req: Request, res: Response, next: NextFunction);
    updateBridge(req: Request, res: Response, next: NextFunction);
    listBridges(req: Request, res: Response, next: NextFunction);
    listBridgesBetweenBuilding(req: Request, res: Response, next: NextFunction);
}