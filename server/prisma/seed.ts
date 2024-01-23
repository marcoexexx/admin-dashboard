import bcrypt from 'bcryptjs'
import { PrismaClient, Role } from "@prisma/client"

const prisma = new PrismaClient()


async function getHashedPassword(password: string) {
  const hashedPassword = await bcrypt.hash(password, 12);
  return  hashedPassword
}


async function main() {
  const marco = await prisma.user.upsert({
    where: {
      email: "marco@admin.com"
    },
    create: {
      name: "Marco",
      username: "@marco",
      email: "marco@admin.com",
      password: await getHashedPassword("12345678@Abc"),
      verified: true,
      reward: {
        create: {
          points: 0,
        }
      },
      role: Role.Admin,
      image: "https://avatars.githubusercontent.com/u/103842280?s=400&u=9fe6bb21b1133980e96384942c66aca35bc9e06d&v=4",
    },
    update: {}
  })

  console.log("Created:", marco.username)

  const boo = await prisma.user.upsert({
    where: {
      email: "boo@shopowner.com"
    },
    create: {
      name: "Boo",
      username: "@boo",
      email: "boo@shopowner.com",
      password: await getHashedPassword("12345678@Abc"),
      verified: true,
      reward: {
        create: {
          points: 0,
        }
      },
      role: Role.Shopowner,
      image: "https://ca-times.brightspotcdn.com/dims4/default/b54bc8c/2147483647/strip/true/crop/6240x4160+0+0/resize/1200x800!/format/webp/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F87%2F81%2F24ca9c1948318fba6fd573e36f52%2Fbrd-106-04261-r-crop.jpg"
    },
    update: {}
  })

  console.log("Created:", boo.username)

  const bob = await prisma.user.upsert({
    where: {
      email: "bob@user.com",
    },
    create: {
      name: "Bob",
      username: "@bob",
      email: "bob@user.com",
      password: await getHashedPassword("12345678@Abc"),
      verified: true,
      reward: {
        create: {
          points: 0,
        }
      },
      role: Role.User,
      image: "https://resizing.flixster.com/vK77TbbXQYgkJ2HpvPp1p_W0tj4=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2FkNDZiMzU2LTFmYTQtNDgwMS1iOWM5LTgxNTg2NDMxNjBmNi53ZWJw",
    },
    update: {}
  })

  console.log("Created:", bob.username)
}


main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (err) => {
    console.log(err)
    await prisma.$disconnect()
    process.exit(1)
  })
