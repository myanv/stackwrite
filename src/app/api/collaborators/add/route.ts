import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { addNovelistValidator } from "@/lib/validations/add"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"
import {ZodError, z} from 'zod'
import { pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const {email: emailToAdd} = addNovelistValidator.parse(body.email)

        const idToAdd = await fetchRedis('get', `user:email:${emailToAdd}`) as string

        // Fetch data from the Upstash Redis DB, using REST token authorization in headers
        // If the ID to add doesn't exist
        if (!idToAdd) {
            return new Response(`This person does not exist.`, {status: 400})
        }

        // Finding out who's making the request from the session
        const session = await getServerSession(authOptions)

        // If there's no session, send an unauthorized response
        if (!session) {
            return new Response(`Unauthorized`, {status: 401})
        }

        // If the user is requesting themselves
        if (idToAdd === session.user.id) {
            return new Response('You cannot add yourself as a friend', {
                status: 400,
            })
        }

        // Checking if the user is already added
        const isAlreadyAdded = (await fetchRedis(
            'sismember', 
            `user:${idToAdd}:incoming_collab_requests`,
            session.user.id)) as 0 | 1

        if (isAlreadyAdded) {
            return new Response('Already added this collaborator!', {status: 400})
        }

        // Check if user is already a collaborator
        const isAlreadyCollaborator = (await fetchRedis(
            'sismember', 
            `user:${session.user.id}:collaborators`,
            idToAdd
        )) as 0 | 1

        if (isAlreadyAdded) {
            return new Response('Already added this collaborator!', {status: 400})
        }

        // Valid request, send collab request
        
        pusherServer.trigger(
            toPusherKey(`user:${idToAdd}:incoming_collab_requests`), 
            'incoming_collab_requests',
                {
                    senderId: session.user.id,
                    senderName: session.user.name,
                    senderEmail: session.user.email,
                }
            )

        db.sadd(`user:${idToAdd}:incoming_collab_requests`, session.user.id)

        return new Response('OK')
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload', { status: 422 })
        }

        return new Response('Invalid request', {status: 400})
    }
}