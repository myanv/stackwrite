import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import { fetchRedis } from "@/helpers/redis"
import StoryFragments from "@/components/StoryFragments"
import WritingInput from "@/components/WritingInput"
import { db } from "@/lib/db"
import { fragmentArraySchema } from "@/lib/validations/fragment"
import Image from "next/image"
interface StoryProps {
    params: {
        storyId: string
    }
}

async function getFragments(storyId: string) {
    try {
        console.log("STORY ID : " + storyId)
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

    console.log("PATH ID: " + storyId)

    const collaboratorId = user.id === userId1 ? userId2 : userId1
    const collaborator = (await db.get(`user:${collaboratorId}`)) as User
    const initialFragments = await getFragments(storyUniqueId)
    return (
        <>
            <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
                <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
                    <div className="relative flex items-center space-x-4">
                        <div className="relative">
                            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
                                <Image 
                                    fill
                                    referrerPolicy="no-referrer"
                                    src={collaborator.image}
                                    alt={`${collaborator.name} profile picture`}
                                    className="rounded-full"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col leading-tight">
                            <div className="text-xl flex items-center">
                                <span className="text-gray-700 mr-3 font-semibold">{collaborator.name}</span>
                            </div>

                            <span className="text-sm text-gray-600">{collaborator.email}</span>
                        </div>
                    </div>
                </div>

                <StoryFragments initialFragments={initialFragments} sessionId={session.user.id}/>
                <WritingInput storyId={storyId}/>
            </div>
        </>
    )   
}

export default page