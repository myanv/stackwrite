import { ClassValue } from "class-variance-authority/types";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

// Utility function for class variance

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function storyHrefConstructor(storyId: string, id1: string, id2: string) {
    const sortedIds = [id1, id2].sort()
    return `${storyId}--${sortedIds[0]}--${sortedIds[1]}}`
}