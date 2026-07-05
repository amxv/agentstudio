# AgentStudio -- Comprehensive Feature Overview

## Platform Summary

AgentStudio is a professional AI image generation platform available at **agentstudio.ashray.xyz**. It combines a conversational AI chat interface with a powerful artifact-based creation workflow, enabling users to generate, edit, iterate on, and manage AI-generated images using multiple state-of-the-art image models. The platform is built on Next.js 15 with a React 19 frontend, backed by PostgreSQL, and integrates with leading AI providers including Anthropic, OpenAI, Google, and FAL.

---

## Core Experience: Chat-Based Image Creation

At the heart of AgentStudio is a conversational interface where users describe what they want to create in natural language. An AI assistant -- powered by a choice of large language models -- interprets the request, crafts an optimized prompt, selects the appropriate image generation model, and produces the result in a dedicated artifact panel alongside the conversation.

This chat-driven approach means users never need to learn complex parameter configurations or prompt engineering syntax. They simply describe their vision, and the system handles everything: prompt enhancement, model selection, aspect ratio formatting, and parameter tuning.

### How It Works

1. The user types a request in the chat (e.g., "Design a minimalist logo for a coffee shop called Brew & Bean").
2. The AI assistant analyzes the request and invokes the image generation tool with an optimized prompt.
3. The image appears in a dedicated artifact panel beside the conversation.
4. The user can then ask for modifications ("Make the font bolder and change the color to deep brown"), and the system automatically switches to image-to-image editing mode, using the previous result as a starting point.
5. Every iteration is versioned, allowing users to browse through all previous versions and compare changes.

---

## Supported AI Image Generation Models

AgentStudio integrates a comprehensive roster of image generation models, organized into three categories: Text-to-Image, Image-to-Image, and Multi-Image models. All models are accessed through the FAL inference platform.

### Text-to-Image Models

These models create images from scratch based on text descriptions.

**GPT Image 2**
The default image model, selected for strong prompt adherence, typography, product-quality detail, and general-purpose creative work.

**GPT Image 1.5**
A high-quality OpenAI image model retained as a selectable premium generator for users who want a different OpenAI image style.

**Nano Banana Pro**
Google's Gemini 3 Pro image model on FAL, suited for high-resolution creative generation and complex visual instructions.

**Seedream 4.5**
A modern ByteDance generator with strong material rendering, layout quality, and visual consistency.

**Seedream 5 Lite**
A fast, cost-efficient model for high-volume drafts and high-resolution general generation.

**FLUX.2 Pro**
Black Forest Labs' production FLUX.2 endpoint for professional text-to-image work.

**Ideogram v4**
Specialized for posters, logos, signage, social graphics, and designs that include readable text.

**Krea 2 Large**
A high-fidelity creative model for polished visual exploration and style-driven generation.

**Nano Banana Lite**
A fast Gemini image model for drafts and responsive iteration.

**FLUX.2 Klein 9B**
A lightweight FLUX.2 model for lower-cost experimentation.

### Image-to-Image Models

These models transform or edit existing images based on text instructions.

**GPT Image 2 Edit**
The default OpenAI editing route for preserving and transforming existing image artifacts or uploaded references.

**Nano Banana Pro Edit**
A multi-reference editor for combining or modifying several images with strong character and subject consistency.

**Seedream 5 Lite Edit**
A cost-efficient multi-reference editor for quick visual iteration.

**FLUX.2 Pro Edit**
A production multi-reference editor for reliable transformation workflows.

### Multi-Image Models

Multi-image support is provided by edit-capable catalog entries that declare multi-reference support. The server routes only through explicit text/edit pairs in `lib/ai/models.ts`.

### Intelligent Model Selection

The platform features an automatic model routing system that ensures the optimal model is always used:

