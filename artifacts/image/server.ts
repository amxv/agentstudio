import { createDocumentHandler } from "@/lib/artifacts/server"
import {
	DEFAULT_IMAGE_MODEL,
	getImageModelConfig,
	getRoutedImageModelId,
	isImageModelId,
	mapUniversalRatioToImageSize,
	type ImageModel,
	type ImageModelId,
	type UniversalAspectRatio
} from "@/lib/ai/models"
import { myProvider } from "@/lib/ai/providers"
import { generateImage } from "ai"
import type {
	AppAttachment as Attachment,
	AppUIMessage as UIMessage
} from "@/lib/ai/types"

const DEFAULT_ASPECT_RATIO: UniversalAspectRatio = "1:1"

const enhanceImagePrompt = (userPrompt: string): string => {
	const wordCount = userPrompt.trim().split(/\s+/).length

	if (wordCount > 5) {
		return userPrompt
	}

	return `A ${userPrompt}, captured in natural lighting with clear details`
}

const extractImageUrlFromText = (text: string): string | null => {
	const imageUrlRegex =
		/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|bmp)(\?[^\s]*)?/i
	const match = text.match(imageUrlRegex)
	return match ? match[0] : null
}

const extractBase64ImageFromText = (text: string): string | null => {
	const base64Regex = /data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/
	const match = text.match(base64Regex)
	return match ? match[0] : null
}

const parseImageInput = (
	input: string,
	attachments?: Array<Attachment>
): { prompt: string; imageUrls: string[] } => {
	const imageUrls =
		attachments
			?.filter((attachment) =>
				attachment.contentType?.startsWith("image/")
			)
			.map((attachment) => attachment.url) ?? []

	if (imageUrls.length === 0) {
		const imageUrl =
			extractImageUrlFromText(input) || extractBase64ImageFromText(input)

		if (imageUrl) {
			imageUrls.push(imageUrl)
		}
	}

	let prompt = input
	if (
		imageUrls.length === 1 &&
		(extractImageUrlFromText(input) || extractBase64ImageFromText(input))
	) {
		prompt = input
			.replace(imageUrls[0], "")
			.trim()
			.replace(/^\s*[-*]\s*/, "")
			.replace(/^(image|img|picture|photo):\s*/i, "")
			.trim()
	}

	return { prompt, imageUrls }
}

const getLatestImageArtifactFromConversation = (
	messages: Array<UIMessage>
): string | null => {
	for (let i = messages.length - 1; i >= 0; i--) {
		const message = messages[i]
		if (message.role !== "assistant") {
			continue
		}

		for (const part of message.parts ?? []) {
			if (part.type !== "tool-invocation") {
				continue
			}

			const { toolInvocation } = part as unknown as {
				toolInvocation: {
					state: string
					toolName: string
					result?: unknown
				}
			}
			if (
				toolInvocation.state !== "result" ||
				(toolInvocation.toolName !== "createDocument" &&
					toolInvocation.toolName !== "updateDocument")
			) {
				continue
			}

			const result = toolInvocation.result as {
				kind?: string
				content?: string
			}

			if (result.kind === "image" && result.content) {
				return `data:image/png;base64,${result.content}`
			}
		}
	}

	return null
}

const normalizeAspectRatio = (
	aspectRatio: string | undefined
): UniversalAspectRatio => {
	if (
		aspectRatio === "1:1" ||
		aspectRatio === "16:9" ||
		aspectRatio === "9:16" ||
		aspectRatio === "4:3" ||
		aspectRatio === "3:4"
	) {
		return aspectRatio
	}

	return DEFAULT_ASPECT_RATIO
}

const normalizeSelectedImageModel = (
	selectedImageModel: string | undefined
): ImageModelId => {
	if (!selectedImageModel) {
		return DEFAULT_IMAGE_MODEL
	}

	if (!isImageModelId(selectedImageModel)) {
		throw new Error(`Unsupported image model: ${selectedImageModel}`)
	}

	return selectedImageModel
}

const getImagesForModel = (
	imageUrls: string[],
	model: ImageModel
): string[] => {
	if (imageUrls.length === 0) {
		return []
	}

	if (model.capabilities.multiImage) {
		return imageUrls
	}

	return [imageUrls[imageUrls.length - 1]]
}

const buildFalProviderOptions = ({
	model,
	aspectRatio
}: {
	model: ImageModel
	aspectRatio: UniversalAspectRatio
}): Record<string, string | number | boolean> => {
	const options: Record<string, string | number | boolean> = {}

	if (model.accepts.syncMode) {
		options.syncMode = true
	}

	if (model.accepts.outputFormat) {
		options.outputFormat = model.defaults.outputFormat
	}

	if (model.accepts.quality && model.defaults.quality) {
		options.quality = model.defaults.quality
	}

	if (model.accepts.resolution && model.defaults.resolution) {
		options.resolution = model.defaults.resolution
	}

	if (model.accepts.numImages) {
		options.numImages = 1
	}

	if (model.accepts.imageSize) {
		options.imageSize = mapUniversalRatioToImageSize(aspectRatio)
	}

	if (model.accepts.aspectRatio) {
		options.aspectRatio = aspectRatio
	}

	return options
}

