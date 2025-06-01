import { cookies } from "next/headers"

import { Chat } from "@/components/chat"
import { DataStreamHandler } from "@/components/data-stream-handler"
import { DEFAULT_CHAT_MODEL, DEFAULT_IMAGE_MODEL } from "@/lib/ai/models"
import { generateUUID } from "@/lib/utils"
import { redirect } from "next/navigation"
import { auth } from "../(auth)/auth"

export default async function Page() {
	const session = await auth()

	if (!session) {
		redirect("/api/auth/guest")
	}

	const id = generateUUID()

	const cookieStore = await cookies()
	const modelIdFromCookie = cookieStore.get("chat-model")
	const imageModelIdFromCookie = cookieStore.get("image-model")

	if (!modelIdFromCookie || !imageModelIdFromCookie) {
		return (
			<>
				<Chat
					key={id}
					id={id}
					initialMessages={[]}
					initialChatModel={
						modelIdFromCookie?.value || DEFAULT_CHAT_MODEL
					}
					initialImageModel={
						imageModelIdFromCookie?.value || DEFAULT_IMAGE_MODEL
					}
					initialVisibilityType="private"
					isReadonly={false}
					session={session}
					autoResume={false}
				/>
				<DataStreamHandler id={id} />
			</>
		)
	}

	return (
		<>
			<Chat
				key={id}
				id={id}
				initialMessages={[]}
				initialChatModel={modelIdFromCookie.value}
				initialImageModel={imageModelIdFromCookie.value}
				initialVisibilityType="private"
				isReadonly={false}
				session={session}
				autoResume={false}
			/>
			<DataStreamHandler id={id} />
		</>
	)
}
