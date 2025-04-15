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
    return results;
  } catch (error) {
    console.error("❌ Error in unitOfMeasures seed:", error);
    throw error;
  }
}

// Esta es la función principal que exportaremos
export async function seed() {
  try {
    const results = await seedUnitOfMeasures();
    // Aquí podrías agregar más funciones de seed para otras entidades
    return results;
  } catch (error) {
    console.error("Error en el proceso de seed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Solo ejecuta la función si este archivo se ejecuta directamente
if (require.main === module) {
  seed().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

// Exporta la función para usarla en otros archivos
export default seed;
