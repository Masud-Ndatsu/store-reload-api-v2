import { HttpException } from "../exceptions";
import Product from "../products/product.model";
import { IOrder } from "./order.interface";
import { OrderModel } from "./order.model";

export class OrderService {
     private orders = OrderModel;
     private products = Product;
     public async create(orderReq: IOrder, userId: string) {
          const { products, price, reference, shipping_address } = orderReq;
          const orders = await this.products
               .find({ _id: { $in: products } })
               .lean();

          if (products.length === orders.length) {
               throw new HttpException(400, "Some products are not found");
          }
          for (let i = 0; i < products.length; i++) {
               if (
                    !orders
                         .map((product) => product._id.toString())
                         .includes(products[i].toString())
               ) {
                    throw new HttpException(
                         400,
                         "A product is missing from your orders " +
                              products[i].toString()
                    );
               }
          }
          const newOrder = await this.orders.create({
               ...orderReq,
               price,
               shipping_address,
               reference,
               user: userId,
          });

          return {
               data: newOrder,
          };
     }

     public async list() {
          const orders = await this.orders.aggregate([
               {
                    $match: {},
               },
          ]);
     }
}
