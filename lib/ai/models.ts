// Centralized model IDs - define once, use everywhere
export const MODEL_IDS = {
	CLAUDE_FABLE_5: "claude-fable-5",
	CLAUDE_OPUS_4_8: "claude-opus-4-8",
	CLAUDE_SONNET_5: "claude-sonnet-5",
	CLAUDE_HAIKU_4_5: "claude-haiku-4-5",
	GPT_5_5: "gpt-5.5",
	GEMINI_3_5_FLASH: "gemini-3.5-flash",
	GEMINI_3_1_PRO_PREVIEW: "gemini-3.1-pro-preview",
	GEMINI_3_1_FLASH_LITE: "gemini-3.1-flash-lite"
} as const

export const IMAGE_MODEL_IDS = {
	GPT_IMAGE_2: "gpt-image-2",
	GPT_IMAGE_2_EDIT: "gpt-image-2-edit",
	GPT_IMAGE_1_5: "gpt-image-1-5",
	NANO_BANANA_PRO: "nano-banana-pro",
	NANO_BANANA_PRO_EDIT: "nano-banana-pro-edit",
	SEEDREAM_4_5: "seedream-4-5",
	SEEDREAM_5_LITE: "seedream-5-lite",
	SEEDREAM_5_LITE_EDIT: "seedream-5-lite-edit",
	FLUX_2_PRO: "flux-2-pro",
	FLUX_2_PRO_EDIT: "flux-2-pro-edit",
	IDEOGRAM_V4: "ideogram-v4",
	KREA_V2_LARGE: "krea-v2-large",
	NANO_BANANA_LITE: "nano-banana-lite",
	FLUX_2_KLEIN: "flux-2-klein"
} as const

export type ModelId = (typeof MODEL_IDS)[keyof typeof MODEL_IDS]
export type ImageModelId =
	(typeof IMAGE_MODEL_IDS)[keyof typeof IMAGE_MODEL_IDS]

export type UniversalAspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4"
export type ImageEndpointKind =
	| "text-to-image"
	| "image-edit"
	| "multi-reference-edit"

export type ImageQuality = "low" | "medium" | "high"
export type ImageResolution = "1K" | "2K" | "4K"
export type ImageOutputFormat = "jpeg" | "png" | "webp"

export interface ChatModel {
	id: ModelId
	name: string
	description: string
	provider: "anthropic" | "openai" | "google"
}

export interface ImageModel {
	id: ImageModelId
	name: string
	description: string
	provider: "fal"
	falEndpoint: string
	modelFamily: string
	endpointKind: ImageEndpointKind
	capabilities: {
		textToImage: boolean
		imageToImage: boolean
		multiImage: boolean
		mask?: boolean
		styleReference?: boolean
	}
	accepts: {
		imageInput: boolean
		mask: boolean
		imageSize: boolean
		aspectRatio: boolean
		quality: boolean
		resolution: boolean
		numImages: boolean
		outputFormat: boolean
		syncMode: boolean
		seed: boolean
		guidanceScale: boolean
		inferenceSteps: boolean
		strength: boolean
	}
	routing?: {
		textRoute?: ImageModelId
		editRoute?: ImageModelId
	}
	defaults: {
		quality?: ImageQuality
		resolution?: ImageResolution
		outputFormat: ImageOutputFormat
		aspectRatio: UniversalAspectRatio
	}
}

export const chatModels: Array<ChatModel> = [
	{
		id: MODEL_IDS.CLAUDE_FABLE_5,
		name: "Claude Fable 5",
		description:
			"Anthropic's most capable widely released model for long-running agents and complex work.",
		provider: "anthropic"
	},
	{
		id: MODEL_IDS.CLAUDE_OPUS_4_8,
		name: "Claude Opus 4.8",
		description:
			"Anthropic's recommended model for complex agentic coding and enterprise work.",
		provider: "anthropic"
	},
	{
		id: MODEL_IDS.CLAUDE_SONNET_5,
		name: "Claude Sonnet 5",
		description:
			"Anthropic's best combination of speed and intelligence for everyday high-quality work.",
		provider: "anthropic"
	},
	{
		id: MODEL_IDS.CLAUDE_HAIKU_4_5,
		name: "Claude Haiku 4.5",
		description:
			"Anthropic's fastest current Claude model with near-frontier intelligence.",
		provider: "anthropic"
	},
	{
		id: MODEL_IDS.GPT_5_5,
		name: "GPT-5.5",
		description:
			"OpenAI's latest model for coding, tool-heavy agents, grounded assistants, and complex workflows.",
		provider: "openai"
	},
	{
		id: MODEL_IDS.GEMINI_3_5_FLASH,
		name: "Gemini 3.5 Flash",
		description:
			"Google's stable Gemini 3 model for sustained frontier performance on agentic and coding tasks.",
		provider: "google"
	},
	{
		id: MODEL_IDS.GEMINI_3_1_PRO_PREVIEW,
		name: "Gemini 3.1 Pro Preview",
		description:
			"Google's preview Gemini Pro model for advanced reasoning and multimodal work.",
		provider: "google"
	},
	{
		id: MODEL_IDS.GEMINI_3_1_FLASH_LITE,
		name: "Gemini 3.1 Flash-Lite",
		description:
			"Google's stable, cost-efficient Gemini 3 model for fast high-volume tasks.",
		provider: "google"
	}
]

