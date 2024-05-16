"use client"

import { cn } from "@/lib/utils"
import { error } from "console"
import { FC, useRef, useState } from "react"
import toast from "react-hot-toast"

interface StoryFragmentProps {
    initialFragments: StoryFragment[]
    sessionId: string
}

const StoryFragments: FC<StoryFragmentProps> = ({
    initialFragments,
    sessionId
}) => {
    const [fragments, setFragments] = useState<StoryFragment[]>(initialFragments)

    const scrollDownRef = useRef<HTMLDivElement | null>(null)
    
    return (
        <div id='story-fragments' className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
            <div ref={scrollDownRef}/>

            {fragments.map((fragment, index) => {
                const isCurrentUser = fragment.senderId === sessionId
                
                const hasNextMessageFromSameUser = 
                    fragments[index - 1]?.senderId === fragments[index].senderId
                
                
                return (
                    <div className="story-fragment" key={fragment.id}>
                        <div className={cn('flex items-end', {
                            'justify-end': isCurrentUser,
                        })}>
                            <div className={cn('flex flex-col space-y-2 text-base max-w-full mx-2', {
                                'order-1 items-end': isCurrentUser,
                                'order-2 items-start': !isCurrentUser
                            })}>
                                <span className={cn('px-4 py-2 rounded-lg inline-block', {
                                    'bg-indigo-600 text-white': isCurrentUser,
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