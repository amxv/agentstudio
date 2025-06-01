import type { UserType } from "@/app/(auth)/auth"
import type { ChatModel, ImageModel } from "./models"
import { ALL_MODEL_IDS, USER_SELECTABLE_IMAGE_MODEL_IDS } from "./models"

interface Entitlements {
	maxMessagesPerDay: number
	availableChatModelIds: Array<ChatModel["id"]>
	availableImageModelIds: Array<ImageModel["id"]>
}

export const entitlementsByUserType: Record<UserType, Entitlements> = {
	/*
	 * For users without an account
	 */
	guest: {
		maxMessagesPerDay: 10,
		availableChatModelIds: ALL_MODEL_IDS,
		availableImageModelIds: USER_SELECTABLE_IMAGE_MODEL_IDS
	},

	/*
	 * For users with an account
	 */
	regular: {
		maxMessagesPerDay: 100,
		availableChatModelIds: ALL_MODEL_IDS,
		availableImageModelIds: USER_SELECTABLE_IMAGE_MODEL_IDS
	}

	/*
	 * TODO: For users with an account and a paid membership - access to all models including enterprise
	 * enterprise: {
	 *   maxMessagesPerDay: 1000,
	 *   availableChatModelIds: [
	 *     "o4-mini",
	 *     "gemini-2.5-flash",
	 *     "claude-sonnet-4",
	 *     "claude-sonnet-4-reasoning",
	 *     "gpt-4.1",
	 *     "gemini-2.5-pro",
	 *     "claude-opus-4"
	 *   ],
	 *   availableImageModelIds: USER_SELECTABLE_IMAGE_MODEL_IDS
	 * }
	 */
}
