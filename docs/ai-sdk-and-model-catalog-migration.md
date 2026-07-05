# AI SDK and Model Catalog Migration Plan

Date researched: 2026-07-05

This app currently uses AI SDK 4.x-era packages and an older image model catalog. The production image artifact path is still built around `experimental_generateImage` and a FLUX/Imagen/Recraft/Ideogram v3-era FAL catalog. This migration moves the app toward the current AI SDK image generation API and a 2026-grade FAL image model catalog while preserving the app's strongest architectural idea: the LLM plans, but the artifact handler deterministically calls the image API.

## Current state in this repository

Current package versions in `package.json`:

```json
{
  "ai": "^4.3.16",
  "@ai-sdk/fal": "^0.1.11",
  "@ai-sdk/anthropic": "^1.2.12",
  "@ai-sdk/openai": "^1.3.22",
  "@ai-sdk/google": "^1.2.18"
}
```

Primary runtime files:

- `app/(chat)/api/chat/route.ts` uses AI SDK `streamText` for the chat/tool loop.
- `artifacts/image/server.ts` uses AI SDK `experimental_generateImage` for artifact image generation.
- `lib/ai/models.ts` defines the app's selectable chat/image model catalog.
- `lib/ai/providers.ts` maps app model IDs to provider model IDs, including FAL image endpoints.
- `artifacts/image/server.ts` also contains a second FAL endpoint mapping. This duplication should be removed during the migration.

## Research summary

### AI SDK

The current public AI SDK documentation shows `generateImage` as the image generation API. The app should migrate away from `experimental_generateImage` and use `generateImage` once the package major upgrade is complete.

The AI SDK image API supports:

- `generateImage({ model, prompt })`
- access to generated image data through `image.base64` / `image.uint8Array`
- `size` and `aspectRatio` controls, depending on model support
- `n` for multiple images
- provider-specific options via `providerOptions`
- model warnings when a provider cannot support a requested setting

The npm registry check on 2026-07-05 showed newer major versions than this repo currently uses:

```txt
ai latest: 7.0.15
@ai-sdk/fal latest: 3.0.6
@ai-sdk/anthropic latest: 4.0.8
@ai-sdk/openai latest: 4.0.7
@ai-sdk/google latest: 4.0.8
```

Recommended approach: perform an AI SDK major-version spike first, then update the image model catalog. Do not combine the SDK upgrade, endpoint migration, and UI/routing changes in one untested deploy.

### Artificial Analysis image rankings

Artificial Analysis currently ranks GPT Image 2 at the top of both text-to-image and image editing. GPT Image 1.5, Nano Banana / Gemini image models, MAI-Image-2.5, and several open-weight editing models are also near the top.

Important caveat: the user requested that image/image-editing models should all be on FAL. Some high-ranked Artificial Analysis models either do not appear on FAL, were not found in FAL's public model explorer during this pass, or may be available only through a vendor route. The recommended catalog below prioritizes strong models that were found on FAL.

### Artificial Analysis LLM rankings

Artificial Analysis currently ranks newer LLMs such as Claude Fable 5, Claude Opus 4.8, GPT-5.5, Claude Opus 4.7, Claude Sonnet 5, Gemini 3.5 Flash, and Gemini 3.1 Pro Preview above this repo's existing chat catalog.

Important caveat: LLMs are not FAL image endpoints, and exact first-party model IDs must be validated against the provider account and current AI SDK provider packages before enabling them in production. Treat the LLM section below as a target catalog and validation checklist, not as blindly copy-pasteable code.

## Target LLM catalog

The app should replace the current chat catalog:

- Claude Sonnet 4
- Claude Sonnet 4 reasoning
- GPT-4.1
- o4-mini
- Gemini 2.5 Pro preview
- Gemini 2.5 Flash preview

with a 2026 catalog shaped like this:

