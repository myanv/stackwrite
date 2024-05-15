import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"

export async function POST(req: Request) {
    try {
        const { text, storyId } = await req.json()
        const session = await getServerSession(authOptions)

        if (!session) return new Response('Unauthorized', {status: 401})
        
        const rawSender = (await fetchRedis('get', `user:${session.user.id}`)) as string
        const sender = JSON.parse(rawSender) as User

    } catch (error) {

    }
}