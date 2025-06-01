import { imagePrompt, updateDocumentPrompt } from "@/lib/ai/prompts"
import { myProvider } from "@/lib/ai/providers"
import { createDocumentHandler } from "@/lib/artifacts/server"
import {
	imageModels,
	DEFAULT_IMAGE_MODEL,
	IMAGE_MODEL_IDS
} from "@/lib/ai/models"
import { experimental_generateImage } from "ai"
import type { Attachment, UIMessage } from "ai"

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

const extractImageUrlFromText = (text: string): string | null => {
	// Look for image URLs in the text (http/https URLs ending with image extensions)
	const imageUrlRegex =
		/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|bmp)(\?[^\s]*)?/i
	const match = text.match(imageUrlRegex)
	return match ? match[0] : null
}

const extractBase64ImageFromText = (text: string): string | null => {
	// Look for base64 image data in the text
	const base64Regex = /data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/
	const match = text.match(base64Regex)
	return match ? match[0] : null
}

const parseImageInput = (
	input: string,
	attachments?: Array<Attachment>
): { prompt: string; imageUrl: string | null } => {
	// First, check for image attachments (prioritize over text-embedded URLs)
	let imageUrl: string | null = null

	if (attachments && attachments.length > 0) {
		// Find the first image attachment
		const imageAttachment = attachments.find((attachment) =>
			attachment.contentType?.startsWith("image/")
		)
		if (imageAttachment) {
			imageUrl = imageAttachment.url
		}
	}

	// If no attachment found, look for URLs or base64 data in text
	if (!imageUrl) {
		imageUrl =
			extractImageUrlFromText(input) || extractBase64ImageFromText(input)
	}

	// Remove the image URL/data from the prompt to get clean text (only if it was embedded in text)
	let prompt = input
	if (
		imageUrl &&
		(extractImageUrlFromText(input) || extractBase64ImageFromText(input))
	) {
		prompt = input.replace(imageUrl, "").trim()
		// Clean up any leftover formatting
		prompt = prompt.replace(/^\s*[-•*]\s*/, "").trim()
		prompt = prompt.replace(/^(image|img|picture|photo):\s*/i, "").trim()
	}

	return { prompt, imageUrl }
}

