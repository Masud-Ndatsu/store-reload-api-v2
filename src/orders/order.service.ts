import { IOrder } from "./order.interface";
import { OrderModel } from "./order.model";
import userModel from "../users/user.model";
import { UserNotVerified } from "../exceptions";

export class OrderService {
     private orders = OrderModel;
     private users = userModel;
     public async create(orderReq: IOrder, userId: string) {
          const { products, price, reference, shipping_address } = orderReq;

          const user = await this.users.findById(userId);

          if (user && !user.verified) {
               throw new UserNotVerified();
          }
          const newOrder = await this.orders.create({
               products,
               price,
               shipping_address,
               reference,
               user: user?._id,
          });

          return {
               data: newOrder,
          };
     }

     public async list() {
          const orders = await this.orders.aggregate([
               {
                    $lookup: {
                         from: "carts",
                         localField: "products",
                         foreignField: "_id",
                         as: "products",
                         pipeline: [
                              {
                                   $lookup: {
                                        from: "products",
                                        localField: "product",
                                        foreignField: "_id",
                                        as: "product",
                                   },
                              },
                              {
                                   $project: {
                                        quantity: 1,
                                        product: {
                                             $arrayElemAt: ["$product", 0],
                                        },
                                   },
                              },
                         ],
                    },
               },

               {
                    $match: {},
               },
               {
                    $project: {
                         products: 1,
                         price: 1,
                         shipping_address: 1,
                         user: 1,
                    },
               },
          ]);

          return {
               data: orders,
          };
     }
     public getById = async (id: string) => {
          const order = await this.orders.aggregate([
               {
                    $lookup: {
                         from: "carts",
                         localField: "products",
                         foreignField: "_id",
                         as: "products",
                         pipeline: [
                              {
                                   $lookup: {
                                        from: "products",
                                        localField: "product",
                                        foreignField: "_id",
                                        as: "product",
                                   },
                              },
                              {
                                   $project: {
                                        quantity: 1,
                                        product: {
                                             $arrayElemAt: ["$product", 0],
                                        },
                                   },
                              },
                         ],
                    },
               },

               {
                    $match: {
                         // _id: id,
                    },
               },
               {
                    $project: {
                         products: 1,
                         price: 1,
                         shipping_address: 1,
                         user: 1,
                    },
               },
          ]);

          return {
               data: order,
          };
     };
}
