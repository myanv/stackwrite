import AddStoryButton from "@/components/AddStoryButton";
import { FC } from "react";

const page: FC = () => {
    return (
        <main className="pt-8 pl-5">
            <h1 className="font-bold text-5xl mb-8">Want to add a new story?</h1>
            <AddStoryButton />
        </main>
    )
}

export default page