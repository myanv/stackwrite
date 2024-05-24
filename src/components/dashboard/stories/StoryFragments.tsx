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
    const [storyText, setStoryText] = useState<string>(
        initialFragments.map((fragment) => fragment.text).reverse().join(" ")
    )

    console.log("Story text: " + storyText)

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
            setStoryText((prev) => prev + " " + text)
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
            <div className="bg-slate-800 mt-10 rounded-lg h-full overflow-y-scroll overflow-x-hidden" >
                {/* FREEFORM MODE (TBI)
                
                <ContentEditable
                    html={storyText}
                    onChange={handleTextChange}
                    tagName="div"
                    className="px-3 py-2 outline-none text-zinc-50"
                >
                    
                </ContentEditable>

                */}

                {/* CONSTRUCT MODE */}
                
                <div className="px-3 py-2">
                    {
                        fragments.map((fragment) => {
                            {
                                const isCurrentUser = fragment.senderId === currentUserId
                                const isNewline = fragment.text.includes("\n")
                                
                                return (
                                    <span key={fragment.id} className={cn('hover:bg-cyan-900 p-1 text-sm md:text-md', {
                                        'text-cyan-200': isCurrentUser,
                                        'text-zinc-200': !isCurrentUser,
                                        'block': isNewline,
                                    })}>
                                        {fragment.text.trim()}
                                    </span>
                                )
                            }
                        }).reverse()
                    }
                </div>
            </div>
        </div>
    )
}

export default StoryFragments