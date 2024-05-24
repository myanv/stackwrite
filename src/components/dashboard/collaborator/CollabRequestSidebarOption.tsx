"use client"

import { pusherClient } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { User } from "lucide-react"
import Link from "next/link"
import { FC, useEffect, useState } from "react"

interface CollabRequestSidebarOptionProps {
    sessionId: string
    initialUnseenRequestCount: number
}

const CollabRequestSidebarOption: FC<CollabRequestSidebarOptionProps> = ({
    sessionId,
    initialUnseenRequestCount,
}) => {
    const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
        initialUnseenRequestCount
    )

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(
            `user:${sessionId}:incoming_collab_requests`
        ))
        

        const unseenCollabRequestHandler = () => {    
            setUnseenRequestCount((prev) => prev + 1)
        }

        // Whenever an event with incoming_collab_requests happens, bind to actual function on front-end
        pusherClient.bind('incoming_collab_requests', unseenCollabRequestHandler)
        
        return () => {
            pusherClient.unsubscribe(toPusherKey(
                `user:${sessionId}:incoming_collab_requests`
            ))
            pusherClient.unbind('incoming_collab_requests', unseenCollabRequestHandler)
        }
    }, [])

    return (
        <Link href='/dashboard/requests' className="text-gray-300 hover:text-zinc-200 hover:bg-slate-900 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
            <div className="text-gray-300 group-hover:text-zinc-200 h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium">
                <User className="pl-1 h-5 w-5" />
            </div>
            <p className="truncate">Collab requests</p>

            {unseenRequestCount > 0 ? (
                <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-zinc-600">
                    {unseenRequestCount}
                </div>
            ) : null}
        </Link>
    )
}


export default CollabRequestSidebarOption