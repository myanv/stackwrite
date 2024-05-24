import { z } from 'zod'

// Validates email response using Zod's built-in email validator function
export const addCollaboratorValidator = z.object({
    email: z.string().email()
})

export const addStoryValidator = z.object({
    title: z.string(),
    description: z.string()
})