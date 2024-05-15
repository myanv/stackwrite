interface User {
    name: string
    email: string
    id: string
    image: string
}

interface Story {
    id: string
    title: string
    description: string
    author: string
    collaborator: string
    fragments: StoryFragment[]
}

interface StoryFragment {
    id: string
    senderId: string
    text: string
    timestamp: number
}

interface FriendRequest {
    id: string
    senderId: string
    receiverId: string
}