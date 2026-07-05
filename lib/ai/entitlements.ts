import type { UserType } from "@/app/(auth)/auth"
import type { ChatModel, ImageModel } from "./models"
import {
	ALL_MODEL_IDS,
	USER_SELECTABLE_IMAGE_MODEL_IDS,
	IMAGE_MODEL_IDS
} from "./models"
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
	 * TODO: For users with an account and a paid membership - access to all models including enterprise
	 * enterprise: {
	 *   maxMessagesPerDay: 1000,
	 *   availableChatModelIds: [
	 *     "o4-mini",
	 *     "gemini-2.5-flash",
	 *     "claude-sonnet-4",
	 *     "claude-sonnet-4-reasoning",
	 *     "gpt-4.1",
	 *     "gemini-2.5-pro"
	 *   ],
	 *   availableImageModelIds: USER_SELECTABLE_IMAGE_MODEL_IDS
	 * }
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

	// Restricted models that require special access
	const restrictedModels = [
		IMAGE_MODEL_IDS.FLUX_PRO_ULTRA,
		IMAGE_MODEL_IDS.FLUX_KONTEXT_MAX_T2I,
		IMAGE_MODEL_IDS.FLUX_KONTEXT_MAX_I2I,
		IMAGE_MODEL_IDS.FLUX_KONTEXT_MAX_MULTI
	] as const

	// Allow access to restricted models only for a@ashray.xyz
	const hasRestrictedAccess = session.user.email === "a@ashray.xyz"

	if (hasRestrictedAccess) {
		// a@ashray.xyz gets access to all models
		return baseEntitlements
	}

	// All other users get base entitlements minus restricted models
	return baseEntitlements.filter(
		(modelId) => !(restrictedModels as readonly string[]).includes(modelId)
	)
}
