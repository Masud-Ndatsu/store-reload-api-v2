import { Router, Request, Response, NextFunction } from "express";
import { Controller } from "../interfaces/controller.interface";
import { AuthService } from "./auth.service";
import { validateRequest } from "../middlewares/validation.middleware";
import {
     ChangePasswordSchema,
     CreateUserSchema,
     LoginSchema,
     ResetPasswordSchema,
     VerifyPasswordOTPSchema,
} from "./auth.dto";

const authService = new AuthService();

export class AuthController implements Controller {
     path: string = "/auth";
     router: Router = Router();

     constructor() {
          this.initializeRoutes();
     }

     private initializeRoutes() {
          this.router.post(
               `${this.path}/register`,
               validateRequest(CreateUserSchema),
               this.register
          );
          this.router.post(
               `${this.path}/login`,
               validateRequest(LoginSchema),
               this.login
          );
          this.router.post(
               `${this.path}/reset-password`,
               validateRequest(ResetPasswordSchema),
               this.resetPassword
          );
          this.router.post(
               `${this.path}/reset-password/verify-code`,
               validateRequest(VerifyPasswordOTPSchema),
               this.resetPasswordVerifyCode
          );
          this.router.post(
               `${this.path}/reset-password/change`,
               validateRequest(ChangePasswordSchema),
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
               const { user, cookie, token } = await authService.register(
                    userReq
               );
               res.setHeader("Set-Cookie", [cookie]);
               return res.status(201).json({
                    status: true,
                    data: {
                         ...user,
                         token,
                    },
                    message: "Request successful",
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
               const { cookie, user, token } = await authService.login(userReq);

               res.setHeader("Set-Cookie", [cookie]);
               return res.status(200).json({
                    status: true,
                    data: {
                         ...user,
                         token,
                    },
                    message: "Request successful",
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
                    message: "Request successful",
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
                    message: "Request successful",
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
                    message: "Request successful",
               });
          } catch (error) {
               next(error);
          }
     };
}
