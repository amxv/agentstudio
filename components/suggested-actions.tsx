"use client"

import type { UseChatHelpers } from "@ai-sdk/react"
import { motion } from "framer-motion"
import { memo } from "react"
import { Button } from "./ui/button"
import type { VisibilityType } from "./visibility-selector"

interface SuggestedActionsProps {
	chatId: string
	setInput: UseChatHelpers["setInput"]
	selectedVisibilityType: VisibilityType
}

function PureSuggestedActions({
	chatId,
	setInput,
	selectedVisibilityType
}: SuggestedActionsProps) {
	const suggestedActions = [
		{
			title: "Create a professional",
			label: "headshot photo",
			action: "Generate a professional business headshot portrait. Person in business attire against a neutral gray background, soft studio lighting creating subtle shadows, confident expression looking directly at camera"
		},
		{
			title: "Design a company",
			label: "presentation slide",
			action: "Create a modern presentation slide template with clean layout. Title area at top, content sections with placeholder text, company branding elements, using a blue and white color scheme"
		},
		{
			title: "Generate a business",
			label: "infographic design",
			action: "Design a business infographic showing data visualization. Include bar charts, pie graphs, and icon-based statistics arranged in a vertical flow, using corporate blue and gray colors with clear typography"
		},
		{
			title: "Create a corporate",
			label: "event banner",
			action: "Design a corporate event banner with elegant typography. Company logo prominently displayed, event title in modern sans-serif font, date and venue information at bottom, sophisticated color palette"
		}
	]

	return (
		<div
			data-testid="suggested-actions"
			className="grid sm:grid-cols-2 gap-2 w-full"
		>
			{suggestedActions.map((suggestedAction, index) => (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
					transition={{ delay: 0.05 * index }}
					key={`suggested-action-${suggestedAction.title}-${index}`}
					className={index > 1 ? "hidden sm:block" : "block"}
				>
					<Button
						variant="outline"
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							setInput(suggestedAction.action)
						}}
						className="text-center border rounded-3xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-center items-center"
					>
						<span className="text-md font-normal">
							{suggestedAction.title}
						</span>
						<span className="text-md font-normal">
							{suggestedAction.label}
						</span>
					</Button>
				</motion.div>
			))}
		</div>
	)
}

export const SuggestedActions = memo(
	PureSuggestedActions,
	(prevProps, nextProps) => {
		if (prevProps.chatId !== nextProps.chatId) return false
		if (
			prevProps.selectedVisibilityType !==
			nextProps.selectedVisibilityType
		)
			return false

		return true
	}
)
