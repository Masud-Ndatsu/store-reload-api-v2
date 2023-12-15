import {
     CategoryNotFound,
     ProductNotFound,
     ProductTypeNotFound,
} from "../exceptions";
import { Category } from "../product_categories/category.model";
import { IProduct } from "./product.interface";
import Product from "./product.model";

export class ProductService {
     products = Product;
     categories = Category;
     public create = async (productReq: IProduct): Promise<any> => {
          const { category: id } = productReq;

          const productCat = await this.categories.findById(id);
          if (!productCat) {
               throw new CategoryNotFound();
          }

          await this.products.create({
               ...productReq,
          });
          return;
     };
     public getById = async (id: string): Promise<any> => {
          const [product] = await this.products.aggregate([
               {
                    $match: {
                         $expr: {
                              $eq: [{ $toString: "$_id" }, id],
                         },
                    },
               },
               {
                    $project: {
                         name: 1,
                         images: 1,
                         description: 1,
                         price: 1,
                    },
               },
          ]);

          if (!product) {
               throw new ProductNotFound();
          }

          return {
               data: product,
          };
     };
     public search = async ({
          search_text,
          page,
          limit,
     }: {
          search_text: string;
          page: number;
          limit: number;
     }): Promise<any> => {
          const products = await this.products.aggregate([
               {
                    $lookup: {
                         from: "categories",
                         localField: "category",
                         foreignField: "_id",
                         as: "category",
                    },
               },
               {
                    $match: {
                         $or: [
                              {
                                   name: {
                                        $regex: new RegExp(search_text, "i"),
                                   },
                              },
                              {
                                   description: {
                                        $regex: new RegExp(search_text, "i"),
                                   },
                              },
                              {
                                   "category.name": {
                                        $regex: new RegExp(search_text, "i"),
                                   },
                              },
                         ],
                    },
               },
               {
                    $project: {
                         name: 1,
                         images: 1,
                         price: 1,
                    },
               },
               {
                    $skip: (page - 1) * limit,
               },
               {
                    $limit: limit,
               },
          ]);

          return {
               data: products,
          };
     };
     public list = async (metadata: {
          page: number;
          limit: number;
          type: string;
     }): Promise<any> => {
          const { page, limit, type } = metadata;

          const products = await this.products.aggregate([
               {
                    $lookup: {
                         from: "categories",
                         localField: "category",
                         foreignField: "_id",
                         as: "category",
                    },
               },
               {
                    $project: {
                         name: 1,
                         type: 1,
                         images: 1,
                         price: 1,
                         category: { $arrayElemAt: ["$category", 0] },
                    },
               },
               {
                    $match: {
                         type: type,
                    },
               },

               {
                    $skip: (page - 1) * limit,
               },
               {
                    $limit: limit,
               },
          ]);

          const productCategories = await this.categories.aggregate([
               {
                    $match: {
                         product_type: type,
                    },
               },
               {
                    $project: {
                         name: 1,
                    },
               },
          ]);

          console.log({
               products: JSON.stringify(
                    products.map((product) => product.category.name)
               ),
          });

          const categories = [
               ...new Set(productCategories.map((category) => category.name)),
          ];

          if (!productCategories[0]) {
               throw new ProductTypeNotFound();
          }
          const productsAndCategory = products.map((_, index) => ({
               category: categories[index],
               href: `/products?category=${categories[index]}`,
               data: products.filter(
                    (product) => product.category.name === categories[index]
               ),
          }));

          const filteredProducts = productsAndCategory.filter((product) => {
               return product.category !== undefined;
          });

          return {
               data: filteredProducts,
          };
     };

     public getByCategory = async ({
          category,
          page,
          limit,
     }: {
          category: string;
          page: number;
          limit: number;
     }): Promise<any> => {
          const products = await this.products.aggregate([
               {
                    $lookup: {
                         from: "categories",
                         localField: "category",
                         foreignField: "_id",
                         as: "category",
                    },
               },
               {
                    $project: {
                         name: 1,
                         images: 1,
                         price: 1,
                         category: { $arrayElemAt: ["$category", 0] },
                    },
               },
               {
                    $match: {
                         $expr: { $eq: ["$category.name", category] },
                    },
               },
               {
                    $skip: (page - 1) * limit,
               },
               {
                    $limit: limit,
               },
          ]);

          return { data: products };
     };

     public update = async (productReq: IProduct, id: string): Promise<any> => {
          const product = await this.products.findById(id).lean();

          if (!product) {
               throw new ProductNotFound();
          }

          await this.products.findOneAndUpdate(
               { _id: product._id },
               {
                    ...productReq,
               }
          );
          return;
     };
     public remove = async (id: string): Promise<void> => {
          const product = await this.products.findById(id).lean();

          if (!product) {
               throw new ProductNotFound();
          }

          await this.products.findByIdAndDelete(id);

          const products = await this.products.find({
               category: product.category,
          });

          if (products.length === 0) {
               await this.categories.findByIdAndDelete(product.category);
          }

          return;
     };
}
