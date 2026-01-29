import { SignIn } from "@clerk/nextjs";


export default function AuthPage() {
    return(
        <div className="min-h-screen w-full flex justify-center items-center">
            <SignIn />
        </div>
    )
}