# ZUE Images -- Comprehensive Feature Overview

## Platform Summary

ZUE Images is a professional AI image generation platform available at **design.zue.ai**. It combines a conversational AI chat interface with a powerful artifact-based creation workflow, enabling users to generate, edit, iterate on, and manage AI-generated images using multiple state-of-the-art image models. The platform is built on Next.js 15 with a React 19 frontend, backed by PostgreSQL, and integrates with leading AI providers including Anthropic, OpenAI, Google, and FAL.

---

## Core Experience: Chat-Based Image Creation

At the heart of ZUE Images is a conversational interface where users describe what they want to create in natural language. An AI assistant -- powered by a choice of large language models -- interprets the request, crafts an optimized prompt, selects the appropriate image generation model, and produces the result in a dedicated artifact panel alongside the conversation.

This chat-driven approach means users never need to learn complex parameter configurations or prompt engineering syntax. They simply describe their vision, and the system handles everything: prompt enhancement, model selection, aspect ratio formatting, and parameter tuning.

### How It Works

1. The user types a request in the chat (e.g., "Design a minimalist logo for a coffee shop called Brew & Bean").
2. The AI assistant analyzes the request and invokes the image generation tool with an optimized prompt.
3. The image appears in a dedicated artifact panel beside the conversation.
4. The user can then ask for modifications ("Make the font bolder and change the color to deep brown"), and the system automatically switches to image-to-image editing mode, using the previous result as a starting point.
5. Every iteration is versioned, allowing users to browse through all previous versions and compare changes.

---

## Supported AI Image Generation Models

ZUE Images integrates a comprehensive roster of image generation models, organized into three categories: Text-to-Image, Image-to-Image, and Multi-Image models. All models are accessed through the FAL inference platform.

### Text-to-Image Models

These models create images from scratch based on text descriptions.

**FLUX Kontext**
High-quality text-to-image generation with excellent prompt adherence. Part of the FLUX family by Black Forest Labs, this model excels at understanding and faithfully rendering detailed text descriptions. Supports resolutions up to 1024x1024 with all five aspect ratios (1:1, 16:9, 9:16, 4:3, 3:4). Configurable guidance scale (1-20) and 50 inference steps for balanced quality.

**FLUX Kontext Max**
The premium tier of FLUX Kontext, offering improved prompt adherence and notably superior typography rendering. Ideal for images that include text elements like signs, labels, or branding. Same resolution and aspect ratio support as standard Kontext but with enhanced quality output. This is a restricted-access model available to premium users.

**FLUX Pro Ultra**
Professional-grade image generation capable of producing images at up to 2K resolution (2048x2048). The highest-resolution model in the platform, designed for use cases that demand print-quality output or large-format visuals. Features a higher guidance scale default of 12 and 60 inference steps for maximum detail. This is a restricted-access model.

**FLUX Pro v1.1**
An enhanced version of FLUX Pro that balances improved quality with faster generation speed. Produces images at 1024x1024 with strong prompt adherence. A good general-purpose choice when high quality matters but ultra-resolution is not needed.

**Imagen 4 (Preview)**
Google's latest image generation model, renowned for producing photorealistic results. Imagen 4 excels at natural-looking photography, realistic portraits, and scenes with complex lighting. It operates with a lower guidance scale of 8 and 40 inference steps, reflecting its inherent strength at interpreting prompts without heavy guidance.

**Recraft V3**
A state-of-the-art model specifically designed for vector art, brand assets, and style-consistent generation. Recraft V3 is the go-to choice for logos, icons, illustrations, and brand collateral. It uses a distinct aspect ratio format internally (square_hd, landscape_4_3, portrait_16_9, etc.) but the platform abstracts this behind a universal ratio selector. Does not support guidance scale adjustment, as its internal optimization handles style consistency automatically.

