import { NextFunction, Response } from "express";
import { IRequestWithUser } from "../authentication/auth.interface";
import { UnAuthorized } from "../exceptions";

export const restrictedTo =
     (roles: string[]) =>
     (req: IRequestWithUser, res: Response, next: NextFunction) => {
          const role = req.user?.user_type;
          if (req.user && roles.includes(role ?? "user")) {
               next();
          } else {
               throw new UnAuthorized();
          }
     };
