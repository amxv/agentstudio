"use client"

import { startTransition, useMemo, useOptimistic, useState } from "react"

import { saveImageModelAsCookie } from "@/app/(chat)/actions"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { imageModels } from "@/lib/ai/models"
import { cn } from "@/lib/utils"

import { entitlementsByUserType } from "@/lib/ai/entitlements"
import type { Session } from "next-auth"
import { CheckCircleFillIcon, ChevronDownIcon } from "./icons"
import { ImageIcon } from "lucide-react"

export function ImageModelSelector({
	session,
	selectedImageModelId,
	className
}: {
	session: Session
	selectedImageModelId: string
} & React.ComponentProps<typeof Button>) {
	const [open, setOpen] = useState(false)
	const [optimisticImageModelId, setOptimisticImageModelId] =
		useOptimistic(selectedImageModelId)

	const userType = session.user.type
	const { availableImageModelIds } = entitlementsByUserType[userType]

	const availableImageModels = imageModels.filter((imageModel) =>
		availableImageModelIds.includes(imageModel.id)
	)

	// Separate models by capability
	const textToImageModels = availableImageModels.filter(
		(model) =>
			model.capabilities.textToImage && !model.capabilities.imageToImage
	)
	const imageToImageModels = availableImageModels.filter(
		(model) =>
			model.capabilities.imageToImage && !model.capabilities.textToImage
	)

	const selectedImageModel = useMemo(
		() =>
			availableImageModels.find(
				(imageModel) => imageModel.id === optimisticImageModelId
			),
		[optimisticImageModelId, availableImageModels]
	)

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger
				asChild
				className={cn(
					"w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
					className
				)}
			>
				<Button
					data-testid="image-model-selector"
					variant="outline"
					className="md:px-2 md:h-[34px]"
				>
					<ImageIcon size={12} />
					{selectedImageModel?.name || "Select Model"}
					<div
						className={cn(
							"transition-transform duration-200",
							open && "rotate-180"
						)}
					>
						<ChevronDownIcon />
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="min-w-[350px]">
				{/* Text-to-Image Models Section */}
				<DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
					Text-to-Image Models
				</DropdownMenuLabel>
				{textToImageModels.map((imageModel) => {
					const { id } = imageModel

					return (
						<DropdownMenuItem
							data-testid={`image-model-selector-item-${id}`}
							key={id}
							onSelect={() => {
								setOpen(false)

								startTransition(() => {
									setOptimisticImageModelId(id)
									saveImageModelAsCookie(id)
								})
							}}
							data-active={id === optimisticImageModelId}
							asChild
						>
							<button
								type="button"
								className="gap-4 group/item flex flex-row justify-between items-center w-full"
							>
								<div className="flex flex-col gap-1 items-start">
									<div className="flex items-center gap-2">
										<span>{imageModel.name}</span>
									</div>
									<div className="text-xs text-muted-foreground text-left">
										{imageModel.description}
									</div>
								</div>

								<div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
									<CheckCircleFillIcon />
								</div>
							</button>
						</DropdownMenuItem>
					)
				})}

				{/* Separator between sections */}
				{textToImageModels.length > 0 &&
					imageToImageModels.length > 0 && <DropdownMenuSeparator />}

				{/* Image-to-Image Models Section */}
				<DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
					Image-to-Image Models
				</DropdownMenuLabel>
				{imageToImageModels.map((imageModel) => {
					const { id } = imageModel

					return (
						<DropdownMenuItem
							data-testid={`image-model-selector-item-${id}`}
							key={id}
							onSelect={() => {
								setOpen(false)

								startTransition(() => {
									setOptimisticImageModelId(id)
									saveImageModelAsCookie(id)
								})
							}}
							data-active={id === optimisticImageModelId}
							asChild
						>
							<button
								type="button"
								className="gap-4 group/item flex flex-row justify-between items-center w-full"
							>
								<div className="flex flex-col gap-1 items-start">
									<div className="flex items-center gap-2">
										<span>{imageModel.name}</span>
									</div>
									<div className="text-xs text-muted-foreground text-left">
										{imageModel.description}
									</div>
								</div>

								<div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
									<CheckCircleFillIcon />
								</div>
							</button>
						</DropdownMenuItem>
					)
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
