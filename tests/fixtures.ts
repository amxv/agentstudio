import { expect as baseExpect, test as baseTest } from "@playwright/test"
import { getUnixTime } from "date-fns"
import { MODEL_IDS } from "@/lib/ai/models"
import { type UserContext, createAuthenticatedContext } from "./helpers"

interface Fixtures {
	adaContext: UserContext
	babbageContext: UserContext
	curieContext: UserContext
}

// biome-ignore lint/complexity/noBannedTypes: Playwright test fixture requires this type
export const test = baseTest.extend<{}, Fixtures>({
	adaContext: [
		async ({ browser }, use, workerInfo) => {
			const ada = await createAuthenticatedContext({
				browser,
				name: `ada-${workerInfo.workerIndex}-${getUnixTime(new Date())}`
			})

			await use(ada)
			await ada.context.close()
		},
		{ scope: "worker" }
	],
	babbageContext: [
		async ({ browser }, use, workerInfo) => {
			const babbage = await createAuthenticatedContext({
				browser,
				name: `babbage-${workerInfo.workerIndex}-${getUnixTime(new Date())}`
			})

			await use(babbage)
			await babbage.context.close()
		},
		{ scope: "worker" }
	],
	curieContext: [
		async ({ browser }, use, workerInfo) => {
			const curie = await createAuthenticatedContext({
				browser,
				name: `curie-${workerInfo.workerIndex}-${getUnixTime(new Date())}`,
				chatModel: MODEL_IDS.CLAUDE_SONNET_5
			})

			await use(curie)
			await curie.context.close()
		},
		{ scope: "worker" }
	]
})

export const expect = baseExpect