const getOptimalImageModel = (
	selectedImageModelId: string,
	hasInputImage: boolean,
	isFirstGeneration: boolean = false,
	hasExistingImageArtifact: boolean = false
): string => {
	// For the new model structure, users explicitly select T2I or I2I models
	// We should respect their choice and only fall back if there's a capability mismatch
	// OR if there's an existing image artifact in the conversation (indicating editing intent)

	// Find the selected image model
	const selectedModel = imageModels.find(
		(model) => model.id === selectedImageModelId
	)

	if (!selectedModel) {
		// Fallback to default model
		return DEFAULT_IMAGE_MODEL
	}

	// If there's an existing image artifact in the conversation and no direct input image,
	// but user selected a T2I model, map to the corresponding I2I model for editing
	if (
		hasExistingImageArtifact &&
		!hasInputImage &&
		selectedModel.capabilities.textToImage &&
		!selectedModel.capabilities.imageToImage
	) {
		// Map T2I models to their I2I counterparts for editing existing artifacts
		if (selectedImageModelId === IMAGE_MODEL_IDS.FLUX_KONTEXT_T2I) {
			return IMAGE_MODEL_IDS.FLUX_KONTEXT_I2I
		}
		if (selectedImageModelId === IMAGE_MODEL_IDS.FLUX_KONTEXT_MAX_T2I) {
			return IMAGE_MODEL_IDS.FLUX_KONTEXT_MAX_I2I
		}
		if (selectedImageModelId === IMAGE_MODEL_IDS.RECRAFT_V3_T2I) {
			return IMAGE_MODEL_IDS.RECRAFT_V3_I2I
		}
		if (selectedImageModelId === IMAGE_MODEL_IDS.IDEOGRAM_V3) {
			return IMAGE_MODEL_IDS.IDEOGRAM_V3_EDIT
		}
		// For models without direct I2I counterparts, map to FLUX_KONTEXT_I2I
		if (
			selectedImageModelId === IMAGE_MODEL_IDS.FLUX_PRO_ULTRA ||
			selectedImageModelId === IMAGE_MODEL_IDS.FLUX_PRO_V11 ||
			selectedImageModelId === IMAGE_MODEL_IDS.IMAGEN4_PREVIEW
		) {
			return IMAGE_MODEL_IDS.FLUX_KONTEXT_I2I
		}
	}

	// Check if the selected model supports the required capability
	if (hasInputImage && !selectedModel.capabilities.imageToImage) {
		// User selected a T2I model but has an input image
		// Find a similar I2I model or fallback to a default I2I model
		if (selectedImageModelId === IMAGE_MODEL_IDS.FLUX_KONTEXT_T2I) {
			return IMAGE_MODEL_IDS.FLUX_KONTEXT_I2I
		}
		if (selectedImageModelId === IMAGE_MODEL_IDS.FLUX_KONTEXT_MAX_T2I) {
			return IMAGE_MODEL_IDS.FLUX_KONTEXT_MAX_I2I
		}
		if (selectedImageModelId === IMAGE_MODEL_IDS.RECRAFT_V3_T2I) {
			return IMAGE_MODEL_IDS.RECRAFT_V3_I2I
		}
		if (selectedImageModelId === IMAGE_MODEL_IDS.IDEOGRAM_V3) {
			return IMAGE_MODEL_IDS.IDEOGRAM_V3_EDIT
		}
		// For models without direct I2I counterparts, map to FLUX_KONTEXT_I2I
		if (
			selectedImageModelId === IMAGE_MODEL_IDS.FLUX_PRO_ULTRA ||
			selectedImageModelId === IMAGE_MODEL_IDS.FLUX_PRO_V11 ||
			selectedImageModelId === IMAGE_MODEL_IDS.IMAGEN4_PREVIEW
		) {
			return IMAGE_MODEL_IDS.FLUX_KONTEXT_I2I
		}

		// Fallback to first available I2I model
		const imageToImageModel = imageModels.find(
			(model) => model.capabilities.imageToImage
		)
		return imageToImageModel?.id || IMAGE_MODEL_IDS.FLUX_KONTEXT_I2I
	}

	if (!hasInputImage && !selectedModel.capabilities.textToImage) {
		// User selected an I2I model but has no input image
		// Find a similar T2I model or fallback to a default T2I model
		if (selectedImageModelId === IMAGE_MODEL_IDS.FLUX_KONTEXT_I2I) {
			return IMAGE_MODEL_IDS.FLUX_KONTEXT_T2I
		}
		if (selectedImageModelId === IMAGE_MODEL_IDS.FLUX_KONTEXT_MAX_I2I) {
			return IMAGE_MODEL_IDS.FLUX_KONTEXT_MAX_T2I
		}
		if (selectedImageModelId === IMAGE_MODEL_IDS.RECRAFT_V3_I2I) {
			return IMAGE_MODEL_IDS.RECRAFT_V3_T2I
		}
		if (
			selectedImageModelId === IMAGE_MODEL_IDS.IDEOGRAM_V3_EDIT ||
			selectedImageModelId === IMAGE_MODEL_IDS.IDEOGRAM_V3_REMIX
		) {
			return IMAGE_MODEL_IDS.IDEOGRAM_V3
		}

		// Fallback to first available T2I model
		const textToImageModel = imageModels.find(
			(model) => model.capabilities.textToImage
		)
		return textToImageModel?.id || IMAGE_MODEL_IDS.FLUX_KONTEXT_T2I
	}

	// Legacy support for old model IDs
	if (selectedImageModelId === IMAGE_MODEL_IDS.FLUX_PRO_FIRST_TIME) {
		return hasInputImage
			? IMAGE_MODEL_IDS.FLUX_KONTEXT_I2I
			: IMAGE_MODEL_IDS.FLUX_KONTEXT_T2I
	}

	return selectedImageModelId
}

const getModelParameters = (modelId: string) => {
	const model = imageModels.find((m) => m.id === modelId)
	return (
		model?.parameters || {
			guidanceScale: 10,
			inferenceSteps: 50,
			maxSize: "1024x1024"
		}
	)
}

const isFirstImageGenerationInConversation = (
	messages: Array<UIMessage>
): boolean => {
	// Check if any previous messages contain image artifacts
	// Look for assistant messages that mention image creation or contain image-related tool calls
	for (const message of messages) {
		if (message.role === "assistant" && message.parts) {
			for (const part of message.parts) {
				if (part.type === "tool-invocation") {
					const { toolInvocation } = part
					if (
						toolInvocation.toolName === "createDocument" &&
						toolInvocation.state === "call"
					) {
						const args = toolInvocation.args as { kind?: string }
						if (args.kind === "image") {
							return false // Found a previous image generation
						}
					}
				}
			}
		}
	}
	return true // No previous image generations found
}

