import { Request, Response, NextFunction, RequestHandler } from "express";

const switchware =
  <T extends string | number | symbol, R extends Record<T, RequestHandler>>(
    getKey: (req: Request, res: Response) => T,
    mapping: R
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    const key = getKey(req, res);
    if (mapping[key]) {
      return mapping[key](req, res, next);
    } else {
      return next(new Error("Invalid middleware key"));
    }
  };

export default switchware;
