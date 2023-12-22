cd admin-dashboard

git pull origin main

# server
cd server
pnpm dlx prisma generate
pnpm install
pnpm run build

# client 
cd ../client
pnpm install
pnpm run build
