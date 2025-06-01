import {
	artifactKinds,
	documentHandlersByArtifactKind
} from "@/lib/artifacts/server"
import { generateUUID } from "@/lib/utils"
import { type DataStreamWriter, tool } from "ai"
import type { UIMessage } from "ai"
import type { Session } from "next-auth"
import { z } from "zod"

interface CreateDocumentProps {
	session: Session
	dataStream: DataStreamWriter
	messages?: Array<UIMessage>
	selectedImageModel?: string
}

export const createDocument = ({
	session,
	dataStream,
	messages,
	selectedImageModel
}: CreateDocumentProps) =>
	tool({
		description:
			"Create a document for a writing or content creation activities. This tool will call other functions that will generate the contents of the document based on the title and kind.",
		parameters: z.object({
			title: z.string(),
			kind: z.enum(artifactKinds as [string, ...string[]])
		}),
		execute: async ({ title, kind }) => {
			const id = generateUUID()

			dataStream.writeData({
				type: "kind",
				content: kind
			})

			dataStream.writeData({
				type: "id",
				content: id
			})

			dataStream.writeData({
				type: "title",
				content: title
			})

			dataStream.writeData({
				type: "clear",
				content: ""
			})

			const documentHandler = documentHandlersByArtifactKind.find(
				(documentHandlerByArtifactKind) =>
					documentHandlerByArtifactKind.kind === kind
			)

			if (!documentHandler) {
				throw new Error(`No document handler found for kind: ${kind}`)
			}

			await documentHandler.onCreateDocument({
				id,
				title,
				dataStream,
				session,
				messages: messages || [],
				selectedImageModel
			})

			dataStream.writeData({ type: "finish", content: "" })

			return {
				id,
				title,
				kind,
				content:
					"A document was created and is now visible to the user."
			}
		}
	})
