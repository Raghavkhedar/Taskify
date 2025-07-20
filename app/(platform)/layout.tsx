import { ClerkProvider } from "@clerk/nextjs"

const PLatformLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ClerkProvider>
            {children}
        </ClerkProvider>
    )
}

export default PLatformLayout;  

