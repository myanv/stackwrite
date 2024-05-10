import { fetchRedis } from "./redis"

export const getStoriesByUserId = async (userId: string) => {
    // Retrieve all the stories this user has
    const storyIds = (await fetchRedis('smembers', `user:${userId}:stories`)) as string[]

    const stories = await Promise.all(
        storyIds.map(async (storyId) => {
            const story = await fetchRedis('get', `user:${storyId}`) as Story
            return story
        })
    )

    return stories
}