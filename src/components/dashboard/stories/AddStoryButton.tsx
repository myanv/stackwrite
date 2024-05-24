"use client"

import { FC, useState } from "react";
import Button from "@/components/ui/Button";
import { addStoryValidator } from "@/lib/validations/add";
import axios, { AxiosError } from "axios";
import z from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { Icons } from "@/components/Icons";

interface AddStoryButton {
    collaborators: CollaboratorInList[]
}

type FormData = z.infer<typeof addStoryValidator>

const AddStoryButton: FC<AddStoryButton> = ({
    collaborators
}) => {
    const [showSuccessState, setShowSuccessState] = useState<boolean>(false)
    const [isTyping, setIsTyping] = useState<boolean>(false)
    const [selectedCollaboratorName, setSelectedCollaboratorName] = useState<string>("Add an existing collaborator!")
    const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string>("")

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
        description: string,
        collaborator: string
    ) => {
        try {
            // Using Axios to send a POST request containing the validated email

            await axios.post('/api/stories/add', {
                title: title,
                description: description,
                collaborator: collaborator
            })

            setShowSuccessState(true)
        } catch (error) {
            console.log("zod")
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
        addStory(
            data.title,
            data.description,
            selectedCollaboratorId
        )
    }

    const handleChange = (input: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (input.target.value !== "") {
            setIsTyping(true)
        } else {
            setIsTyping(false)
        }
    }

    const handleClick = (id: string, collaboratorName: string) => {
        setSelectedCollaboratorName(collaboratorName)
        setSelectedCollaboratorId(id)
    }

    return (
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
                <label htmlFor="text" className="block text-md font-medium leading-6 text-gray-900">
                    Add a new story
                </label>

                <div className="mt-2 flex gap-4 mr-4">
                    <input 
                    {...register('title')}
                    onChange={(input) => { handleChange(input) }}
                    type="text" className="block outline-none w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-400 sm:text-sm sm:leading-6"
                    placeholder="Your story"
                    />
                    
                </div>
            
            <div className="flex flex-col gap-3 mt-4 mr-4">
                { isTyping ? (
                    <>
                        <label htmlFor="text" className="block text-md font-medium leading-6 text-gray-900">
                            Add a description for your story
                        </label>
                        <input
                        {...register('description')}
                        className="block outline-none w-full pl-2 h-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-400 sm:text-sm sm:leading-6"
                        placeholder="Description"
                        />

                
                        <Drawer>
                            <DrawerTrigger asChild>
                                <Button variant='default'>
                                    {selectedCollaboratorName === "Add an existing collaborator!" ? (
                                        <span>{selectedCollaboratorName}</span>
                                    ) : (
                                        <span>Selected collaborator: {selectedCollaboratorName}</span>
                                    )}
                                
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                                <div className="mx-auto w-full max-w-sm">
                                    <DrawerHeader>
                                        <DrawerTitle>Your collaborators</DrawerTitle>
                                        <DrawerDescription>Select your collaborators!</DrawerDescription>
                                    </DrawerHeader>
                                    <div className="p-4 pb-0">
                                        <div className="flex flex-col items-center justify-center">
                                            <ul className="mb-10">
                                                {collaborators.map((collab) => {
                                                    return (
                                                        <Button 
                                                            key={collab.id}
                                                            variant='ghost' 
                                                            className="w-full flex space-x-5 px-28"
                                                            onClick={() => handleClick(collab.id, collab.collaboratorName)}
                                                        >
                                                            <li>
                                                                {collab.collaboratorName}
                                                            </li>
                                                            <Icons.NotebookPen />
                                                        </Button>
                                                    )
                                                })}
                                            </ul>

                                        </div>
                                    </div>
                                </div>
                            </DrawerContent>
                        </Drawer>

                        <Button>Add</Button>
                    </>
                ) : null}
            </div>
            <p className="mt-1 text-sm text-red-600">{errors.title?.message}</p>
            { showSuccessState ? (
                    <p className="mt-1 text-sm text-zinc-200">New story created!</p>
                ) : null 
            }
        </form>
    )
}

export default AddStoryButton