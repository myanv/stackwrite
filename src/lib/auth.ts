import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import { fetchRedis } from "@/helpers/redis";

function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || clientId.length === 0) {
        throw new Error(`Missing GOOGLE_CLIENT_ID`)
    }
    if (!clientSecret || clientSecret.length === 0) {
        throw new Error(`Missing GOOGLE_CLIENT_SECRET`)
    }
    return { clientId, clientSecret }
}

function getGithubCredentials() {
    const clientId = process.env.GITHUB_CLIENT_ID
    const clientSecret = process.env.GITHUB_CLIENT_SECRET

    if (!clientId || clientId.length === 0) {
        throw new Error(`Missing GITHUB_CLIENT_ID`)
    }
    if (!clientSecret || clientSecret.length === 0) {
        throw new Error(`Missing GITHUB_CLIENT_SECRET`)
    }
    return { clientId, clientSecret }
} 

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),

    // Don't handle the session on the database
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/login'
    },
    providers: [
        GoogleProvider({ 
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret,
        }),
        // Other providers here
        GithubProvider({
            clientId: getGithubCredentials().clientId,
            clientSecret: getGithubCredentials().clientSecret,
        })
        
    ],
    callbacks: {
        async jwt ({ token, user }) {
            // token.id automatically generated by the Upstash adapter
            const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as string | null
            
            if (!dbUserResult) {
                token.id = user!.id
                return token
            }
            
            const dbUser = JSON.parse(dbUserResult) as User

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
            }
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
            }

            return session
        },
        redirect() {
            // Redirects to the dashboard once OAuth is successful
            return '/dashboard'
        }
    }
}