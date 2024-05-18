import { FC } from "react";
import AddNovelistButton from "@/components/AddNovelistButton";

const page: FC = () => {
    return (
        <main className="pt-8 pl-5">
            <h1 className="font-bold text-5xl pt-8 mb-8">Want to add a novelist to collaborate with?</h1>
            <AddNovelistButton />
        </main>
    )
}

export default page