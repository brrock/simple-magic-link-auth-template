# Basic magic link auth template
Powered by Prisma. Next.js and Resend
1. Set up env - copy .env.example to .env and fill you envs in. 
2. Install deps
```sh
bun i 
```
3. Push prisma schema
```sh
bunx prisma db push
```
4. Run in dev mode
```sh 
bun dev
# preview emails
bun email:dev
```