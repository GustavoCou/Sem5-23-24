import { NextFunction, Request, Response } from "express";

export default interface IElevatorController {

    createElevator(req: Request, res: Response, next: NextFunction);
    getFloorsServed(req: Request, res: Response, next: NextFunction);
    getElevatorsByBuilding(req: Request, res: Response, next: NextFunction);
}