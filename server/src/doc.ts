import { db } from "./utils/db"

(async () => {
  await db.brand.findMany({
    where: {
      name: {
        ""
      }
    },
  })
})()
