import { Schema, model } from "mongoose";
import { ICategory } from "./category.interface";

const schema = new Schema<ICategory>(
     {
          name: {
               type: String,
               required: true,
          },
          product_type: {
               type: String,
               required: true,
          },
     },
     { timestamps: true }
);

schema.index({ name: 1 }, { unique: true });

export const Category = model("categories", schema);

Category.syncIndexes();
