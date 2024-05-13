import { fetchRedis } from "./redis"

export const getStoriesByUserId = async (userId: string) => {
    // Retrieve all the stories this user has
    const storyKeys = (await fetchRedis('keys', `user:${userId}:stories:*`)) as string[]

    const stories = await Promise.all(
        storyKeys.map(async (storyKey) => {
            const storyDataArray = (await fetchRedis('hgetall', storyKey)) as string[];

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
        })
    )

    return stories
}