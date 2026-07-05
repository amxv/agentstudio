import { createDocumentHandler } from "@/lib/artifacts/server"
import { myProvider } from "@/lib/ai/providers"
import {
	DEFAULT_IMAGE_MODEL,
	getImageModelConfig,
	getRoutedImageModelId,
	isImageModelId
} from "@/lib/ai/models"
import { generateImage } from "ai"
import type {
	AppAttachment as Attachment,
	AppUIMessage as UIMessage
} from "@/lib/ai/types"

interface SlideData {
	title: string
	content: string
	slideNumber: number
	totalSlides: number
}

const parseMarkdownSlides = (markdown: string): SlideData[] => {
	// Split by slide separators (---) or by h1/h2 headers
	const slides = markdown
		.split(/^---+$/m)
		.filter((slide) => slide.trim().length > 0)
		.map((slide, index, array) => {
			const trimmedSlide = slide.trim()

			// Extract title from first header or use content preview
			const titleMatch = trimmedSlide.match(/^#{1,2}\s+(.+)$/m)
			const title = titleMatch ? titleMatch[1] : `Slide ${index + 1}`

			return {
				title,
				content: trimmedSlide,
				slideNumber: index + 1,
				totalSlides: array.length
			}
		})

	return slides
}

const generateSlidePrompt = (slide: SlideData): string => {
	// Create a comprehensive prompt for slide generation
	const prompt = `Create a professional presentation slide with the following content:

Title: ${slide.title}

Content:
${slide.content}

Design requirements:
- Clean, professional slide layout
- Readable fonts and good contrast
- Consistent visual style suitable for business presentations
- Include slide number (${slide.slideNumber}/${slide.totalSlides})
- White or light background with dark text
- Minimalist design with appropriate spacing
- Any bullet points should be clearly formatted
- If there are code blocks, use monospace font with syntax highlighting
- Charts or diagrams should be clear and professional
- Use appropriate colors for emphasis but keep it professional

The slide should look like it was created in PowerPoint or Google Slides with a modern, clean aesthetic.`

	return prompt
}

const generateSlideImage = async (
	slide: SlideData,
	selectedImageModel?: string
): Promise<string> => {
	const prompt = generateSlidePrompt(slide)
	const selectedModelId =
		selectedImageModel && isImageModelId(selectedImageModel)
			? selectedImageModel
			: DEFAULT_IMAGE_MODEL
	const modelId = getRoutedImageModelId({
		selectedModelId,
		hasInputImages: false
	})
	const model = getImageModelConfig(modelId)

	try {
		const { image } = await generateImage({
			model: myProvider.imageModel(modelId),
			prompt,
			providerOptions: {
				fal: {
					syncMode: true,
					outputFormat: model.defaults.outputFormat,
					aspectRatio: "4:3"
				}
			}
		})

		return `data:image/png;base64,${image.base64}`
	} catch (error) {
		console.error("Failed to generate slide image:", error)
		throw new Error(
			`Failed to generate slide ${slide.slideNumber}: ${error}`
		)
	}
}

export const slidesDocumentHandler = createDocumentHandler({
	kind: "slides" as const,
	onCreateDocument: async ({
		id,
		title,
		dataStream,
		session,
		messages = [],
		selectedImageModel
	}) => {
		try {
			// Get the most recent user message to extract markdown content
			const userMessages = messages.filter((msg) => msg.role === "user")
			const latestUserMessage = userMessages[userMessages.length - 1]

			let markdownContent = ""

			// Try to extract markdown from the message content
			const messageContent = latestUserMessage?.content as unknown
			if (typeof messageContent === "string") {
				markdownContent = messageContent
			} else if (Array.isArray(messageContent)) {
				// Handle multipart content from SDK variants
				const textParts = messageContent.filter(
					(part): part is { type: string; text?: unknown } =>
						typeof part === "object" &&
						part !== null &&
						"type" in part &&
						(part as { type: string }).type === "text"
				)
				markdownContent = textParts
					.map((part) => String(part.text ?? ""))
					.join("\n")
			}

			// If no markdown found in messages, use a default template
			if (!markdownContent.trim()) {
				markdownContent = `# ${title}

## Welcome Slide
Welcome to our presentation

---

## Agenda
- Introduction
- Main Topics
- Conclusion

---

## Conclusion
Thank you for your attention`
			}

			dataStream.writeData({
				type: "text-delta",
				content: "🎯 Parsing slide deck markdown...\n"
			})

			// Parse the markdown into individual slides
			const slides = parseMarkdownSlides(markdownContent)

			dataStream.writeData({
				type: "text-delta",
				content: `📊 Found ${slides.length} slides. Generating images...\n\n`
			})

			// Generate images for each slide
			const generatedSlides = []

			for (const slide of slides) {
				dataStream.writeData({
					type: "text-delta",
					content: `🎨 Generating slide ${slide.slideNumber}/${slide.totalSlides}: "${slide.title}"\n`
				})

				try {
					const imageUrl = await generateSlideImage(
						slide,
						selectedImageModel
					)

					generatedSlides.push({
						...slide,
						imageUrl
					})

					dataStream.writeData({
						type: "text-delta",
						content: `✅ Generated slide ${slide.slideNumber}\n`
					})
				} catch (error) {
					dataStream.writeData({
						type: "text-delta",
						content: `❌ Failed to generate slide ${slide.slideNumber}: ${error}\n`
					})

					// Add placeholder for failed slides
					generatedSlides.push({
						...slide,
						imageUrl: null,
						error: String(error)
					})
				}
			}

			dataStream.writeData({
				type: "text-delta",
				content: "\n🎉 Slide deck generation complete!\n"
			})

			// Create the final content structure
			const finalContent = JSON.stringify({
				title,
				slides: generatedSlides,
				originalMarkdown: markdownContent,
				generatedAt: new Date().toISOString(),
				modelUsed: selectedImageModel || DEFAULT_IMAGE_MODEL
			})

			// Send the final slide deck data
			dataStream.writeData({
				type: "slides-delta",
				content: finalContent
			})

			return finalContent
		} catch (error) {
			console.error("Error creating slides document:", error)

			dataStream.writeData({
				type: "text-delta",
				content: `❌ Error generating slide deck: ${error}\n`
			})

			throw error
		}
	},
	onUpdateDocument: async ({
		document,
		description,
		dataStream,
		session,
		selectedImageModel
	}) => {
		try {
			dataStream.writeData({
				type: "text-delta",
				content: `🔄 Updating slide deck: ${description}\n`
			})

			// Parse existing content
			const existingContent = JSON.parse(document.content || "{}")
			const { slides = [], originalMarkdown = "" } = existingContent

			// For updates, we'll regenerate specific slides based on the description
			// This is a simplified implementation - could be enhanced to parse which slides to update
			const updatedSlides = []

			for (const slide of slides) {
				dataStream.writeData({
					type: "text-delta",
					content: `🎨 Regenerating slide ${slide.slideNumber}: "${slide.title}"\n`
				})

				try {
					const imageUrl = await generateSlideImage(
						slide,
						selectedImageModel
					)

					updatedSlides.push({
						...slide,
						imageUrl
					})

					dataStream.writeData({
						type: "text-delta",
						content: `✅ Regenerated slide ${slide.slideNumber}\n`
					})
				} catch (error) {
					dataStream.writeData({
						type: "text-delta",
						content: `❌ Failed to regenerate slide ${slide.slideNumber}: ${error}\n`
					})

					// Keep the original slide if regeneration fails
					updatedSlides.push(slide)
				}
			}

			const finalContent = JSON.stringify({
				...existingContent,
				slides: updatedSlides,
				updatedAt: new Date().toISOString(),
				updateDescription: description,
				modelUsed: selectedImageModel || DEFAULT_IMAGE_MODEL
			})

			dataStream.writeData({
				type: "slides-delta",
				content: finalContent
			})

			dataStream.writeData({
				type: "text-delta",
				content: "\n🎉 Slide deck update complete!\n"
			})

			return finalContent
		} catch (error) {
			console.error("Error updating slides document:", error)

			dataStream.writeData({
				type: "text-delta",
				content: `❌ Error updating slide deck: ${error}\n`
			})

			throw error
		}
	}
})
