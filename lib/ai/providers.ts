import { anthropic } from "@ai-sdk/anthropic"
import { fal } from "@ai-sdk/fal"
import {
	customProvider,
	extractReasoningMiddleware,
	wrapLanguageModel
} from "ai"
import { isTestEnvironment } from "../constants"
import {
	artifactModel,
	chatModel,
	reasoningModel,
	titleModel
} from "./models.test"

export const myProvider = isTestEnvironment
	? customProvider({
			languageModels: {
				"chat-model": chatModel,
				"chat-model-reasoning": reasoningModel,
				"title-model": titleModel,
				"artifact-model": artifactModel
			}
		})
	: customProvider({
			languageModels: {
				"chat-model": anthropic("claude-3-7-sonnet-20250219"),
				"chat-model-reasoning": wrapLanguageModel({
					model: anthropic("claude-3-7-sonnet-20250219"),
					middleware: extractReasoningMiddleware({ tagName: "think" })
				}),
				"title-model": anthropic("claude-3-7-sonnet-20250219"),
				"artifact-model": anthropic("claude-3-7-sonnet-20250219")
			},
			imageModels: {
				"small-model": fal.image("fal-ai/flux-pro/kontext")
			}
		})
