import Image from "next/image";
import Button from "@/components/ui/Button";
import { db } from "@/lib/db";

export default async function Home() {
  await db.set('hello', 'hello')
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-[20px]">
        
        <Button>Standard button UI</Button>
        <Button variant='ghost'>Ghost variant of the button UI</Button>
      </div>
    </main>
  );
}
