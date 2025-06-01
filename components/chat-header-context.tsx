"use client"

import {
	createContext,
	useContext,
	useState,
	useCallback,
	type ReactNode
} from "react"
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

	const updateHeaderState = useCallback((state: ChatHeaderState) => {
		setHeaderState((prevState) => {
			// Only update if the state has actually changed
			if (!prevState) return state

			const hasChanged =
				prevState.chatId !== state.chatId ||
				prevState.selectedModelId !== state.selectedModelId ||
				prevState.selectedImageModelId !== state.selectedImageModelId ||
				prevState.selectedAspectRatio !== state.selectedAspectRatio ||
				prevState.selectedGuidanceScale !==
					state.selectedGuidanceScale ||
				prevState.selectedVisibilityType !==
					state.selectedVisibilityType ||
				prevState.isReadonly !== state.isReadonly

			return hasChanged ? state : prevState
		})
	}, [])

	const clearHeaderState = useCallback(() => {
		setHeaderState(null)
	}, [])

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
