import { Request, Response, NextFunction, RequestHandler } from "express";

const expressSwitchware = <
  T extends string | number | symbol,
  R extends Record<T, RequestHandler>
>(
  getKey: (req: Request, res: Response) => T,
  mapping: R
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = getKey(req, res);
    const handler = mapping[key];
    if (handler) {
      return handler(req, res, next);
    }
    return next(new Error(`Invalid middleware key: ${String(key)}`));
  };
};

export default expressSwitchware;
