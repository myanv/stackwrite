import Image from "next/image";
import Button from "@/components/ui/Button";
import { db } from "@/lib/db";

export default async function Home() {
  await db.set('hello', 'hello')
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-[20px]">
        
        <Button>
          <a href={'/login'}>
            Navigate to the login page
          </a>
        </Button>
        <Button variant='ghost'>About the project</Button>
      </div>
    </main>
  );
}
