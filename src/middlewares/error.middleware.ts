import { NextFunction, Response } from "express";
import { HttpException } from "../exceptions/";

export const errorMiddleware = (
     error: HttpException,
     _: any,
     res: Response,
     next: NextFunction
) => {
     if (res.headersSent) {
          next(error);
     }
     const status = error.status || 500;
     const message = error.message || "Something went wrong";

     return res.status(status).json({
          status: false,
          data: null,
          message: message,
     });
};
