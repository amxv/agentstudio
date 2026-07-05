import type { UserType } from "@/app/(auth)/auth"
import type { ChatModel, ImageModel } from "./models"
import { ALL_MODEL_IDS, USER_SELECTABLE_IMAGE_MODEL_IDS } from "./models"
import type { Session } from "next-auth"

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
	 * TODO: For users with a paid membership, split premium models into
	 * explicit entitlement groups instead of granting the full catalog.
	 */
}

/**
 * Get available image models for a specific user based on their email and user type
 * This function applies user-specific restrictions beyond just user type
 */
export function getAvailableImageModelsForUser(
	session: Session | null
): Array<ImageModel["id"]> {
	if (!session?.user) {
		// For non-authenticated users, use guest entitlements
		return entitlementsByUserType.guest.availableImageModelIds
	}

	const userType = session.user.type
	const baseEntitlements =
		entitlementsByUserType[userType].availableImageModelIds

	return baseEntitlements
}
