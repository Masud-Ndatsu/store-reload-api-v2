import { CategoryAlreadyExists, CategoryNotFound } from "../exceptions";
import { ICategory } from "./category.interface";
import { Category } from "./category.model";

export class CategoryService {
     public categories = Category;
     public async create(categoryReq: ICategory) {
          const { name } = categoryReq;
          const category = await this.categories.findOne({ name });

          if (category) {
               throw new CategoryAlreadyExists();
          }

          await this.categories.create({
               ...categoryReq,
          });
          return;
     }
     public async list() {
          const categories = await this.categories.aggregate([
               {
                    $match: {},
               },
          ]);

          return {
               data: categories,
          };
     }
     public async update(categoryReq: ICategory, id: string) {
          const category = await this.categories.findById(id);

          if (!category) {
               throw new CategoryNotFound();
          }

          await this.categories.findOneAndUpdate(
               {
                    _id: category._id,
               },
               {
                    ...categoryReq,
               }
          );

          return;
     }

     public async remove(id: string) {
          const category = await this.categories.findById(id);
          if (!category) {
               throw new CategoryNotFound();
          }
          await this.categories.findByIdAndDelete(id);

          return;
     }
}