| App ID | Display name | Provider | Provider model ID | Role |
| --- | --- | --- | --- | --- |
| `claude-fable-5` | Claude Fable 5 | Anthropic | verify in Anthropic + AI SDK account | top creative/reasoning candidate from Artificial Analysis |
| `claude-opus-4-8` | Claude Opus 4.8 | Anthropic | verify in Anthropic + AI SDK account | top quality / deep reasoning |
| `gpt-5-5-xhigh` | GPT-5.5 xhigh | OpenAI | verify in OpenAI + AI SDK account | top OpenAI reasoning tier |
| `claude-opus-4-7` | Claude Opus 4.7 | Anthropic | verify in Anthropic + AI SDK account | fallback premium Anthropic tier |
| `claude-sonnet-5` | Claude Sonnet 5 | Anthropic | verify in Anthropic + AI SDK account | high-quality default coding/writing model |
| `gpt-5-5-high` | GPT-5.5 high | OpenAI | verify in OpenAI + AI SDK account | default premium OpenAI tier |
| `gpt-5-5-medium` | GPT-5.5 medium | OpenAI | verify in OpenAI + AI SDK account | cost/quality balanced OpenAI tier |
| `gemini-3-5-flash` | Gemini 3.5 Flash | Google | verify in Google + AI SDK account | fast high-intelligence model |
| `gemini-3-1-pro-preview` | Gemini 3.1 Pro Preview | Google | `gemini-3.1-pro-preview` if still current | long-context multimodal candidate |
| `gpt-5-2` | GPT-5.2 | OpenAI | `gpt-5.2` if available in account | stable OpenAI fallback if 5.5 is unavailable |

Recommended defaults after validation:

- Default chat model: `claude-sonnet-5` or `gpt-5-5-medium`, depending on account availability and cost.
- Default title model: a fast/cheap current model, not Claude 3 Haiku unless still explicitly desired.
- Default artifact model: same as default chat model or a stronger model for prompt planning.
- Reasoning variants: use provider-native reasoning/thinking options from the current AI SDK instead of relying only on the old XML reasoning extraction wrapper.

Implementation notes:

1. Keep legacy IDs as aliases for existing chats and tests.
2. Add a provider smoke test script that calls each configured LLM once with `generateText` before exposing it in the UI.
3. Do not commit unverified model IDs as production defaults. Some Artificial Analysis names may differ from provider API identifiers.
4. Put premium models behind entitlement flags instead of hardcoded emails.

## Target FAL image catalog

The app should move to a capability-first image catalog. These are the recommended selectable families, all selected because they are either top-ranked on Artificial Analysis, present on FAL, or strategically useful for this app's product use cases.

| Priority | App ID | Display name | FAL endpoint | Capability | Why include |
| --- | --- | --- | --- | --- | --- |
| 1 | `gpt-image-2` | GPT Image 2 | `fal-ai/gpt-image-2` or `openai/gpt-image-2` after endpoint alias verification | text-to-image | Highest Artificial Analysis text-to-image model; strong typography and prompt adherence. |
| 2 | `gpt-image-2-edit` | GPT Image 2 Edit | `fal-ai/gpt-image-2/image-to-image` | image editing, mask editing | Highest Artificial Analysis editing model; supports masked editing. |
| 3 | `gpt-image-1-5` | GPT Image 1.5 | `fal-ai/gpt-image-1.5` | text-to-image | Still top-tier and useful as a fallback if GPT Image 2 cost/latency is too high. |
| 4 | `nano-banana-pro` | Nano Banana Pro / Gemini 3 Pro Image | `fal-ai/gemini-3-pro-image-preview` | text-to-image | High-quality Gemini image generation, 1K/2K/4K, up to 4 outputs. |
| 5 | `nano-banana-pro-edit` | Nano Banana Pro Edit | `fal-ai/nano-banana-pro/edit` | image editing, multi-reference | Strong editing model, up to 14 reference images, good character consistency. |
| 6 | `seedream-4-5` | Seedream 4.5 | `fal-ai/bytedance/seedream/v4.5/text-to-image` | text-to-image | Strong modern ByteDance generator, good quality/cost position. |
| 7 | `seedream-5-lite` | Seedream 5 Lite | `fal-ai/bytedance/seedream/v5/lite/text-to-image` | text-to-image, batch | Fast, cost-effective, high-resolution output up to about 9MP. |
| 8 | `seedream-5-lite-edit` | Seedream 5 Lite Edit | `fal-ai/bytedance/seedream/v5/lite/edit` | image editing, multi-reference | Cost-effective multi-reference editor; up to 10 reference images. |
| 9 | `flux-2-pro` | FLUX.2 Pro | `fal-ai/flux-2-pro` | text-to-image, references | Modern FLUX production model; simpler API with fewer tuning knobs. |
| 10 | `flux-2-pro-edit` | FLUX.2 Pro Edit | `fal-ai/flux-2-pro/edit` | image editing, multi-reference | Production-grade multi-reference editing; up to 9 reference images. |
| 11 | `ideogram-v4` | Ideogram v4 | `ideogram/v4` | text-to-image | Best fit for posters, logos, crisp text, and design assets. |
| 12 | `krea-v2-large` | Krea 2 Large | `krea/v2/large/text-to-image` | text-to-image, style references | Good for high-fidelity creative generation and style reference workflows. |
| 13 | `nano-banana-lite` | Nano Banana Lite | `google/nano-banana-lite` | text-to-image/editing, fast | Fast, cheaper Gemini image model for drafts and quick iterations. |
| 14 | `flux-2-klein` | FLUX.2 Klein 9B | `fal-ai/flux-2/klein/9b` | text-to-image, budget | Budget/open-weight style fallback. |

Recommended initial selectable top 10:

1. GPT Image 2
2. GPT Image 2 Edit
3. GPT Image 1.5
4. Nano Banana Pro
5. Nano Banana Pro Edit
6. Seedream 4.5
7. Seedream 5 Lite
8. Seedream 5 Lite Edit
9. FLUX.2 Pro
10. FLUX.2 Pro Edit

Recommended additional non-default options:

- Ideogram v4 for logo/poster/text-heavy design work.
- Krea 2 Large for style-reference creative work.
- Nano Banana Lite for fast drafts.
- FLUX.2 Klein for low-cost open-weight-ish experimentation.

Watchlist, not ready to add from this pass:

- HunyuanImage 3.0 Instruct: Artificial Analysis lists it as a leading open-weight image editing model on FAL, but a public FAL inference endpoint was not found in this pass.
- Qwen Image Edit Plus 2511: Artificial Analysis ranks it highly among open-weight editors, but the FAL explorer surfaced a trainer/reference rather than a clear inference endpoint in this pass.
- MAI-Image-2.5, Reve 2.0, and HiDream-O1-Image-1.5: highly ranked on Artificial Analysis, but FAL endpoint availability needs separate verification before adding.

## FAL API specifics by endpoint

The most important implementation change is that the old code globally sends FLUX-like parameters such as `num_inference_steps`, `guidance_scale`, `strength`, and `aspect_ratio`. Newer FAL endpoints do not share one parameter schema. The image handler should switch to per-model allowlisted `providerOptions.fal` construction.

### GPT Image 2

Endpoint candidates:

- FAL page route: `openai/gpt-image-2`
- FAL quickstart endpoint: `fal-ai/gpt-image-2`

Verify which endpoint string works with `fal.image(...)` and/or `@fal-ai/client` before committing runtime defaults.

Text-to-image parameters:

```ts
{
  prompt: string,
  image_size?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9" | { width: number; height: number },
  quality?: "low" | "medium" | "high",
  num_images?: number,
  output_format?: "jpeg" | "png" | "webp",
  sync_mode?: boolean,
  openai_api_key?: string
}
```

Image editing parameters:

```ts
{
  prompt: string,
  image_urls: string[],
  mask_image_url?: string,
  quality?: "low" | "medium" | "high",
  output_format?: "jpeg" | "png" | "webp",
  sync_mode?: boolean,
  openai_api_key?: string
}
```

Implementation decision:

- Use GPT Image 2 as the highest-quality default if account cost and latency are acceptable.
- Add mask upload later; do not block the base migration on masks.
- Treat BYOK as server-only configuration. Never expose `openai_api_key` to the browser.

### GPT Image 1.5

Endpoint:

```txt
fal-ai/gpt-image-1.5
```

Expected parameters are similar to GPT Image 2: prompt, image size, quality, number of images, output format, and sync mode. Verify exact editing support before wiring it as an editor.

Implementation decision:

- Keep as a fallback premium generator.
- Do not assume it accepts the GPT Image 2 editing endpoint shape unless verified.

### Nano Banana Pro / Gemini 3 Pro Image

Text-to-image endpoint:

```txt
fal-ai/gemini-3-pro-image-preview
```

Editing endpoint:

```txt
fal-ai/nano-banana-pro/edit
```

Important editing parameters/capabilities:

```ts
{
  prompt: string,
  image_urls: string[],
  aspect_ratio?: "auto" | "21:9" | "16:9" | "3:2" | "4:3" | "5:4" | "1:1" | "4:5" | "3:4" | "2:3" | "9:16",
  resolution?: "1K" | "2K" | "4K",
  num_images?: 1 | 2 | 3 | 4,
  output_format?: "png" | "jpeg" | "webp"
}
```

Known capabilities:

- Supports up to 14 reference images for editing.
- Good for complex natural-language edits and character consistency.
- More expensive and quality-oriented than the original Nano Banana model.

Implementation decision:

- Use as the default multi-reference editor if GPT Image 2 masking is not needed.
- Add UI copy explaining that it can combine many reference images.

### Nano Banana Lite

Endpoint:

```txt
google/nano-banana-lite
```

Known capabilities:

- Lower cost and lower latency than Nano Banana Pro.
- 1K output.
- Supports many aspect ratios.
- Useful for quick drafts, not final premium work.

Implementation decision:

- Add as the fast/default draft model if product wants a cheaper default.
- Keep premium models for final generation.

### Seedream 4.5

Endpoint:

```txt
fal-ai/bytedance/seedream/v4.5/text-to-image
```

Known capabilities:

- Text-to-image.
- Unified generation/editing architecture at the model-family level, but use the explicit FAL endpoint exposed here for text-to-image.
- Cost-effective high-quality generation.

Implementation decision:

- Add as a strong default general-purpose generator if GPT Image 2 is too expensive.
- Verify aspect ratio and output-size schema before exposing UI controls.

### Seedream 5 Lite

Text-to-image endpoint:

```txt
fal-ai/bytedance/seedream/v5/lite/text-to-image
```

Editing endpoint:

```txt
fal-ai/bytedance/seedream/v5/lite/edit
```

Known parameters/capabilities:

- Text prompt.
- `image_urls` required for editing.
- Up to 10 reference images for editing.
- High-resolution output up to roughly 3072x3072 / 9MP.
- Batch-style generation through model-specific image count controls.
- PNG output via URL by default; data URI returns through sync mode where supported.

Implementation decision:

- Use as a cost-effective high-resolution generator/editor.
- Do not pass FLUX guidance/steps/strength parameters.

### FLUX.2 Pro

Text-to-image endpoint:

```txt
fal-ai/flux-2-pro
```

Editing endpoint:

```txt
fal-ai/flux-2-pro/edit
```

Known capabilities:

- Production-grade model family.
- Editing supports up to 9 reference images and 9MP total input.
- No steps/guidance tuning required for the pro endpoints.
- Natural-language multi-reference instructions and image indexing.

Implementation decision:

- Use as the production/reliable editor where deterministic API behavior matters.
- Remove `guidance_scale`, `num_inference_steps`, and `strength` for these endpoints.

### Ideogram v4

Endpoint:

```txt
ideogram/v4
```

Known capabilities:

- Text-to-image.
- Especially strong for posters, logos, and text rendering.
- Controls include image size and rendering speed.

Implementation decision:

- Add as a specialist model, not necessarily the default.
- Route logo/poster/text-heavy prompts here if automatic routing is later expanded.

### Krea 2 Large

Endpoint:

```txt
krea/v2/large/text-to-image
```

Known capabilities:

- Text-to-image.
- Aspect ratio, creativity, seed controls.
- Optional style references.

Implementation decision:

- Add as a creative/style-reference model.
- Its style-reference support may require a custom parameter branch separate from simple T2I.

## Required code changes

### 1. Upgrade the AI SDK in isolation

Update packages together, not piecemeal:

```txt
ai
@ai-sdk/fal
@ai-sdk/anthropic
@ai-sdk/openai
@ai-sdk/google
```

Then fix compile errors before touching model behavior.

Expected changes:

- Replace `experimental_generateImage` with `generateImage` in `artifacts/image/server.ts`.
- Re-check `streamText` request/response types in `app/(chat)/api/chat/route.ts`.
- Re-check `UIMessage`, `Attachment`, and tool-call part types used by artifact routing.
- Re-check `providerOptions` typing for FAL.
- Update tests/fakes in `lib/ai/models.test.ts` if AI SDK test utilities changed.

### 2. Centralize image endpoint metadata

Create one source of truth for image endpoints. Today mapping exists in both `lib/ai/providers.ts` and `artifacts/image/server.ts`.

Recommended shape:

