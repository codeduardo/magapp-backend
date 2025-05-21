import { prisma } from "@/data/postgres";
import { Product, ProductVariant } from "@prisma/client";
import { CreateProductDto } from "../product.schema";
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

  async updateProductWithVariant(
    productId: number,
    data: {
      product?: Partial<Product>;
      variant?: {
        id: number;
        data: Partial<Omit<ProductVariant, "id" | "productId">>;
      };
    }
  ) {
    try {
      return await prisma.$transaction(async (tx) => {
        let updatedProduct;
        let updatedVariant;

        // Actualizar el producto si se proporcionaron datos
        if (data.product && Object.keys(data.product).length > 0) {
          updatedProduct = await tx.product.update({
            where: { id: productId },
            data: data.product,
            include: {
              unitOfMeasure: true,
              productCategories: {
                include: {
                  category: true,
                },
              },
            },
          });
        } else {
          // Si no se actualizó, al menos obtener el producto actual
          updatedProduct = await tx.product.findUnique({
            where: { id: productId },
            include: {
              unitOfMeasure: true,
              productCategories: {
                include: {
                  category: true,
                },
              },
            },
          });
        }

        // Actualizar la variante si se proporcionaron datos
        if (
          data.variant &&
          data.variant.id &&
          Object.keys(data.variant.data).length > 0
        ) {
          updatedVariant = await tx.productVariant.update({
            where: {
              id: data.variant.id,
              productId: productId, // Asegurarse de que la variante pertenezca al producto
            },
            data: data.variant.data,
          });
        } else if (data.variant && data.variant.id) {
          // Si no hay datos para actualizar pero sí un ID, obtener la variante actual
          updatedVariant = await tx.productVariant.findUnique({
            where: { id: data.variant.id },
          });
        }

        // Devolver el resultado completo
        return {
          product: updatedProduct,
          variant: updatedVariant,
        };
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // Manejar errores específicos de Prisma
        if (error.code === "P2025") {
          throw {
            status: 404,
            message: "Producto o variante no encontrado",
            error: "NotFound",
          };
        }
        if (error.code === "P2002") {
          throw {
            status: 409,
            message: "Conflicto con datos existentes (clave única)",
            error: "UniqueConstraintViolation",
          };
        }
      }
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

  async searchProducts(
    searchTerm: string,
    page: number = 1,
    perPage: number = 20
  ) {
    try {
      // Aseguramos valores válidos para la paginación
      const currentPage = page < 1 ? 1 : page;
      const itemsPerPage = perPage < 1 ? 20 : perPage;
      const skip = (currentPage - 1) * itemsPerPage;

      // Consulta para obtener los productos
      const products = await prisma.product.findMany({
        where: {
          OR: [
            {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              brand: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              barcode: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          capacity: true,
          productVariants: {
            select: {
              id: true,
              price: true,
            },
          },
          unitOfMeasure: {
            select: {
              unit: true,
            },
          },
        },
        skip: skip,
        take: itemsPerPage,
      });

      // Consulta para obtener el conteo total (para metadata de paginación)
      const total = await prisma.product.count({
        where: {
          OR: [
            {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              brand: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              barcode: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          ],
        },
      });

      // Transformar los resultados como antes
      const items = products.map((product) => ({
        productId: product.id,
        name: product.name,
        weight: product.capacity,
        variantId: product.productVariants[0]?.id || null,
        price: product.productVariants[0]?.price || "0",
        unit: product.unitOfMeasure?.unit || "",
      }));

      // Devolver resultados con metadata de paginación
      return {
        items,
        pagination: {
          total,
          page: currentPage,
          perPage: itemsPerPage,
          totalPages: Math.ceil(total / itemsPerPage),
        },
      };
    } catch (error: any) {
      throw error;
    }
  }

  async searchProductVariants(searchTerm: string) {
    try {
      const variants = await prisma.productVariant.findMany({
        where: {
          product: {
            OR: [
              {
                name: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
              {
                barcode: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
        include: {
          product: {
            include: {
              unitOfMeasure: true,
              productCategories: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
        take: 20,
      });
      return variants;
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
        include: {
          productVariants: {
            select: {
              id: true,
              quantityPerPackage: true,
              price: true,
              stockQuantity: true,
            },
          },
          unitOfMeasure: true,
          productCategories: {
            include: {
              category: true,
            },
          },
        },
      });

      if (!product) {
        throw {
          status: 404,
          message: "Producto no encontrado",
          error: "NotFound",
        };
      }

      // Transformamos la respuesta para tener una estructura más limpia
      const categories = product.productCategories.map(
        (pc) => pc.category.name
      );

      // Tomamos la primera variante (asumiendo que esto es lo que necesitas)
      const variant = product.productVariants[0] || {};

      return {
        // Datos del producto
        id: product.id,
        barcode: product.barcode,
        name: product.name,
        brand: product.brand,
        packagingType: product.packagingType,
        capacity: product.capacity,

        // Datos de la variante
        price: variant.price || "0",
        quantityPerPackage: variant.quantityPerPackage || 1,
        stockQuantity: variant.stockQuantity || 0,

        // Unidad de medida
        unit: product.unitOfMeasure?.unit || "",

        // Lista de categorías (solo los nombres)
        categories: categories,
      };
    } catch (error: any) {
      throw error;
    }
  }
}
