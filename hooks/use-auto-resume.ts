"use client"

import type { DataPart } from "@/lib/types"
import type { AppUseChatHelpers as UseChatHelpers } from "@/lib/ai/types"
import type { AppUIMessage as UIMessage } from "@/lib/ai/types"
import { useEffect } from "react"

export interface UseAutoResumeParams {
	autoResume: boolean
	initialMessages: UIMessage[]
	experimental_resume: UseChatHelpers["experimental_resume"]
	data: UseChatHelpers["data"]
	setMessages: UseChatHelpers["setMessages"]
}

export function useAutoResume({
	autoResume,
	initialMessages,
	experimental_resume,
	data,
	setMessages
}: UseAutoResumeParams) {
	useEffect(() => {
		if (!autoResume) return

		const mostRecentMessage = initialMessages.at(-1)

		if (mostRecentMessage?.role === "user") {
			experimental_resume()
		}

		// we intentionally run this once
	}, [autoResume, experimental_resume, initialMessages])

	useEffect(() => {
		if (!data) return
		if (data.length === 0) return

		const dataPart = data[0] as DataPart

		if (dataPart.type === "append-message") {
			const message = JSON.parse(dataPart.message) as UIMessage
			setMessages([...initialMessages, message])
		}
	}, [data, initialMessages, setMessages])
}
