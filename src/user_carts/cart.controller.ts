import { NextFunction, Request, Response, Router } from "express";
import { Controller } from "../interfaces/controller.interface";
import { CartService } from "./cart.service";
import { IRequestWithUser } from "../authentication/auth.interface";
import { authUser } from "../middlewares/auth.middleware";
const cartService = new CartService();

export class CartController implements Controller {
     public path: string = "/carts";
     public router: Router = Router();

     constructor() {
          this.initializeRoutes();
     }

     private initializeRoutes() {
          this.router.post(`${this.path}`, authUser, this.add);
          this.router.get(`${this.path}`, authUser, this.list);
          this.router.put(`${this.path}/:id`, authUser, this.update);
          this.router.delete(`${this.path}/:id`, authUser, this.remove);
     }

     private add = async (
          req: IRequestWithUser,
          res: Response,
          next: NextFunction
     ) => {
          try {
               const id = req.user ? req.user._id.toString() : "";
               await cartService.create(req.body, id);
               return res.status(201).json({
                    status: true,
                    data: null,
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
               const id = req.user ? req.user._id.toString() : "";
               console.log({
                    id,
               });
               const { data } = await cartService.list(id);
               return res.status(200).json({
                    status: true,
                    data,
                    message: "Request successful",
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
               const { id } = req.params;
               const userId = req.user ? req.user._id : "";
               req.body._id = id;
               await cartService.update(req.body, userId);
               return res.status(200).json({
                    status: true,
                    data: null,
                    message: "Request successful",
               });
          } catch (error) {
               next(error);
          }
     };

     private remove = async (
          req: Request,
          res: Response,
          next: NextFunction
     ) => {
          try {
               const { id } = req.params;
               await cartService.remove(id);
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
