import { Router, Response, NextFunction } from "express";
import { Controller } from "../interfaces/controller.interface";
import { IRequestWithUser } from "../authentication/auth.interface";
import { authUser } from "../middlewares/auth.middleware";
import userModel from "./user.model";
import { UserNotFound } from "../exceptions";
import { UserService } from "./user.service";
import { restrictedTo } from "../middlewares/permission.middleware";
import { validateRequest } from "../middlewares/validation.middleware";
import { UpdateUserSchema, VerifyUserSchema } from "./user.dto";
const userService = new UserService();

export class UserController implements Controller {
     public path: string = "/users";
     public router: Router = Router();
     public users = userModel;

     constructor() {
          this.initializeRoutes();
     }

     private initializeRoutes() {
          this.router.get(
               `${this.path}/me`,
               authUser,
               restrictedTo(["user"]),
               this.me
          );
          this.router.get(
               `${this.path}/:id`,
               authUser,
               restrictedTo(["admin", "user"]),
               this.read
          );
          this.router.post(
               `${this.path}/account-setup`,
               authUser,
               restrictedTo(["user"]),
               validateRequest(UpdateUserSchema),
               this.setup
          );
          this.router.put(
               `${this.path}/me`,
               authUser,
               restrictedTo(["admin"]),
               this.update
          );
          this.router.post(
               `${this.path}/verify-me`,
               authUser,
               restrictedTo(["user"]),
               validateRequest(VerifyUserSchema),
               this.verify
          );
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
                    messsage: "Request successful",
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
                    messsage: "Request successful",
               });
          } catch (error) {
               next(error);
          }
     };

     private setup = async (
          req: IRequestWithUser,
          res: Response,
          next: NextFunction
     ) => {
          try {
               const user = req.user;
               const userReq = req.body;
               userReq._id = user?._id;

               await userService.accountSetup(userReq);
               return res.status(200).json({
                    status: true,
                    data: null,
                    messsage: "Request successful",
               });
          } catch (error) {
               next(error);
          }
     };

     private update = async (
          req: IRequestWithUser,
          res: Response,
          next: NextFunction
     ) => {
          try {
               const userReq = req.body;
               await userService.update(userReq);
               return res.status(200).json({
                    status: true,
                    data: null,
                    messsage: "Request successful",
               });
          } catch (error) {
               next(error);
          }
     };

     private verify = async (
          req: IRequestWithUser,
          res: Response,
          next: NextFunction
     ) => {
          try {
               if (req.user) {
                    req.body._id = req.user._id;
               }
               await userService.verify(req.body);
               return res.status(200).json({
                    status: true,
                    data: null,
                    messsage: "Request successful",
               });
          } catch (error) {
               next(error);
          }
     };
}
