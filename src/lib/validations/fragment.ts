import { timeStamp } from "console";
import { z } from "zod";

export const fragmentSchema = z.object({
    id: z.string(),
    senderId: z.string(),
    text: z.string().max(2000),
    timestamp: z.number(),
})

export const fragmentArraySchema = z.array(fragmentSchema)

export type StoryFragment = z.infer<typeof fragmentSchema>