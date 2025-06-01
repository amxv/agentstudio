"use client"

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	type ReactNode
} from "react"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog"
import { GenerationDetailsContent } from "@/components/generation-details"

interface GenerationDetails {
	originalPrompt: string
	enhancedPrompt: string
	modelUsed: string
	modelName: string
	modelDescription: string
	parameters: {
		guidanceScale: number
		inferenceSteps: number
		aspectRatio: string
		size: string
		strength?: number
		hasInputImages: boolean
		inputImageCount: number
	}
	generationType: string
	timestamp: string
}

interface GenerationDetailsDialogContextType {
	showGenerationDetails: (details: GenerationDetails) => void
}

const GenerationDetailsDialogContext = createContext<
	GenerationDetailsDialogContextType | undefined
>(undefined)

// Global function to show generation details
let globalShowGenerationDetails: ((details: GenerationDetails) => void) | null =
	null

export function showGenerationDetailsDialog(details: GenerationDetails) {
	if (globalShowGenerationDetails) {
		globalShowGenerationDetails(details)
	} else {
		console.error("Generation details dialog not initialized")
	}
}

export function useGenerationDetailsDialog() {
	const context = useContext(GenerationDetailsDialogContext)
	if (!context) {
		throw new Error(
			"useGenerationDetailsDialog must be used within a GenerationDetailsDialogProvider"
		)
	}
	return context
}

export function GenerationDetailsDialogProvider({
	children
}: {
	children: ReactNode
}) {
	const [isOpen, setIsOpen] = useState(false)
	const [details, setDetails] = useState<GenerationDetails | null>(null)

	const showGenerationDetails = useCallback((details: GenerationDetails) => {
		setDetails(details)
		setIsOpen(true)
	}, [])

	// Set the global function in useEffect
	useEffect(() => {
		globalShowGenerationDetails = showGenerationDetails

		return () => {
			globalShowGenerationDetails = null
		}
	}, [showGenerationDetails])

	return (
		<GenerationDetailsDialogContext.Provider
			value={{ showGenerationDetails }}
		>
			{children}
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
					{details && <GenerationDetailsContent details={details} />}
				</DialogContent>
			</Dialog>
		</GenerationDetailsDialogContext.Provider>
	)
}