const getFalModelName = (modelId: string, hasInputImage: boolean): string => {
	// Handle the new model IDs
	if (modelId === IMAGE_MODEL_IDS.FLUX_KONTEXT_T2I) {
		return "fal-ai/flux-pro/kontext/text-to-image"
	}
	if (modelId === IMAGE_MODEL_IDS.FLUX_KONTEXT_MAX_T2I) {
		return "fal-ai/flux-pro/kontext/max/text-to-image"
	}
	if (modelId === IMAGE_MODEL_IDS.IMAGEN4_PREVIEW) {
		return "fal-ai/imagen4/preview"
	}
	if (modelId === IMAGE_MODEL_IDS.RECRAFT_V3_T2I) {
		return "fal-ai/recraft/v3/text-to-image"
	}
	if (modelId === IMAGE_MODEL_IDS.FLUX_PRO_ULTRA) {
		return "fal-ai/flux-pro/v1.1-ultra"
	}
	if (modelId === IMAGE_MODEL_IDS.FLUX_PRO_V11) {
		return "fal-ai/flux-pro/v1.1"
	}
	if (modelId === IMAGE_MODEL_IDS.IDEOGRAM_V3) {
		return "fal-ai/ideogram/v3"
	}
	if (modelId === IMAGE_MODEL_IDS.FLUX_KONTEXT_I2I) {
		return "fal-ai/flux-pro/kontext"
	}
	if (modelId === IMAGE_MODEL_IDS.FLUX_KONTEXT_MAX_I2I) {
		return "fal-ai/flux-pro/kontext/max"
	}
	if (modelId === IMAGE_MODEL_IDS.RECRAFT_V3_I2I) {
		return "fal-ai/recraft/v3/image-to-image"
	}
	if (modelId === IMAGE_MODEL_IDS.IDEOGRAM_V3_EDIT) {
		return "fal-ai/ideogram/v3/edit"
	}
	if (modelId === IMAGE_MODEL_IDS.IDEOGRAM_V3_REMIX) {
		return "fal-ai/ideogram/v3/remix"
	}

	// Legacy model handling
	if (modelId === IMAGE_MODEL_IDS.FLUX_PRO_TEXT_TO_IMAGE) {
		return "fal-ai/flux-pro/kontext/text-to-image"
	}
	if (modelId === IMAGE_MODEL_IDS.FLUX_PRO_IMAGE_TO_IMAGE) {
		return "fal-ai/flux-pro/kontext"
	}
	if (modelId === IMAGE_MODEL_IDS.FLUX_SCHNELL) {
		return "fal-ai/flux/schnell"
	}
	if (modelId === IMAGE_MODEL_IDS.FLUX_DEV) {
		return "fal-ai/flux/dev"
	}

	// Fallback to the model ID if no mapping found
	return modelId
}

const getLatestImageArtifactFromConversation = (
	messages: Array<UIMessage>
): string | null => {
	// Look for the most recent image artifact in the conversation
	// Search backwards through messages to find the latest one
	for (let i = messages.length - 1; i >= 0; i--) {
		const message = messages[i]
		if (message.role === "assistant" && message.parts) {
			for (const part of message.parts) {
				if (part.type === "tool-invocation") {
					const { toolInvocation } = part
					if (
						toolInvocation.state === "result" &&
						(toolInvocation.toolName === "createDocument" ||
							toolInvocation.toolName === "updateDocument")
					) {
						try {
							const result = toolInvocation.result as {
								kind?: string
								content?: string
							}
							if (result.kind === "image" && result.content) {
								return `data:image/png;base64,${result.content}`
							}
						} catch {
							// Continue searching if parsing fails
						}
					}
				}
			}
		}
	}
	return null
}

