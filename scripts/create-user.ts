#!/usr/bin/env tsx

import { drizzle } from "drizzle-orm/postgres-js"
import { eq } from "drizzle-orm"
import postgres from "postgres"
import { genSaltSync, hashSync } from "bcrypt-ts"
import { generateId } from "ai"
import dotenv from "dotenv"

// Import the schema directly
import { user } from "@/lib/db/schema"

dotenv.config({ path: ".env.local" })

// Database connection
if (!process.env.POSTGRES_URL) {
	console.error("❌ Error: POSTGRES_URL environment variable is required")
	process.exit(1)
}
const client = postgres(process.env.POSTGRES_URL)
const db = drizzle(client)

function generateHashedPassword(password: string) {
	const salt = genSaltSync(10)
	const hash = hashSync(password, salt)
	return hash
}

async function getUserByEmail(email: string) {
	try {
		return await db.select().from(user).where(eq(user.email, email))
	} catch (error) {
		throw new Error("Failed to get user by email")
	}
}

async function createUserInDb(email: string, password: string) {
	const hashedPassword = generateHashedPassword(password)

	try {
		return await db.insert(user).values({ email, password: hashedPassword })
	} catch (error) {
		throw new Error("Failed to create user")
	}
}

async function main() {
	const args = process.argv.slice(2)

	if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
		console.log(`
Usage: npm run create-user <email> [password]

Creates a new user account while signups are disabled.

Arguments:
  email       Email address for the new user (required)
  password    Password for the new user (optional, will generate random if not provided)

Options:
  --help, -h  Show this help message

Examples:
  npm run create-user user@example.com
  npm run create-user user@example.com mypassword123
`)
		process.exit(0)
	}

	const email = args[0]
	const password = args[1] || generateId()

	if (!email) {
		console.error("❌ Error: Email is required")
		process.exit(1)
	}

	// Basic email validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(email)) {
		console.error("❌ Error: Invalid email format")
		process.exit(1)
	}

	try {
		// Check if user already exists
		const existingUsers = await getUserByEmail(email)
		if (existingUsers.length > 0) {
			console.error(`❌ Error: User with email ${email} already exists`)
			process.exit(1)
		}

		// Create the user
		await createUserInDb(email, password)

		console.log("✅ User created successfully!")
		console.log(`📧 Email: ${email}`)
		console.log(`🔑 Password: ${password}`)

		if (args[1]) {
			console.log(
				"\n💡 User can now sign in with the provided credentials"
			)
		} else {
			console.log(
				"\n💡 A random password was generated. Make sure to share it with the user."
			)
		}
	} catch (error) {
		console.error("❌ Error creating user:", error)
		process.exit(1)
	} finally {
		// Close the database connection
		await client.end()
	}
}

main().catch((error) => {
	console.error("❌ Unexpected error:", error)
	process.exit(1)
})
