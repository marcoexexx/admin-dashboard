import bcrypt from 'bcryptjs'
import { OperationAction, PrismaClient, Resource } from "@prisma/client"

const prisma = new PrismaClient()


async function getHashedPassword(password: string) {
  const hashedPassword = await bcrypt.hash(password, 12);
  return  hashedPassword
}


async function rolesSeed() {
  const customerRole = await prisma.role.upsert({
    where: {
      name: "Customer"
    },
    create: {
      name: "Customer",
      remark: "Build-in role",
      permissions: {
        createMany: {
          data: [
            // Products
            {
              resource: Resource.Product,
              action: OperationAction.Read
            },

            // AccessLog

            // AuditLog

            // User

            // Brand
            {
              resource: Resource.Brand,
              action: OperationAction.Read
            },

            // Category
            {
              resource: Resource.Category,
              action: OperationAction.Read
            },

            // Coupon

            // Exchange

            // Order
            {
              resource: Resource.Order,
              action: OperationAction.Read
            },
            {
              resource: Resource.Order,
              action: OperationAction.Create
            },

            // PickupAddress
            {
              resource: Resource.Order,
              action: OperationAction.Read
            },
            {
              resource: Resource.Order,
              action: OperationAction.Create
            },

            // PotentialOrder
            {
              resource: Resource.PotentialOrder,
              action: OperationAction.Read
            },
            {
              resource: Resource.PotentialOrder,
              action: OperationAction.Create
            },

            // Region
            {
              resource: Resource.Region,
              action: OperationAction.Read
            },

            // SalesCategory
            {
              resource: Resource.SalesCategory,
              action: OperationAction.Read
            },

            // Township
            {
              resource: Resource.Township,
              action: OperationAction.Read
            },

            // UserAddress
          ]
        }
      }
    },
    update: {}
  })

  console.log(`Created: ${customerRole.name}`)
}


async function brandsSeed() {
  const samsung = await prisma.brand.upsert({
    where: {
      name: "Samsung",
    },
    create: {
      name: "Samsung",
    },
    update: {}
  })

  console.log(`Created: ${samsung.name}`)
}

async function shopownersSeed() {
  const rangoonDiscountShopowner = await prisma.shopownerProvider.upsert({
    where: {
      name: "Rangoon discount",
    },
    create: {
      name: "Rangoon discount",
      remark: "Build-in shopowner"
    },
    update: {}
  })

  console.log(`Created: ${rangoonDiscountShopowner.name}`)
}


async function usersSeed() {
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
      image: "https://avatars.githubusercontent.com/u/103842280?s=400&u=9fe6bb21b1133980e96384942c66aca35bc9e06d&v=4",
      isSuperuser: true,
    },
    update: {}
  })

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
      role: {
        connect: {
          name: "Customer"
        }
      },
      shopownerProvider: {
        connect: {
          name: "Rangoon discount",
        }
      },
      image: "https://ca-times.brightspotcdn.com/dims4/default/b54bc8c/2147483647/strip/true/crop/6240x4160+0+0/resize/1200x800!/format/webp/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F87%2F81%2F24ca9c1948318fba6fd573e36f52%2Fbrd-106-04261-r-crop.jpg"
    },
    update: {}
  })

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
      role: {
        connect: {
          name: "Customer"
        }
      },
      image: "https://resizing.flixster.com/vK77TbbXQYgkJ2HpvPp1p_W0tj4=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2FkNDZiMzU2LTFmYTQtNDgwMS1iOWM5LTgxNTg2NDMxNjBmNi53ZWJw",
    },
    update: {}
  })

  console.log(`Created: ${marco.name}`)
  console.log(`Created: ${boo.name}`)
  console.log(`Created: ${bob.name}`)
}


async function main() {
  // await rolesSeed()
  // await shopownersSeed()
  // await usersSeed()

  await brandsSeed()
}


main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (err) => {
    console.log(err)
    await prisma.$disconnect()
    process.exit(1)
  })
