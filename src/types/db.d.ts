interface User {
    name: string
    email: string
    id: string
}

interface Story {
    id: string
    fragments: StoryFragment[]
    text: string
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