- When a user selects a text-to-image model but uploads an image, the system automatically switches to the configured image-editing variant for that model family.
- When editing an existing image artifact in the conversation, the system detects the context and routes to the appropriate I2I model even without an explicit upload.
- When an I2I model is selected but no image is provided, the system routes to the corresponding T2I model.
- Multi-image models are used when explicitly selected by the user, respecting their intent.
- Models without a configured editing route are rejected for editing workflows instead of silently switching providers or endpoints.

---

## Chat AI Models (Conversational Intelligence)

The conversational layer that interprets user requests and manages the creative workflow is powered by the current model catalog from Anthropic, OpenAI, and Google:

**Anthropic**
- Claude Fable 5 -- Long-running agentic and creative work
- Claude Opus 4.8 -- Premium deep reasoning and complex workflows
- Claude Sonnet 5 -- Default balanced model for high-quality creative direction
- Claude Haiku 4.5 -- Fast current Claude model for responsive interactions

**OpenAI**
- GPT-5.5 -- OpenAI's latest model for coding, tool-heavy agents, grounded assistants, and complex workflows

**Google**
- Gemini 3.5 Flash -- Stable frontier Gemini model for fast, capable responses
- Gemini 3.1 Pro Preview -- Advanced preview Gemini model for multimodal and reasoning-heavy work
- Gemini 3.1 Flash-Lite -- Cost-efficient Gemini model for fast high-volume tasks

Users can switch between these models at any time via the model selector in the chat header, allowing them to choose the best conversational partner for their creative process.

---

## Prompt Enhancement

The platform includes an intelligent prompt enhancement system that improves short or basic user prompts without overriding detailed ones:

- Prompts with more than 5 words are passed through unchanged, respecting the user's artistic intent.
- Very short prompts (5 words or fewer) are automatically enriched with natural language structure and visual grounding (e.g., "a sunset" becomes "A sunset, captured in natural lighting with clear details").

The system prompt also provides the AI assistant with comprehensive guidelines for crafting natural, visually grounded image prompts. It covers best practices for logos, posters, product photography, character design, and environmental art -- ensuring the AI generates effective prompts for any use case.

---

## Artifact System

The artifact system is the visual workspace where generated content appears beside the conversation. It supports four artifact types:

### Image Artifacts
The primary artifact type. Generated images appear in a dedicated panel with:
- Real-time streaming status during generation
- Zoom controls (0.25x to 3x magnification)
- Rotation controls (90-degree increments)
- Fullscreen view mode
- Download as PNG
- Copy to clipboard
- Version history browsing (navigate previous/next versions)
- Generation details inspector showing the exact prompt, enhanced prompt, model used, all parameters, and timestamp
- Toolbar with quick actions: Regenerate, Edit, Upload image to edit, Image-to-image guide, Change style, Change aspect ratio, and Enhance image

### Text Artifacts
For generating written content (essays, emails, articles). Text artifacts support real-time streaming display and content editing with debounced auto-saving.

### Sheet Artifacts
For creating spreadsheets and tabular data. Generates CSV-format content based on user descriptions.

### Slides Artifacts
For creating AI-generated presentation slide decks. Users provide markdown content, and the system:
1. Parses the markdown into individual slides (split by `---` separators or headers)
2. Generates a professional slide image for each slide using the selected image model
3. Presents the slides in a navigable viewer with:
   - Slide-by-slide navigation (previous/next)
   - Thumbnail strip for quick access
   - Fullscreen presentation mode
   - Zoom controls
   - Individual slide download
   - Copy slide to clipboard
   - View original markdown source
   - Regenerate all slides
   - Change presentation style

---

## Image Upload and Input Methods

The platform supports multiple ways to provide images for image-to-image workflows:

### File Upload
Users can attach images via the paperclip button in the chat input. Supported formats include JPEG, PNG, GIF, WebP, and BMP, with a maximum file size of 10MB per image. Multiple images can be uploaded simultaneously. Files are stored on Vercel Blob storage.

### Drag and Drop
Images can be dragged and dropped directly onto the chat input area. A visual overlay appears during drag operations confirming the supported formats.

### Clipboard Paste
Users can paste images directly from their clipboard (e.g., screenshots) into the chat input. The system automatically detects image content in the clipboard and processes it.

