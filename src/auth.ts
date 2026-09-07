import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"

export const { auth, handlers } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [GitHub],
    callbacks: {
        session({ session, user }) {
            session.user.id = user.id
            return session
        }
    }
})
