import { App } from "./app";
import { AuthController } from "./authentication/auth.controller";
import { CategoryController } from "./product_categories/category.controller";
import { ProductController } from "./products/product.controller";
import { UserController } from "./users/user.controller";
const port = process.env.PORT! || 8080;
const app = new App(
     [
          new AuthController(),
          new UserController(),
          new CategoryController(),
          new ProductController(),
     ],
     Number(port)
);

app.listen();
