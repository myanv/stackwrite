import { FC } from "react";
import AddStoryButton from "@/components/dashboard/stories/AddStoryButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { fetchRedis } from "@/helpers/redis";

const page: FC = async () => {
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
        <main className="pt-8 pl-5">
            <h1 className="font-bold text-5xl pt-8 mb-8">Want to add a new story?</h1>
            <AddStoryButton collaborators={collaborators}/>
        </main>
    )
}

export default page