"use client"

import { UserButton } from "@clerk/nextjs";

const ProtectedPage = () => {
    return (
        <div>
            <h1>Protected Page</h1>
            <p>You are successfully signed in!</p>
            <UserButton afterSignOutUrl="/" />
        </div>
    )
}

export default ProtectedPage;
