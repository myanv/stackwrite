"use client"
import { Icons } from "@/components/Icons"
import { useRouter } from "next/router"
import { FC, useState } from "react"

interface CollaboratorProps {
    collaborators: CollaboratorInList[]
    sessionId: string
}
const CollaboratorList: FC<CollaboratorProps> = ({
    collaborators,
    sessionId
}) => {
    
    // Placeholder for future functionalities within the collaborator list

    // const [collabs, setCollabs] = useState<CollaboratorInList[]>(collaborators)

    return (
        <div>
            {collaborators.length === 0 ? (
                <p className="ml-4 text-md text-zinc-900">You have no collaborators at this moment.</p>
            ) : (
                <div className="pt-8 ml-6">
                    <h1 className="font-bold text-5xl pt-8 mb-8">A list of your collaborators so far:</h1>
                    <ul className="ml-8 text-lg flex">
                        <Icons.PencilRuler />
                        {collaborators.map((collab) => {
                            return (
                                <li className="ml-4">{collab.collaboratorName}</li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default CollaboratorList