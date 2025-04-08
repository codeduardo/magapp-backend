import { prisma } from "@/data/postgres";
import { Product } from "@prisma/client";
import { CreateProductDto } from "../product.dto";
import { UomService } from "@/modules/uom/services/uom.service";

export class ProductService {
  constructor(private readonly uomService: UomService = new UomService()) {}

  async createProduct(data: CreateProductDto) {
    const {
      barcode,
      name,
      brand,
      packaging_type,
      capacity,
      unit,
      categories,
      quantity_per_package,
    } = data;
    return await prisma.$transaction(async (tx) => {
      const uom = await this.uomService.findOrCreateUom(unit);

      const product = await tx.product.create({
        data: {
          barcode,
          name,
          brand,
          packagingType: packaging_type,
          capacity,
          unitId: uom.id,
          productVariants: {
            create: {
              quantityPerPackage: quantity_per_package,
            },
          },
          productCategories: {
            create: categories.map((categoryName) => ({
              category: {
                connectOrCreate: {
                  where: { name: categoryName },
                  create: { name: categoryName },
                },
              },
            })),
          },
        },
        include: {
          productCategories: true,
          productVariants: true,
        },
      });
      return product;
    });
  }

  async updateProduct(id: number, data: Product) {
    const product = await prisma.product.update({
      where: { id },
      data,
    });
  }
  async deleteProduct(id: number) {
    const product = await prisma.product.delete({
      where: { id },
    });
  }
  async getProduct(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
    });
  }
  async   getAllProducts() {
    const products = await prisma.product.findMany();
    return products;
  }

  async getProductById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
    });
  }
}
