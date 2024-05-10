import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { addStoryValidator } from "@/lib/validations/add"
import { getServerSession } from "next-auth"


export async function POST(req: Request) {
    try{
        const body = await req.json()

        const {title: titleToAdd} = addStoryValidator.parse(body.title)

        // const idToAdd = await fetchRedis('get', `user:stories:${titleToAdd}`) as string

        // Finding out who's making the request from the session
        const session = await getServerSession(authOptions)

        // If there's no session, send an unauthorized response
        if (!session) {
            return new Response(`Unauthorized`, {status: 401})
        }

        db.sadd(`user:${session.user.id}:stories`, titleToAdd)
        return new Response('OK')

    } catch (error) {

    }
}