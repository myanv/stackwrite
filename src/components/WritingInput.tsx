"use client"

import { FC, useRef, useState } from "react"
import TextArea from 'react-textarea-autosize'
import Button from "./ui/Button"
import axios from "axios"
import toast from "react-hot-toast"

interface WritingInputProps {
    storyPath: string
    lastSenderId: string | null
    currentUserId: string
}

const WritingInput: FC<WritingInputProps> = ({ 
    storyPath,
    lastSenderId,
    currentUserId
}) => {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
    const [input, setInput] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    
    const isCurrentUserTurn = lastSenderId !== currentUserId

    const sendFragment = async () => {
        if (lastSenderId === currentUserId) {
            toast.error("Please wait for the other person to send their story fragment.")
            return
        }

        lastSenderId = currentUserId

        setIsLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            await axios.post('/api/story-fragment/send', {
                text: input,
                storyPath: storyPath,
            })

            // Clears text area after sending
            setInput("")
            

        } catch (error) {
            toast.error("Something went wrong. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }
    
    return (
        <div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:sb-0">
            <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2">
                <TextArea ref={textAreaRef} onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendFragment()
                    }
                }}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Start writing your story!"
                className="block w-full resize-none bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0"
                />

                <div 
                    onClick={() => textAreaRef.current?.focus()} 
                    className="py-2"
                    aria-hidden="true">
                    <div className="py-px">
                        <div className="h-9"></div>
                    </div>
                </div>
            </div>

            <div className="absolute right-0 bottom-0 flex justify-between py-2 ol-3 pr-2">
                <div className="flex-shrink-0">
                    <Button 
                        onClick={sendFragment} 
                        isLoading={isLoading} 
                        type="submit"
                        disabled={!isCurrentUserTurn}
                    >
                            Post
                    </Button>
                </div>
            </div>
        </div>
    )
}


export default WritingInput