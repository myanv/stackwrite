import { Redis } from "@upstash/redis"

// Automatically loads environmental variables from .env
export const db = Redis.fromEnv()