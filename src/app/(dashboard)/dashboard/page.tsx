import Button from "@/components/ui/Button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { FC } from "react";

const page = async ({}) => {
    
    const session = await getServerSession(authOptions)

    // <pre>{JSON.stringify(session)}</pre> to see the JSON string

    return 
}

export default page