export const imageDocumentHandler = createDocumentHandler<"image">({
	kind: "image",
	onCreateDocument: async ({
		title,
		dataStream,
		messages,
		selectedImageModel
	}) => {
		let draftContent = ""

		try {
			// Check if this is the first image generation in the conversation
			const isFirstGeneration = isFirstImageGenerationInConversation(
				messages || []
			)

			// Check if there's an existing image artifact in the conversation
			// This indicates the user might want to edit/modify an existing image
			const hasExistingImageArtifact = !isFirstGeneration

			// Get the latest user message to extract attachments
			const latestMessage =
				messages && messages.length > 0
					? messages[messages.length - 1]
					: null
			const attachments = latestMessage?.experimental_attachments || []

			// Parse the title to extract image URL and text prompt
			const { prompt: textPrompt, imageUrl: inputImage } =
				parseImageInput(title, attachments)

			// If there's no direct input image but there's an existing image artifact,
			// use the latest image artifact as the base image for editing
			let baseImageForEditing: string | null = null
			if (!inputImage && hasExistingImageArtifact) {
				baseImageForEditing = getLatestImageArtifactFromConversation(
					messages || []
				)
			}

			// Use the extracted text prompt, fallback to original title if no image found
			const promptToUse = textPrompt || title
			const enhancedPrompt = enhanceImagePrompt(promptToUse)

			// Choose optimal model based on selected model and input type
			// The user selects FLUX_KONTEXT, and we automatically choose the best backend model
			const modelToUse = selectedImageModel || DEFAULT_IMAGE_MODEL

			const optimalModelId = getOptimalImageModel(
				modelToUse,
				!!(inputImage || baseImageForEditing),
				isFirstGeneration,
				hasExistingImageArtifact
			)
			const modelParams = getModelParameters(optimalModelId)

			const generateParams: Parameters<
				typeof experimental_generateImage
			>[0] = {
				model: myProvider.imageModel(optimalModelId),
				prompt: enhancedPrompt,
				n: 1,
				size: modelParams.maxSize as "1024x1024"
			}

			// Add image-to-image specific parameters if we have an input image or base image for editing
			const imageToUse = inputImage || baseImageForEditing
			if (imageToUse) {
				generateParams.providerOptions = {
					fal: {
						image_url: imageToUse,
						guidance_scale: modelParams.guidanceScale,
						num_inference_steps: modelParams.inferenceSteps,
						sync_mode: true,
						// Strength controls how much the input image influences the output
						// Lower values preserve more of the original image
						// Use lower strength for editing existing artifacts vs new input images
						strength: inputImage ? 0.8 : 0.6
					}
				}
			} else {
				// Text-to-image specific parameters
				generateParams.providerOptions = {
					fal: {
						guidance_scale: modelParams.guidanceScale,
						num_inference_steps: modelParams.inferenceSteps,
						sync_mode: true
					}
				}
			}

			const { image } = await experimental_generateImage(generateParams)

			draftContent = image.base64

			// Stream the generated image data
			dataStream.writeData({
				type: "image-delta",
				content: image.base64
			})
		} catch (error) {
			console.error("Image generation failed:", error)
			throw error
		}

		return draftContent
	},
	onUpdateDocument: async ({
		document,
		description,
		dataStream,
		messages,
		selectedImageModel
	}) => {
		let draftContent = ""

		try {
			// Get the latest user message to extract attachments
			const latestMessage =
				messages && messages.length > 0
					? messages[messages.length - 1]
					: null
			const attachments = latestMessage?.experimental_attachments || []

			// Parse the description to extract any new image URL and text prompt
			const { prompt: textPrompt, imageUrl: newInputImage } =
				parseImageInput(description, attachments)

			// Use the new input image if provided, otherwise use the existing document content as base
			const baseImage =
				newInputImage || `data:image/png;base64,${document.content}`
			const promptToUse = textPrompt || description
			const enhancedPrompt = enhanceImagePrompt(promptToUse)

			// For updates, we always have a base image, so use image-to-image capable model
			// Don't use first-time logic for updates - use the user's selected model
			const modelToUse = selectedImageModel || DEFAULT_IMAGE_MODEL

			const optimalModelId = getOptimalImageModel(
				modelToUse,
				true, // Always true for updates since we have a base image
				false, // Never first generation for updates
				true // Always true for updates since we're updating an existing image artifact
			)
			const modelParams = getModelParameters(optimalModelId)

			const { image } = await experimental_generateImage({
				model: myProvider.imageModel(optimalModelId),
				prompt: enhancedPrompt,
				n: 1,
				size: modelParams.maxSize as "1024x1024",
				providerOptions: {
					fal: {
						image_url: baseImage,
						guidance_scale: modelParams.guidanceScale,
						num_inference_steps: modelParams.inferenceSteps,
						sync_mode: true,
						// Adjust strength based on whether we have a new input image
						// Higher strength for new images, lower for modifications
						strength: newInputImage ? 0.8 : 0.6
					}
				}
			})

			draftContent = image.base64

			// Stream the updated image data
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
