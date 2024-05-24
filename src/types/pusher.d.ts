interface IncomingCollabRequest {
    senderId: string
    senderName: string
    senderEmail: string | null | undefined
}

interface CollaboratorInList {
    id: string
    collaboratorName: string
    collaboratorEmail: string | null | undefined
    collaboratorImage: string
}