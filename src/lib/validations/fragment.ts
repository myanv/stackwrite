import { z } from "zod";

export const fragmentSchema = z.object({
    id: z.string(),
    senderId: z.string(),
    text: z.string(),
    order: z.number(),
})

export const fragmentArraySchema = z.array(fragmentSchema)

export type StoryFragment = z.infer<typeof fragmentSchema>