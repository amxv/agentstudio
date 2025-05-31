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

	try {
		// For credentials providers, use signIn without redirect and handle redirect manually
		await signIn("guest")
		return NextResponse.redirect(new URL(redirectUrl, request.url))
	} catch (error) {
		console.error("Guest sign-in error:", error)
		return NextResponse.redirect(
			new URL("/login?error=Configuration", request.url)
		)
	}
}
