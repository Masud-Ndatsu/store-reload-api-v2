import { NextFunction, Router, Response } from "express";
import { Controller } from "../interfaces/controller.interface";
import { IRequestWithUser } from "../authentication/auth.interface";
import { OrderService } from "./order.service";

const orderService = new OrderService();

export class OrderController implements Controller {
     public path: string = "/orders";
     public router: Router = Router();

     constructor() {
          this.initializeRoutes();
     }

     private initializeRoutes() {
          this.router.post(`${this.path}`, this.create);
          this.router.get(`${this.path}`, this.list);
          this.router.get(`${this.path}/:id`, this.read);
          this.router.delete(`${this.path}/:id`, this.remove);
     }

     private create = async (
          req: IRequestWithUser,
          res: Response,
          next: NextFunction
     ) => {
          try {
               const id = req.user ? req.user._id : "";
               const { data } = await orderService.create(req.body, id);
               return res.status(201).json({
                    status: true,
                    data,
                    message: "Request successful",
               });
          } catch (error) {
               next(error);
          }
     };

     private list = async (
          req: IRequestWithUser,
          res: Response,
          next: NextFunction
     ) => {
          try {
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