### URL Extraction
The system can extract image URLs embedded in text prompts (HTTP/HTTPS URLs ending with standard image extensions) and use them as input for image-to-image generation.

### Base64 Data
Base64-encoded image data embedded in prompts is automatically detected and processed as input for image-to-image workflows.

### Attachment Persistence
Uploaded attachments are persisted to localStorage so they survive page refreshes, ensuring users do not lose their work during the upload and generation process.

---

## Generation Configuration Controls

Users have granular control over image generation parameters through the model selector dropdown in the chat header:

### Aspect Ratio
Five aspect ratio presets are available across all models:
- Square (1:1) -- Default, ideal for profile pictures, icons, and social media posts
- Landscape (16:9) -- Widescreen format for banners, headers, and video thumbnails
- Portrait (9:16) -- Tall format for mobile wallpapers, stories, and vertical displays
- Landscape (4:3) -- Classic format for presentations and traditional displays
- Portrait (3:4) -- Slightly tall format for posters and portrait photography

The platform automatically translates these universal ratios to model-specific formats in the server-side catalog.

### Model Parameters
The server sends only the options supported by the selected catalog entry, such as quality, resolution, output format, image size, or aspect ratio. Unsupported controls are omitted instead of being sent globally.

### Model-Specific Parameters
Each model has tuned default parameters for inference steps and maximum output size, ensuring optimal results without requiring manual configuration.

---

## Gallery

The Gallery page provides a visual grid of all images a user has generated across the platform. Features include:

- Responsive masonry grid layout (1-4 columns depending on screen size)
- Image thumbnails with hover overlay for quick actions
- Quick view, download, and prompt copy actions on hover
- Status badges (completed, generating, failed, pending) with color coding
- Model badge showing which AI model was used
- Image dimensions and creation date display
- Full image detail dialog with:
  - Large image preview
  - Download, save, and share buttons
  - Complete prompt and negative prompt display
  - Model, style, dimensions, steps, guidance scale, and seed information
  - Creation and completion timestamps

---

## Collections

Users can organize their generated images into themed collections. Collections support:
- Custom titles and descriptions
- Public or private visibility settings
- Adding and removing images from collections
- Organization by theme, project, or style

---

## Saved Prompts

A prompt library feature that allows users to:
- Save favorite prompts for quick reuse
- Categorize prompts with custom categories
- Tag prompts for easy discovery
- Track usage count for each saved prompt
- Mark prompts as public for sharing with other users
- Browse a prompt library

---

## Projects

Images are organized within projects at the database level. Each user has a default "My Images" project that is automatically created on first use. Projects support:
- Custom titles and descriptions
- Public or private visibility
- Grouping images by creative endeavor

---

## Authentication and User Management

The platform supports two authentication methods:

### Email/Password Authentication
Standard email and password registration and login flow. Passwords are securely hashed using bcrypt. Signup can be optionally disabled via configuration (controlled by an environment variable).

### Guest Access
A guest authentication mode exists in the codebase where anonymous users can be auto-provisioned with temporary accounts. Currently, the guest route redirects to login, enforcing authenticated-only access.

### User Types and Entitlements
The system defines two user tiers with different quotas:
- **Guest users**: Up to 10 messages per day, access to all non-restricted models
- **Regular users**: Up to 100 messages per day, access to all non-restricted models
- An enterprise tier is planned but not yet implemented (1,000 messages per day)

Image and chat model availability is controlled through the centralized entitlement layer, with stale cookie values normalized to current defaults.

---

## Chat Visibility and Sharing

Each chat conversation can be set to one of two visibility levels:
- **Private** -- Only the creator can access the chat and its generated images
- **Public** -- Anyone with the link can view the chat, enabling sharing of creative processes and results

The visibility selector is accessible in the chat header and can be changed at any time.

---

## Sidebar and Navigation

