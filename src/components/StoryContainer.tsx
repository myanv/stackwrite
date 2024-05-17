"use client";

import { FC, useState } from "react"
import StoryFragments from "./StoryFragments"
import WritingInput from "./WritingInput"

interface StoryContainerProps {
    initialFragments: StoryFragment[]
    storyPath: string
    currentUserId: string
}

const StoryContainer: FC<StoryContainerProps> = ({
    initialFragments,
    storyPath,
    currentUserId,
}) => {
    const [lastSenderId, setLastSenderId] = useState<string | null>(
        initialFragments.length > 0 ? initialFragments[0].senderId : null
    )

    const handleLastSenderIdUpdate = (updatedLastSenderId: string | null) => {
        setLastSenderId(updatedLastSenderId)
    }

    const storyId = storyPath.split('--')[0]

    return (
        <>
            <StoryFragments 
                    initialFragments={initialFragments} 
                    currentUserId={currentUserId} 
                    storyId={storyId}
                    onLastSenderIdUpdate={handleLastSenderIdUpdate}
            />
            <WritingInput 
                storyPath={storyPath} 
                lastSenderId={lastSenderId}
                currentUserId={currentUserId}
            />
        </>
    )

}

export default StoryContainer

    