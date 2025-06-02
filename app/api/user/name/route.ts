import { auth } from "@/app/(auth)/auth"
import { user } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { NextRequest, NextResponse } from "next/server"

// Database connection
// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!)
const db = drizzle(client)

export async function PATCH(request: NextRequest) {
	try {
		const session = await auth()

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const body = await request.json()
		const { name } = body

		if (typeof name !== "string") {
			return NextResponse.json(
				{ error: "Name must be a string" },
				{ status: 400 }
			)
		}

		if (name.length > 100) {
			return NextResponse.json(
				{ error: "Name must be 100 characters or less" },
				{ status: 400 }
			)
		}

		// Update the user's name in the database
		const [updatedUser] = await db
			.update(user)
			.set({ name: name.trim() || null })
			.where(eq(user.id, session.user.id))
			.returning({ id: user.id, email: user.email, name: user.name })

		return NextResponse.json({
			success: true,
			user: updatedUser
		})
	} catch (error) {
		console.error("Error updating user name:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
