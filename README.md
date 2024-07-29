# StackWrite - a [Next.js](https://nextjs.org/) 14 pair story-writing project
### Overview
StackWrite aims to turn the process of recreational writing into a simple, two-person game - each person can only contribute a limited amount of words to a story in a turn, afterwhich they have to wait for the other author to finish writing their section. The overarching story is then updated in real-time and is available for viewing by both parties!

Some of the libraries used at first glance:
* [NextAuth.js](https://next-auth.js.org/) - for seamlessly implementing user authentication and signing in with Google
* [Zod](https://zod.dev/) - for response validation
* [Lucide](https://lucide.dev/) - for high-quality icons
* [Shadcn](https://ui.shadcn.com/) - for some styling components
   
...and various others. The styling was done with [Tailwind CSS](https://tailwindcss.com/) and the database being used here is [Redis](https://redis.io/).

## Web preview
![image](https://github.com/user-attachments/assets/af7a8ac4-5d3f-4226-9af1-0eb129795ee9)

## Mobile preview
![image](https://github.com/user-attachments/assets/bf305dfe-7e23-493f-b798-34939c2cd40b)


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
