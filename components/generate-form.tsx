"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Loader2, Wand2, Download, Heart, Share2 } from "lucide-react"
import { generateImage } from "@/lib/actions/generate"
import { toast } from "sonner"

const AI_MODELS = [
	{ value: "gpt-image-2", label: "GPT Image 2" },
	{ value: "gpt-image-1-5", label: "GPT Image 1.5" },
	{ value: "nano-banana-pro", label: "Nano Banana Pro" },
	{ value: "seedream-4-5", label: "Seedream 4.5" },
	{ value: "seedream-5-lite", label: "Seedream 5 Lite" },
	{ value: "flux-2-pro", label: "FLUX.2 Pro" },
	{ value: "ideogram-v4", label: "Ideogram v4" },
	{ value: "krea-v2-large", label: "Krea 2 Large" },
	{ value: "nano-banana-lite", label: "Nano Banana Lite" },
	{ value: "flux-2-klein", label: "FLUX.2 Klein 9B" }
]

const IMAGE_STYLES = [
	{ value: "photorealistic", label: "Photorealistic" },
	{ value: "artistic", label: "Artistic" },
	{ value: "anime", label: "Anime" },
	{ value: "cartoon", label: "Cartoon" },
	{ value: "abstract", label: "Abstract" },
	{ value: "minimalist", label: "Minimalist" },
	{ value: "vintage", label: "Vintage" },
	{ value: "cyberpunk", label: "Cyberpunk" }
]

const ASPECT_RATIOS = [
	{ value: "1:1", label: "Square (1:1)", width: 1024, height: 1024 },
	{ value: "16:9", label: "Landscape (16:9)", width: 1344, height: 768 },
	{ value: "9:16", label: "Portrait (9:16)", width: 768, height: 1344 },
	{ value: "4:3", label: "Classic (4:3)", width: 1152, height: 896 },
	{ value: "3:4", label: "Portrait (3:4)", width: 896, height: 1152 }
]

