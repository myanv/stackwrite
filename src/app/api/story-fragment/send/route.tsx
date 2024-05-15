import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { StoryFragment, fragmentSchema } from "@/lib/validations/fragment"
import { getServerSession } from "next-auth"
import { nanoid } from 'nanoid'

export async function POST(req: Request) {
    try {
        const { text, storyPath }: {text:string, storyPath: string} = await req.json()
        const session = await getServerSession(authOptions)
        
        if (!session) return new Response('Unauthorized', {status: 401})
        
        const [storyId, userId1, userId2] = storyPath.split('--')
        
        if (session.user.id !== userId1 && session.user.id !== userId2) {
            return new Response('Unauthorized', {status: 401})
        }

        const collaboratorId = session.user.id === userId1 ? userId2 : userId1
        const collaboratorList = await fetchRedis('smembers', `user:${session.user.id}:collabs`) as string[]
        const isCollaborator = collaboratorList.includes(collaboratorId)

        if (!isCollaborator) {
            return new Response('Unauthorized', {status: 401})
        }
        
        
        // Get as raw JSON string, then parse
        const rawSender = (await fetchRedis('get', `user:${session.user.id}`)) as string
        const sender = JSON.parse(rawSender) as User

        const timestamp = Date.now()
        const fragmentData: StoryFragment = {
            id: nanoid(),
            senderId: session.user.id,
            text: text,
            timestamp: timestamp,
        }

        const fragment = fragmentSchema.parse(fragmentData)

        // All valid, send the story fragment
        await db.zadd(`stories:${storyId}:fragments`, {
            score: timestamp,
            member: JSON.stringify(fragment)
        })

        return new Response('OK')
    } catch (error) {
        if (error instanceof Error) {
            return new Response(error.message, {status: 500})
        }

        return new Response('Internal Server Error', {status: 500})
    }
}