import { anthropic } from "@ai-sdk/anthropic"
import { fal } from "@ai-sdk/fal"
import { google } from "@ai-sdk/google"
import { openai } from "@ai-sdk/openai"
import {
	customProvider,
	extractReasoningMiddleware,
	wrapLanguageModel
} from "ai"
import { isTestEnvironment } from "../constants"
import { IMAGE_MODEL_IDS, MODEL_IDS, imageModels } from "./models"
import {
	artifactModel,
	chatModel,
	reasoningModel,
	titleModel
} from "./models.test"

const imageModelEntries = Object.fromEntries(
	imageModels.map((imageModel) => [
		imageModel.id,
		fal.image(imageModel.falEndpoint)
	])
)

export const myProvider = isTestEnvironment
	? customProvider({
			languageModels: {
				[MODEL_IDS.CLAUDE_FABLE_5]: chatModel,
				[MODEL_IDS.CLAUDE_OPUS_4_8]: reasoningModel,
				[MODEL_IDS.CLAUDE_SONNET_5]: chatModel,
				[MODEL_IDS.CLAUDE_HAIKU_4_5]: chatModel,
				[MODEL_IDS.GPT_5_5]: chatModel,
				[MODEL_IDS.GEMINI_3_5_FLASH]: chatModel,
				[MODEL_IDS.GEMINI_3_1_PRO_PREVIEW]: chatModel,
				[MODEL_IDS.GEMINI_3_1_FLASH_LITE]: chatModel,
				"title-model": titleModel,
				"artifact-model": artifactModel
			},
			imageModels: imageModelEntries
		})
	: customProvider({
			languageModels: {
				[MODEL_IDS.CLAUDE_FABLE_5]: anthropic("claude-fable-5"),
				[MODEL_IDS.CLAUDE_OPUS_4_8]: wrapLanguageModel({
					model: anthropic("claude-opus-4-8"),
					middleware: extractReasoningMiddleware({
						tagName: "antml:thinking"
					})
				}),
				[MODEL_IDS.CLAUDE_SONNET_5]: anthropic("claude-sonnet-5"),
				[MODEL_IDS.CLAUDE_HAIKU_4_5]: anthropic("claude-haiku-4-5"),
				[MODEL_IDS.GPT_5_5]: openai("gpt-5.5"),
				[MODEL_IDS.GEMINI_3_5_FLASH]: google("gemini-3.5-flash"),
				[MODEL_IDS.GEMINI_3_1_PRO_PREVIEW]: google(
					"gemini-3.1-pro-preview"
				),
				[MODEL_IDS.GEMINI_3_1_FLASH_LITE]: google(
					"gemini-3.1-flash-lite"
				),
				"title-model": anthropic("claude-haiku-4-5"),
				"artifact-model": anthropic("claude-sonnet-5")
			},
			imageModels: imageModelEntries
		})

export const defaultImageModel = myProvider.imageModel(
	IMAGE_MODEL_IDS.GPT_IMAGE_2
)
