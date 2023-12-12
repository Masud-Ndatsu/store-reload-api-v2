import { NextFunction, Request, Response } from "express";

export const validateRequest =
     (schema: any) => (req: Request, res: Response, next: NextFunction) => {
          const { error } = schema.validate(
               req?.body ? req.body : req?.params ? req.params : req.query
          );

          if (error) {
               return res.status(400).json({
                    status: false,
                    data: null,
                    message: error.details[0].message,
               });
          }

          return next();
     };
