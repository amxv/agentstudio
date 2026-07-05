import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"

import { auth } from "@/app/(auth)/auth"
import { Chat } from "@/components/chat"
import { DataStreamHandler } from "@/components/data-stream-handler"
import {
	DEFAULT_CHAT_MODEL,
	DEFAULT_IMAGE_MODEL,
	isChatModelId,
	isImageModelId
} from "@/lib/ai/models"
import { getChatById, getMessagesByChatId } from "@/lib/db/queries"
import type { DBMessage } from "@/lib/db/schema"
import type {
	AppAttachment as Attachment,
	AppUIMessage as UIMessage
} from "@/lib/ai/types"

export default async function Page(props: { params: Promise<{ id: string }> }) {
	const params = await props.params
	const { id } = params
	const chat = await getChatById({ id })

	if (!chat) {
		notFound()
	}

	const session = await auth()

	if (!session) {
		redirect("/login")
	}

	if (chat.visibility === "private") {
		if (!session.user) {
			return notFound()
		}

		if (session.user.id !== chat.userId) {
			return notFound()
		}
	}

	const messagesFromDb = await getMessagesByChatId({
		id
	})

	function convertToUIMessages(messages: Array<DBMessage>): Array<UIMessage> {
		return messages.map((message) => ({
			id: message.id,
			parts: message.parts as UIMessage["parts"],
			role: message.role as UIMessage["role"],
			// Note: content will soon be deprecated in @ai-sdk/react
			content: "",
			createdAt: message.createdAt,
			experimental_attachments:
				(message.attachments as Array<Attachment>) ?? []
		}))
	}

	const cookieStore = await cookies()
	const chatModelFromCookie = cookieStore.get("chat-model")
	const imageModelFromCookie = cookieStore.get("image-model")
	const aspectRatioFromCookie = cookieStore.get("aspect-ratio")
	const guidanceScaleFromCookie = cookieStore.get("guidance-scale")
	const initialChatModel =
		chatModelFromCookie && isChatModelId(chatModelFromCookie.value)
			? chatModelFromCookie.value
			: DEFAULT_CHAT_MODEL
	const initialImageModel =
		imageModelFromCookie && isImageModelId(imageModelFromCookie.value)
			? imageModelFromCookie.value
			: DEFAULT_IMAGE_MODEL

	if (!chatModelFromCookie || !imageModelFromCookie) {
		return (
			<>
				<Chat
					key={chat.id}
					id={chat.id}
					initialMessages={convertToUIMessages(messagesFromDb)}
					initialChatModel={initialChatModel}
					initialImageModel={initialImageModel}
					initialAspectRatio={aspectRatioFromCookie?.value || "1:1"}
					initialGuidanceScale={
						guidanceScaleFromCookie?.value || "10"
					}
					initialVisibilityType={chat.visibility}
					isReadonly={false}
					session={session}
					autoResume={false}
				/>
				<DataStreamHandler id={chat.id} />
			</>
		)
	}

	return (
		<>
			<Chat
				key={chat.id}
				id={chat.id}
				initialMessages={convertToUIMessages(messagesFromDb)}
				initialChatModel={initialChatModel}
				initialImageModel={initialImageModel}
				initialAspectRatio={aspectRatioFromCookie?.value || "1:1"}
				initialGuidanceScale={guidanceScaleFromCookie?.value || "10"}
				initialVisibilityType={chat.visibility}
				isReadonly={false}
				session={session}
				autoResume={false}
			/>
			<DataStreamHandler id={chat.id} />
		</>
	)
}
