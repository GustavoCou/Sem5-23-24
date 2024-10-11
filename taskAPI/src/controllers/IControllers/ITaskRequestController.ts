import { NextFunction, Request, Response } from "express";

export default interface ITaskRequestController {
  createTaskRequest(req: Request, res: Response, next: NextFunction);
  listPendingTaskRequests(req: Request, res: Response, next: NextFunction);
  filteredPendingTaskRequests(req: Request, res: Response, next: NextFunction);
  listAproveTaskRequests(req: Request, res: Response, next: NextFunction);
  updateTaskRequestStatus(req: Request, res: Response, next: NextFunction);
}
