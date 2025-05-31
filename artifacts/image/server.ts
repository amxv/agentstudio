import { imagePrompt, updateDocumentPrompt } from "@/lib/ai/prompts"
import { myProvider } from "@/lib/ai/providers"
import { createDocumentHandler } from "@/lib/artifacts/server"
import { experimental_generateImage } from "ai"

const enhanceImagePrompt = (userPrompt: string): string => {
	// Add quality and style enhancements to the prompt
	const qualityTerms = "high quality, detailed, professional, 8k resolution"
	const styleGuidance = "well-composed, good lighting, sharp focus"

	// Check if the prompt already contains quality terms
	const hasQualityTerms =
		/\b(high quality|detailed|professional|8k|4k|hd|sharp|crisp)\b/i.test(
			userPrompt
		)

	if (hasQualityTerms) {
		return userPrompt
	}

	return `${userPrompt}, ${qualityTerms}, ${styleGuidance}`
}

export const imageDocumentHandler = createDocumentHandler<"image">({
	kind: "image",
	onCreateDocument: async ({ title, dataStream }) => {
		let draftContent = ""

		try {
			const enhancedPrompt = enhanceImagePrompt(title)

			const { image } = await experimental_generateImage({
				model: myProvider.imageModel("small-model"),
				prompt: enhancedPrompt,
				n: 1,
				size: "1024x1024", // Default to square format
				// Add additional parameters if supported by the model
				...(myProvider
					.imageModel("small-model")
					.modelId.includes("flux") && {
					// Flux-specific parameters
					guidance_scale: 7.5,
					num_inference_steps: 50
				})
			})

			draftContent = image.base64

			dataStream.writeData({
				type: "image-delta",
				content: image.base64
			})
		} catch (error) {
			console.error("Image generation failed:", error)
			// You might want to handle this error more gracefully
			throw error
		}

		return draftContent
	},
	onUpdateDocument: async ({ description, dataStream }) => {
		let draftContent = ""

		try {
			const enhancedPrompt = enhanceImagePrompt(description)

			const { image } = await experimental_generateImage({
				model: myProvider.imageModel("small-model"),
				prompt: enhancedPrompt,
				n: 1,
				size: "1024x1024",
				...(myProvider
					.imageModel("small-model")
					.modelId.includes("flux") && {
					guidance_scale: 7.5,
					num_inference_steps: 50
				})
			})

			draftContent = image.base64

			dataStream.writeData({
				type: "image-delta",
				content: image.base64
			})
		} catch (error) {
			console.error("Image update failed:", error)
			throw error
		}

		return draftContent
	}
})
