import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import { fetchRedis } from "@/helpers/redis"
import StoryFragments from "@/components/StoryFragments"
import WritingInput from "@/components/WritingInput"

interface StoryProps {
    storyPath: string
}

const page = async (storyPath: StoryProps) => {
    console.log(storyPath)
    return (
        <>
            </>
    )   
}

export default page