interface GenerationDetailsProps {
	details: {
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

export function GenerationDetailsContent({ details }: GenerationDetailsProps) {
	return (
		<div className="space-y-4">
			<div>
				<h3 className="font-semibold text-sm mb-2">
					Generation Details
				</h3>
				<p className="text-xs text-muted-foreground">
					{new Date(details.timestamp).toLocaleString()}
				</p>
			</div>

			<div>
				<h4 className="font-medium text-sm mb-1">Model</h4>
				<p className="text-sm">{details.modelName}</p>
				{details.modelDescription && (
					<p className="text-xs text-muted-foreground mt-1">
						{details.modelDescription}
					</p>
				)}
				<p className="text-xs text-muted-foreground mt-1">
					ID: {details.modelUsed}
				</p>
			</div>

			<div>
				<h4 className="font-medium text-sm mb-1">Original Prompt</h4>
				<p className="text-sm bg-muted p-2 rounded text-wrap break-words">
					{details.originalPrompt}
				</p>
			</div>

			<div>
				<h4 className="font-medium text-sm mb-1">Enhanced Prompt</h4>
				<p className="text-sm bg-muted p-2 rounded text-wrap break-words">
					{details.enhancedPrompt}
				</p>
			</div>

			<div>
				<h4 className="font-medium text-sm mb-1">Parameters</h4>
				<div className="grid grid-cols-2 gap-2 text-sm">
					<div>
						<span className="text-muted-foreground">Type:</span>
						<br />
						<span className="capitalize">
							{details.generationType.replace("-", " ")}
						</span>
					</div>
					<div>
						<span className="text-muted-foreground">
							Aspect Ratio:
						</span>
						<br />
						<span>{details.parameters.aspectRatio}</span>
					</div>
					<div>
						<span className="text-muted-foreground">
							Guidance Scale:
						</span>
						<br />
						<span>{details.parameters.guidanceScale}</span>
					</div>
					<div>
						<span className="text-muted-foreground">
							Inference Steps:
						</span>
						<br />
						<span>{details.parameters.inferenceSteps}</span>
					</div>
					<div>
						<span className="text-muted-foreground">Size:</span>
						<br />
						<span>{details.parameters.size}</span>
					</div>
					{details.parameters.strength && (
						<div>
							<span className="text-muted-foreground">
								Strength:
							</span>
							<br />
							<span>{details.parameters.strength}</span>
						</div>
					)}
					{details.parameters.hasInputImages && (
						<div className="col-span-2">
							<span className="text-muted-foreground">
								Input Images:
							</span>
							<br />
							<span>
								{details.parameters.inputImageCount} image(s)
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
