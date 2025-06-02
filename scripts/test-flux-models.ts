import { fal } from "@ai-sdk/fal"
import { experimental_generateImage } from "ai"
import dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: ".env.local" })

async function testFluxModels() {
	console.log("Testing FLUX models...")

	// Check if FAL API key is set
	if (!process.env.FAL_API_KEY && !process.env.FAL_KEY) {
		console.error(
			"❌ FAL_API_KEY or FAL_KEY environment variable is not set"
		)
		return
	}

	console.log("✅ FAL API key is configured")

	// Test FLUX Kontext model
	try {
		console.log("\n🧪 Testing FLUX Kontext text-to-image model...")

		const { image } = await experimental_generateImage({
			model: fal.image("fal-ai/flux-pro/kontext/text-to-image"),
			prompt: "A beautiful sunset over mountains",
			providerOptions: {
				fal: {
					image_size: {
						width: 512,
						height: 512
					},
					num_inference_steps: 4, // Reduced for faster testing
					aspect_ratio: "1:1"
				}
			}
		})

		console.log("✅ FLUX Kontext text-to-image model is working!")
		console.log(
			`Image generated successfully - Base64 length: ${image.base64.length}`
		)
	} catch (error) {
		console.error("❌ FLUX Kontext text-to-image model failed:")
		console.error(error)
	}

	// Test FLUX Kontext Max model
	try {
		console.log("\n🧪 Testing FLUX Kontext Max text-to-image model...")

		const { image } = await experimental_generateImage({
			model: fal.image("fal-ai/flux-pro/kontext/max/text-to-image"),
			prompt: "A serene lake with reflection",
			providerOptions: {
				fal: {
					image_size: {
						width: 512,
						height: 512
					},
					num_inference_steps: 4, // Reduced for faster testing
					aspect_ratio: "1:1"
				}
			}
		})

		console.log("✅ FLUX Kontext Max text-to-image model is working!")
		console.log(
			`Image generated successfully - Base64 length: ${image.base64.length}`
		)
	} catch (error) {
		console.error("❌ FLUX Kontext Max text-to-image model failed:")
		console.error(error)
	}

	// Test model listing
	console.log("\n📋 Available models in your provider mapping:")
	const models = [
		"fal-ai/flux-pro/kontext/text-to-image",
		"fal-ai/flux-pro/kontext/max/text-to-image",
		"fal-ai/flux-pro/kontext",
		"fal-ai/flux-pro/kontext/max",
		"fal-ai/flux/schnell",
		"fal-ai/flux/dev",
		"fal-ai/flux-pro/v1.1",
		"fal-ai/flux-pro/v1.1-ultra"
	]

	for (const model of models) {
		console.log(`  - ${model}`)
	}
}

// Run the test
testFluxModels().catch(console.error)
