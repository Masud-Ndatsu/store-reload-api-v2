import express, { Express } from "express";
import { Controller } from "./interfaces/controller.interface";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import { errorMiddleware } from "./middlewares/error.middleware";

export class App {
     public app: Express;
     public port: number;

     constructor(controllers: Controller[], port: number) {
          this.app = express();
          this.port = port;
          this.connectToDatabase();
          this.initializeMiddleware();
          this.initializeControllers(controllers);
          this.initializeErrorHandler();
     }

     private initializeMiddleware() {
          this.app.use(cors());
          this.app.use(express.json());
          this.app.use(express.urlencoded({ extended: true }));
     }

     private initializeErrorHandler() {
          this.app.use(errorMiddleware);
     }
     private connectToDatabase() {
          try {
               mongoose.connect(process.env.MONGODB_URI!);
               const connection = mongoose.connection;

               connection.on("connected", () => {
                    console.log("Database connected!");
               });

               connection.on("error", (err: any) => {
                    console.log("error", err.message);
               });
          } catch (error) {
               console.log({
                    error,
               });
          }
     }

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