const baseAccepts = {
	mask: false,
	imageSize: false,
	aspectRatio: true,
	quality: false,
	resolution: false,
	numImages: true,
	outputFormat: true,
	syncMode: true,
	seed: false,
	guidanceScale: false,
	inferenceSteps: false,
	strength: false
}

export const imageModels: Array<ImageModel> = [
	{
		id: IMAGE_MODEL_IDS.GPT_IMAGE_2,
		name: "GPT Image 2",
		description:
			"OpenAI's latest image model on FAL, with strong typography, prompt adherence, and commercial-quality detail.",
		provider: "fal",
		falEndpoint: "fal-ai/gpt-image-2",
		modelFamily: "gpt-image-2",
		endpointKind: "text-to-image",
		capabilities: {
			textToImage: true,
			imageToImage: false,
			multiImage: false
		},
		accepts: {
			...baseAccepts,
			imageInput: false,
			imageSize: true,
			quality: true
		},
		routing: { editRoute: IMAGE_MODEL_IDS.GPT_IMAGE_2_EDIT },
		defaults: {
			quality: "high",
			outputFormat: "png",
			aspectRatio: "1:1"
		}
	},
	{
		id: IMAGE_MODEL_IDS.GPT_IMAGE_2_EDIT,
		name: "GPT Image 2 Edit",
		description:
			"Highest-quality GPT Image 2 editing route for uploaded images, existing image artifacts, and masked edits.",
		provider: "fal",
		falEndpoint: "fal-ai/gpt-image-2/image-to-image",
		modelFamily: "gpt-image-2",
		endpointKind: "image-edit",
		capabilities: {
			textToImage: false,
			imageToImage: true,
			multiImage: true,
			mask: true
		},
		accepts: {
			...baseAccepts,
			imageInput: true,
			aspectRatio: false,
			imageSize: false,
			quality: true,
			mask: true
		},
		routing: { textRoute: IMAGE_MODEL_IDS.GPT_IMAGE_2 },
		defaults: {
			quality: "high",
			outputFormat: "png",
			aspectRatio: "1:1"
		}
	},
	{
		id: IMAGE_MODEL_IDS.GPT_IMAGE_1_5,
		name: "GPT Image 1.5",
		description:
			"Top-tier OpenAI image generation on FAL for high-quality general creative output.",
		provider: "fal",
		falEndpoint: "fal-ai/gpt-image-1.5",
		modelFamily: "gpt-image-1.5",
		endpointKind: "text-to-image",
		capabilities: {
			textToImage: true,
			imageToImage: false,
			multiImage: false
		},
		accepts: {
			...baseAccepts,
			imageInput: false,
			imageSize: true,
			quality: true
		},
		routing: { editRoute: IMAGE_MODEL_IDS.GPT_IMAGE_2_EDIT },
		defaults: {
			quality: "high",
			outputFormat: "png",
			aspectRatio: "1:1"
		}
	},
	{
		id: IMAGE_MODEL_IDS.NANO_BANANA_PRO,
		name: "Nano Banana Pro",
		description:
			"Gemini 3 Pro Image generation on FAL, with high-quality output and strong instruction following.",
		provider: "fal",
		falEndpoint: "fal-ai/gemini-3-pro-image-preview",
		modelFamily: "nano-banana-pro",
		endpointKind: "text-to-image",
		capabilities: {
			textToImage: true,
			imageToImage: false,
			multiImage: false
		},
		accepts: {
			...baseAccepts,
			imageInput: false,
			resolution: true
		},
		routing: { editRoute: IMAGE_MODEL_IDS.NANO_BANANA_PRO_EDIT },
		defaults: {
			resolution: "2K",
			outputFormat: "png",
			aspectRatio: "1:1"
		}
	},
	{
		id: IMAGE_MODEL_IDS.NANO_BANANA_PRO_EDIT,
		name: "Nano Banana Pro Edit",
		description:
			"Gemini editing route for complex natural-language edits and multi-reference character consistency.",
		provider: "fal",
		falEndpoint: "fal-ai/nano-banana-pro/edit",
		modelFamily: "nano-banana-pro",
		endpointKind: "multi-reference-edit",
		capabilities: {
			textToImage: false,
			imageToImage: true,
			multiImage: true
		},
		accepts: {
			...baseAccepts,
			imageInput: true,
			resolution: true
		},
		routing: { textRoute: IMAGE_MODEL_IDS.NANO_BANANA_PRO },
		defaults: {
			resolution: "2K",
			outputFormat: "png",
			aspectRatio: "1:1"
		}
	},
	{
		id: IMAGE_MODEL_IDS.SEEDREAM_4_5,
		name: "Seedream 4.5",
		description:
			"Modern ByteDance text-to-image model with strong quality and cost performance.",
		provider: "fal",
		falEndpoint: "fal-ai/bytedance/seedream/v4.5/text-to-image",
		modelFamily: "seedream",
		endpointKind: "text-to-image",
		capabilities: {
			textToImage: true,
			imageToImage: false,
			multiImage: false
		},
		accepts: {
			...baseAccepts,
			imageInput: false,
			imageSize: true
		},
		routing: { editRoute: IMAGE_MODEL_IDS.SEEDREAM_5_LITE_EDIT },
		defaults: {
			outputFormat: "png",
			aspectRatio: "1:1"
		}
	},
	{
		id: IMAGE_MODEL_IDS.SEEDREAM_5_LITE,
		name: "Seedream 5 Lite",
		description:
			"Fast, cost-effective ByteDance generator with high-resolution output.",
		provider: "fal",
		falEndpoint: "fal-ai/bytedance/seedream/v5/lite/text-to-image",
		modelFamily: "seedream",
		endpointKind: "text-to-image",
		capabilities: {
			textToImage: true,
			imageToImage: false,
			multiImage: false
		},
		accepts: {
			...baseAccepts,
			imageInput: false,
			imageSize: true
		},
		routing: { editRoute: IMAGE_MODEL_IDS.SEEDREAM_5_LITE_EDIT },
		defaults: {
			outputFormat: "png",
			aspectRatio: "1:1"
		}
	},
	{
		id: IMAGE_MODEL_IDS.SEEDREAM_5_LITE_EDIT,
		name: "Seedream 5 Lite Edit",
		description:
			"Cost-effective ByteDance editor for multi-reference image edits.",
		provider: "fal",
		falEndpoint: "fal-ai/bytedance/seedream/v5/lite/edit",
		modelFamily: "seedream",
		endpointKind: "multi-reference-edit",
		capabilities: {
			textToImage: false,
			imageToImage: true,
			multiImage: true
		},
		accepts: {
			...baseAccepts,
			imageInput: true,
			imageSize: true
		},
		routing: { textRoute: IMAGE_MODEL_IDS.SEEDREAM_5_LITE },
		defaults: {
			outputFormat: "png",
			aspectRatio: "1:1"
		}
	},
	{
		id: IMAGE_MODEL_IDS.FLUX_2_PRO,
		name: "FLUX.2 Pro",
		description:
			"Production-grade FLUX.2 generation with fixed quality optimization and predictable output.",
		provider: "fal",
		falEndpoint: "fal-ai/flux-2-pro",
		modelFamily: "flux-2",
		endpointKind: "text-to-image",
		capabilities: {
			textToImage: true,
			imageToImage: false,
			multiImage: false
		},
		accepts: {
			...baseAccepts,
			imageInput: false
		},
		routing: { editRoute: IMAGE_MODEL_IDS.FLUX_2_PRO_EDIT },
		defaults: {
			outputFormat: "png",
			aspectRatio: "1:1"
		}
	},
	{
		id: IMAGE_MODEL_IDS.FLUX_2_PRO_EDIT,
		name: "FLUX.2 Pro Edit",
		description:
			"Production-grade FLUX.2 multi-reference editing with catalog-scoped parameters.",
		provider: "fal",
		falEndpoint: "fal-ai/flux-2-pro/edit",
		modelFamily: "flux-2",
		endpointKind: "multi-reference-edit",
		capabilities: {
			textToImage: false,
			imageToImage: true,
			multiImage: true
		},
		accepts: {
			...baseAccepts,
			imageInput: true
		},
		routing: { textRoute: IMAGE_MODEL_IDS.FLUX_2_PRO },
		defaults: {
			outputFormat: "png",
			aspectRatio: "1:1"
		}
	},
	{
		id: IMAGE_MODEL_IDS.IDEOGRAM_V4,
		name: "Ideogram v4",
		description:
			"Specialist model for posters, logos, crisp typography, and design assets.",
		provider: "fal",
		falEndpoint: "ideogram/v4",
		modelFamily: "ideogram",
		endpointKind: "text-to-image",
		capabilities: {
			textToImage: true,
			imageToImage: false,
			multiImage: false
		},
		accepts: {
			...baseAccepts,
			imageInput: false,
			imageSize: true
		},
		routing: { editRoute: IMAGE_MODEL_IDS.GPT_IMAGE_2_EDIT },
		defaults: {
			outputFormat: "png",
			aspectRatio: "1:1"
		}
	},
	{
		id: IMAGE_MODEL_IDS.KREA_V2_LARGE,
		name: "Krea 2 Large",
		description:
			"Creative high-fidelity generation route with support for style-reference workflows.",
		provider: "fal",
		falEndpoint: "krea/v2/large/text-to-image",
		modelFamily: "krea",
		endpointKind: "text-to-image",
		capabilities: {
			textToImage: true,
			imageToImage: false,
			multiImage: false,
			styleReference: true
		},
		accepts: {
			...baseAccepts,
			imageInput: false,
			seed: true
		},
		routing: { editRoute: IMAGE_MODEL_IDS.GPT_IMAGE_2_EDIT },
		defaults: {
			outputFormat: "png",
			aspectRatio: "1:1"
		}
	},
	{
		id: IMAGE_MODEL_IDS.NANO_BANANA_LITE,
		name: "Nano Banana Lite",
		description:
			"Fast, lower-cost Gemini image model for drafts and quick iterations.",
		provider: "fal",
		falEndpoint: "google/nano-banana-lite",
		modelFamily: "nano-banana-lite",
		endpointKind: "text-to-image",
		capabilities: {
			textToImage: true,
			imageToImage: true,
			multiImage: true
		},
		accepts: {
			...baseAccepts,
			imageInput: true
		},
		defaults: {
			outputFormat: "png",
			aspectRatio: "1:1"
		}
	},
	{
		id: IMAGE_MODEL_IDS.FLUX_2_KLEIN,
		name: "FLUX.2 Klein 9B",
		description:
			"Budget FLUX.2 route for low-cost generation and experimentation.",
		provider: "fal",
		falEndpoint: "fal-ai/flux-2/klein/9b",
		modelFamily: "flux-2",
		endpointKind: "text-to-image",
		capabilities: {
			textToImage: true,
			imageToImage: false,
			multiImage: false
		},
		accepts: {
			...baseAccepts,
			imageInput: false
		},
		routing: { editRoute: IMAGE_MODEL_IDS.FLUX_2_PRO_EDIT },
		defaults: {
			outputFormat: "png",
			aspectRatio: "1:1"
		}
	}
]

