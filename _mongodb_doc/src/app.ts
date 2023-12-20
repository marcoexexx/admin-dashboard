import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
  // const bob = await prisma.user.create({
  //   data: {
  //     email: "a@a.com",
  //     name: "Bob"
  //   }
  // })

  // const post = await prisma.post.create({
  //   data: {
  //     title: "Bob's 1st post",
  //     authorId: bob.id
  //   }
  // })

  const bob = await prisma.user.findUnique({
    where: {
      id: "65825b38a6786efa994603fa"
    },
    include: {
      posts: true
    }
  })
  console.log(bob)
}


main().catch(async (err) => {
  console.error(err)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})