const createGenerationDetails = ({
	originalPrompt,
	enhancedPrompt,
	model,
	inputImageCount,
	aspectRatio,
	warnings
}: {
	originalPrompt: string
	enhancedPrompt: string
	model: ImageModel
	inputImageCount: number
	aspectRatio: UniversalAspectRatio
	warnings?: unknown[]
}) => ({
	originalPrompt,
	enhancedPrompt,
	modelUsed: model.id,
	modelName: model.name,
	modelDescription: model.description,
	provider: model.provider,
	falEndpoint: model.falEndpoint,
	modelFamily: model.modelFamily,
	endpointKind: model.endpointKind,
	parameters: {
		aspectRatio,
		quality: model.defaults.quality,
		resolution: model.defaults.resolution,
		outputFormat: model.defaults.outputFormat,
		hasInputImages: inputImageCount > 0,
		inputImageCount,
		hasMask: false
	},
	generationType: model.endpointKind,
	warnings: warnings ?? [],
	timestamp: new Date().toISOString()
})

const generateArtifactImage = async ({
	prompt,
	imageUrls,
	selectedImageModel,
	selectedAspectRatio
}: {
	prompt: string
	imageUrls: string[]
	selectedImageModel?: string
	selectedAspectRatio?: string
}) => {
	const selectedModelId = normalizeSelectedImageModel(selectedImageModel)
	const routedModelId = getRoutedImageModelId({
		selectedModelId,
		hasInputImages: imageUrls.length > 0
	})
	const model = getImageModelConfig(routedModelId)
	const aspectRatio = normalizeAspectRatio(selectedAspectRatio)
	const imagesToUse = getImagesForModel(imageUrls, model)
	const enhancedPrompt = enhanceImagePrompt(prompt)
	const providerOptions = buildFalProviderOptions({ model, aspectRatio })
	const generationPrompt =
		imagesToUse.length > 0
			? {
					text: enhancedPrompt,
					images: imagesToUse
				}
			: enhancedPrompt

	const { image, warnings } = await generateImage({
		model: myProvider.imageModel(model.id),
		prompt: generationPrompt,
		n: 1,
		providerOptions: { fal: providerOptions }
	})

	return {
		base64: image.base64,
		details: createGenerationDetails({
			originalPrompt: prompt,
			enhancedPrompt,
			model,
			inputImageCount: imagesToUse.length,
			aspectRatio,
			warnings
		})
	}
}

export const imageDocumentHandler = createDocumentHandler<"image">({
	kind: "image",
	onCreateDocument: async ({
		title,
		dataStream,
		messages = [],
		selectedImageModel,
		selectedAspectRatio
	}) => {
		const latestMessage = messages[messages.length - 1]
		const attachments = latestMessage?.experimental_attachments || []
		const { prompt: parsedPrompt, imageUrls } = parseImageInput(
			title,
			attachments
		)
		const existingArtifact =
			getLatestImageArtifactFromConversation(messages)
		const imagesForGeneration =
			imageUrls.length > 0
				? imageUrls
				: existingArtifact
					? [existingArtifact]
					: []
		const prompt = parsedPrompt || title

		const { base64, details } = await generateArtifactImage({
			prompt,
			imageUrls: imagesForGeneration,
			selectedImageModel,
			selectedAspectRatio
		})

		dataStream.writeData({
			type: "generation-details",
			content: JSON.stringify(details)
		})

		dataStream.writeData({
			type: "image-delta",
			content: base64
		})

		return base64
	},
	onUpdateDocument: async ({
		document,
		description,
		dataStream,
		messages = [],
		selectedImageModel,
		selectedAspectRatio
	}) => {
		const latestMessage = messages[messages.length - 1]
		const attachments = latestMessage?.experimental_attachments || []
		const { prompt: parsedPrompt, imageUrls } = parseImageInput(
			description,
			attachments
		)
		const imagesForGeneration =
			imageUrls.length > 0
				? imageUrls
				: [`data:image/png;base64,${document.content}`]
		const prompt = parsedPrompt || description

		const { base64, details } = await generateArtifactImage({
			prompt,
			imageUrls: imagesForGeneration,
			selectedImageModel,
			selectedAspectRatio
		})

		dataStream.writeData({
			type: "generation-details",
			content: JSON.stringify(details)
		})

		dataStream.writeData({
			type: "image-delta",
			content: base64
		})

		return base64
	}
})
