"use client"

import { FC, useState } from "react";
import Button from "./ui/Button";
import { addStoryValidator } from "@/lib/validations/add";
import axios, { AxiosError } from "axios";
import z from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { error } from "console";

interface AddStoryButton {}

type FormData = z.infer<typeof addStoryValidator>

const AddStoryButton: FC<AddStoryButton> = ({}) => {
    const [showSuccessState, setShowSuccessState] = useState<boolean>(false)
    const [isTyping, setIsTyping] = useState<boolean>(false)

    const { 
        register, 
        handleSubmit, 
        setError, 
        formState: {errors} 
    } = useForm<FormData>({
        resolver: zodResolver(addStoryValidator)
    })


    const addStory = async (
        title: string,
    ) => {
        try {
            const validatedTitle = addStoryValidator.parse({ title })

            // Using Axios to send a POST request containing the validated email
            await axios.post('/api/stories/add', {
                title: validatedTitle,
            })

            setShowSuccessState(true)
        } catch (error) {
            if (error instanceof z.ZodError) {
                setError('title', { message: error.message })
                return 
            }

            if (error instanceof AxiosError) {
                setError('title', { message: error.response?.data })
                return
            }

            setError('title', { message: 'Something went wrong.' })
        }
    }
    

    // On submit, receives an object of type FormData as defined containing strictly an email
    const onSubmit = (data: FormData) => {
        addStory(data.title)
    }

    const handleChange = (input: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (input.target.value !== "") {
            setIsTyping(true)
        } else {
            setIsTyping(false)
        }
        
    }

    return (
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
                <label htmlFor="text" className="block text-sm font-medium leading-6 text-gray-900">
                    Add a new story
                </label>

                <div className="mt-2 flex gap-4">
                    <input 
                    {...register('title')}
                    onChange={(input) => { handleChange(input) }}
                    type="text" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Your story"
                    />
                    
                </div>
            
            <div className="flex flex-col gap-3 mt-4">
                { isTyping ? (
                    <>
                        <label htmlFor="text" className="block text-sm font-medium leading-6 text-gray-900">
                            Add a description for your story
                        </label>
                        <input
                        className="block w-full h-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Description"
                        />
                        <Button>Add</Button>
                    </>
                ) : null}
            </div>
            <p className="mt-1 text-sm text-red-600">{errors.title?.message}</p>
            { showSuccessState ? (
                    <p className="mt-1 text-sm text-green-600">New story created!</p>
                ) : null 
            }
        </form>
    )
}

export default AddStoryButton