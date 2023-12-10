import { App } from "./app";
import { AuthController } from "./authentication/auth.controller";
import { UserController } from "./users/user.controller";
const port = process.env.PORT! || 8080;
const app = new App([new AuthController(), new UserController()], Number(port));

app.listen();
