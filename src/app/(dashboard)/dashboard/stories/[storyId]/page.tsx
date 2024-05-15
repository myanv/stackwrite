import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import { fetchRedis } from "@/helpers/redis"
import StoryFragments from "@/components/StoryFragments"
import WritingInput from "@/components/WritingInput"

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
    const session = await getServerSession(authOptions)

    if (!session) notFound()

    return (
        <>
            <div className="w-full">
                <div className="flex flex-col">
                    <h1>{story.title}</h1>
                    <h2>{story.description}</h2>
                    <h2>Authored by: {story.author}</h2>
                </div>

                <div className="h-2/3">
                    <StoryFragments initialFragments={story.fragments} sessionId={session.user.id} />
                </div>
                <div>
                    <WritingInput storyId={story.id} />
                </div>
            </div>
        </>
    )   
}

export default page