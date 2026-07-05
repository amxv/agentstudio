"use client"

import Image from "next/image"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import {
	Heart,
	Download,
	Share2,
	Eye,
	Copy,
	Calendar,
	Palette,
	Settings
} from "lucide-react"
import { toast } from "sonner"
import type { DBImage } from "@/lib/db/schema"

interface ImageGridProps {
	images: DBImage[]
}

export function ImageGrid({ images }: ImageGridProps) {
	const [selectedImage, setSelectedImage] = useState<DBImage | null>(null)

	const handleDownload = async (imageUrl: string, prompt: string) => {
		try {
			const response = await fetch(imageUrl)
			const blob = await response.blob()
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement("a")
			a.href = url
			a.download = `${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "_")}.jpg`
			document.body.appendChild(a)
			a.click()
			window.URL.revokeObjectURL(url)
			document.body.removeChild(a)
			toast.success("Image downloaded!")
		} catch (error) {
			toast.error("Failed to download image")
		}
	}

	const handleCopyPrompt = (prompt: string) => {
		navigator.clipboard.writeText(prompt)
		toast.success("Prompt copied to clipboard!")
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
			case "generating":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
			case "failed":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
		}
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{images.map((image) => (
					<Card
						key={image.id}
						className="rounded-3xl border bg-card text-card-foreground shadow-xs overflow-hidden group"
					>
						<CardContent className="p-0">
							<div className="relative aspect-square bg-muted">
								{image.imageUrl &&
								image.status === "completed" ? (
									<Image
										src={image.imageUrl}
										alt="AI generated artwork"
										fill
										unoptimized
										sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
										className="object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										{image.status === "generating" ? (
											<div className="text-center space-y-2">
												<div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
												<p className="text-sm text-muted-foreground">
													Generating...
												</p>
											</div>
										) : image.status === "failed" ? (
											<div className="text-center space-y-2">
												<div className="h-8 w-8 text-red-500">
													⚠️
												</div>
												<p className="text-sm text-red-500">
													Failed
												</p>
											</div>
										) : (
											<div className="text-center space-y-2">
												<Palette className="h-8 w-8 text-muted-foreground" />
												<p className="text-sm text-muted-foreground">
													Pending
												</p>
											</div>
										)}
									</div>
								)}

								{/* Overlay with actions */}
								<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
									<Dialog>
										<DialogTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												className="bg-white/90 hover:bg-white"
												onClick={() =>
													setSelectedImage(image)
												}
											>
												<Eye className="h-4 w-4" />
											</Button>
										</DialogTrigger>
									</Dialog>

									{image.imageUrl && (
										<Button
											variant="outline"
											size="sm"
											className="bg-white/90 hover:bg-white"
											onClick={() =>
												image.imageUrl &&
												handleDownload(
													image.imageUrl,
													image.prompt
												)
											}
										>
											<Download className="h-4 w-4" />
										</Button>
									)}

									<Button
										variant="outline"
										size="sm"
										className="bg-white/90 hover:bg-white"
										onClick={() =>
											handleCopyPrompt(image.prompt)
										}
									>
										<Copy className="h-4 w-4" />
									</Button>
								</div>
							</div>

							{/* Image info */}
							<div className="p-4 space-y-3">
								<div className="flex items-center justify-between">
									<Badge
										variant="outline"
										className={getStatusColor(image.status)}
									>
										{image.status}
									</Badge>
									<Badge variant="outline">
										{image.model}
									</Badge>
								</div>

								<p className="text-sm text-foreground line-clamp-2 leading-relaxed">
									{image.prompt}
								</p>

								<div className="flex items-center justify-between text-xs text-muted-foreground">
									<span className="flex items-center gap-1">
										<Calendar className="h-3 w-3" />
										{new Date(
											image.createdAt
										).toLocaleDateString()}
									</span>
									<span className="flex items-center gap-1">
										<Settings className="h-3 w-3" />
										{image.width}×{image.height}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Image Detail Dialog */}
			<Dialog>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
					{selectedImage && (
						<>
							<DialogHeader>
								<DialogTitle>Image Details</DialogTitle>
							</DialogHeader>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Image */}
								<div className="space-y-4">
									{selectedImage.imageUrl ? (
										<div className="aspect-square rounded-2xl overflow-hidden bg-muted">
											<Image
												src={selectedImage.imageUrl}
												alt="AI generated artwork"
												width={selectedImage.width}
												height={selectedImage.height}
												unoptimized
												sizes="(min-width: 1024px) 50vw, 100vw"
												className="w-full h-full object-cover"
											/>
										</div>
									) : (
										<div className="aspect-square rounded-2xl bg-muted flex items-center justify-center">
											<Palette className="h-16 w-16 text-muted-foreground" />
										</div>
									)}

									{selectedImage.imageUrl && (
										<div className="flex gap-2">
											<Button
												variant="outline"
												className="flex-1"
												onClick={() =>
													selectedImage.imageUrl &&
													handleDownload(
														selectedImage.imageUrl,
														selectedImage.prompt
													)
												}
											>
												<Download className="h-4 w-4 mr-2" />
												Download
											</Button>
											<Button
												variant="outline"
												className="flex-1"
											>
												<Heart className="h-4 w-4 mr-2" />
												Save
											</Button>
											<Button
												variant="outline"
												className="flex-1"
											>
												<Share2 className="h-4 w-4 mr-2" />
												Share
											</Button>
										</div>
									)}
								</div>

								{/* Details */}
								<div className="space-y-4">
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											Prompt
										</label>
										<p className="mt-1 text-sm bg-muted p-3 rounded-2xl">
											{selectedImage.prompt}
										</p>
									</div>

									{selectedImage.negativePrompt && (
										<div>
											<label className="text-sm font-medium text-muted-foreground">
												Negative Prompt
											</label>
											<p className="mt-1 text-sm bg-muted p-3 rounded-2xl">
												{selectedImage.negativePrompt}
											</p>
										</div>
									)}

									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="text-sm font-medium text-muted-foreground">
												Model
											</label>
											<p className="mt-1 text-sm">
												{selectedImage.model}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-muted-foreground">
												Style
											</label>
											<p className="mt-1 text-sm">
												{selectedImage.style}
											</p>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="text-sm font-medium text-muted-foreground">
												Dimensions
											</label>
											<p className="mt-1 text-sm">
												{selectedImage.width} ×{" "}
												{selectedImage.height}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-muted-foreground">
												Steps
											</label>
											<p className="mt-1 text-sm">
												{selectedImage.steps}
											</p>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="text-sm font-medium text-muted-foreground">
												Guidance Scale
											</label>
											<p className="mt-1 text-sm">
												{selectedImage.guidanceScale}
											</p>
										</div>
										{selectedImage.seed && (
											<div>
												<label className="text-sm font-medium text-muted-foreground">
													Seed
												</label>
												<p className="mt-1 text-sm">
													{selectedImage.seed}
												</p>
											</div>
										)}
									</div>

									<div>
										<label className="text-sm font-medium text-muted-foreground">
											Created
										</label>
										<p className="mt-1 text-sm">
											{new Date(
												selectedImage.createdAt
											).toLocaleString()}
										</p>
									</div>

									{selectedImage.completedAt && (
										<div>
											<label className="text-sm font-medium text-muted-foreground">
												Completed
											</label>
											<p className="mt-1 text-sm">
												{new Date(
													selectedImage.completedAt
												).toLocaleString()}
											</p>
										</div>
									)}
								</div>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
