import serverless from "serverless-http";
import express, { Router } from "express";
import cors from "cors";
import { ProductRouter } from "./modules/products/product.router";
import { BaseConfig } from "./config/config";
import { UomRouter } from "./modules/uom/uom.router";

// Reutiliza el código pero sin iniciar el servidor
class LambdaServer extends BaseConfig {
  public app: express.Application = express();

  constructor() {
    super();
    this.setupMiddleware();
  }

  private setupMiddleware() {
    const corsOptions = {
      origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      maxAge: 86400,
    };
    this.app.use(cors(corsOptions));

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.setupRoutes();
  }

  private setupRoutes() {
    this.app.use("/api", this.privateRoutes());
  }

  privateRoutes(): Router[] {
    return [new ProductRouter().router, new UomRouter().router];
  }
}

// Crea la instancia y exporta el handler
const app = new LambdaServer().app;
export const handler = serverless(app);
