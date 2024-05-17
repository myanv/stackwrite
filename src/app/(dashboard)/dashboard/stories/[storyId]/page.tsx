import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import { fetchRedis } from "@/helpers/redis"
import { db } from "@/lib/db"
import { fragmentArraySchema } from "@/lib/validations/fragment"
import Image from "next/image"
import StoryContainer from "@/components/StoryContainer"

interface StoryProps {
    params: {
        storyId: string
    }
}

async function getFragments(storyId: string) {
    try {
        const result: string[] = await fetchRedis(
            'zrange',
            `stories:${storyId}:fragments`,
            0,
            -1
        )

        const dbFragments = result.map((fragment) => JSON.parse(fragment) as StoryFragment)
        
        const reversedDbFragments = dbFragments.reverse()

        const fragments = fragmentArraySchema.parse(reversedDbFragments) 

        return fragments

    } catch (error) {
        notFound()
    }
}

const page = async ({ params }: StoryProps) => {
    const { storyId } = params

    const session = await getServerSession(authOptions)
    if (!session) notFound()

    const { user } = session

    // Notice that storyId isn't the actual story ID but the path ID
    const [storyUniqueId, userId1, userId2] = storyId.split('--')

    if (user.id !== userId1 && user.id !== userId2) {
        notFound()
    }

    const collaboratorId = user.id === userId1 ? userId2 : userId1
    const collaborator = (await db.get(`user:${collaboratorId}`)) as User
    const initialFragments = await getFragments(storyUniqueId)

    return (
        <>
            <div className="flex-1 justify-between flex flex-col h-full">
                

                {/*
                    * For real-time POST button rendering we need a client-side component to use UseState.
                    * Hence use a StoryContainer wrapper instead of two seaparate client-side components as before
                */}

                <StoryContainer
                    initialFragments={initialFragments}
                    storyPath={storyId}
                    currentUserId={session.user.id} 
                />
            </div>
        </>
    )   
}

export default page