import { NextFunction } from "express";
import { Request, Response } from "../utils/interfaces/express.interface";

export const asyncWrapper =
  (fn: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };
