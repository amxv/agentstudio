import { fal } from "@ai-sdk/fal"
import { experimental_generateImage } from "ai"
import dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: ".env.local" })

async function testRecraftModels() {
	console.log("Testing Recraft models...")

	// Check if FAL API key is set
	if (!process.env.FAL_API_KEY && !process.env.FAL_KEY) {
		console.error(
			"❌ FAL_API_KEY or FAL_KEY environment variable is not set"
		)
		return
	}

	console.log("✅ FAL API key is configured")

	// Test Recraft V3 text-to-image model with correct parameters
	try {
		console.log("\n🧪 Testing Recraft V3 text-to-image model...")

		const { image } = await experimental_generateImage({
			model: fal.image("fal-ai/recraft/v3/text-to-image"),
			prompt: "A beautiful sunset over mountains",
			providerOptions: {
				fal: {
					image_size: "square_hd", // Correct parameter name for Recraft
					style: "realistic_image",
					num_inference_steps: 35,
					sync_mode: true
				}
			}
		})

		console.log("✅ Recraft V3 text-to-image model is working!")
		console.log(
			`Image generated successfully - Base64 length: ${image.base64.length}`
		)
	} catch (error) {
		console.error("❌ Recraft V3 text-to-image model failed:")
		console.error(error)
	}

	// Test Recraft V3 image-to-image model
	try {
		console.log("\n🧪 Testing Recraft V3 image-to-image model...")

		// First generate a base image
		const baseImage = await experimental_generateImage({
			model: fal.image("fal-ai/flux/schnell"),
			prompt: "A simple landscape",
			providerOptions: {
				fal: {
					aspect_ratio: "1:1",
					num_inference_steps: 4,
					sync_mode: true
				}
			}
		})

		// Now test image-to-image
		const { image } = await experimental_generateImage({
			model: fal.image("fal-ai/recraft/v3/image-to-image"),
			prompt: "Transform this into a winter scene with snow",
			providerOptions: {
				fal: {
					image_url: `data:image/png;base64,${baseImage.image.base64}`,
					style: "realistic_image",
					num_inference_steps: 35,
					sync_mode: true
				}
			}
		})

		console.log("✅ Recraft V3 image-to-image model is working!")
		console.log(
			`Image generated successfully - Base64 length: ${image.base64.length}`
		)
	} catch (error) {
		console.error("❌ Recraft V3 image-to-image model failed:")
		console.error(error)
	}

	// Test with wrong parameters (what's currently happening)
	try {
		console.log(
			"\n🧪 Testing Recraft V3 with wrong parameters (current implementation)..."
		)

		const { image } = await experimental_generateImage({
			model: fal.image("fal-ai/recraft/v3/text-to-image"),
			prompt: "A beautiful sunset over mountains",
			providerOptions: {
				fal: {
					aspect_ratio: "1:1", // WRONG - should be image_size
					guidance_scale: 7, // WRONG - Recraft doesn't support this
					num_inference_steps: 35,
					sync_mode: true
				}
			}
		})

		console.log("✅ Recraft V3 with wrong parameters somehow worked!")
		console.log(
			`Image generated successfully - Base64 length: ${image.base64.length}`
		)
	} catch (error) {
		console.error(
			"❌ Recraft V3 with wrong parameters failed (as expected):"
		)
		console.error(error)
	}
}

testRecraftModels().catch(console.error)
