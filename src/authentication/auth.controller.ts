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
          this.router.post(`${this.path}/reset-password`, this.resetPassword);
          this.router.post(
               `${this.path}/reset-password/verify-code`,
               this.resetPasswordVerifyCode
          );
          this.router.post(
               `${this.path}/reset-password/change`,
               this.resetPasswordChange
          );
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
               const { cookie, shop, token } = await authService.login(userReq);

               res.setHeader("Set-Cookie", [cookie]);
               return res.status(200).json({
                    status: true,
                    data: {
                         ...shop,
                         token,
                    },
               });
          } catch (error: any) {
               next(error);
          }
     };

     private resetPassword = async (
          req: Request,
          res: Response,
          next: NextFunction
     ) => {
          try {
               const { email } = req.body;
               await authService.resetPassword({
                    email,
               });
               return res.status(200).json({
                    status: true,
                    data: null,
               });
          } catch (error) {
               next(error);
          }
     };

     private resetPasswordVerifyCode = async (
          req: Request,
          res: Response,
          next: NextFunction
     ) => {
          try {
               const { user } = await authService.resetPasswordVerifyCode(
                    req.body
               );
               return res.status(200).json({
                    status: true,
                    data: user,
               });
          } catch (error) {
               next(error);
          }
     };
     private resetPasswordChange = async (
          req: Request,
          res: Response,
          next: NextFunction
     ) => {
          try {
               await authService.resetPasswordChange(req.body);
               return res.status(200).json({
                    status: true,
                    data: null,
               });
          } catch (error) {
               next(error);
          }
     };
}
