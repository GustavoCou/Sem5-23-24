import { Request, Response, NextFunction } from 'express';

export default interface IBuildingController {
    createBuilding(req: Request, res: Response, next: NextFunction);
    updateBuilding(req: Request, res: Response, next: NextFunction);
    listBuilding(req: Request, res: Response, next: NextFunction);
    existBuilding(req: Request, res: Response, next: NextFunction);
}