"use client"

import { storyHrefConstructor } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { FC, useEffect, useState } from "react"

interface SidebarStoryListProps {
    stories: Story[]
}

const SidebarStoryList: FC<SidebarStoryListProps> = ({stories}) => { 

    return <ul role='list' className="max-h-[25rem] overflow-y-auto -mx-2 space-y-2 ml-1">
        {stories.map((story) => {
            return (
                <li key={story.id}>
                    <a href={`/dashboard/stories/${storyHrefConstructor(
                        story.id, 
                        story.author,
                        story.collaborator
                        )}`}>{story.title}</a>
                </li>)
        })}
    </ul>
}


export default SidebarStoryList