interface User {
    name: string
    email: string
    id: string
}

interface Story {
    id: string
    title: string
    description: string
    author: string
    fragments: StoryFragment[]
}

interface StoryFragment {
    id: string
    senderId: string
    receiverId: string
    text: string
    order: number
}

interface FriendRequest {
    id: string
    senderId: string
    receiverId: string
}