```ts
export type ImageEndpointKind =
  | "text-to-image"
  | "image-edit"
  | "multi-reference-edit"

export interface FalImageEndpointConfig {
  id: ImageModelId
  name: string
  falEndpoint: string
  endpointKind: ImageEndpointKind
  capabilities: {
    textToImage: boolean
    imageToImage: boolean
    multiImage: boolean
    mask?: boolean
    styleReference?: boolean
  }
  accepts: {
    imageUrls?: boolean
    maskImageUrl?: boolean
    imageSize?: boolean
    aspectRatio?: boolean
    quality?: boolean
    resolution?: boolean
    numImages?: boolean
    outputFormat?: boolean
    syncMode?: boolean
    seed?: boolean
    guidanceScale?: boolean
    inferenceSteps?: boolean
    strength?: boolean
  }
  routing?: {
    editFallback?: ImageModelId
    textFallback?: ImageModelId
    multiImageFallback?: ImageModelId
  }
}
```

### 3. Replace global FAL provider options with per-model builders

Current image generation code applies many defaults globally. Replace that with allowlisted builders:

```ts
function buildFalProviderOptions(args: {
  modelId: ImageModelId
  prompt: string
  imageUrls: string[]
  aspectRatio: UniversalAspectRatio
  quality?: "low" | "medium" | "high"
  outputFormat?: "jpeg" | "png" | "webp"
}) {
  switch (args.modelId) {
    case IMAGE_MODEL_IDS.GPT_IMAGE_2:
      return {
        image_size: mapUniversalRatioToImageSize(args.aspectRatio),
        quality: args.quality ?? "high",
        output_format: args.outputFormat ?? "png",
        sync_mode: true
      }

    case IMAGE_MODEL_IDS.GPT_IMAGE_2_EDIT:
      return {
        image_urls: args.imageUrls,
        quality: args.quality ?? "high",
        output_format: args.outputFormat ?? "png",
        sync_mode: true
      }

    case IMAGE_MODEL_IDS.FLUX_2_PRO_EDIT:
      return {
        image_urls: args.imageUrls,
        image_size: mapUniversalRatioToFlux2Size(args.aspectRatio)
      }
  }
}
```

Do not send a parameter unless the endpoint is known to support it.

### 4. Update model routing

Current routing maps T2I to I2I by hardcoded model-family switches. Preserve the behavior but make the mapping data-driven.

Recommended default routes:

| User-selected model | Has image input? | Route to |
| --- | --- | --- |
| GPT Image 2 | no | GPT Image 2 |
| GPT Image 2 | yes | GPT Image 2 Edit |
| Nano Banana Pro | no | Nano Banana Pro |
| Nano Banana Pro | yes | Nano Banana Pro Edit |
| Seedream 5 Lite | no | Seedream 5 Lite |
| Seedream 5 Lite | yes | Seedream 5 Lite Edit |
| FLUX.2 Pro | no | FLUX.2 Pro |
| FLUX.2 Pro | yes | FLUX.2 Pro Edit |
| Ideogram v4 | yes | GPT Image 2 Edit or Nano Banana Pro Edit |
| Krea 2 Large | yes | GPT Image 2 Edit or Nano Banana Pro Edit |

### 5. Update UI controls

The current UI exposes guidance scale and a small universal aspect ratio set. That no longer maps cleanly to the target catalog.

Recommended UI changes:

- Keep aspect ratio, but model-specific mapping should happen server-side.
- Add quality for GPT Image 2 / GPT Image 1.5.
- Add resolution for Nano Banana Pro.
- Hide guidance scale for all new recommended top models unless the endpoint explicitly supports it.
- Hide inference steps for all new recommended top models unless the endpoint explicitly supports it.
- Add output format later; default to PNG initially.
- Add mask input later; do not block the initial migration.

### 6. Update persistence metadata

Extend `generation-details` metadata to include:

```ts
{
  provider: "fal",
  falEndpoint: string,
  modelFamily: string,
  endpointKind: "text-to-image" | "image-edit" | "multi-reference-edit",
  inputImageCount: number,
  hasMask: boolean,
  quality?: string,
  resolution?: string,
  outputFormat?: string,
  imageSize?: string | { width: number; height: number },
  aspectRatio?: string,
  warnings?: Array<{ code?: string; message: string }>
}
```

The current document content stores base64 directly. That is acceptable for the first migration but should be followed by Blob storage for generated images.

### 7. Add validation tests before enabling defaults

Add focused unit tests around model routing and provider option building:

