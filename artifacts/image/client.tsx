import { Artifact } from "@/components/create-artifact"
import {
	Copy,
	Redo,
	Undo,
	RotateCcw,
	Palette,
	Image,
	Download,
	Edit,
	Sparkles
} from "lucide-react"
import { ImageEditor } from "@/components/image-editor"
import { toast } from "sonner"

interface ImageArtifactMetadata {
	originalPrompt: string
	aspectRatio: string
	style: string
}

export const imageArtifact = new Artifact<"image", ImageArtifactMetadata>({
	kind: "image",
	description: "Useful for image generation and editing",
	initialize: async ({ setMetadata }) => {
		setMetadata({
			originalPrompt: "",
			aspectRatio: "1:1",
			style: "realistic"
		})
	},
	onStreamPart: ({ streamPart, setArtifact }) => {
		if (streamPart.type === "image-delta") {
			setArtifact((draftArtifact) => ({
				...draftArtifact,
				content: streamPart.content as string,
				isVisible: true,
				status: "streaming"
			}))
		}
	},
	content: ImageEditor,
	actions: [
		{
			icon: <RotateCcw size={18} />,
			description: "Regenerate image",
			onClick: ({ metadata }) => {
				console.log("Regenerate clicked", metadata)
			}
		},
		{
			icon: <Undo size={18} />,
			description: "View Previous version",
			onClick: ({ handleVersionChange }) => {
				handleVersionChange("prev")
			},
			isDisabled: ({ currentVersionIndex }) => {
				if (currentVersionIndex === 0) {
					return true
				}

				return false
			}
		},
		{
			icon: <Redo size={18} />,
			description: "View Next version",
			onClick: ({ handleVersionChange }) => {
				handleVersionChange("next")
			},
			isDisabled: ({ isCurrentVersion }) => {
				if (isCurrentVersion) {
					return true
				}

				return false
			}
		},
		{
			icon: <Download size={18} />,
			description: "Download image",
			onClick: ({ content }) => {
				const link = document.createElement("a")
				link.href = `data:image/png;base64,${content}`
				link.download = `generated_image_${Date.now()}.png`
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
				toast.success("Image downloaded!")
			}
		},
		{
			icon: <Copy size={18} />,
			description: "Copy image to clipboard",
			onClick: ({ content }) => {
				try {
					const img = new window.Image()
					img.src = `data:image/png;base64,${content}`

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
								"write" in navigator.clipboard &&
								"ClipboardItem" in window
							) {
								const ClipboardItem = (
									window as typeof window & {
										ClipboardItem: new (
											items: Record<string, Blob>
										) => ClipboardItem
									}
								).ClipboardItem
								navigator.clipboard.write([
									new ClipboardItem({
										"image/png": blob
									})
								])
							}
						}, "image/png")
					}

					toast.success("Copied image to clipboard!")
				} catch (error) {
					toast.error("Failed to copy image to clipboard")
				}
			}
		}
	],
	toolbar: [
		{
			icon: <RotateCcw />,
			description: "Regenerate image",
			onClick: ({ appendMessage }) => {
				appendMessage({
					role: "user",
					content:
						"Regenerate this image with the same style and composition"
				})
			}
		},
		{
			icon: <Edit />,
			description: "Edit image",
			onClick: ({ appendMessage }) => {
				appendMessage({
					role: "user",
					content:
						"Please modify this image. What changes would you like me to make?"
				})
			}
		},
		{
			icon: <Palette />,
			description: "Change style",
			onClick: ({ appendMessage }) => {
				appendMessage({
					role: "user",
					content:
						"Create a variation of this image in a different artistic style (e.g., watercolor, oil painting, digital art, photorealistic, cartoon, etc.)"
				})
			}
		},
		{
			icon: <Image />,
			description: "Change aspect ratio",
			onClick: ({ appendMessage }) => {
				appendMessage({
					role: "user",
					content:
						"Recreate this image in a different aspect ratio (16:9 landscape, 9:16 portrait, or 4:3)"
				})
			}
		},
		{
			icon: <Sparkles />,
			description: "Enhance image",
			onClick: ({ appendMessage }) => {
				appendMessage({
					role: "user",
					content:
						"Enhance this image with better lighting, more detail, and improved composition"
				})
			}
		}
	]
})
