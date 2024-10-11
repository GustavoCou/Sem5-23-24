import { Request, Response, NextFunction } from 'express';

export default interface IFloorController {
    createFloor(req: Request, res: Response, next: NextFunction);
    updateFloor(req: Request, res: Response, next: NextFunction);
    uploadMap(req: Request, res: Response, next: NextFunction);
    getFloor(req: Request, res: Response, next: NextFunction);
    getFloorByBuilding(req: Request, res: Response, next: NextFunction);
    countFloorsByBuilding(req: Request, res: Response, next: NextFunction);
    countTotalFloorsByBuildings(req: Request, res: Response, next: NextFunction);
    getBuildingsInFloorRange(req: Request, res: Response, next: NextFunction);
    existFloor(req: Request, res: Response, next: NextFunction);
}