import { ProductController } from "./product.controller";
import { BaseRouter } from "@/shared/router";
import { createProductSchema } from "./product.schema";
import { validateSchema } from "@/shared/middleware/base";

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
    this.router.get("/search", (req, res) =>
      this.controller.searchProducts(req, res)
    );
    this.router.post(
      "/product",
      validateSchema(createProductSchema),
      (req, res) => this.controller.createProduct(req, res)
    );
    this.router.put("/product/:id", (req, res) =>
      this.controller.updateProductWithVariant(req, res)
    );
    this.router.delete("/product/:id", (req, res) =>
      this.controller.deleteProduct(req, res)
    );
  }
}
