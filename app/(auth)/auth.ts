import { DUMMY_PASSWORD } from "@/lib/constants"
import { createGuestUser, getUser } from "@/lib/db/queries"
import { compare } from "bcrypt-ts"
import NextAuth, { type DefaultSession } from "next-auth"
import type { DefaultJWT } from "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"

export type UserType = "guest" | "regular"

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string
			type: UserType
			name?: string | null
		} & DefaultSession["user"]
	}

	interface User {
		id?: string
		email?: string | null
		name?: string | null
		type: UserType
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		id: string
		type: UserType
		name?: string | null
	}
}

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut
} = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null
				const { email, password } = credentials as {
					email: string
					password: string
				}
				const users = await getUser(email)

				if (users.length === 0) {
					await compare(password, DUMMY_PASSWORD)
					return null
				}

				const [user] = users

				if (!user.password) {
					await compare(password, DUMMY_PASSWORD)
					return null
				}

				const passwordsMatch = await compare(password, user.password)

				if (!passwordsMatch) return null

				return { ...user, type: "regular" }
			}
		}),
		Credentials({
			id: "guest",
			credentials: {},
			async authorize() {
				const [guestUser] = await createGuestUser()
				return { ...guestUser, type: "guest" }
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id as string
				token.type = user.type
				token.name = user.name
			}

			return token
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id
				session.user.type = token.type
				session.user.name = token.name
			}

			return session
		}
	}
})
