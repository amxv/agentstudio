interface GenerationDetailsProps {
	details: {
		originalPrompt: string
		enhancedPrompt: string
		modelUsed: string
		modelName: string
		modelDescription: string
		provider?: string
		falEndpoint?: string
		modelFamily?: string
		endpointKind?: string
		parameters: {
			aspectRatio: string
			quality?: string
			resolution?: string
			outputFormat?: string
			hasInputImages: boolean
			inputImageCount: number
			hasMask?: boolean
		}
		generationType: string
		warnings?: Array<{ code?: string; message?: string } | string>
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
				{details.falEndpoint && (
					<p className="text-xs text-muted-foreground mt-1">
						FAL: {details.falEndpoint}
					</p>
				)}
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
					{details.parameters.quality && (
						<div>
							<span className="text-muted-foreground">
								Quality:
							</span>
							<br />
							<span>{details.parameters.quality}</span>
						</div>
					)}
					{details.parameters.resolution && (
						<div>
							<span className="text-muted-foreground">
								Resolution:
							</span>
							<br />
							<span>{details.parameters.resolution}</span>
						</div>
					)}
					{details.parameters.outputFormat && (
						<div>
							<span className="text-muted-foreground">
								Output:
							</span>
							<br />
							<span>{details.parameters.outputFormat}</span>
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