**Ideogram V3**
Specialized for high-quality posters, marketing materials, and designs that feature prominent typography. Ideogram V3 is uniquely capable of rendering text within images with exceptional accuracy and aesthetic quality -- a historically difficult challenge for AI image generators. Ideal for event flyers, social media graphics, signage, and any visual that combines imagery with readable text. Like Recraft, it uses its own aspect ratio format internally. This is the default image model for the platform.

### Image-to-Image Models

These models transform or edit existing images based on text instructions.

**FLUX Kontext (Image-to-Image)**
Takes an existing image and transforms it based on text instructions. Enables sophisticated editing like changing lighting, modifying elements, adjusting style, or adding new components while preserving the overall composition and structure of the original.

**FLUX Kontext Max (Image-to-Image)**
The premium image editing variant with enhanced consistency and quality. Produces more coherent edits with better preservation of the original image's key elements. Restricted-access model.

**Recraft V3 (Image-to-Image)**
Applies Recraft's vector art and brand style capabilities to existing images. Useful for converting photographs or sketches into polished vector-style illustrations or brand-consistent artwork.

**Ideogram V3 Remix**
Creative image remixing and style transfer powered by Ideogram's engine. Takes an existing image and reimagines it with new stylistic elements while maintaining the core subject matter and composition.

### Multi-Image Models

These advanced models can process multiple input images simultaneously for more sophisticated compositions and transformations.

**FLUX Kontext Max (Multi-Image)**
The most advanced multi-image processing model, capable of understanding context across multiple input images simultaneously. Users can upload several reference images, and this model synthesizes elements from all of them into a cohesive new creation. Supports all aspect ratios and both text-to-image and image-to-image workflows. Restricted-access model.

**Ideogram V3 (Multi-Image)**
Processes up to 4 input images simultaneously with Ideogram's exceptional typography and poster generation capabilities. Perfect for creating composite designs that reference multiple visual sources while maintaining clean text rendering. Available to all users.

### Intelligent Model Selection

The platform features an automatic model routing system that ensures the optimal model is always used:

- When a user selects a text-to-image model but uploads an image, the system automatically switches to the corresponding image-to-image variant (e.g., FLUX Kontext T2I becomes FLUX Kontext I2I).
- When editing an existing image artifact in the conversation, the system detects the context and routes to the appropriate I2I model even without an explicit upload.
- When an I2I model is selected but no image is provided, the system falls back to the corresponding T2I model.
- Multi-image models are used when explicitly selected by the user, respecting their intent.
- Models without a direct I2I counterpart (FLUX Pro Ultra, FLUX Pro v1.1, Imagen 4) gracefully fall back to FLUX Kontext I2I for editing workflows.

---

## Chat AI Models (Conversational Intelligence)

The conversational layer that interprets user requests and manages the creative workflow is powered by six selectable language models from three leading AI providers:

**Anthropic**
- Claude Sonnet 4 -- The latest balanced model with superior coding and reasoning capabilities
- Claude Sonnet 4 (Reasoning) -- Enhanced with step-by-step reasoning for complex creative direction

**OpenAI**
- GPT-4.1 -- The flagship model with enhanced capabilities (default chat model)
- o4-mini -- An efficient reasoning model for everyday tasks and quick interactions

**Google**
- Gemini 2.5 Pro -- An advanced multimodal model with extensive context understanding
- Gemini 2.5 Flash -- Fast and efficient for quick, responsive interactions

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

The platform automatically translates these universal ratios to model-specific formats (FLUX models use direct ratios like "16:9", while Recraft and Ideogram models use named formats like "landscape_16_9").

### Guidance Scale
An adjustable parameter (range 1-20, default 10) that controls how closely the generation adheres to the text prompt. Higher values produce images more faithful to the prompt at the cost of some creative diversity. This control is intelligently hidden for models that do not support it (Recraft V3, Ideogram V3, and Imagen 4).

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

Certain premium models (FLUX Pro Ultra, FLUX Kontext Max variants) are restricted to specific authorized accounts, with the system filtering available models based on user identity.

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
