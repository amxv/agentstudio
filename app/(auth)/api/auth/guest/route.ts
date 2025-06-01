import { signIn } from "@/app/(auth)/auth"
import { isDevelopmentEnvironment } from "@/lib/constants"
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const redirectUrl = searchParams.get("redirectUrl") || "/"

	const token = await getToken({
		req: request,
		secret: process.env.AUTH_SECRET,
		secureCookie: !isDevelopmentEnvironment
	})

	if (token) {
		return NextResponse.redirect(new URL("/", request.url))
	}

	// Redirect to login instead of creating guest sessions
	// since the site now only works for logged in users
	return NextResponse.redirect(new URL("/login", request.url))
}
