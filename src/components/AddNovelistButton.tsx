"use client"

import { FC, useState } from "react";
import Button from "./ui/Button";
import { addNovelistValidator } from "@/lib/validations/add";
import axios, { AxiosError } from "axios";
import z from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { error } from "console";

interface AddNovelistButton {}

type FormData = z.infer<typeof addNovelistValidator>

const AddNovelistButton: FC<AddNovelistButton> = ({}) => {
    const [showSuccessState, setShowSuccessState] = useState<boolean>(false)
    
    const { 
        register, 
        handleSubmit, 
        setError, 
        formState: {errors} 
    } = useForm<FormData>({
        resolver: zodResolver(addNovelistValidator)
    })


    const addNovelist = async (email: string) => {
        try {
            const validatedEmail = addNovelistValidator.parse({ email })

            // Using Axios to send a POST request containing the validated email
            await axios.post('/api/collaborators/add', {
                email: validatedEmail,
            })

            setShowSuccessState(true)
        } catch (error) {
            if (error instanceof z.ZodError) {
                setError('email', { message: error.message })
                return 
            }

            if (error instanceof AxiosError) {
                setError('email', { message: error.response?.data })
                return
            }

            setError('email', { message: 'Something went wrong.' })
        }
    }
    

    // On submit, receives an object of type FormData containing strictly an email
    const onSubmit = (data: FormData) => {
        addNovelist(data.email)
    }

    return <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Add a novelist by E-mail
        </label>

        <div className="mt-2 flex gap-4">
            <input 
            {...register('email')}
            type="text" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="you@example.com"
            />
            <Button>Add</Button>
        </div>
        <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
        { showSuccessState ? (
            <p className="mt-1 text-sm text-green-600">Friend request sent!</p>
        ) : null 
        }
    </form>
}

export default AddNovelistButton