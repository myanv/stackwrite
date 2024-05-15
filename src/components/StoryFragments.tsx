"use client"

import { FC, useRef, useState } from "react"

interface StoryFragmentProps {
    initialFragments: StoryFragment[],
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

                return (
                    <div className="story-fragment" key={fragment.id}>
                        {fragment.text}
                    </div>
                )
            })}
        </div>
    )
}

export default StoryFragments