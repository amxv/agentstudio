import { getResponseChunksByPrompt } from "@/tests/prompts/utils"
import type {
	LanguageModelV3CallOptions,
	LanguageModelV3GenerateResult,
	LanguageModelV3StreamPart,
	LanguageModelV3StreamResult,
	LanguageModelV3Usage
} from "@ai-sdk/provider"
import { simulateReadableStream, type ModelMessage } from "ai"
import { MockLanguageModelV3 } from "ai/test"

const stopFinishReason = { unified: "stop", raw: "stop" } as const

const testUsage: LanguageModelV3Usage = {
	inputTokens: {
		total: 10,
		noCache: 10,
		cacheRead: 0,
		cacheWrite: 0
	},
	outputTokens: {
		total: 20,
		text: 20,
		reasoning: 0
	}
}

const titleUsage: LanguageModelV3Usage = {
	inputTokens: {
		total: 3,
		noCache: 3,
		cacheRead: 0,
		cacheWrite: 0
	},
	outputTokens: {
		total: 10,
		text: 10,
		reasoning: 0
	}
}

const generateTextResult = (text: string): LanguageModelV3GenerateResult => ({
	finishReason: stopFinishReason,
	usage: testUsage,
	content: [{ type: "text", text }],
	warnings: []
})

const streamResult = (
	chunks: LanguageModelV3StreamPart[],
	chunkDelayInMs: number,
	initialDelayInMs: number
): LanguageModelV3StreamResult => ({
	stream: simulateReadableStream({
		chunkDelayInMs,
		initialDelayInMs,
		chunks
	})
})

export const chatModel = new MockLanguageModelV3({
	doGenerate: async () => generateTextResult("Hello, world!"),
	doStream: async ({ prompt }: LanguageModelV3CallOptions) =>
		streamResult(
			getResponseChunksByPrompt(prompt as ModelMessage[]),
			500,
			1000
		)
})

export const reasoningModel = new MockLanguageModelV3({
	doGenerate: async () => generateTextResult("Hello, world!"),
	doStream: async ({ prompt }: LanguageModelV3CallOptions) =>
		streamResult(
			getResponseChunksByPrompt(prompt as ModelMessage[], true),
			500,
			1000
		)
})

export const titleModel = new MockLanguageModelV3({
	doGenerate: async () => generateTextResult("This is a test title"),
	doStream: async () =>
		streamResult(
			[
				{ type: "text-start", id: "text-1" },
				{
					type: "text-delta",
					id: "text-1",
					delta: "This is a test title"
				},
				{ type: "text-end", id: "text-1" },
				{
					type: "finish",
					finishReason: stopFinishReason,
					usage: titleUsage
				}
			],
			500,
			1000
		)
})

export const artifactModel = new MockLanguageModelV3({
	doGenerate: async () => generateTextResult("Hello, world!"),
	doStream: async ({ prompt }: LanguageModelV3CallOptions) =>
		streamResult(
			getResponseChunksByPrompt(prompt as ModelMessage[]),
			50,
			100
		)
})
