import { ClassValue } from "class-variance-authority/types";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

// Utility function for class variance

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}