import express, { Express } from "express";
import { Controller } from "./interfaces/controller.interface";

export class App {
     public app: Express;
     public port: number;

     constructor(controllers: Controller[], port: number) {
          this.app = express();
          this.port = port;
          this.initializeMiddleware();
          this.initializeControllers(controllers);
     }

     private initializeMiddleware() {
          this.app.use(express.json());
          this.app.use(express.urlencoded({ extended: true }));
     }

     private initializeErrorHandler() {}

     private initializeControllers(controllers: Controller[]) {
          controllers.forEach((controller) => {
               this.app.use("/api", controller.router);
          });
     }

     public listen() {
          this.app.listen(this.port, () => {
               console.log(`App listening on ${this.port}`);
          });
     }
}
