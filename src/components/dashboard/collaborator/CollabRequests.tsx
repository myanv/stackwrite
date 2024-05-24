"use client"

import { Check, UserPlus, X } from "lucide-react"
import { FC, useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { pusherClient } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"

interface CollabRequestsProps {
    incomingCollabRequests: IncomingCollabRequest[]
    sessionId: string
}

const CollabRequests: FC<CollabRequestsProps> = ({
    incomingCollabRequests,
    sessionId,
}) => {
    const router = useRouter()

    const [collabRequests, setCollabRequests] = useState<IncomingCollabRequest[]>(
        incomingCollabRequests
    )

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(
            `user:${sessionId}:incoming_collab_requests`
        ))

        const collabRequestHandler = ({senderId, senderName, senderEmail}: IncomingCollabRequest) => {    
            setCollabRequests((prev) => [...prev, {
                senderId,
                senderName,
                senderEmail
            }])
        }

        // Whenever an event with incoming_collab_requests happens, bind to actual function on front-end
        pusherClient.bind('incoming_collab_requests', collabRequestHandler)
        
        return () => {
            pusherClient.unsubscribe(toPusherKey(
                `user:${sessionId}:incoming_collab_requests`
            ))
            pusherClient.unbind('incoming_collab_requests', collabRequestHandler)
        }
    }, [])

    const acceptCollab = async (senderId: string) => {
        await axios.post('/api/collaborators/accept', {
            id: senderId
        })

        setCollabRequests((prev) => 
            prev.filter((request) => request.senderId !== senderId)
        )

        // Refresh the router - removes the accepted person from the incoming req list
        router.refresh()
    }

    const denyCollab = async (senderId: string) => {
        await axios.post('/api/collaborators/deny', {
            id: senderId
        })

        setCollabRequests((prev) => 
            prev.filter((request) => request.senderId !== senderId)
        )

        // Refresh the router - removes the accepted person from the incoming req list
        router.refresh()
    }

    return <>
        {collabRequests.length === 0 ? (
            <p className="text-md text-zinc-900 ml-4">You have no incoming collab requests...</p>
        ) : (
            collabRequests.map((request) => (
                <div key={request.senderId} className="flex gap-4 items-center">
                    <UserPlus className="text-white" />
                    <p className="font-medium text-lg">{request.senderName}</p>
                    <p className="font-medium text-sm ml-10">{request.senderEmail}</p>
                    <button onClick={() => acceptCollab(request.senderId)} aria-label="Accept collaborator" className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md">
                        <Check className="font-semibold text-white w-3/4 h-3/4" />
                    </button>

                    <button onClick={() => denyCollab(request.senderId)} aria-label="Deny collaborator" className="w-8 h-8 bg-blue-600 hover:bg-blue-700 grid place-items-center rounded-full transition hover:shadow-md">
                        <X className="font-semibold text-white w-3/4 h-3/4" />    
                    </button>
                </div>
            ))
        )}
    </>
}


export default CollabRequests