"use client"

import { pusherClient } from "@/lib/pusher"
import { storyHrefConstructor, toPusherKey } from "@/lib/utils"
import { FC, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

interface SidebarStoryListProps {
    stories: Story[],
    sessionId: string
}

const SidebarStoryList: FC<SidebarStoryListProps> = ({
    stories,
    sessionId
}) => { 
    const [storyList, setStoryList] = useState<Story[]>(stories)

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(
            `user:${sessionId}:stories`
        ))

        const storyRequestHandler = ({
            id,
            title,
            description,
            author,
            collaborator
        }: Story) => {    
            setStoryList((prev) => [...prev, {
                id,
                title,
                description,
                author,
                collaborator
            }])
        }

        pusherClient.bind('stories', storyRequestHandler)
        
        return () => {
            pusherClient.unsubscribe(toPusherKey(
                `user:${sessionId}:stories`
            ))
            pusherClient.unbind('stories', storyRequestHandler)
        }
    }, [])

    return <ul role='list' className="max-h-[25rem] overflow-y-auto -mx-2 space-y-2 ml-1">
        {storyList.map((story) => {
            return (
                <li key={story.id}>
                    <a href={`/dashboard/stories/${storyHrefConstructor(
                        story.id, 
                        story.author,
                        story.collaborator
                        )}`}
                    >
                        <div className="w-full py-2 rounded-md">
                            <span className="truncate text-md text-zinc-300">{story.title}</span>
                            <span className="truncate block text-[0.9rem] text-zinc-400">{story.description}</span>
                            <Badge>In collaboration</Badge>
                        </div>
                    </a>
                </li>)
        })}
    </ul>
}


export default SidebarStoryList