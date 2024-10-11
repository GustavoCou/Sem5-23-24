import { Request, Response, NextFunction } from 'express';

export default interface IRobotController {
    createRobot(req: Request, res: Response, next: NextFunction);
    updateRobot(req: Request, res: Response, next: NextFunction);
    listRobot(req: Request, res: Response, next: NextFunction);
    inhibitRobot(req: Request, res: Response, next: NextFunction);
    existRobot(req: Request, res: Response, next: NextFunction);
}