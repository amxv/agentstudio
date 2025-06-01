import cn from "classnames"
import { useState } from "react"
import { Minimize2 } from "lucide-react"
import Image from "next/image"
import { LoaderIcon } from "./icons"

interface ImageArtifactMetadata {
	originalPrompt: string
	aspectRatio: string
	style: string
	generationType?: "text-to-image" | "image-to-image"
	hasInputImage?: boolean
	inputImageUrl?: string
	zoom?: number
	rotation?: number
	isFullscreen?: boolean
	generationDetails?: {
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
}

interface ImageEditorProps {
	title: string
	content: string
	isCurrentVersion: boolean
	currentVersionIndex: number
	status: string
	isInline: boolean
	metadata?: ImageArtifactMetadata
	setMetadata?: (
		updater: (prev: ImageArtifactMetadata) => ImageArtifactMetadata
	) => void
}

export function ImageEditor({
	title,
	content,
	status,
	isInline,
	metadata,
	setMetadata
}: ImageEditorProps) {
	const [imageError, setImageError] = useState(false)

	const zoom = metadata?.zoom || 1
	const rotation = metadata?.rotation || 0
	const isFullscreen = metadata?.isFullscreen || false

	const handleFullscreenClose = () => {
		if (setMetadata) {
			setMetadata((prev) => ({
				originalPrompt: prev?.originalPrompt || "",
				aspectRatio: prev?.aspectRatio || "1:1",
				style: prev?.style || "realistic",
				generationType: prev?.generationType,
				hasInputImage: prev?.hasInputImage,
				inputImageUrl: prev?.inputImageUrl,
				zoom: prev?.zoom,
				rotation: prev?.rotation,
				isFullscreen: false
			}))
		}
	}

	if (status === "streaming") {
		return (
			<div
				className={cn(
					"flex flex-col items-center justify-center w-full",
					{
						"h-[calc(100dvh-60px)]": !isInline,
						"h-[200px]": isInline
					}
				)}
			>
				<div className="flex flex-col gap-4 items-center">
					<div className="animate-spin">
						<LoaderIcon />
					</div>
					<div className="text-lg font-medium">
						Generating Image...
					</div>
					<div className="text-sm text-muted-foreground">
						This may take a few moments
					</div>
				</div>
			</div>
		)
	}

	// Show error state if no content or image failed to load
	if (!content || content.trim() === "" || imageError) {
		return (
			<div
				className={cn(
					"flex flex-col items-center justify-center w-full",
					{
						"h-[calc(100dvh-60px)]": !isInline,
						"h-[200px]": isInline
					}
				)}
			>
				<div className="flex flex-col gap-4 items-center text-center">
					<div className="text-lg font-medium text-muted-foreground">
						{imageError
							? "Failed to load image"
							: "No image content"}
					</div>
					<div className="text-sm text-muted-foreground">
						{imageError
							? "There was an error loading the generated image. Please try again."
							: "The image content appears to be empty. Please try generating a new image."}
					</div>
					{process.env.NODE_ENV === "development" && (
						<div className="text-xs text-muted-foreground font-mono">
							Debug: content length = {content?.length || 0},
							status = {status}
						</div>
					)}
				</div>
			</div>
		)
	}

	return (
		<div
			className={cn("flex flex-col w-full h-full", {
				"fixed inset-0 z-50 bg-black": isFullscreen
			})}
		>
			{/* Image Display Area */}
			<div
				className={cn("flex-1 flex items-center justify-center", {
					"p-4 md:p-8": !isInline && !isFullscreen,
					"p-2": isInline,
					"p-8": isFullscreen
				})}
			>
				<div
					className="relative transition-transform duration-200 ease-in-out"
					style={{
						transform: `scale(${zoom}) rotate(${rotation}deg)`
					}}
				>
					<Image
						className={cn(
							"max-w-full max-h-full object-contain rounded-2xl shadow-lg",
							{
								"max-w-[800px] max-h-[600px]":
									!isInline && !isFullscreen,
								"max-w-[300px] max-h-[200px]": isInline,
								"max-w-[90vw] max-h-[90vh]": isFullscreen
							}
						)}
						src={`data:image/png;base64,${content}`}
						alt={title}
						width={800}
						height={600}
						unoptimized={true}
						draggable={false}
						onError={() => {
							console.error("Image failed to load:", {
								title,
								contentLength: content?.length
							})
							setImageError(true)
						}}
						onLoad={() => {
							console.log("Image loaded successfully:", {
								title,
								contentLength: content?.length
							})
							setImageError(false)
						}}
					/>
				</div>
			</div>

			{/* Fullscreen overlay controls */}
			{isFullscreen && (
				<button
					type="button"
					onClick={handleFullscreenClose}
					className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-3xl transition-colors"
				>
					<Minimize2 size={16} />
				</button>
			)}
		</div>
	)
}
