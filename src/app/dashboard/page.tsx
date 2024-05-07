'use client' // convert from server -> client component for interactivity

import Button from "@/components/ui/Button";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
    return <Button>hello</Button>
}

export default page