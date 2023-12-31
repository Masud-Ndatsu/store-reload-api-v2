import { Router, Request, Response, NextFunction } from "express";
import { Controller } from "../interfaces/controller.interface";
import { CategoryService } from "./category.service";
import { validateRequest } from "../middlewares/validation.middleware";
import { CreateCategorySchema } from "./category.dto";
import { authUser } from "../middlewares/auth.middleware";
import { restrictedTo } from "../middlewares/permission.middleware";
const categoryService = new CategoryService();

export class CategoryController implements Controller {
     public path: string = "/categories";
     public router: Router = Router();
     constructor() {
          this.initializeRoutes();
     }

     private initializeRoutes() {
          this.router.post(
               `${this.path}/`,
               authUser,
               restrictedTo(["admin", "user"]),
               validateRequest(CreateCategorySchema),
               this.create
          );
          this.router.get(`${this.path}`, authUser, this.list);
          this.router.put(
               `${this.path}/:id`,
               authUser,
               restrictedTo(["admin"]),
               this.update
          );
          this.router.delete(
               `${this.path}/:id`,
               authUser,
               restrictedTo(["admin"]),
               this.remove
          );
     }

     private create = async (
          req: Request,
          res: Response,
          next: NextFunction
     ) => {
          try {
               await categoryService.create(req.body);
               return res.status(201).json({
                    status: true,
                    data: null,
                    message: "Request successful",
               });
          } catch (error) {
               next(error);
          }
     };

     private list = async (req: Request, res: Response, next: NextFunction) => {
          try {
               const { data } = await categoryService.list();
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
          req: Request,
          res: Response,
          next: NextFunction
     ) => {
          try {
               const { id } = req.params;
               await categoryService.update(req.body, id);
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
               console.log(req.params);

               await categoryService.remove(id);
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
