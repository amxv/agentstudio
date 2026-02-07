import { Artifact } from "@/components/create-artifact"
import {
	Copy,
	Redo,
	Undo,
	Download,
	Edit,
	Sparkles,
	Presentation,
	ChevronLeft,
	ChevronRight,
	Maximize2,
	RotateCcw,
	FileText
} from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

interface SlideData {
	title: string
	content: string
	slideNumber: number
	totalSlides: number
	imageUrl?: string | null
	error?: string
}

interface SlidesArtifactMetadata {
	currentSlideIndex: number
	isFullscreen: boolean
	zoom: number
}

interface SlidesContent {
	title: string
	slides: SlideData[]
	originalMarkdown: string
	generatedAt: string
	modelUsed: string
	updatedAt?: string
	updateDescription?: string
}

function SlidesViewer({
	content,
	metadata,
	setMetadata,
	isCurrentVersion,
	onSaveContent
}: {
	content: string
	metadata: SlidesArtifactMetadata
	setMetadata: (metadata: SlidesArtifactMetadata) => void
	isCurrentVersion: boolean
	onSaveContent: (content: string, debounce: boolean) => void
}) {
	let slidesData: SlidesContent

	try {
		slidesData = JSON.parse(content)
	} catch (error) {
		return (
			<div className="flex items-center justify-center h-64 text-gray-500">
				<div className="text-center">
					<FileText className="mx-auto mb-2" size={48} />
					<p>Invalid slide deck data</p>
				</div>
			</div>
		)
	}

	const { slides = [] } = slidesData
	const currentSlide = slides[metadata.currentSlideIndex] || slides[0]

	if (!currentSlide) {
		return (
			<div className="flex items-center justify-center h-64 text-gray-500">
				<div className="text-center">
					<Presentation className="mx-auto mb-2" size={48} />
					<p>No slides available</p>
				</div>
			</div>
		)
	}

	const goToSlide = (index: number) => {
		const newIndex = Math.max(0, Math.min(index, slides.length - 1))
		setMetadata({
			...metadata,
			currentSlideIndex: newIndex
		})
	}

	const nextSlide = () => goToSlide(metadata.currentSlideIndex + 1)
	const prevSlide = () => goToSlide(metadata.currentSlideIndex - 1)

	return (
		<div
			className={`flex flex-col h-full ${metadata.isFullscreen ? "fixed inset-0 z-50 bg-black" : ""}`}
		>
			{/* Slide Navigation Header */}
			<div className="flex items-center justify-between p-4 border-b bg-gray-50">
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={prevSlide}
						disabled={metadata.currentSlideIndex === 0}
						className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<ChevronLeft size={16} />
					</button>
					<span className="text-sm font-medium">
						{metadata.currentSlideIndex + 1} / {slides.length}
					</span>
					<button
						type="button"
						onClick={nextSlide}
						disabled={
							metadata.currentSlideIndex === slides.length - 1
						}
						className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<ChevronRight size={16} />
					</button>
				</div>

				<div className="flex items-center gap-2">
					<h3 className="text-sm font-medium text-gray-700">
						{currentSlide.title}
					</h3>
				</div>

				<div className="flex items-center gap-2">
					<button
						onClick={() =>
							setMetadata({
								...metadata,
								isFullscreen: !metadata.isFullscreen
							})
						}
						className="p-2 rounded-lg border hover:bg-gray-100"
					>
						<Maximize2 size={16} />
					</button>
				</div>
			</div>

			{/* Slide Content */}
			<div className="flex-1 flex items-center justify-center p-4 bg-gray-100">
				{currentSlide.imageUrl ? (
					<div
						className="max-w-full max-h-full"
						style={{
							transform: `scale(${metadata.zoom})`,
							transition: "transform 0.2s ease"
						}}
					>
						<img
							src={currentSlide.imageUrl}
							alt={`Slide ${currentSlide.slideNumber}: ${currentSlide.title}`}
							className="max-w-full max-h-full object-contain shadow-lg rounded-lg"
						/>
					</div>
				) : currentSlide.error ? (
					<div className="text-center text-red-500">
						<div className="bg-red-50 border border-red-200 rounded-lg p-4">
							<p className="font-medium">
								Failed to generate slide
							</p>
							<p className="text-sm mt-1">{currentSlide.error}</p>
						</div>
					</div>
				) : (
					<div className="text-center text-gray-500">
						<div className="bg-gray-200 border border-gray-300 rounded-lg p-8 min-w-[300px] min-h-[200px] flex items-center justify-center">
							<div>
								<Presentation
									className="mx-auto mb-2"
									size={48}
								/>
								<p>Generating slide...</p>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Slide Thumbnails */}
			<div className="border-t bg-gray-50 p-4">
				<div className="flex gap-2 overflow-x-auto pb-2">
					{slides.map((slide, index) => (
						<button
							key={index}
							onClick={() => goToSlide(index)}
							className={`flex-shrink-0 w-20 h-14 rounded border-2 overflow-hidden ${
								index === metadata.currentSlideIndex
									? "border-blue-500 ring-2 ring-blue-200"
									: "border-gray-300 hover:border-gray-400"
							}`}
						>
							{slide.imageUrl ? (
								<img
									src={slide.imageUrl}
									alt={`Slide ${slide.slideNumber}`}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full bg-gray-200 flex items-center justify-center">
									<span className="text-xs text-gray-500">
										{slide.slideNumber}
									</span>
								</div>
							)}
						</button>
					))}
				</div>
			</div>

			{/* Slide Details */}
			<div className="border-t p-4 bg-white">
				<div className="text-sm text-gray-600">
					<p className="font-medium mb-1">{currentSlide.title}</p>
					<details className="mt-2">
						<summary className="cursor-pointer text-blue-600 hover:text-blue-800">
							View slide markdown
						</summary>
						<pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
							{currentSlide.content}
						</pre>
					</details>
				</div>
			</div>
		</div>
	)
}

export const slidesArtifact = new Artifact<"slides", SlidesArtifactMetadata>({
	kind: "slides",
	description:
		"Useful for creating presentation slide decks from markdown content. Automatically generates professional slide images using AI image generation models.",
	initialize: async ({ setMetadata }) => {
		setMetadata({
			currentSlideIndex: 0,
			isFullscreen: false,
			zoom: 1
		})
	},
	onStreamPart: ({ streamPart, setArtifact }) => {
		if (streamPart.type === "slides-delta") {
			setArtifact((draftArtifact) => ({
				...draftArtifact,
				content: streamPart.content as string,
				isVisible: true,
				status: "idle"
			}))
		}
	},
	content: SlidesViewer,
	actions: [
		{
			icon: <ChevronLeft size={18} />,
			description: "Previous slide",
			onClick: ({ metadata, setMetadata }) => {
				const newIndex = Math.max(0, metadata.currentSlideIndex - 1)
				setMetadata({
					...metadata,
					currentSlideIndex: newIndex
				})
			},
			isDisabled: ({ metadata }) => {
				return metadata.currentSlideIndex === 0
			}
		},
		{
			icon: <ChevronRight size={18} />,
			description: "Next slide",
			onClick: ({ metadata, setMetadata, content }) => {
				let slidesData: SlidesContent
				try {
					slidesData = JSON.parse(content)
				} catch {
					return
				}
				const maxIndex = (slidesData.slides?.length || 1) - 1
				const newIndex = Math.min(
					maxIndex,
					metadata.currentSlideIndex + 1
				)
				setMetadata({
					...metadata,
					currentSlideIndex: newIndex
				})
			},
			isDisabled: ({ metadata, content }) => {
				let slidesData: SlidesContent
				try {
					slidesData = JSON.parse(content)
				} catch {
					return true
				}
				const maxIndex = (slidesData.slides?.length || 1) - 1
				return metadata.currentSlideIndex >= maxIndex
			}
		},
		{
			icon: <Maximize2 size={18} />,
			description: "Toggle fullscreen",
			onClick: ({ metadata, setMetadata }) => {
				setMetadata({
					...metadata,
					isFullscreen: !metadata.isFullscreen
				})
			}
		},
		{
			icon: <Undo size={18} />,
			description: "View Previous version",
			onClick: ({ handleVersionChange }) => {
				handleVersionChange("prev")
			},
			isDisabled: ({ currentVersionIndex }) => {
				return currentVersionIndex === 0
			}
		},
		{
			icon: <Redo size={18} />,
			description: "View Next version",
			onClick: ({ handleVersionChange }) => {
				handleVersionChange("next")
			},
			isDisabled: ({ isCurrentVersion }) => {
				return isCurrentVersion
			}
		},
		{
			icon: <Download size={18} />,
			description: "Download slide",
			onClick: ({ content, metadata }) => {
				let slidesData: SlidesContent
				try {
					slidesData = JSON.parse(content)
				} catch {
					toast.error("Invalid slide data")
					return
				}

				const currentSlide =
					slidesData.slides[metadata.currentSlideIndex]
				if (!currentSlide?.imageUrl) {
					toast.error("No image available for this slide")
					return
				}

				const link = document.createElement("a")
				link.href = currentSlide.imageUrl
				link.download = `slide_${currentSlide.slideNumber}_${currentSlide.title.replace(/[^a-zA-Z0-9]/g, "_")}.png`
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
				toast.success("Slide downloaded!")
			}
		},
		{
			icon: <Copy size={18} />,
			description: "Copy slide to clipboard",
			onClick: ({ content, metadata }) => {
				let slidesData: SlidesContent
				try {
					slidesData = JSON.parse(content)
				} catch {
					toast.error("Invalid slide data")
					return
				}

				const currentSlide =
					slidesData.slides[metadata.currentSlideIndex]
				if (!currentSlide?.imageUrl) {
					toast.error("No image available for this slide")
					return
				}

				try {
					const img = new Image()
					img.src = currentSlide.imageUrl

					img.onload = () => {
						const canvas = document.createElement("canvas")
						canvas.width = img.width
						canvas.height = img.height
						const ctx = canvas.getContext("2d")
						ctx?.drawImage(img, 0, 0)
						canvas.toBlob((blob) => {
							if (
								blob &&
								navigator.clipboard &&
								"write" in navigator.clipboard
							) {
								const ClipboardItem = (window as any)
									.ClipboardItem
								navigator.clipboard.write([
									new ClipboardItem({
										"image/png": blob
									})
								])
								toast.success("Slide copied to clipboard!")
							}
						}, "image/png")
					}
				} catch (error) {
					toast.error("Failed to copy slide to clipboard")
				}
			}
		}
	],
	toolbar: [
		{
			icon: <RotateCcw />,
			description: "Regenerate all slides",
			onClick: ({ appendMessage }) => {
				appendMessage({
					role: "user",
					content:
						"Regenerate all slides with the same content but refreshed styling"
				})
			}
		},
		{
			icon: <Edit />,
			description: "Edit slide deck",
			onClick: ({ appendMessage }) => {
				appendMessage({
					role: "user",
					content:
						"I'd like to modify this slide deck. What changes would you like me to make?"
				})
			}
		},
		{
			icon: <Sparkles />,
			description: "Enhance slides",
			onClick: ({ appendMessage }) => {
				appendMessage({
					role: "user",
					content:
						"Enhance the visual design and layout of all slides for better presentation impact"
				})
			}
		},
		{
			icon: <Presentation />,
			description: "Change style",
			onClick: ({ appendMessage }) => {
				appendMessage({
					role: "user",
					content:
						"Apply a different presentation style to all slides (e.g., modern, minimal, corporate, creative)"
				})
			}
		},
		{
			icon: <FileText />,
			description: "View markdown",
			onClick: ({ appendMessage, content }) => {
				let slidesData: SlidesContent
				try {
					slidesData = JSON.parse(content)
				} catch {
					toast.error("Invalid slide data")
					return
				}

				appendMessage({
					role: "user",
					content: `Here's the original markdown for this slide deck:\n\n\`\`\`markdown\n${slidesData.originalMarkdown}\n\`\`\``
				})
			}
		}
	]
})
