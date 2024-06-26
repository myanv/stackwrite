import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import CollabRequests from "@/components/dashboard/collaborator/CollabRequests";

const page = async () => {
    const session = await getServerSession(authOptions)
    if (!session) notFound()

    // List of ids of people who sent current logged in user a collab request
    const incomingSenderId = (await fetchRedis(
        'smembers', 
        `user:${session.user.id}:incoming_collab_requests`
    )) as string[]

    // Awaits all incoming promises at the same time
    const incomingCollabRequests = await Promise.all(
        incomingSenderId.map(async (senderId) => {
            const sender = await fetchRedis('get', `user:${senderId}`) as string
            const senderParsed = JSON.parse(sender) as User
            return {
                senderId,
                senderName: senderParsed.name,
                senderEmail: senderParsed.email,
            }
        })
    )

    return (
        <main className="mt-8 ml-5">
            <h1 className="font-bold text-5xl mb-8 mt-8">Your incoming collaboration requests:</h1>
            <div className="flex flex-col gap-4">
                <CollabRequests 
                    incomingCollabRequests={incomingCollabRequests} 
                    sessionId={session.user.id}/>
            </div>
        </main>
    )
}

export default page