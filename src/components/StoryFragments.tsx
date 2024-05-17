"use client"

import { pusherClient } from "@/lib/pusher"
import { cn, toPusherKey } from "@/lib/utils"
import { FC, useEffect, useRef, useState } from "react"

interface StoryFragmentProps {
    initialFragments: StoryFragment[]
    currentUserId: string
    storyId: string
    onLastSenderIdUpdate: (lastSenderId: string | null) => void
}

const StoryFragments: FC<StoryFragmentProps> = ({
    initialFragments,
    currentUserId,
    storyId,
    onLastSenderIdUpdate
}) => {
    const [fragments, setFragments] = useState<StoryFragment[]>(initialFragments)

    const scrollDownRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(
            `stories:${storyId}:fragments`
        ))

        const fragmentRequestHandler = ({
            id,
            senderId,
            text,
            timestamp
        }: StoryFragment) => {    
            setFragments((prev) => [{
                id,
                senderId,
                text,
                timestamp
            }, ...prev])
            onLastSenderIdUpdate(senderId)
        }

        pusherClient.bind('incoming-fragment', fragmentRequestHandler)
        
        return () => {
            pusherClient.unsubscribe(toPusherKey(
                `stories:${storyId}:fragments`
            ))
            pusherClient.unbind('incoming-fragment', fragmentRequestHandler)
        }
    }, [storyId, onLastSenderIdUpdate])

    return (
        <div id='story-fragments' className="map-bg flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
            <div ref={scrollDownRef}/>

            {fragments.map((fragment, index) => {
                const isCurrentUser = fragment.senderId === currentUserId
                
                const hasNextMessageFromSameUser = 
                    fragments[index - 1]?.senderId === fragments[index].senderId
                
                
                return (
                    <div className="story-fragment" key={fragment.id}>
                        <div className={cn('flex items-end', {
                            'justify-end': isCurrentUser,
                        })}>
                            <div className={cn('flex flex-col space-y-2 text-base max-w-full mx-2', {
                                'order-1 items-center': isCurrentUser,
                                'order-2 items-start': !isCurrentUser
                            })}>
                                <span className={cn('px-4 py-2 rounded-lg inline-block', {
                                    'bg-slate-800 text-white': isCurrentUser,
                                    'bg-gray-200 text-gray-900': !isCurrentUser,
                                    
                                })}>
                                    {fragment.text}
                                </span>
                            </div>

                            
                        </div>
                        
                    </div>
                )
            })}
        </div>
    )
}

export default StoryFragments