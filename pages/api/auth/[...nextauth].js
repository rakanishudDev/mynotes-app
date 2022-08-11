import NextAuth from 'next-auth'
import GitHubProviders from 'next-auth/providers/github'
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '../../../lib/mongodb'


export const authOptions = {
    providers: [
        GitHubProviders({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    database: process.env.DB_URL,
    session: {
        strategy: "jwt",
    },
    secret: "dSiIhHFfrOiyf04Knfy5Cybc238Hbc093A",
    callbacks: {
        async signIn({user, account, profile, email, credentials}) {
            if (user) {
            }
            return true
        },
        async jwt({token, user}) {
            if (user) {
                token.id = user.id
                if (user.categories) {
                    token.categories = user.categories
                }
            }
            return token
        },
        async session({session, token}) {
            session.user.id = token.id
            if (token.categories) {
                session.user.categories = token.categories
            }
            return session
        }
    }
}

export default NextAuth(authOptions)