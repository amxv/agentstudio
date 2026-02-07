# Slides Artifact - AI-Generated Presentation Creator

The slides artifact creates professional presentation slide decks from markdown content using AI image generation models from FAL.AI.

## Features

- **Markdown-to-Slides Conversion**: Automatically parses markdown with slide separators (`---`) into individual slides
- **AI Image Generation**: Uses FAL.AI models (FLUX, Ideogram, Recraft) to generate professional slide images
- **Interactive Viewer**: Navigate through slides with thumbnail previews and fullscreen mode
- **Professional Styling**: Generates slides with clean, business-appropriate layouts
- **Download & Share**: Export individual slides or copy to clipboard
- **Version Control**: Track changes and regenerate slides with different styles

## Usage

### Creating a Slide Deck

Provide markdown content with slide separators:

```markdown
# My Presentation

## Introduction
Welcome to our presentation about the future of AI

---

## Main Topics
- Artificial Intelligence Evolution
- Current Applications
- Future Possibilities
- Impact on Society

---

## AI Evolution Timeline
### 1950s: Birth of AI
- Alan Turing's work
- First AI programs

### 1980s: Expert Systems
- Knowledge-based systems
- Commercial applications

### 2020s: Deep Learning
- Neural networks
- Large language models

---

## Conclusion
Thank you for your attention!

Questions and discussion
```

### Slide Structure

Each slide is separated by `---` and can contain:

- Headers (`#`, `##`, `###`)
- Bullet points
- Code blocks
- Plain text
- Markdown formatting

### Automatic Features

- **Title Extraction**: First header becomes the slide title
- **Slide Numbering**: Automatically numbered (1/5, 2/5, etc.)
- **Professional Styling**: Clean layout with proper spacing and typography
- **Responsive Design**: Optimized for presentation displays

## Supported Markdown Elements

- **Headers**: `#`, `##`, `###` for titles and sections
- **Lists**: Bullet points (`-`, `*`) and numbered lists
- **Code Blocks**: Syntax-highlighted code snippets
- **Text Formatting**: **bold**, *italic*, `inline code`
- **Links**: `[text](url)` (displayed as text in slides)

## Image Generation Models

Uses FAL.AI models optimized for professional presentations:

- **FLUX Pro**: High-quality, fast generation
- **Ideogram V3**: Excellent typography handling
- **Recraft V3**: Vector-style graphics
- **Aspect Ratio**: 4:3 (1024x768) optimized for presentations

## Viewer Features

### Navigation

- **Previous/Next**: Arrow buttons or keyboard navigation
- **Slide Counter**: Current position indicator (e.g., "3 / 10")
- **Thumbnail Strip**: Quick navigation to any slide

### Display Options

- **Fullscreen Mode**: Distraction-free presentation view
- **Zoom Controls**: Adjust slide size for better visibility
- **Slide Details**: View original markdown content for each slide

### Export Options

- **Download**: Save individual slides as PNG images
- **Copy to Clipboard**: Quick sharing of slide images
- **Markdown View**: Access original source content

## Toolbar Actions

- **Regenerate All**: Refresh all slides with updated styling
- **Edit Deck**: Modify the presentation content
- **Enhance Slides**: Improve visual design and layout
- **Change Style**: Apply different presentation themes
- **View Markdown**: Display original source content

## Example Use Cases

### Business Presentations

```markdown
# Q4 Results

## Executive Summary
- Revenue increased 25%
- New product launches successful
- Market expansion in EMEA

---

## Financial Highlights
### Revenue Growth
- Q4: $50M (+25% YoY)
- FY: $180M (+18% YoY)

### Key Metrics
- Customer acquisition: +35%
- Retention rate: 94%
- Gross margin: 68%
```

### Technical Documentation

```markdown
# API Documentation

## Overview
RESTful API for user management

---

## Authentication
```bash
curl -H "Authorization: Bearer token" \
     https://api.example.com/users
```

---

## Endpoints

### Users

- `GET /users` - List all users
- `POST /users` - Create user
- `PUT /users/:id` - Update user

```

### Educational Content
```markdown
# Introduction to React

## What is React?
A JavaScript library for building user interfaces

---

## Core Concepts
### Components
Reusable pieces of UI

### Props
Data passed to components

### State
Component data that can change

---

## Example Component
```jsx
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

```

## Integration with Chat SDK

This artifact leverages the Chat SDK's capabilities:

- **AI SDK Integration**: Uses `experimental_generateImage` for slide generation
- **Streaming Support**: Real-time progress updates during generation
- **File Upload**: Support for markdown file uploads
- **Version Control**: Maintains history of slide deck iterations
- **Multimodal Input**: Accepts both text prompts and file attachments

## Error Handling

If slide generation fails:
- Individual slides show error messages
- Failed slides can be regenerated independently
- Original markdown content is preserved
- Detailed error logging for debugging

## Performance Considerations

- **Parallel Generation**: Slides generated sequentially for reliability
- **Caching**: Generated images cached for version control
- **Progressive Loading**: Slides display as they're generated
- **Fallback Content**: Placeholder displayed during generation

## Customization Options

- **Model Selection**: Choose different AI models for varied styles
- **Aspect Ratios**: Support for different presentation formats
- **Styling Prompts**: Customize visual appearance through prompts
- **Template Support**: Pre-defined slide templates for consistency
