import { Router, Request, Response, NextFunction } from "express";
import { Multer } from "multer";
import { Controller } from "../interfaces/controller.interface";
import { ProductService } from "./product.service";
import { authUser } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validation.middleware";
import { CreateProductSchema, SearchQuerySchema } from "./product.dto";
import { restrictedTo } from "../middlewares/permission.middleware";
import { HttpException } from "../exceptions";
const productService = new ProductService();

export class ProductController implements Controller {
     public path: string = "/products";
     public router: Router = Router();

     constructor() {
          this.initializeRoutes();
     }

     private initializeRoutes() {
          this.router.get(`${this.path}`, this.list);
          this.router.post(
               `${this.path}`,
               authUser,
               restrictedTo(["admin", "user"]),
               validateRequest(CreateProductSchema),
               this.create
          );
          this.router.get(
               `${this.path}/category`,
               authUser,
               this.getProductByCategory
          );
          this.router.get(
               `${this.path}/search`,
               authUser,
               this.getProductBySearch
          );
          this.router.get(`${this.path}/:id`, authUser, this.read);
          this.router.put(
               `${this.path}/:id`,
               authUser,
               restrictedTo(["admin", "user"]),
               this.update
          );
          this.router.delete(
               `${this.path}/:id`,
               authUser,
               restrictedTo(["admin", "user"]),
               this.remove
          );
     }

     private create = async (
          req: Request,
          res: Response,
          next: NextFunction
     ): Promise<any> => {
          try {
               req.body.tags = JSON.parse(req.body.tags);
               req.body.price = Number(req.body.price);
               req.body.inventory = Number(req.body.inventory);

               if (req.files) {
                    req.body.images = [];
               }

               await productService.create(req.body);
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
               const page = Number(req.query.page) || 1;
               const limit = Number(req.query.limit) || 10;
               const type = (req.query.type as string) || "general";

               const { data } = await productService.list({
                    page,
                    limit,
                    type,
               });

               return res.status(200).json({
                    status: true,
                    data,
                    message: "Request successful",
               });
          } catch (error) {
               next(error);
          }
     };

     private read = async (req: Request, res: Response, next: NextFunction) => {
          try {
               const { id } = req.params;
               const { data } = await productService.getById(id);
               return res.status(200).json({
                    status: true,
                    data,
                    message: "Request successful",
               });
          } catch (error) {
               next(error);
          }
     };

     private getProductByCategory = async (
          req: Request,
          res: Response,
          next: NextFunction
     ) => {
          try {
               const page = Number(req.query.page) || 1;
               const limit = Number(req.query.limit) || 10;
               const category = req.query.q as string;
               const { error } = SearchQuerySchema.validate(req.query);

               if (error) {
                    throw new HttpException(400, error.message);
               }

               const { data } = await productService.getByCategory({
                    category,
                    page,
                    limit,
               });

               return res.status(200).json({
                    status: true,
                    data,
                    message: "Request successful",
               });
          } catch (error) {
               next(error);
          }
     };

     private getProductBySearch = async (
          req: Request,
          res: Response,
          next: NextFunction
     ) => {
          try {
               const page = Number(req.query.page) || 1;
               const limit = Number(req.query.limit) || 10;
               const search_text = req.query.q as string;

               const { error } = SearchQuerySchema.validate(req.query);

               if (error) {
                    throw new HttpException(400, error.message);
               }

               const { data } = await productService.search({
                    search_text,
                    page,
                    limit,
               });

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

               if (req.files) {
                    req.body.images = [];
               }
               await productService.update(req.body, id);
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

               if (req.files) {
                    req.body.images = [];
               }
               await productService.remove(id);
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
