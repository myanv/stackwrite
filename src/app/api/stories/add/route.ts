import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { v4 as uuidv4 } from 'uuid';
import { z } from "zod"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        // Get the title and the description - no need for validation since will be any string
        const {title: titleToAdd} = body.title
        const {description: descriptionToAdd} = body.description
        const {collaborator: collaboratorToAdd} = body.collaborator

        // Finding out who's making the request from the session
        const session = await getServerSession(authOptions)

        // If there's no session, send an unauthorized response
        if (!session) {
            return new Response(`Unauthorized`, {status: 401})
        }

        // Generate a random story ID with UUID
        const storyId = uuidv4();

        db.hset(`user:${session.user.id}:stories:${storyId}`, {
            id: storyId,
            title: body.title,
            description: body.description,
            author: session.user.name,
            collaborator: collaboratorToAdd,
            fragments: [],
        })
        
        return new Response('OK')

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload', { status: 422 })
        }

        return new Response('Invalid request', {status: 400})
    }
}