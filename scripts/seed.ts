const { PrismaClient } = require("@prisma/client")

const db = new PrismaClient()

async function main() {
  try {
    console.log("Attempting to connect")
    await db.category.createMany({
      data: [
        { name: "Famous People" },
        { name: "Anime" },
        { name: "Economist" },
        { name: "Business" },
        { name: "Musicians" },
        { name: "Software Engineer" },
        { name: "Hedge Fund" },
        { name: "Venture Capitalist" },
      ],
    })
    console.log("Connection went success")
  } catch (error) {
    console.error("Error seeding default categories", error)
  } finally {
    await db.$disconnect()
  }
}
