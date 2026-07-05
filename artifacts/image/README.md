# Image Artifact

The image artifact supports both **text-to-image** and **image-to-image** generation through the centralized FAL model catalog, with full support for file attachments and multimodal input.

## Features

- **Text-to-Image Generation**: Create images from text descriptions
- **Image-to-Image Generation**: Transform existing images using text prompts
- **Multi-Image Generation**: Process multiple images simultaneously for enhanced context understanding
- **File Upload Support**: Upload single or multiple images directly through the chat interface
- **URL Support**: Use image URLs in prompts for transformations
- **Catalog-Based Model Selection**: Routes between paired text and edit endpoints based on input type and number of images
- **Quality Enhancement**: Automatically adds quality terms to prompts
- **Multiple Image Formats**: Supports JPG, PNG, GIF, WebP, and BMP

## Usage

### Text-to-Image Generation

Simply provide a text description:

```
Create a serene mountain landscape at sunset with vibrant colors
```

### Image-to-Image Generation

#### Method 1: File Upload (Recommended)

1. Click the attachment button (📎) in the chat interface
2. Upload one or multiple image files
3. Add your modification instructions in the text field

Example (Single Image):

```
Make this image more vibrant and add dramatic lighting
```

Example (Multiple Images):

```
Combine these images into a single composition with a cohesive artistic style
```

#### Method 2: Image URLs

Include an image URL in your prompt followed by your modification instructions:

```
https://example.com/photo.jpg
Convert this to a watercolor painting style
```

#### Method 3: Base64 Data

```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
Make this image more vibrant and add dramatic lighting
```

## Supported Image Formats

- **File Uploads**: PNG, JPG, JPEG (via chat attachment system)
- **URLs**: Any HTTP/HTTPS URL ending with `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, or `.bmp`
- **Base64**: Data URLs with image MIME types

## Model Selection

- **Text-to-Image**: Uses the selected text model for pure text prompts, such as GPT Image 2, Nano Banana Pro, Seedream, Ideogram, Krea, or supported FLUX.2 endpoints
- **Image-to-Image**: Uses the selected model's configured edit route for image transformation tasks, such as GPT Image 2 Edit, Nano Banana Pro Edit, Seedream 5 Lite Edit, or FLUX.2 Pro Edit
- **Multi-Image**: Uses edit models with multi-reference support when multiple image inputs are provided

**Important**: The server only routes through explicit catalog entries in `lib/ai/models.ts`. Unsupported text/edit combinations fail fast instead of silently switching to a different model.

## Parameters

### Shared Parameters

- **Aspect Ratio**: User-selected aspect ratio is mapped through the model catalog
- **Output Format**: PNG by default, with JPEG and WebP available where supported
- **Quality / Resolution**: Sent only to models that explicitly support those options
- **Image Inputs**: Sent through AI SDK 7 `generateImage` prompt image parts for edit workflows

## Examples

### Basic Text-to-Image

```
A futuristic cityscape with flying cars and neon lights
```

### Style Transfer with File Upload

1. Upload a portrait image using the 📎 button
2. Type: `Transform this portrait into a Renaissance painting style`

### Image Enhancement with URL

```
https://example.com/landscape.jpg
Enhance this landscape with better lighting and more vivid colors
```

### Object Addition/Removal

1. Upload a room photo
2. Type: `Add a large bookshelf to the left wall of this room`

### Multi-Image Composition

1. Upload multiple related images (e.g., different angles of the same subject)
2. Type: `Create a panoramic composition from these images with seamless blending`

### Style Transfer with Multiple References

1. Upload a content image and one or more style reference images
2. Type: `Apply the artistic style from the reference images to the main content`

## Tips for Better Results

1. **Use File Uploads**: File uploads are prioritized over URL parsing for better reliability
2. **Be Specific**: Include details about style, lighting, composition, and mood
3. **Quality Terms**: The system automatically adds quality enhancement terms
4. **Model Fit**: Use edit-capable models when the source image must be preserved or transformed
5. **Clear Instructions**: Separate the image input from the modification text clearly

## Toolbar Actions

- **Regenerate**: Create a new version with the same prompt
- **Edit**: Modify the current image
- **Upload Image to Edit**: Get guidance on file upload workflow
- **Image-to-Image Guide**: Learn how to use both upload and URL methods
- **Change Style**: Apply different artistic styles
- **Change Aspect Ratio**: Recreate in different dimensions
- **Enhance**: Improve lighting, detail, and composition

## Multimodal Workflow

The image artifact now seamlessly integrates with the chat system's attachment feature:

1. **Attachment Detection**: Automatically detects image attachments in messages
2. **Priority System**: File attachments take priority over URL parsing
3. **Clean Text Extraction**: Removes embedded URLs from prompts when attachments are present
4. **URL Support**: Parses image URLs when no upload attachment is present

## Error Handling

If image generation fails, check:

- Image file is a supported format (PNG, JPG, JPEG)
- Image URL is accessible and valid
- Image format is supported
- Prompt is clear and specific
- Network connectivity is stable

The system will log detailed error information for debugging purposes.

## Integration with Chat SDK

This artifact leverages the Chat SDK's multimodal capabilities:

- **File Upload API**: Uses `/api/files/upload` for secure file handling
- **Attachment System**: Integrates with uploaded image attachments and AI SDK UI messages
- **Streaming Support**: Real-time image generation with progress feedback
- **Version Control**: Maintains history of generated images
