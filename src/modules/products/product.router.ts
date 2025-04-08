import { ProductController } from "./product.controller";
import { BaseRouter } from "@/shared/router";

export class ProductRouter extends BaseRouter<ProductController> {
  constructor() {
    super(ProductController);
  }
  public routes() {
    this.router.get("/products", (req, res) =>
      this.controller.getProducts(req, res)
    );
    this.router.get("/product/:id", (req, res) =>
      this.controller.getProductById(req, res)
    );
    this.router.post("/product", (req, res) =>
      this.controller.createProduct(req, res)
    );
    this.router.put("/product/:id", (req, res) =>
      this.controller.updateProduct(req, res)
    );
    this.router.delete("/product/:id", (req, res) =>
      this.controller.deleteProduct(req, res)
    );
  }
}
