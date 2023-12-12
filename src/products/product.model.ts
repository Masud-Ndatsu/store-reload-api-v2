import { Schema, model } from "mongoose";
import { IProduct } from "./product.interface";

const schema = new Schema<IProduct>({
     name: {
          type: String,
          required: true,
     },
     description: {
          type: String,
          required: true,
     },
     category: {
          type: String,
          required: true,
          ref: "categories",
     },
     type: {
          type: String,
          enum: ["general", "medical"],
          default: "general",
     },
     images: {
          type: [String],
     },
     price: {
          type: Number,
          default: 0,
          min: 0,
     },
     tags: {
          type: [String],
     },
     inventory: {
          type: Number,
          default: 0,
          min: 0,
     },
     manufacturer: {
          type: String,
     },
     ratings: {
          type: [
               {
                    user: String,
                    rating: {
                         type: Number,
                         min: 1,
                         max: 5,
                    },
                    review: String,
               },
          ],
     },
     featured: {
          type: Boolean,
          default: false,
     },
     is_active: {
          type: Boolean,
          default: true,
     },
     reviews: {
          type: [
               {
                    user: String,
                    review: String,
               },
          ],
     },
});

schema.index({ name: "text", description: "text" }, { unique: true });

const Product = model("products", schema);
Product.syncIndexes();

export default Product;
