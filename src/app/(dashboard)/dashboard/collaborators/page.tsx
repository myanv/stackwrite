import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import CollaboratorList from "@/components/dashboard/collaborator/CollaboratorList"

const page = async () => {
    const session = await getServerSession(authOptions)

    if (!session) notFound()

    // Fetching a list of collaborator userIds from the DB
    const collaboratorIds = await (fetchRedis(
        'smembers',
        `user:${session.user.id}:collabs`
    )) as string[]

    const collaborators = (await Promise.all(
        collaboratorIds.map(async (id) => {
            const collaborator = (await fetchRedis(
                'get',
                `user:${id}`
            )) as string

            const collaboratorParsed = JSON.parse(collaborator) as User
            return {
                id,
                collaboratorName: collaboratorParsed.name,
                collaboratorEmail: collaboratorParsed.email,
                collaboratorImage: collaboratorParsed.image,
            }

        })
    ))

    return (
        <div>
            <CollaboratorList 
                collaborators={collaborators} 
                sessionId={session.user.id} 
            />
        </div>
    )
}

export default page