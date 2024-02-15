import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


async function main() {
  await prisma.auditLog.deleteMany({
  })
}


main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (err) => {
    console.log(err)
    await prisma.$disconnect()
    process.exit(1)
  })