export function GenerateForm() {
	const [isGenerating, setIsGenerating] = useState(false)
	const [prompt, setPrompt] = useState("")
	const [negativePrompt, setNegativePrompt] = useState("")
	const [model, setModel] = useState("gpt-image-2")
	const [style, setStyle] = useState("photorealistic")
	const [aspectRatio, setAspectRatio] = useState("1:1")
	const [steps, setSteps] = useState([50])
	const [guidanceScale, setGuidanceScale] = useState([7])
	const [seed, setSeed] = useState("")
	const [generatedImage, setGeneratedImage] = useState<string | null>(null)

	const selectedAspectRatio = ASPECT_RATIOS.find(
		(ar) => ar.value === aspectRatio
	)

	const handleGenerate = async () => {
		if (!prompt.trim()) {
			toast.error("Please enter a prompt")
			return
		}

		setIsGenerating(true)
		try {
			const result = await generateImage({
				prompt: prompt.trim(),
				negativePrompt: negativePrompt.trim() || undefined,
				model,
				style,
				width: selectedAspectRatio?.width || 1024,
				height: selectedAspectRatio?.height || 1024,
				steps: steps[0],
				guidanceScale: guidanceScale[0],
				seed: seed ? parseInt(seed) : undefined
			})

			if (result.success && result.imageUrl) {
				setGeneratedImage(result.imageUrl)
				toast.success("Image generated successfully!")
			} else {
				toast.error(result.error || "Failed to generate image")
			}
		} catch (error) {
			console.error("Generation error:", error)
			toast.error("Failed to generate image")
		} finally {
			setIsGenerating(false)
		}
	}

	const handleRandomSeed = () => {
		setSeed(Math.floor(Math.random() * 1000000).toString())
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{/* Generation Form */}
			<Card className="rounded-3xl border bg-card text-card-foreground shadow-xs">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Wand2 className="h-5 w-5" />
						Image Generation
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Prompt */}
					<div className="space-y-2">
						<Label htmlFor="prompt">Prompt</Label>
						<Textarea
							id="prompt"
							placeholder="Describe the image you want to generate..."
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							className="min-h-[100px] bg-muted"
							disabled={isGenerating}
						/>
					</div>

					{/* Negative Prompt */}
					<div className="space-y-2">
						<Label htmlFor="negative-prompt">
							Negative Prompt (Optional)
						</Label>
						<Textarea
							id="negative-prompt"
							placeholder="What you don't want in the image..."
							value={negativePrompt}
							onChange={(e) => setNegativePrompt(e.target.value)}
							className="bg-muted"
							disabled={isGenerating}
						/>
					</div>

					{/* Model Selection */}
					<div className="space-y-2">
						<Label>AI Model</Label>
						<Select
							value={model}
							onValueChange={setModel}
							disabled={isGenerating}
						>
							<SelectTrigger className="bg-muted">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{AI_MODELS.map((model) => (
									<SelectItem
										key={model.value}
										value={model.value}
									>
										{model.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Style Selection */}
					<div className="space-y-2">
						<Label>Style</Label>
						<Select
							value={style}
							onValueChange={setStyle}
							disabled={isGenerating}
						>
							<SelectTrigger className="bg-muted">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{IMAGE_STYLES.map((style) => (
									<SelectItem
										key={style.value}
										value={style.value}
									>
										{style.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Aspect Ratio */}
					<div className="space-y-2">
						<Label>Aspect Ratio</Label>
						<Select
							value={aspectRatio}
							onValueChange={setAspectRatio}
							disabled={isGenerating}
						>
							<SelectTrigger className="bg-muted">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{ASPECT_RATIOS.map((ratio) => (
									<SelectItem
										key={ratio.value}
										value={ratio.value}
									>
										{ratio.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Advanced Settings */}
					<div className="space-y-4">
						<Label>Advanced Settings</Label>

						{/* Steps */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label className="text-sm">Steps</Label>
								<Badge variant="outline">{steps[0]}</Badge>
							</div>
							<Slider
								value={steps}
								onValueChange={setSteps}
								max={100}
								min={10}
								step={10}
								disabled={isGenerating}
								className="w-full"
							/>
						</div>

						{/* Guidance Scale */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label className="text-sm">
									Guidance Scale
								</Label>
								<Badge variant="outline">
									{guidanceScale[0]}
								</Badge>
							</div>
							<Slider
								value={guidanceScale}
								onValueChange={setGuidanceScale}
								max={20}
								min={1}
								step={0.5}
								disabled={isGenerating}
								className="w-full"
							/>
						</div>

						{/* Seed */}
						<div className="space-y-2">
							<Label htmlFor="seed">Seed (Optional)</Label>
							<div className="flex gap-2">
								<Input
									id="seed"
									placeholder="Random seed for reproducibility"
									value={seed}
									onChange={(e) => setSeed(e.target.value)}
									className="bg-muted"
									disabled={isGenerating}
								/>
								<Button
									type="button"
									variant="outline"
									onClick={handleRandomSeed}
									disabled={isGenerating}
								>
									Random
								</Button>
							</div>
						</div>
					</div>

					{/* Generate Button */}
					<Button
						onClick={handleGenerate}
						disabled={isGenerating || !prompt.trim()}
						className="w-full rounded-2xl"
						size="lg"
					>
						{isGenerating ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
								Generating...
							</>
						) : (
							<>
								<Wand2 className="h-4 w-4 mr-2" />
								Generate Image
							</>
						)}
					</Button>
				</CardContent>
			</Card>

			{/* Generated Image Preview */}
			<Card className="rounded-3xl border bg-card text-card-foreground shadow-xs">
				<CardHeader>
					<CardTitle>Generated Image</CardTitle>
				</CardHeader>
				<CardContent>
					{isGenerating ? (
						<div className="aspect-square bg-muted rounded-2xl flex items-center justify-center">
							<div className="text-center space-y-4">
								<Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
								<p className="text-sm text-muted-foreground">
									Generating your image...
								</p>
							</div>
						</div>
					) : generatedImage ? (
						<div className="space-y-4">
							<div className="aspect-square relative overflow-hidden rounded-2xl bg-muted">
								<Image
									src={generatedImage}
									alt="AI generated artwork"
									fill
									unoptimized
									sizes="(min-width: 1024px) 50vw, 100vw"
									className="object-cover"
								/>
							</div>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									className="flex-1"
								>
									<Download className="h-4 w-4 mr-2" />
									Download
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="flex-1"
								>
									<Heart className="h-4 w-4 mr-2" />
									Save
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="flex-1"
								>
									<Share2 className="h-4 w-4 mr-2" />
									Share
								</Button>
							</div>
						</div>
					) : (
						<div className="aspect-square bg-muted rounded-2xl flex items-center justify-center">
							<div className="text-center space-y-2">
								<Wand2 className="h-8 w-8 mx-auto text-muted-foreground" />
								<p className="text-sm text-muted-foreground">
									Your generated image will appear here
								</p>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
