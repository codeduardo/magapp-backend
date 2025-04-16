import { prisma } from "@/data/postgres";
import { Product } from "@prisma/client";
import { CreateProductDto } from "../product.dto";
import { UomService } from "@/modules/uom/services/uom.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class ProductService {
  constructor(private readonly uomService: UomService = new UomService()) {}

  async createProduct(data: CreateProductDto) {
    try {
      const {
        barcode,
        name,
        brand,
        packaging_type,
        capacity,
        unit,
        price,
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
                price,
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
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw {
          status: 409,
          message: `Ya existe un producto con el mismo barcode`,
          error: "UniqueConstraintViolation",
        };
      }
      throw error;
    }
  }

  async updateProduct(id: number, data: Product) {
    try {
      const product = await prisma.product.update({
        where: { id },
        data,
      });
      return product;
    } catch (error: any) {
      throw error;
    }
  }
  async deleteProduct(id: number) {
    try {
      const product = await prisma.product.delete({
        where: { id },
      });
      return product;
    } catch (error: any) {
      throw error;
    }
  }
  async getProduct(id: number) {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
      });
      return product;
    } catch (error: any) {
      throw error;
    }
  }
  async getAllProducts() {
    try {
      const products = await prisma.product.findMany();
      return products;
    } catch (error: any) {
      throw error;
    }
  }

  async getProductById(id: number) {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
      });
      return product;
    } catch (error: any) {
      throw error;
    }
  }
}
