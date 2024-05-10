import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import {z} from 'zod'
import { fetchRedis } from '@/helpers/redis'
import { db } from '@/lib/db'

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const {id: idToAdd} = z.object({ id: z.string() }).parse(body)

        const session = await getServerSession(authOptions)

        // If the user isn't logged in
        if (!session) {
            return new Response('Unauthorized', { status: 401 })
        }

        // Verify that the users are not already collaborators
        const isAlreadyCollaborator = await fetchRedis('sismember', 
            `user:${session.user.id}.collab`,
            idToAdd
        )

        if (isAlreadyCollaborator) {
            return new Response('Already collaborators!', { status: 400 })
        }

        const hasCollabRequests = await fetchRedis('sismember', `user:${session.user.id}:incoming_collab_requests`,
            idToAdd
        )

        if (!hasCollabRequests) {
            return new Response("No friend requests!", { status: 400 })
        }

        // Add a two-way connection between the two users on the DB
        await db.sadd(`user:${session.user.id}:collabs`, idToAdd)
        await db.sadd(`user:${idToAdd}:collabs`, session.user.id)

        // Removes the current user from the other user's friend requests list on the DB
        await db.srem(`user:${idToAdd}:incoming_collab_requests`, session.user.id)

        await db.srem(`user:${session.user.id}:incoming_collab_requests`, idToAdd)
        
        return new Response("OK")

    } catch (error) {

    }
}