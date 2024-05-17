import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth"
import { z } from "zod"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        // Get the title and the description - no need for validation since will be any string
        const {title: titleToAdd} = body.title
        const {description: descriptionToAdd} = body.description
        const {collaborator: collaboratorToAdd} = body.collaborator

        console.log(`user:email:${collaboratorToAdd}`)
        
        // Gets the collaborator's ID
        const idToAdd = await fetchRedis('get', `user:email:${collaboratorToAdd}`) as string

        console.log(idToAdd)

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
            return new Response('You cannot collaborate with yourself!', {
                status: 400,
            })
        }

        // Check if user is already a collaborator
        const isCollaborator = (await fetchRedis(
            'sismember', 
            `user:${session.user.id}:collabs`,
            idToAdd
        )) as 0 | 1

        if (isCollaborator) {

            // Generate a random story ID with UUID
            const storyId = nanoid()

            // Valid request, trigger pusher event and post to database
            await pusherServer.trigger(
                toPusherKey(`user:${session.user.id}:stories`), 
                'stories',
                    {
                        id: storyId,
                        title: body.title,
                        description: body.description,
                        author: session.user.id,
                        collaborator: idToAdd,
                    }
                )
            
            await pusherServer.trigger(
                toPusherKey(`user:${idToAdd}:stories`), 
                'stories',
                    {
                        id: storyId,
                        title: body.title,
                        description: body.description,
                        author: idToAdd,
                        collaborator: session.user.id,
                    }
                )

            // Two way story connection
            db.hset(`user:${session.user.id}:stories:${storyId}`, {
                id: storyId,
                title: body.title,
                description: body.description,
                author: session.user.id,
                collaborator: idToAdd,
                fragments: [],
            })
            db.hset(`user:${idToAdd}:stories:${storyId}`, {
                id: storyId,
                title: body.title,
                description: body.description,
                author: idToAdd,
                collaborator: session.user.id,
                fragments: [],
            })
            
            return new Response('OK')
        } else {
            return new Response('This person is not one of your collaborators!', { status: 401 })
        }

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload', { status: 422 })
        }

        return new Response('Invalid request', {status: 400})
    }
}