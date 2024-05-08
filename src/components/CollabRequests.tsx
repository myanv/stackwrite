"use client"

import { Check, UserPlus, X } from "lucide-react"
import { FC, useState } from "react"

interface CollabRequestsProps {
    incomingCollabRequests: IncomingCollabRequest[]
    sessionId: string
}

const CollabRequests: FC<CollabRequestsProps> = ({
    incomingCollabRequests,
    sessionId,
}) => {
    const [collabRequests, setCollabRequests] = useState<IncomingCollabRequest[]>(
        incomingCollabRequests
    )

    return <>
        {collabRequests.length === 0 ? (
            <p className="text-sm text-zinc-500">You have no incoming collab requests...</p>
        ) : (
            collabRequests.map((request) => (
                <div key={request.senderId} className="flex gap-4 items-center">
                    <UserPlus className="text-black" />
                    <p className="font-medium text-lg">{request.senderEmail}</p>
                    <button aria-label="Accept collaborator" className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md">
                        <Check className="font-semibold text-white w-3/4 h-3/4" />
                    </button>

                    <button aria-label="Deny collaborator" className="w-8 h-8 bg-blue-600 hover:bg-blue-700 grid place-items-center rounded-full transition hover:shadow-md">
                        <X className="font-semibold text-white w-3/4 h-3/4" />    
                    </button>
                </div>
            ))
        )}
    </>
}


export default CollabRequests