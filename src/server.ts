import { App } from "./app";
import { AuthController } from "./authentication/auth.controller";
import { OrderController } from "./orders/order.controller";
import { CategoryController } from "./product_categories/category.controller";
import { ProductController } from "./products/product.controller";
import { CartController } from "./user_carts/cart.controller";
import { UserController } from "./users/user.controller";

const port = process.env.PORT! || 8080;
const app = new App(
     [
          new AuthController(),
          new UserController(),
          new CategoryController(),
          new ProductController(),
          new CartController(),
          new OrderController(),
     ],
     Number(port)
);

app.listen();
