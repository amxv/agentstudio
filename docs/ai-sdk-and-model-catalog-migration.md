# AI SDK and Model Catalog Migration

Date completed: 2026-07-05

This document records the completed migration to AI SDK 7 and the current 2026 model catalog. The implementation removes the older chat model set, removes the previous image endpoint aliases, and routes image generation only through explicit entries in `lib/ai/models.ts`.

## Package Versions

The app now uses the current AI SDK package family:

```json
{
  "ai": "^7.0.15",
  "@ai-sdk/fal": "^3.0.6",
  "@ai-sdk/anthropic": "^4.0.8",
  "@ai-sdk/openai": "^4.0.7",
  "@ai-sdk/google": "^4.0.8",
  "@ai-sdk/react": "^4.0.16",
  "@ai-sdk/xai": "^4.0.6",
  "zod": "^4.4.3"
}
```

Runtime image generation now uses `generateImage` from AI SDK 7.

## Chat Model Catalog

Selectable chat models are defined in `lib/ai/models.ts` and bound to providers in `lib/ai/providers.ts`.

| App ID | Display name | Provider | Provider model ID |
| --- | --- | --- | --- |
| `claude-fable-5` | Claude Fable 5 | Anthropic | `claude-fable-5` |
| `claude-opus-4-8` | Claude Opus 4.8 | Anthropic | `claude-opus-4-8` |
| `claude-sonnet-5` | Claude Sonnet 5 | Anthropic | `claude-sonnet-5` |
| `claude-haiku-4-5` | Claude Haiku 4.5 | Anthropic | `claude-haiku-4-5` |
| `gpt-5.5` | GPT-5.5 | OpenAI | `gpt-5.5` |
| `gemini-3.5-flash` | Gemini 3.5 Flash | Google | `gemini-3.5-flash` |
| `gemini-3.1-pro-preview` | Gemini 3.1 Pro Preview | Google | `gemini-3.1-pro-preview` |
| `gemini-3.1-flash-lite` | Gemini 3.1 Flash-Lite | Google | `gemini-3.1-flash-lite` |

Default model:

- `claude-sonnet-5`

Utility models:

- Title generation: `claude-haiku-4-5`
- Artifact planning: `claude-sonnet-5`

## FAL Image Model Catalog

All image models are routed through FAL via `@ai-sdk/fal`. The catalog is capability-first: each model declares whether it supports text generation, image editing, multi-image input, masks, image size, aspect ratio, quality, resolution, output format, and other provider options.

| App ID | Display name | FAL endpoint | Endpoint kind |
| --- | --- | --- | --- |
| `gpt-image-2` | GPT Image 2 | `fal-ai/gpt-image-2` | text-to-image |
| `gpt-image-2-edit` | GPT Image 2 Edit | `fal-ai/gpt-image-2/image-to-image` | image-edit |
| `gpt-image-1-5` | GPT Image 1.5 | `fal-ai/gpt-image-1.5` | text-to-image |
| `nano-banana-pro` | Nano Banana Pro | `fal-ai/gemini-3-pro-image-preview` | text-to-image |
| `nano-banana-pro-edit` | Nano Banana Pro Edit | `fal-ai/nano-banana-pro/edit` | multi-reference-edit |
| `seedream-4-5` | Seedream 4.5 | `fal-ai/bytedance/seedream/v4.5/text-to-image` | text-to-image |
| `seedream-5-lite` | Seedream 5 Lite | `fal-ai/bytedance/seedream/v5/lite/text-to-image` | text-to-image |
| `seedream-5-lite-edit` | Seedream 5 Lite Edit | `fal-ai/bytedance/seedream/v5/lite/edit` | multi-reference-edit |
| `flux-2-pro` | FLUX.2 Pro | `fal-ai/flux-2-pro` | text-to-image |
| `flux-2-pro-edit` | FLUX.2 Pro Edit | `fal-ai/flux-2-pro/edit` | multi-reference-edit |
| `ideogram-v4` | Ideogram v4 | `ideogram/v4` | text-to-image |
| `krea-v2-large` | Krea 2 Large | `krea/v2/large/text-to-image` | text-to-image |
| `nano-banana-lite` | Nano Banana Lite | `google/nano-banana-lite` | text-to-image |
| `flux-2-klein` | FLUX.2 Klein 9B | `fal-ai/flux-2/klein/9b` | text-to-image |

Default image model:

- `gpt-image-2`

## Routing Rules

Image routing is deterministic:

1. Text-only requests use the selected text endpoint.
2. Requests with uploaded images or image URLs use the selected model's configured edit route.
3. Editing an existing image artifact uses the selected model's configured edit route.
4. A selected edit model with no image input uses its configured text route.
5. Unsupported combinations throw an error instead of silently switching to another model.

This intentionally avoids hidden provider/model fallbacks. The only valid route changes are the explicit `textRoute` and `editRoute` pairs stored in the catalog.

## Provider Options

The image artifact no longer sends one global parameter shape to every FAL endpoint. It builds an allowlisted `providerOptions.fal` object from the selected catalog entry:

- `syncMode`
- `outputFormat`
- `quality`
- `resolution`
- `numImages`
- `imageSize`
- `aspectRatio`

The server sends each option only when the selected model declares support for it.

## Updated Runtime Files

- `lib/ai/models.ts`: central chat and image catalog, capability metadata, strict routing helpers.
- `lib/ai/providers.ts`: AI SDK 7 provider registry for Anthropic, OpenAI, Google, and FAL image endpoints.
- `artifacts/image/server.ts`: AI SDK 7 `generateImage` image artifact handler with catalog-routed model selection.
- `artifacts/slides/server.ts`: slide image generation through `generateImage` and the selected catalog model.
- `app/(chat)/api/chat/route.ts`: AI SDK 7 chat streaming, model-message conversion, tool loop stopping, and UI stream response.
- `components/chat.tsx`: AI SDK 7 React transport setup with the app's existing chat UI compatibility layer.
- `app/(chat)/api/chat/schema.ts`: expanded image upload MIME support.
- `app/(chat)/api/files/upload/route.ts`: Zod 4 validation issue handling.

## Validation

Completed checks:

- `bunx tsc --noEmit`

Before deploying, also run:

- `npm run check`
- `npm run build`

## Maintenance Notes

- Add new LLMs only after confirming first-party provider model IDs and AI SDK provider support.
- Add new image models only by extending `IMAGE_MODEL_IDS`, `imageModels`, and the route-pair metadata in `lib/ai/models.ts`.
- Do not add compatibility aliases for retired IDs. Invalid or stale cookies are normalized to the current defaults at page load.
- Do not add hidden runtime fallbacks. If a model cannot handle a request type, make the catalog relationship explicit or return a clear error.
