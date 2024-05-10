import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import { FC } from "react"
import { db } from "@/lib/db"
import { fetchRedis } from "@/helpers/redis"

interface StoryProps {
    params: {
        storyId: string
    }
}

async function getStory(storyId: string) {
    try {
        const results: string[] = await fetchRedis(
            'zrange',
            'story:${storyId}:fragments',
            0,
            -1
        )
        
        const dbStories = results.map((fragment) => JSON.parse(fragment) as StoryFragment)
    } catch (error) {
        notFound()
    }
}

const page = async ({ params }: StoryProps) => {
    const { storyId } = params
    const session = await getServerSession(authOptions)

    if (!session) notFound()

    const { user } = session 
    const [userId1, userId2] = storyId.split('--')
    
    if (user.id !== userId1 && user.id !== userId2) {
        notFound()
    }

    const collabPartnerId = user.id === userId1 ? userId2 : userId1
    const collabPartner = (await fetchRedis('get', `user:${collabPartnerId}`)) as User
    const initialMessages = await getStory

    return (
        <>
        </>
    )   
}

export default page