- GPT Image 2 without images routes to GPT Image 2.
- GPT Image 2 with images routes to GPT Image 2 Edit.
- Nano Banana Pro with two images preserves both image URLs.
- FLUX.2 Pro Edit does not receive guidance/steps/strength.
- Ideogram v4 with an image falls back to the default editor.
- Seedream 5 Lite edit receives `image_urls` and no FLUX-only params.
- `image/gif`, `image/webp`, and `image/bmp` upload behavior is aligned with chat schema.

## Migration sequence

1. Add this migration doc.
2. Upgrade AI SDK packages in a dedicated PR.
3. Replace `experimental_generateImage` with `generateImage` and fix type errors.
4. Centralize FAL endpoint metadata.
5. Add per-model FAL provider option builders.
6. Add the new image model IDs, but keep old models hidden as compatibility aliases.
7. Add routing tests.
8. Enable the new image catalog behind a feature flag.
9. Smoke test each FAL endpoint in production-like env.
10. Flip the default image model to GPT Image 2 or Seedream 5 Lite depending on cost posture.
11. Update chat LLM catalog after provider IDs are validated.
12. Remove old FLUX/Recraft/Ideogram v3 defaults once no saved chats depend on them.

## Suggested implementation order by risk

Low risk:

- Centralize endpoint metadata.
- Hide deprecated image models in the selector.
- Add tests for routing and parameter construction.

Medium risk:

- Switch image calls from `experimental_generateImage` to `generateImage`.
- Add new FAL endpoints with feature flag.
- Remove global guidance/steps/strength defaults.

High risk:

- Upgrade AI SDK across multiple major versions.
- Change default image model to GPT Image 2.
- Change default chat model IDs without provider/account smoke tests.
- Add mask editing and multi-reference workflows to the UI.

## Open questions before runtime implementation

- Does `@ai-sdk/fal` latest support every target FAL endpoint through `fal.image(endpoint)`?
- If not, should the image artifact handler use `@fal-ai/client` directly for unsupported endpoints while keeping AI SDK for chat?
- Which premium image models should be available to all users vs entitlement-gated?
- Should generated images move to Vercel Blob immediately, or after the model migration?
- Should model routing stay user-selected-first, or should prompts automatically route logo/text-heavy tasks to Ideogram v4 and complex edits to Nano Banana Pro/GPT Image 2?
- What should the default cost posture be: best quality, balanced, or cheap-fast drafts?

## Source links used for this plan

- AI SDK image generation docs: https://ai-sdk.dev/docs/ai-sdk-core/image-generation
- AI SDK FAL provider docs: https://ai-sdk.dev/providers/ai-sdk-providers/fal
- AI SDK Anthropic provider docs: https://ai-sdk.dev/providers/ai-sdk-providers/anthropic
- AI SDK OpenAI provider docs: https://ai-sdk.dev/providers/ai-sdk-providers/openai
- AI SDK Google provider docs: https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai
- Artificial Analysis text-to-image leaderboard: https://artificialanalysis.ai/image/leaderboard/text-to-image
- Artificial Analysis image editing leaderboard: https://artificialanalysis.ai/image/leaderboard/editing
- Artificial Analysis LLM leaderboard: https://artificialanalysis.ai/leaderboards/models
- FAL GPT Image 2: https://fal.ai/models/openai/gpt-image-2
- FAL GPT Image 1.5: https://fal.ai/models/fal-ai/gpt-image-1.5
- FAL Nano Banana Pro edit: https://fal.ai/models/fal-ai/nano-banana-pro/edit
- FAL Gemini 3 Pro Image Preview: https://fal.ai/models/fal-ai/gemini-3-pro-image-preview
- FAL Nano Banana Lite: https://fal.ai/models/google/nano-banana-lite
- FAL Seedream 4.5 text-to-image: https://fal.ai/models/fal-ai/bytedance/seedream/v4.5/text-to-image
- FAL Seedream 5 Lite text-to-image: https://fal.ai/models/fal-ai/bytedance/seedream/v5/lite/text-to-image
- FAL Seedream 5 Lite edit: https://fal.ai/models/fal-ai/bytedance/seedream/v5/lite/edit
- FAL FLUX.2 Pro: https://fal.ai/models/fal-ai/flux-2-pro
- FAL FLUX.2 Pro edit: https://fal.ai/models/fal-ai/flux-2-pro/edit
- FAL Ideogram v4: https://fal.ai/models/ideogram/v4
- FAL Krea 2 Large: https://fal.ai/models/krea/v2/large/text-to-image
