import { FC } from "react";
import AddCollaboratorButton from "@/components/dashboard/collaborator/AddCollaboratorButton";

const page: FC = () => {
    return (
        <main className="pt-8 pl-5">
            <h1 className="font-bold text-5xl pt-8 mb-8">Want to add a novelist to collaborate with?</h1>
            <AddCollaboratorButton />
        </main>
    )
}

export default page