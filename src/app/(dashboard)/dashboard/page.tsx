import Button from "@/components/ui/Button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { FC } from "react";

const page = async ({}) => {
    
    const session = await getServerSession(authOptions)

    return (
        <div className="flex flex-col min-h-full py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="font-bold text-5xl pt-8 mb-8">Welcome!</h1>
            <p className="font-semibold text-lg mb-5">This is your dashboard. Begin writing stories with a collaborator or a friend by adding them via email!</p>
            <p className="font-semibold text-lg">Logging in via username will be implemented later.</p>
        </div>
    )
}

export default page