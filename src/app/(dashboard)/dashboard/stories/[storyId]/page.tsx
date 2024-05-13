import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import { FC } from "react"
import { db } from "@/lib/db"
import { fetchRedis } from "@/helpers/redis"
import { fragmentArraySchema } from "@/lib/validations/fragment"

interface StoryProps {
    params: {
        storyId: string
    }
}

async function getStory(storyId: string) {
    const session = await getServerSession(authOptions)

    if (!session) notFound()

    try {
        const storyDataArray = (await fetchRedis('hgetall', `user:${session.user.id}:stories:${storyId}`));

        const storyData: { [key: string]: string } = {};
        for (let i = 0; i < storyDataArray.length; i += 2) {
            const key = storyDataArray[i];
            const value = storyDataArray[i + 1];
            storyData[key] = value;
        }

        const story: Story = {
            id: storyData.id,
            title: storyData.title,
            author: storyData.author,
            description: storyData.description,
            fragments: JSON.parse(storyData.fragments) as StoryFragment[],
        }

        return story
    } catch (error) {
        console.log("did an oopsie")
    }
}

const page = async ({ params }: StoryProps) => {
    const { storyId } = params
    
    const story = await getStory(storyId);
    if (!story) {
        notFound()
    }   

    return (
        <>
            <div className="flex flex-col">
                <h1>{story.title}</h1>
                <h2>{story.description}</h2>
                <h2>Authored by: {story.author}</h2>
            </div>
        </>
    )   
}

export default page