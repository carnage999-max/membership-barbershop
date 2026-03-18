const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Connecting...");
  try {
    const count = await prisma.location.count();
    console.log(`Connection successful. Found ${count} locations.`);
  } catch(e) {
    console.error("Connection failed:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
