import { NextFunction } from "express";
import { IRequestWithUser } from "../authentication/auth.interface";
import jwt from "jsonwebtoken";
import userModel from "../users/user.model";
import { AuthTokenInvalid, AuthTokenRequired } from "../exceptions";

export const authUser = async (
     req: IRequestWithUser,
     _: any,
     next: NextFunction
): Promise<void> => {
     const cookies = req.cookies;
     if ((cookies && cookies.Authorization) || req.headers?.authorization) {
          const token =
               req?.headers?.authorization?.split(" ")[1] ||
               (cookies && cookies.Authorization);
          const secret = process.env.JWT_SECRET!;

          const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
          const user = await userModel.findOne({ _id: decoded._id });
          if (!user) {
               next(new AuthTokenInvalid());
          } else {
               req.user = user;
               next();
          }
     } else {
          next(new AuthTokenRequired());
     }
};
