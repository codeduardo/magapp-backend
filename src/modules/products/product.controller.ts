import { Request, Response } from "express";
import { ProductService } from "./services/product.service";
import { HttpResponse } from "../../shared/response/http.response";
export class ProductController {
  constructor(
    private readonly productService: ProductService = new ProductService()
  ) {}
  public getProducts = async (req: Request, res: Response) => {
    const products = await this.productService.getAllProducts();
    HttpResponse.Ok(res, products);
  };
  public getProductById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const product = await this.productService.getProductById(id);
    res.status(200).json(product);
  };
  public createProduct = async (req: Request, res: Response) => {
    const product = await this.productService.createProduct(req.body);
    res.status(201).json(product);
  };
  public updateProduct = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const product = await this.productService.updateProduct(id, req.body);
    res.status(200).json(product);
  };
  public deleteProduct = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const product = await this.productService.deleteProduct(id);
    res.status(200).json(product);
  };
}