The application sidebar provides:
- Quick access to all main sections: Generate Images, Gallery, Collections, and Saved Prompts
- A "New Image" button for starting fresh generation
- A searchable list of the 10 most recent images with thumbnail previews, prompt excerpts, status badges, and creation dates
- User profile display with email and avatar
- Quick navigation to Dashboard and Sign Out

---

## Suggested Actions

When a new chat is started, the platform presents four suggested action cards to help users get started quickly:
1. **Create a professional headshot photo** -- Generates a business portrait with studio lighting
2. **Design a company presentation slide** -- Creates a modern slide template with corporate branding
3. **Generate a business infographic design** -- Produces data visualization graphics with charts and statistics
4. **Create a corporate event banner** -- Designs an elegant event banner with typography

---

## Generation Details Inspector

After any image is generated, users can open a detailed inspector dialog that reveals the complete technical context of the generation:
- **Original Prompt** -- What the user typed
- **Enhanced Prompt** -- What was actually sent to the image model after prompt enhancement
- **Model Used** -- The specific model ID and display name with description
- **Generation Type** -- Whether it was text-to-image or image-to-image
- **Parameters** -- Guidance scale, inference steps, aspect ratio, output size, strength (for I2I), input image count
- **Timestamp** -- Exact time of generation

This transparency gives users full insight into how their images were created and helps them refine their approach for future generations.

---

## Version History

Every image artifact maintains a complete version history. When users ask for modifications, a new version is created while preserving all previous versions. Users can:
- Navigate backward and forward through all versions of an image
- Compare different iterations side by side
- Jump directly to the latest version
- Each version is independently downloadable and copyable

---

## Real-Time Streaming

The platform uses data streams to deliver real-time feedback during generation:
- A spinning loader with "Generating Image..." message appears during active generation
- Generation details are streamed as they become available
- The image data is streamed as a single base64 payload when complete
- Text artifacts stream word-by-word for a natural writing experience
- Slides show progress updates as each individual slide is generated

---

## Responsive Design

The interface is fully responsive with:
- Mobile-optimized layouts with adaptive column grids
- Touch-friendly controls and gestures
- Disabled auto-zoom on mobile Safari for consistent experience
- Collapsible sidebar with remembered state (persisted via cookies)
- Full-screen image viewing mode optimized for different screen sizes
- Dark mode and light mode support via system preference detection with theme persistence

---

## Technical Architecture

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4, shadcn/ui component library, Framer Motion for animations
- **Backend**: Next.js API routes and server actions, Vercel AI SDK for model integration
- **Database**: PostgreSQL via Drizzle ORM with a schema covering Users, Projects, Images, Collections, Prompts, and Votes
- **File Storage**: Vercel Blob for uploaded images
- **Authentication**: NextAuth.js v5 with credentials provider
- **AI Providers**: Anthropic (@ai-sdk/anthropic), OpenAI (@ai-sdk/openai), Google (@ai-sdk/google), FAL (@ai-sdk/fal)
- **Deployment**: Vercel with geolocation-aware request handling
- **Testing**: Playwright for end-to-end tests
- **Code Quality**: Biome linter/formatter, ESLint, TypeScript strict mode, Husky pre-commit hooks

---

## Data Model Summary

The platform's database schema tracks the following entities:

- **User** -- Email, name, hashed password
- **Project** -- Title, description, visibility, owner reference
- **Image** -- Prompt, negative prompt, model, style, dimensions, steps, guidance scale, seed, generated URL, status (pending/generating/completed/failed), error message, timestamps
- **Vote** -- Upvote/downvote per image per user
- **Collection** -- Title, description, visibility, owner reference
- **CollectionImage** -- Many-to-many relationship linking collections and images
- **Prompt** -- Title, content, category, tags, public flag, usage count, owner reference
- **Chat** -- Title, visibility, owner reference (for the conversational interface)
- **Message** -- Role, parts, attachments, chat reference (for conversation history)
- **Document** -- Title, content, kind (text/image/sheet/slides), owner reference (for artifacts)
- **Stream** -- Stream IDs for resumable streaming support
