import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Dashboard from "./dashboard/page"

export default async function Home() {
    const session = await auth()

    if (!session) {
        redirect("/api/auth/signin")
    }

    return <Dashboard />
}
