import { Router, Request, Response, NextFunction } from "express";
import { Controller } from "../interfaces/controller.interface";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export class AuthController implements Controller {
     path: string = "/auth";
     router: Router = Router();

     constructor() {
          this.initializeRoutes();
     }

     private initializeRoutes() {
          this.router.post(`${this.path}/register`, this.register);
          this.router.post(`${this.path}/login`, this.login);
     }

     private register = async (
          req: Request,
          res: Response,
          next: NextFunction
     ) => {
          try {
               const userReq = req.body;
               const { shop, cookie, token } = await authService.register(
                    userReq
               );
               res.setHeader("Set-Cookie", [cookie]);
               return res.status(201).json({
                    ...shop,
                    token,
               });
          } catch (error: any) {
               next(error);
          }
     };

     private login = async (
          req: Request,
          res: Response,
          next: NextFunction
     ) => {
          try {
               const userReq = req.body;
          } catch (error: any) {
               next(error);
          }
     };
}
