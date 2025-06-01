"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { VisibilityType } from "./visibility-selector"

interface ChatHeaderState {
	chatId: string
	selectedModelId: string
	selectedImageModelId: string
	selectedAspectRatio: string
	selectedGuidanceScale: string
	selectedVisibilityType: VisibilityType
	isReadonly: boolean
}

interface ChatHeaderContextType {
	headerState: ChatHeaderState | null
	updateHeaderState: (state: ChatHeaderState) => void
	clearHeaderState: () => void
}

const ChatHeaderContext = createContext<ChatHeaderContextType | null>(null)

export function useChatHeader() {
	const context = useContext(ChatHeaderContext)
	if (!context) {
		throw new Error(
			"useChatHeader must be used within a ChatHeaderProvider"
		)
	}
	return context
}

interface ChatHeaderProviderProps {
	children: ReactNode
}

export function ChatHeaderProvider({ children }: ChatHeaderProviderProps) {
	const [headerState, setHeaderState] = useState<ChatHeaderState | null>(null)

	const updateHeaderState = (state: ChatHeaderState) => {
		setHeaderState(state)
	}

	const clearHeaderState = () => {
		setHeaderState(null)
	}

	return (
		<ChatHeaderContext.Provider
			value={{
				headerState,
				updateHeaderState,
				clearHeaderState
			}}
		>
			{children}
		</ChatHeaderContext.Provider>
	)
}
