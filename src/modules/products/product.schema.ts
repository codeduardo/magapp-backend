import { z } from "zod";

// Esquema para la creación de Producto
export const createProductSchema = z.object({
  barcode: z.string().trim(),
  name: z
    .string()
    .trim()
    .transform((val) => val.toLowerCase()),
  brand: z
    .string()
    .trim()
    .transform((val) => val.toLowerCase()),
  packaging_type: z
    .string()
    .trim()
    .transform((val) => val.toLowerCase()),

  // Validamos capacity como un número
  capacity: z
    .union([
      z.number().positive(), // Si ya viene como número
      z
        .string()
        .trim()
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
          message: "La capacidad debe ser un número positivo",
        }),
    ])
    .transform((val) => Number(val)), // Transformamos a número

  unit: z.string().trim().toLowerCase(),

  // Seguimos manejando price como string para Prisma (Decimal)
  price: z
    .union([z.number(), z.string().trim()])
    .transform((val) => String(val))
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "El precio debe ser un número válido mayor o igual a cero",
    }),

  quantity_per_package: z.number().int().positive(),

  // Si el frontend no envía stockQuantity, se establece como 0
  stock_quantity: z.number().int().nonnegative().optional().default(0),

  // Limpiamos y convertimos a minúsculas cada categoría
  categories: z.array(
    z
      .string()
      .trim()
      .transform((val) => val.toLowerCase())
  ),
});

// Esquema para actualización de producto
export const updateProductSchema = z.object({
  product: z
    .object({
      barcode: z.string().trim().optional(),
      name: z
        .string()
        .trim()
        .transform((val) => val.toLowerCase())
        .optional(),
      brand: z
        .string()
        .trim()
        .transform((val) => val.toLowerCase())
        .optional(),
      packagingType: z
        .string()
        .trim()
        .transform((val) => val.toLowerCase())
        .optional(),

      // Actualizamos capacity a número también en el esquema de actualización
      capacity: z
        .union([
          z.number().positive(),
          z
            .string()
            .trim()
            .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
              message: "La capacidad debe ser un número positivo",
            }),
        ])
        .transform((val) => Number(val))
        .optional(),

      unitId: z.number().int().positive().optional(),
    })
    .optional(),

  variant: z
    .object({
      id: z.number().int().positive(),
      data: z.object({
        // Mantenemos price como string para Prisma
        price: z
          .union([z.number(), z.string().trim()])
          .transform((val) => String(val))
          .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
            message: "El precio debe ser un número válido mayor o igual a cero",
          })
          .optional(),

        quantityPerPackage: z.number().int().positive().optional(),
        stockQuantity: z.number().int().nonnegative().optional(),
      }),
    })
    .optional(),
});

// Tipos derivados de los esquemas (para usar en tus DTOs)
export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
