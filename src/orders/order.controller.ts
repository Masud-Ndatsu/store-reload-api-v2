import { NextFunction, Router, Response } from "express";
import { Controller } from "../interfaces/controller.interface";
import { IRequestWithUser } from "../authentication/auth.interface";
import { OrderService } from "./order.service";
import { authUser } from "../middlewares/auth.middleware";

const orderService = new OrderService();

export class OrderController implements Controller {
     public path: string = "/orders";
     public router: Router = Router();

     constructor() {
          this.initializeRoutes();
     }

     private initializeRoutes() {
          this.router.post(`${this.path}`, authUser, this.create);
          this.router.get(`${this.path}`, authUser, this.list);
          this.router.get(`${this.path}/:id`, authUser, this.read);
          this.router.delete(`${this.path}/:id`, authUser, this.remove);
     }

     private create = async (
          req: IRequestWithUser,
          res: Response,
          next: NextFunction
     ) => {
          try {
               const id = req.user ? req.user._id : "";
               console.log({
                    id,
               });
               const { data } = await orderService.create(req.body, id);
               return res.status(201).json({
                    status: true,
                    data,
                    message: "Request successful",
               });
          } catch (error) {
               console.log({
                    error,
               });
               next(error);
          }
     };

     private list = async (
          req: IRequestWithUser,
          res: Response,
          next: NextFunction
     ) => {
          try {
               const { data } = await orderService.list();
               return res.status(200).json({
                    status: true,
                    data,
                    message: "Request successful",
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
          try {
               const { id } = req.params;
               const { data } = await orderService.getById(id);
               return res.status(200).json({
                    status: true,
                    data,
                    message: "Request successful",
               });
          } catch (error) {
               next(error);
          }
     };
     private remove = async (
          req: IRequestWithUser,
          res: Response,
          next: NextFunction
     ) => {
          try {
          } catch (error) {
               next(error);
          }
     };
}
