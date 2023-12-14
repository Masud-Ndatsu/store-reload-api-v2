import { captureRejectionSymbol } from "nodemailer/lib/xoauth2";
import { CartItemNotFound, ProductNotFound } from "../exceptions";
import Product from "../products/product.model";
import { ICart } from "./cart.interface";
import cartModel from "./cart.model";
import mongoose from "mongoose";

export class CartService {
     carts = cartModel;
     products = Product;
     public create = async (cartReq: ICart, userId: string): Promise<void> => {
          let { product: id, quantity } = cartReq;

          const _product = await this.products.findById(id).lean();

          if (!_product) {
               throw new ProductNotFound();
          }

          const item = await this.carts.findOne({ product: id });

          if (item) {
               item.quantity += quantity;
               await item.save();
               return;
          }

          await this.carts.create({
               product: id,
               quantity,
               user: userId,
          });

          return;
     };

     public list = async (userId: string): Promise<any> => {
          const carts = await this.carts.aggregate([
               {
                    $lookup: {
                         from: "products",
                         localField: "product",
                         foreignField: "_id",
                         as: "product",
                    },
               },
               {
                    $match: {
                         user: new mongoose.Types.ObjectId(userId),
                    },
               },

               {
                    $project: {
                         _id: 1,
                         quantity: 1,
                         product: { $arrayElemAt: ["$product", 0] },
                    },
               },
          ]);

          const items_id: string[] = carts.map((item) => item._id);
          const total_price = carts.reduce(
               (p, item) => p + item.product.price * item.quantity,
               0
          );

          return {
               data: {
                    items: carts,
                    items_id,
                    total_price,
               },
          };
     };

     public update = async (cartReq: ICart, userId: string) => {
          const { _id: id } = cartReq;
          const cart = await this.carts.findOne({
               _id: id,
               user: userId,
          });

          if (!cart) {
               throw new CartItemNotFound();
          }

          await this.carts.findOneAndUpdate(
               {
                    _id: id,
                    user: userId,
               },
               {
                    ...cartReq,
               }
          );
          return;
     };

     public remove = async (id: string) => {
          const cart = await this.carts.findById(id);

          if (!cart) {
               throw new CartItemNotFound();
          }

          await this.carts.findByIdAndDelete(id);
          return;
     };
}
