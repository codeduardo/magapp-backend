import { ProductEntity } from "../products/product.entity";

export class UomEntity {
  name: string;
  description: string;
  products: ProductEntity[];
  constructor(data: UomEntity) {
    this.name = data.name;
    this.description = data.description;
    this.products = data.products;
  }
}
