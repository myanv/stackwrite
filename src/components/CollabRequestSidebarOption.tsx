"use client"

import { User } from "lucide-react"
import Link from "next/link"
import { FC, useState } from "react"

interface CollabRequestSidebarOptionProps {}

const CollabRequestSidebarOption: FC<CollabRequestSidebarOptionProps> = ({}) => {
    
    
    return (
        <Link href='/dashboard/requests' className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
            <div className="text-gray-400 group-hover:text-indigo-600 h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium bg-white">
                <User className="h-4 w-4" />
            </div>
            <p className="truncate">Collab requests</p>
        </Link>
    )
}


export default CollabRequestSidebarOption