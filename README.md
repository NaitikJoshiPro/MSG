# MSG

Private 1:1 messaging app built with Next.js, Prisma, and Pusher.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your values:
   - `DATABASE_URL` — PostgreSQL connection string (use [Neon](https://neon.tech) for Vercel)
   - `NEXTAUTH_SECRET` — run `openssl rand -base64 32`
   - `NEXTAUTH_URL` — your deployment URL
   - Pusher credentials from [pusher.com](https://pusher.com)

3. Push the database schema:
   ```bash
   npx prisma db push
   ```

4. Seed users and conversation:
   ```bash
   npx prisma db seed
   ```

5. Run dev server:
   ```bash
   npm run dev
   ```

## Credentials

| User | Email | Password |
|------|-------|----------|
| Naitik | naitik@msg.com | Naitik@2024 |
| Anannya | anannya@msg.com | An@nnya0204 |

## Deploy on Vercel

1. Connect repo to Vercel
2. Add all environment variables from `.env.example`
3. Deploy

The build command runs `prisma generate` automatically via `postinstall`.
