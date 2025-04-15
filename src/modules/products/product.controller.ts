import { Request, Response } from "express";
import { ProductService } from "./services/product.service";
import { HttpResponse } from "@/shared/response/http.response";

export class ProductController {
  constructor(
    private readonly productService: ProductService = new ProductService()
  ) {}
  public getProducts = async (req: Request, res: Response) => {
    try {
      const products = await this.productService.getAllProducts();
      HttpResponse.Ok(res, products);
    } catch (error: any) {
      HttpResponse.BadRequest(res, error);
    }
  };
  public getProductById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      const product = await this.productService.getProductById(id);
      HttpResponse.Ok(res, product);
    } catch (error: any) {
      HttpResponse.BadRequest(res, error);
    }
  };
  public createProduct = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.createProduct(req.body);
      HttpResponse.Ok(res, product);
    } catch (error: any) {
      HttpResponse.BadRequest(res, error);
    }
  };
  public updateProduct = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      const product = await this.productService.updateProduct(id, req.body);
      HttpResponse.Ok(res, product);
    } catch (error: any) {
      HttpResponse.BadRequest(res, error);
    }
  };
  public deleteProduct = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      const product = await this.productService.deleteProduct(id);
      HttpResponse.Ok(res, product);
    } catch (error: any) {
      HttpResponse.BadRequest(res, error);
    }
  };
}
