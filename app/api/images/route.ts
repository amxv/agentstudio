import { auth } from "@/app/(auth)/auth"
import { getUserImages } from "@/lib/actions/generate"
import { NextResponse } from "next/server"

export async function GET() {
	try {
		const session = await auth()

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const images = await getUserImages()
		return NextResponse.json(images)
	} catch (error) {
		console.error("API /images error:", error)
		return NextResponse.json(
			{ error: "Failed to fetch images" },
			{ status: 500 }
		)
	}
}
