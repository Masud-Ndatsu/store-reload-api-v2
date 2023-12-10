import { Router, Request, Response, NextFunction } from "express";
import { Controller } from "../interfaces/controller.interface";
import { IRequestWithUser } from "../authentication/auth.interface";
import { authUser } from "../middlewares/auth.middleware";
import userModel from "./user.model";
import { UserNotFound } from "../exceptions";

export class UserController implements Controller {
     public path: string = "/users";
     public router: Router = Router();
     public users = userModel;

     constructor() {
          this.initializeRoutes();
     }

     private initializeRoutes() {
          this.router.use(authUser);
          this.router.get(`${this.path}/me`, this.me);
          this.router.get(`${this.path}/:id`, this.read);
          this.router.post(`${this.path}/account-setup`, this.setup);
          this.router.put(`${this.path}/me`, authUser, this.update);
          this.router.post(`${this.path}/verify-me`, this.verify);
          this.router.post(`${this.path}/messages`, this.message);
     }

     private me = async (
          req: IRequestWithUser,
          res: Response,
          next: NextFunction
     ) => {
          try {
               const user = req.user;
               return res.status(200).json({
                    status: true,
                    data: user,
               });
          } catch (error) {
               next(error);
          }
     };
     private read = async (
          req: IRequestWithUser,
          res: Response,
          next: NextFunction
     ) => {
          const { id } = req.params;
          try {
               const user = await this.users.findById(id).lean();
               if (!user) {
                    throw new UserNotFound();
               }

               return res.status(200).json({
                    status: true,
                    data: user,
               });
          } catch (error) {
               next(error);
          }
     };

     private setup = async (
          req: Request,
          res: Response,
          next: NextFunction
     ) => {
          try {
          } catch (error) {
               next(error);
          }
     };

     private update = async (
          req: Request,
          res: Response,
          next: NextFunction
     ) => {
          try {
          } catch (error) {
               next(error);
          }
     };

     private verify = async (
          req: Request,
          res: Response,
          next: NextFunction
     ) => {
          try {
          } catch (error) {
               next(error);
          }
     };

     private message = async (
          req: Request,
          res: Response,
          next: NextFunction
     ) => {
          try {
          } catch (error) {
               next(error);
          }
     };
}
