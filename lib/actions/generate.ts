"use server"

import { auth } from "@/app/(auth)/auth"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { image, project } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { nanoid } from "nanoid"

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!)
const db = drizzle(client)

interface GenerateImageInput {
	prompt: string
	negativePrompt?: string
	model: string
	style: string
	width: number
	height: number
	steps: number
	guidanceScale: number
	seed?: number
	projectId?: string
}

interface GenerateImageResult {
	success: boolean
	imageUrl?: string
	imageId?: string
	error?: string
}

export async function generateImage(
	input: GenerateImageInput
): Promise<GenerateImageResult> {
	try {
		const session = await auth()
		if (!session?.user) {
			return { success: false, error: "Unauthorized" }
		}

		// Create or get default project
		let projectId = input.projectId
		if (!projectId) {
			const [defaultProject] = await db
				.select()
				.from(project)
				.where(eq(project.userId, session.user.id))
				.limit(1)

			if (!defaultProject) {
				const [newProject] = await db
					.insert(project)
					.values({
						title: "My Images",
						description: "Default project for generated images",
						userId: session.user.id,
						createdAt: new Date()
					})
					.returning()

				projectId = newProject.id
			} else {
				projectId = defaultProject.id
			}
		}

		// Create image record
		const [imageRecord] = await db
			.insert(image)
			.values({
				projectId,
				prompt: input.prompt,
				negativePrompt: input.negativePrompt,
				model: input.model,
				style: input.style,
				width: input.width,
				height: input.height,
				steps: input.steps,
				guidanceScale: input.guidanceScale,
				seed: input.seed,
				status: "generating",
				userId: session.user.id,
				createdAt: new Date()
			})
			.returning()

		try {
			// For now, we'll simulate image generation with a placeholder
			// In a real app, you would integrate with actual AI image generation APIs
			const imageUrl = await simulateImageGeneration(input)

			// Update image record with URL
			await db
				.update(image)
				.set({
					imageUrl,
					status: "completed",
					completedAt: new Date()
				})
				.where(eq(image.id, imageRecord.id))

			return {
				success: true,
				imageUrl,
				imageId: imageRecord.id
			}
		} catch (generationError) {
			// Update image record with error
			await db
				.update(image)
				.set({
					status: "failed",
					errorMessage:
						generationError instanceof Error
							? generationError.message
							: "Unknown error"
				})
				.where(eq(image.id, imageRecord.id))

			throw generationError
		}
	} catch (error) {
		console.error("Generate image error:", error)
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to generate image"
		}
	}
}

async function simulateImageGeneration(
	input: GenerateImageInput
): Promise<string> {
	// Simulate generation time
	await new Promise((resolve) => setTimeout(resolve, 2000))

	// For demo purposes, return a placeholder image URL
	// In production, this would call actual AI image generation APIs like:
	// - OpenAI DALL-E 3
	// - Stability AI
	// - Midjourney API
	// - Flux
	// - etc.

	const placeholderImages = [
		"https://picsum.photos/1024/1024?random=1",
		"https://picsum.photos/1024/1024?random=2",
		"https://picsum.photos/1024/1024?random=3",
		"https://picsum.photos/1024/1024?random=4",
		"https://picsum.photos/1024/1024?random=5"
	]

	const randomIndex = Math.floor(Math.random() * placeholderImages.length)
	return placeholderImages[randomIndex]
}

export async function getUserImages(projectId?: string) {
	const session = await auth()
	if (!session?.user) {
		throw new Error("Unauthorized")
	}

	const whereConditions = [eq(image.userId, session.user.id)]
	if (projectId) {
		whereConditions.push(eq(image.projectId, projectId))
	}

	return await db
		.select()
		.from(image)
		.where(eq(image.userId, session.user.id))
		.orderBy(image.createdAt)
}

export async function deleteImage(imageId: string) {
	const session = await auth()
	if (!session?.user) {
		throw new Error("Unauthorized")
	}

	await db.delete(image).where(eq(image.id, imageId))
}
