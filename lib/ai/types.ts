import type { UIMessage } from "ai"
import type { Attachment } from "@ai-sdk/ui-utils"
import type { Dispatch, SetStateAction } from "react"

export type AppAttachment = Attachment

export type AppUIMessage = UIMessage & {
	content?: string
	createdAt?: Date
	experimental_attachments?: Array<AppAttachment>
}

export type AppChatStatus = "submitted" | "streaming" | "ready" | "error"

export type AppUseChatHelpers = {
	input: string
	setInput: Dispatch<SetStateAction<string>>
	status: AppChatStatus
	messages: Array<AppUIMessage>
	setMessages: Dispatch<SetStateAction<Array<AppUIMessage>>>
	append: (message: {
		role: "user"
		content: string
		experimental_attachments?: Array<AppAttachment>
	}) => Promise<void>
	handleSubmit: (
		event?: { preventDefault?: () => void },
		options?: { experimental_attachments?: Array<AppAttachment> }
	) => void
	stop: () => void | Promise<void>
	reload: () => void | Promise<void>
	experimental_resume: () => void | Promise<void>
	data?: unknown[]
}

export type AppDataStreamWriter = {
	writeData: (data: unknown) => void
}