export const ALL_MODEL_IDS = Object.values(MODEL_IDS)
export const ALL_IMAGE_MODEL_IDS = Object.values(IMAGE_MODEL_IDS)
export const USER_SELECTABLE_IMAGE_MODEL_IDS = ALL_IMAGE_MODEL_IDS

export const DEFAULT_CHAT_MODEL: ModelId = MODEL_IDS.CLAUDE_SONNET_5
export const DEFAULT_IMAGE_MODEL: ImageModelId = IMAGE_MODEL_IDS.GPT_IMAGE_2

export const getImageModelConfig = (modelId: ImageModelId): ImageModel => {
	const model = imageModels.find((imageModel) => imageModel.id === modelId)
	if (!model) {
		throw new Error(`Unknown image model: ${modelId}`)
	}
	return model
}

export const isImageModelId = (modelId: string): modelId is ImageModelId =>
	(ALL_IMAGE_MODEL_IDS as readonly string[]).includes(modelId)

export const isChatModelId = (modelId: string): modelId is ModelId =>
	(ALL_MODEL_IDS as readonly string[]).includes(modelId)

export const getRoutedImageModelId = ({
	selectedModelId,
	hasInputImages
}: {
	selectedModelId: ImageModelId
	hasInputImages: boolean
}): ImageModelId => {
	const selectedModel = getImageModelConfig(selectedModelId)

	if (hasInputImages) {
		if (selectedModel.capabilities.imageToImage) {
			return selectedModelId
		}
		if (selectedModel.routing?.editRoute) {
			return selectedModel.routing.editRoute
		}
		throw new Error(
			`Image model ${selectedModelId} cannot edit images and has no edit route`
		)
	}

	if (selectedModel.capabilities.textToImage) {
		return selectedModelId
	}
	if (selectedModel.routing?.textRoute) {
		return selectedModel.routing.textRoute
	}
	throw new Error(
		`Image model ${selectedModelId} requires image input and has no text route`
	)
}

export const modelSupportsGuidanceScale = (modelId: ImageModelId): boolean =>
	getImageModelConfig(modelId).accepts.guidanceScale

export const mapUniversalRatioToImageSize = (
	aspectRatio: UniversalAspectRatio
): string => {
	const mapping: Record<UniversalAspectRatio, string> = {
		"1:1": "square_hd",
		"4:3": "landscape_4_3",
		"3:4": "portrait_4_3",
		"16:9": "landscape_16_9",
		"9:16": "portrait_16_9"
	}

	return mapping[aspectRatio]
}
