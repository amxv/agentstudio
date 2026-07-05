"use client"

import type { Suggestion } from "@/lib/db/schema"

export type DataStreamDelta = {
	type:
		| "text-delta"
		| "code-delta"
		| "sheet-delta"
		| "image-delta"
		| "slides-delta"
		| "generation-details"
		| "title"
		| "id"
		| "suggestion"
		| "clear"
		| "finish"
		| "kind"
	content: string | Suggestion
}

export function DataStreamHandler({ id }: { id: string }) {
	void id
	return null
}
