# Admin Dashboard

## Overview
Admin Dashboard is a full-stack application utilizing the SERN stack (SQL, Express, React, Node) with TypeScript for a robust and type-safe development experience.

## Features
- **Database:** PostgreSQL with Prisma for efficient data management.
- **Server:** Express in TypeScript for a robust backend.
- **Client:** React in TypeScript for a dynamic and responsive frontend.
- **UI:** Utilizes Material-UI Dashboard for a professional look and fully customizable UI.
- **Components:** Charts, tables, and a custom UI to enhance user experience.
- **Data Management:** React Query for efficient data fetching and management.
- **Forms:** Uses `react-hook-form` and Zod for form validation ensuring data integrity.
- **Authentication:** JWT and Google OAuth for secure user authentication.
- **Authorization:** Implements role-based access control system for better security.
- **Middleware:** Custom middleware for rate limiting with Redis and development-only logging.
- **Type Safety:** Entire codebase is written in TypeScript, ensuring type-safe operations.

## Getting Started
### Server
```sh
cd server/
make start
pnpm dlx prisma migrate dev --name init
pnpm run start
```

### Client
```sh
cd client
pnpm run dev
```

## Repository
Find the project on [GitHub](https://github.com/alk-neq-me/rangoon-admin-dashboard) for further details and contributions.
