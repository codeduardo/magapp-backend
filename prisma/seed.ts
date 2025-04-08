import { PrismaClient, UnitOfMeasure } from "@prisma/client";

const prisma = new PrismaClient();

async function seedUnitOfMeasures() {
  const unitOfMeasures = [
    { unit: "kg", description: "Kilogramos" },
    { unit: "g", description: "Gramos" },
    { unit: "l", description: "Litros" },
    { unit: "ml", description: "Mililitros" },
    { unit: "unidad", description: "Unidades individuales" },
    { unit: "docena", description: "Conjunto de 12 unidades" },
    { unit: "paquete", description: "Empaque estándar" },
    { unit: "caja", description: "Caja estándar" },
    { unit: "oz", description: "Onzas" },
    { unit: "lb", description: "Libras" },
  ];
  try {
    const results = await Promise.all(
      unitOfMeasures.map((uom: Omit<UnitOfMeasure, "id">) =>
        prisma.unitOfMeasure.upsert({
          where: { unit: uom.unit },
          update: {},
          create: {
            unit: uom.unit,
            description: uom.description,
          },
        })
      )
    );

    console.log(`✅ unitOfMeasures seeded`);
  } catch (error) {
    console.error("❌ Error in unitOfMeasures seed:", error);
    throw error;
  }
}

async function main() {
  try {
    await seedUnitOfMeasures();
    // Aquí podrías agregar más funciones de seed para otras entidades
  } catch (error) {
    console.error("Error en el proceso de seed:", error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
