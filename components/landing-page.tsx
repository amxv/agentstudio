"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Archivo_Black, IBM_Plex_Mono } from "next/font/google"
import {
	ArrowRight,
	Bookmark,
	Bot,
	Brain,
	Braces,
	Clipboard,
	Clock,
	Download,
	Eye,
	FileImage,
	FileText,
	FolderOpen,
	History,
	Image as ImageIcon,
	Images,
	LinkIcon,
	Moon,
	MousePointerClick,
	Palette,
	PenLine,
	Presentation,
	RatioIcon,
	Search,
	ShieldCheck,
	Smartphone,
	Sparkles,
	Table2,
	Upload,
	Wand2,
	Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AgentStudioLogo } from "@/components/agentstudio-logo"

const displayFont = Archivo_Black({
	subsets: ["latin"],
	weight: "400",
	display: "swap",
	variable: "--font-display"
})

const monoFont = IBM_Plex_Mono({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
	variable: "--font-mono"
})

const fadeUp = {
	hidden: { opacity: 0, y: 28 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: "easeOut" }
	}
}

const staggerContainer = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.07 } }
}

interface LandingPageProps {
	isAuthenticated: boolean
}

type ModelCard = {
	name: string
	provider: string
	description: string
	tone: string
}

const imageModels: ModelCard[] = [
	{
		name: "GPT Image 2",
		provider: "OpenAI",
		description:
			"Default generator for prompt adherence, typography, product detail, and polished commercial output.",
		tone: "bg-[#b8ff4d]"
	},
	{
		name: "GPT Image 2 Edit",
		provider: "OpenAI",
		description:
			"Preserve, transform, and refine uploaded references or previous generations with a dedicated edit route.",
		tone: "bg-[#69e7ff]"
	},
	{
		name: "GPT Image 1.5",
		provider: "OpenAI",
		description:
			"Premium OpenAI alternative for high-quality generation with a different visual character.",
		tone: "bg-[#ffd447]"
	},
	{
		name: "Nano Banana Pro",
		provider: "Google",
		description:
			"Gemini 3 Pro image model for high-resolution creative generation and complex visual instructions.",
		tone: "bg-[#ff6bcb]"
	},
	{
		name: "Nano Banana Pro Edit",
		provider: "Google",
		description:
			"Multi-reference editor for combining, preserving, and modifying several images with subject consistency.",
		tone: "bg-[#b8ff4d]"
	},
	{
		name: "Seedream 4.5",
		provider: "ByteDance",
		description:
			"Modern generator with strong material rendering, layout quality, and visual consistency.",
		tone: "bg-[#ff8a4c]"
	},
	{
		name: "Seedream 5 Lite",
		provider: "ByteDance",
		description:
			"Fast, cost-efficient model for high-volume drafts and high-resolution general generation.",
		tone: "bg-[#69e7ff]"
	},
	{
		name: "Seedream 5 Lite Edit",
		provider: "ByteDance",
		description:
			"Cost-efficient multi-reference editor for quick visual iteration and reference-based changes.",
		tone: "bg-[#ffd447]"
	},
	{
		name: "FLUX.2 Pro",
		provider: "Black Forest Labs",
		description:
			"Production-grade endpoint for professional text-to-image work through the FAL catalog.",
		tone: "bg-[#ff6bcb]"
	},
	{
		name: "FLUX.2 Pro Edit",
		provider: "Black Forest Labs",
		description:
			"Production multi-reference editor for reliable transformation and composition workflows.",
		tone: "bg-[#b8ff4d]"
	},
	{
		name: "Ideogram v4",
		provider: "Ideogram",
		description:
			"Specialist model for posters, logos, signage, social graphics, and readable text in images.",
		tone: "bg-[#69e7ff]"
	},
	{
		name: "Krea 2 Large",
		provider: "Krea",
		description:
			"High-fidelity creative model for polished visual exploration and style-driven generation.",
		tone: "bg-[#ff8a4c]"
	},
	{
		name: "Nano Banana Lite",
		provider: "Google",
		description:
			"Fast Gemini image model for responsive drafts and lightweight iteration.",
		tone: "bg-[#ffd447]"
	},
	{
		name: "FLUX.2 Klein 9B",
		provider: "Black Forest Labs",
		description:
			"Lightweight FLUX.2 model for lower-cost experimentation and fast generation.",
		tone: "bg-[#ff6bcb]"
	}
]

const chatModels: ModelCard[] = [
	{
		name: "Claude Fable 5",
		provider: "Anthropic",
		description: "Long-running agentic and creative work.",
		tone: "bg-[#ffd447]"
	},
	{
		name: "Claude Opus 4.8",
		provider: "Anthropic",
		description: "Premium deep reasoning for complex workflows.",
		tone: "bg-[#ff8a4c]"
	},
	{
		name: "Claude Sonnet 5",
		provider: "Anthropic",
		description: "Default balanced model for high-quality direction.",
		tone: "bg-[#b8ff4d]"
	},
	{
		name: "Claude Haiku 4.5",
		provider: "Anthropic",
		description: "Fast current Claude model for responsive interactions.",
		tone: "bg-[#69e7ff]"
	},
	{
		name: "GPT-5.5",
		provider: "OpenAI",
		description: "OpenAI's current model for tool-heavy work.",
		tone: "bg-[#ff6bcb]"
	},
	{
		name: "Gemini 3.5 Flash",
		provider: "Google",
		description: "Stable frontier Gemini model for capable responses.",
		tone: "bg-[#b8ff4d]"
	},
	{
		name: "Gemini 3.1 Pro Preview",
		provider: "Google",
		description: "Preview model for multimodal and reasoning-heavy work.",
		tone: "bg-[#ffd447]"
	},
	{
		name: "Gemini 3.1 Flash-Lite",
		provider: "Google",
		description: "Cost-efficient Gemini for high-volume interactions.",
		tone: "bg-[#69e7ff]"
	}
]

const features = [
	{
		icon: Brain,
		title: "Strict model routing",
		description:
			"Text requests and edit requests move through explicit catalog routes. No hidden swaps to retired models."
	},
	{
		icon: Wand2,
		title: "Prompt enhancement",
		description:
			"Short prompts get richer visual detail; detailed prompts stay intact so your intent is preserved."
	},
	{
		icon: FileImage,
		title: "Generation inspector",
		description:
			"See the original prompt, enhanced prompt, selected model, endpoint, parameters, and timestamp."
	},
	{
		icon: History,
		title: "Version history",
		description:
			"Every edit becomes a new version. Step through iterations and download the one that landed."
	},
	{
		icon: Upload,
		title: "Image inputs",
		description:
			"Upload, drag, paste, or link images for edits and multi-reference workflows."
	},
	{
		icon: RatioIcon,
		title: "Aspect ratios",
		description:
			"Square, widescreen, portrait, classic landscape, and classic portrait are mapped per model."
	},
	{
		icon: Images,
		title: "Gallery",
		description:
			"Browse generated images with thumbnails, metadata, download controls, and prompt copy."
	},
	{
		icon: FolderOpen,
		title: "Collections",
		description:
			"Organize output by campaign, client, project, moodboard, or internal review."
	},
	{
		icon: Bookmark,
		title: "Prompt library",
		description:
			"Save reusable prompts, categorize them, tag them, and track what works."
	},
	{
		icon: Presentation,
		title: "Slides",
		description:
			"Turn markdown into presentation slide images with the same image catalog."
	},
	{
		icon: FileText,
		title: "Text artifacts",
		description:
			"Draft written content with streaming display and editable artifact panels."
	},
	{
		icon: Table2,
		title: "Sheets",
		description:
			"Create structured CSV-style tables and spreadsheet content from natural language."
	}
]

const inputMethods = [
	{ icon: Upload, label: "Upload", detail: "JPEG, PNG, GIF, WebP, BMP" },
	{ icon: MousePointerClick, label: "Drag", detail: "Drop files into chat" },
	{ icon: Clipboard, label: "Paste", detail: "Screenshots from clipboard" },
	{ icon: LinkIcon, label: "Link", detail: "Reference image URLs" }
]

function BrutalButton({
	href,
	children,
	variant = "primary"
}: {
	href: string
	children: React.ReactNode
	variant?: "primary" | "secondary"
}) {
	return (
		<Link
			href={href}
			className={`inline-flex items-center justify-center gap-2 border-4 border-black px-6 py-4 font-black uppercase tracking-wide transition-transform hover:-translate-y-1 active:translate-y-0 ${
				variant === "primary"
					? "bg-[#b8ff4d] text-black shadow-[8px_8px_0_#000]"
					: "bg-white text-black shadow-[8px_8px_0_#ff6bcb]"
			}`}
		>
			{children}
		</Link>
	)
}

function StickyNav({ isAuthenticated }: { isAuthenticated: boolean }) {
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 16)
		window.addEventListener("scroll", handleScroll, { passive: true })
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	return (
		<nav
			className={`fixed inset-x-0 top-0 z-50 border-b-4 border-black transition-all ${
				scrolled ? "bg-[#fff7d6]/95 backdrop-blur" : "bg-[#fff7d6]"
			}`}
		>
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
				<Link href="/" className="flex items-center gap-3">
					<div className="border-4 border-black bg-[#ff6bcb] p-1 shadow-[4px_4px_0_#000]">
						<AgentStudioLogo size="8" />
					</div>
					<span
						className={`text-lg font-black uppercase tracking-tight text-black ${displayFont.className}`}
					>
						AgentStudio
					</span>
				</Link>
				<div
					className={`hidden items-center gap-2 text-xs font-bold uppercase text-black md:flex ${monoFont.className}`}
				>
					<span className="border-2 border-black bg-white px-3 py-1">
						AI SDK 7
					</span>
					<span className="border-2 border-black bg-[#69e7ff] px-3 py-1">
						FAL Catalog
					</span>
				</div>
				<Button
					asChild
					className="rounded-none border-4 border-black bg-black text-white shadow-[5px_5px_0_#ff6bcb] hover:bg-black"
				>
					<Link href={isAuthenticated ? "/generate" : "/login"}>
						{isAuthenticated ? "Go to App" : "Sign In"}
					</Link>
				</Button>
			</div>
		</nav>
	)
}

function HeroMockup() {
	const miniCards = [
		["logo poster", "Ideogram v4", "bg-[#ffd447]"],
		["product shot", "GPT Image 2", "bg-[#69e7ff]"],
		["style edit", "Nano Banana Pro Edit", "bg-[#ff6bcb]"]
	]

	return (
		<div className="relative mx-auto max-w-xl">
			<div className="absolute -left-5 -top-5 h-28 w-28 rotate-6 border-4 border-black bg-[#b8ff4d]" />
			<div className="absolute -right-5 bottom-8 h-32 w-32 -rotate-12 border-4 border-black bg-[#ff6bcb]" />
			<div className="relative border-4 border-black bg-white p-4 shadow-[14px_14px_0_#000]">
				<div className="mb-4 flex items-center justify-between border-4 border-black bg-[#ffd447] p-3">
					<div className="flex items-center gap-2">
						<Bot className="size-5 text-black" />
						<span
							className={`text-xs font-black uppercase text-black ${monoFont.className}`}
						>
							creative console
						</span>
					</div>
					<span
						className={`border-2 border-black bg-white px-2 py-1 text-[10px] font-bold uppercase text-black ${monoFont.className}`}
					>
						live catalog
					</span>
				</div>
				<div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
					<div className="space-y-3">
						<div className="border-4 border-black bg-[#111] p-4 text-white">
							<p
								className={`text-[11px] font-bold uppercase text-[#b8ff4d] ${monoFont.className}`}
							>
								user prompt
							</p>
							<p className="mt-3 text-sm font-black leading-snug">
								Make a loud launch poster for a sparkling yuzu
								drink. Big type. Product in hand.
							</p>
						</div>
						{miniCards.map(([title, model, color]) => (
							<div
								key={title}
								className={`border-4 border-black p-3 ${color}`}
							>
								<p
									className={`text-[10px] font-black uppercase text-black ${monoFont.className}`}
								>
									{title}
								</p>
								<p className="mt-1 text-sm font-black text-black">
									{model}
								</p>
							</div>
						))}
					</div>
					<div className="border-4 border-black bg-[#69e7ff] p-3">
						<div className="relative min-h-[310px] overflow-hidden border-4 border-black bg-[#fff7d6]">
							<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.08)_1px,transparent_1px),linear-gradient(rgba(0,0,0,.08)_1px,transparent_1px)] bg-[size:22px_22px]" />
							<div className="absolute left-5 top-5 w-36 -rotate-6 border-4 border-black bg-[#ff6bcb] p-3 shadow-[6px_6px_0_#000]">
								<p
									className={`text-3xl leading-none text-black ${displayFont.className}`}
								>
									YUZU!
								</p>
							</div>
							<div className="absolute right-5 top-24 h-40 w-24 rotate-6 rounded-b-full rounded-t-3xl border-4 border-black bg-[#b8ff4d] shadow-[6px_6px_0_#000]" />
							<div className="absolute bottom-6 left-7 right-7 border-4 border-black bg-white p-3 shadow-[6px_6px_0_#000]">
								<p
									className={`text-[10px] font-bold uppercase text-black ${monoFont.className}`}
								>
									generation details
								</p>
								<div className="mt-2 grid grid-cols-2 gap-2 text-[10px] font-bold uppercase text-black">
									<span className="bg-[#ffd447] p-1">
										model: GPT Image 2
									</span>
									<span className="bg-[#69e7ff] p-1">
										ratio: 4:3
									</span>
									<span className="bg-[#ff6bcb] p-1">
										format: PNG
									</span>
									<span className="bg-[#b8ff4d] p-1">
										route: text
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function HeroSection({ isAuthenticated }: { isAuthenticated: boolean }) {
	return (
		<section className="relative overflow-hidden border-b-4 border-black bg-[#fff7d6] pt-28 pb-20 md:pt-36 md:pb-24">
			<div className="absolute inset-0 bg-[radial-gradient(#000_1.5px,transparent_1.5px)] bg-[size:24px_24px] opacity-15" />
			<div className="relative mx-auto grid max-w-7xl gap-12 px-4 md:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
				<motion.div
					variants={fadeUp}
					initial="hidden"
					animate="visible"
				>
					<div
						className={`mb-6 inline-flex rotate-[-2deg] border-4 border-black bg-[#69e7ff] px-4 py-2 text-xs font-black uppercase text-black shadow-[5px_5px_0_#000] ${monoFont.className}`}
					>
						AI image studio with a new model brain
					</div>
					<h1
						className={`max-w-5xl text-5xl leading-[0.88] tracking-[-0.04em] text-black sm:text-7xl lg:text-8xl ${displayFont.className}`}
					>
						MAKE THE IMAGE. BREAK THE TEMPLATE.
					</h1>
					<p
						className={`mt-8 max-w-2xl border-l-4 border-black pl-5 text-lg font-semibold leading-relaxed text-black md:text-xl ${monoFont.className}`}
					>
						AgentStudio turns plain-language requests into
						production visuals, edits, slide images, text artifacts,
						and structured sheets. The assistant plans the work; the
						catalog picks the exact current model route.
					</p>
					<div className="mt-9 flex flex-col gap-4 sm:flex-row">
						<BrutalButton
							href={isAuthenticated ? "/generate" : "/login"}
						>
							{isAuthenticated ? "Open Studio" : "Start Creating"}
							<ArrowRight className="size-5" />
						</BrutalButton>
						<BrutalButton
							href={isAuthenticated ? "/chat" : "/login"}
							variant="secondary"
						>
							Chat Workflow
						</BrutalButton>
					</div>
					<div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
						{[
							["14", "FAL image models"],
							["8", "chat models"],
							["0", "hidden fallbacks"]
						].map(([value, label]) => (
							<div
								key={label}
								className="border-4 border-black bg-white p-3 shadow-[5px_5px_0_#000]"
							>
								<p
									className={`text-3xl text-black ${displayFont.className}`}
								>
									{value}
								</p>
								<p
									className={`text-[10px] font-bold uppercase text-black ${monoFont.className}`}
								>
									{label}
								</p>
							</div>
						))}
					</div>
				</motion.div>
				<motion.div
					variants={fadeUp}
					initial="hidden"
					animate="visible"
					transition={{ delay: 0.15 }}
				>
					<HeroMockup />
				</motion.div>
			</div>
		</section>
	)
}

function FeatureMarquee() {
	const chips = [
		"Generate",
		"Edit",
		"Inspect",
		"Version",
		"Upload",
		"Paste",
		"Link",
		"Slide decks",
		"Sheets",
		"Prompt library"
	]

	return (
		<div className="overflow-hidden border-b-4 border-black bg-black py-3">
			<div
				className={`flex w-max animate-[marquee_24s_linear_infinite] gap-3 text-sm font-black uppercase text-black ${monoFont.className}`}
			>
				{[...chips, ...chips].map((chip, index) => (
					<span
						key={`${chip}-${index}`}
						className="border-2 border-black bg-[#ffd447] px-4 py-2"
					>
						{chip}
					</span>
				))}
			</div>
			<style jsx>{`
				@keyframes marquee {
					from {
						transform: translateX(0);
					}
					to {
						transform: translateX(-50%);
					}
				}
			`}</style>
		</div>
	)
}

function SectionHeader({
	kicker,
	title,
	description,
	color = "bg-[#b8ff4d]"
}: {
	kicker: string
	title: string
	description: string
	color?: string
}) {
	return (
		<motion.div
			variants={fadeUp}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			className="mx-auto max-w-4xl text-center"
		>
			<p
				className={`mx-auto mb-5 inline-block rotate-[-1deg] border-4 border-black ${color} px-4 py-2 text-xs font-black uppercase text-black shadow-[5px_5px_0_#000] ${monoFont.className}`}
			>
				{kicker}
			</p>
			<h2
				className={`text-4xl leading-[0.95] tracking-[-0.04em] text-black md:text-6xl ${displayFont.className}`}
			>
				{title}
			</h2>
			<p
				className={`mx-auto mt-5 max-w-2xl text-base font-semibold leading-relaxed text-black md:text-lg ${monoFont.className}`}
			>
				{description}
			</p>
		</motion.div>
	)
}

function WorkflowSection() {
	const steps = [
		{
			icon: PenLine,
			title: "Say what you want",
			body: "Ask for a launch poster, logo exploration, product scene, edit, slide deck, article, or sheet."
		},
		{
			icon: Brain,
			title: "Assistant plans",
			body: "The chat model turns your request into a grounded prompt and chooses the right artifact action."
		},
		{
			icon: Braces,
			title: "Catalog routes",
			body: "Text and edit requests use explicit model pairs from the current FAL catalog."
		},
		{
			icon: Download,
			title: "Export the winner",
			body: "Inspect details, browse versions, copy, download, and organize everything in the gallery."
		}
	]

	return (
		<section className="border-b-4 border-black bg-[#69e7ff] py-20 md:py-28">
			<div className="mx-auto max-w-7xl px-4 md:px-8">
				<SectionHeader
					kicker="How it works"
					title="A chat that drives a production machine."
					description="The interface stays conversational while the backend stays strict: current models, explicit routes, and visible generation details."
					color="bg-[#ffd447]"
				/>
				<motion.div
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					className="mt-14 grid gap-5 md:grid-cols-4"
				>
					{steps.map((step, index) => (
						<motion.div
							key={step.title}
							variants={fadeUp}
							className="relative border-4 border-black bg-white p-5 shadow-[8px_8px_0_#000]"
						>
							<div className="mb-6 flex items-center justify-between">
								<div className="border-4 border-black bg-[#ff6bcb] p-3">
									<step.icon className="size-6 text-black" />
								</div>
								<span
									className={`text-5xl text-black ${displayFont.className}`}
								>
									0{index + 1}
								</span>
							</div>
							<h3
								className={`text-xl text-black ${displayFont.className}`}
							>
								{step.title}
							</h3>
							<p
								className={`mt-3 text-sm font-semibold leading-relaxed text-black ${monoFont.className}`}
							>
								{step.body}
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	)
}

function ImageModelsSection() {
	return (
		<section className="border-b-4 border-black bg-[#fff7d6] py-20 md:py-28">
			<div className="mx-auto max-w-7xl px-4 md:px-8">
				<SectionHeader
					kicker="Image catalog"
					title="14 current FAL image routes. No old model ghosts."
					description="OpenAI, Google, ByteDance, Black Forest Labs, Ideogram, and Krea are exposed through the shipped catalog. Text and edit variants are explicit."
					color="bg-[#ff6bcb]"
				/>
				<motion.div
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-80px" }}
					className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
				>
					{imageModels.map((model) => (
						<motion.article
							key={model.name}
							variants={fadeUp}
							className={`${model.tone} flex min-h-52 flex-col justify-between border-4 border-black p-4 shadow-[6px_6px_0_#000] transition-transform hover:-translate-y-1`}
						>
							<div>
								<p
									className={`mb-3 inline-block border-2 border-black bg-white px-2 py-1 text-[10px] font-black uppercase text-black ${monoFont.className}`}
								>
									{model.provider}
								</p>
								<h3
									className={`text-2xl leading-none text-black ${displayFont.className}`}
								>
									{model.name}
								</h3>
							</div>
							<p
								className={`mt-5 text-sm font-semibold leading-relaxed text-black ${monoFont.className}`}
							>
								{model.description}
							</p>
						</motion.article>
					))}
				</motion.div>
			</div>
		</section>
	)
}

function ChatModelsSection() {
	return (
		<section className="border-b-4 border-black bg-[#ff6bcb] py-20 md:py-28">
			<div className="mx-auto max-w-7xl px-4 md:px-8">
				<SectionHeader
					kicker="LLM layer"
					title="8 current chat models guide the creative workflow."
					description="Claude Fable, Opus, Sonnet, Haiku, GPT-5.5, and Gemini 3 variants handle creative direction, prompt planning, tool calls, and artifact work."
					color="bg-[#b8ff4d]"
				/>
				<motion.div
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-80px" }}
					className="mt-14 grid gap-4 md:grid-cols-4"
				>
					{chatModels.map((model) => (
						<motion.article
							key={model.name}
							variants={fadeUp}
							className={`${model.tone} border-4 border-black p-4 shadow-[6px_6px_0_#000]`}
						>
							<p
								className={`mb-4 inline-block border-2 border-black bg-white px-2 py-1 text-[10px] font-black uppercase text-black ${monoFont.className}`}
							>
								{model.provider}
							</p>
							<h3
								className={`text-xl leading-none text-black ${displayFont.className}`}
							>
								{model.name}
							</h3>
							<p
								className={`mt-4 text-xs font-semibold leading-relaxed text-black ${monoFont.className}`}
							>
								{model.description}
							</p>
						</motion.article>
					))}
				</motion.div>
			</div>
		</section>
	)
}

function FeatureGridSection() {
	return (
		<section className="border-b-4 border-black bg-[#b8ff4d] py-20 md:py-28">
			<div className="mx-auto max-w-7xl px-4 md:px-8">
				<SectionHeader
					kicker="Feature stack"
					title="All the useful stuff, not just a prompt box."
					description="AgentStudio is a full workspace: image generation, edits, uploads, details, artifacts, organization, and export tools."
					color="bg-[#69e7ff]"
				/>
				<motion.div
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-80px" }}
					className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
				>
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							variants={fadeUp}
							className={`border-4 border-black bg-white p-5 shadow-[7px_7px_0_#000] ${
								index % 3 === 1
									? "lg:translate-y-6"
									: index % 3 === 2
										? "lg:-translate-y-3"
										: ""
							}`}
						>
							<div className="mb-5 flex items-center gap-3">
								<div className="border-4 border-black bg-[#ffd447] p-3">
									<feature.icon className="size-5 text-black" />
								</div>
								<h3
									className={`text-xl text-black ${displayFont.className}`}
								>
									{feature.title}
								</h3>
							</div>
							<p
								className={`text-sm font-semibold leading-relaxed text-black ${monoFont.className}`}
							>
								{feature.description}
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	)
}

function InputAndArtifactsSection() {
	const artifacts = [
		["Images", "Generate, edit, version, inspect, and download visuals."],
		["Slides", "Turn markdown into presentation slide images."],
		["Text", "Draft written artifacts with streaming and editing."],
		["Sheets", "Create structured tabular data from language."]
	]

	return (
		<section className="border-b-4 border-black bg-[#111] py-20 text-white md:py-28">
			<div className="mx-auto grid max-w-7xl gap-8 px-4 md:px-8 lg:grid-cols-2">
				<motion.div
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					className="border-4 border-white bg-[#69e7ff] p-6 text-black shadow-[10px_10px_0_#ff6bcb]"
				>
					<h2
						className={`text-4xl leading-none md:text-5xl ${displayFont.className}`}
					>
						Bring images in however you work.
					</h2>
					<div className="mt-8 grid gap-4 sm:grid-cols-2">
						{inputMethods.map((method) => (
							<div
								key={method.label}
								className="border-4 border-black bg-white p-4"
							>
								<method.icon className="size-6 text-black" />
								<p
									className={`mt-3 text-xl text-black ${displayFont.className}`}
								>
									{method.label}
								</p>
								<p
									className={`mt-1 text-xs font-bold uppercase text-black ${monoFont.className}`}
								>
									{method.detail}
								</p>
							</div>
						))}
					</div>
				</motion.div>
				<motion.div
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					className="border-4 border-white bg-[#ffd447] p-6 text-black shadow-[10px_10px_0_#b8ff4d]"
				>
					<h2
						className={`text-4xl leading-none md:text-5xl ${displayFont.className}`}
					>
						More than single images.
					</h2>
					<div className="mt-8 space-y-4">
						{artifacts.map(([name, description]) => (
							<div
								key={name}
								className="flex items-start justify-between gap-4 border-4 border-black bg-white p-4"
							>
								<div>
									<p
										className={`text-2xl text-black ${displayFont.className}`}
									>
										{name}
									</p>
									<p
										className={`mt-1 text-sm font-semibold text-black ${monoFont.className}`}
									>
										{description}
									</p>
								</div>
								<Sparkles className="size-6 shrink-0 text-black" />
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	)
}

function ControlRoomSection() {
	const controls = [
		{
			icon: ShieldCheck,
			label: "Stale cookies normalize to current defaults"
		},
		{ icon: Eye, label: "Generation details expose model and endpoint" },
		{ icon: Search, label: "Gallery keeps output discoverable" },
		{ icon: Palette, label: "Model-specific options are allowlisted" },
		{ icon: Clock, label: "Every version stays browsable" },
		{ icon: Moon, label: "Dark and light modes are supported" },
		{ icon: Smartphone, label: "Responsive controls work on mobile" },
		{ icon: Zap, label: "Fast draft and premium routes coexist" }
	]

	return (
		<section className="border-b-4 border-black bg-[#fff7d6] py-20 md:py-28">
			<div className="mx-auto max-w-7xl px-4 md:px-8">
				<div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
					<SectionHeader
						kicker="Control room"
						title="Transparent when it matters. Loud when it should be."
						description="The page is bold; the runtime is disciplined. Users get a creative interface while the server keeps model behavior explicit."
						color="bg-[#ff8a4c]"
					/>
					<motion.div
						variants={staggerContainer}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-100px" }}
						className="grid gap-3 sm:grid-cols-2"
					>
						{controls.map((control) => (
							<motion.div
								key={control.label}
								variants={fadeUp}
								className="flex items-center gap-3 border-4 border-black bg-white p-4 shadow-[5px_5px_0_#000]"
							>
								<div className="border-2 border-black bg-[#b8ff4d] p-2">
									<control.icon className="size-5 text-black" />
								</div>
								<p
									className={`text-sm font-black uppercase leading-tight text-black ${monoFont.className}`}
								>
									{control.label}
								</p>
							</motion.div>
						))}
					</motion.div>
				</div>
			</div>
		</section>
	)
}

function FinalCTASection({ isAuthenticated }: { isAuthenticated: boolean }) {
	return (
		<section className="bg-[#ff6bcb] px-4 py-20 md:px-8 md:py-28">
			<div className="mx-auto max-w-6xl border-4 border-black bg-[#fff7d6] p-8 text-center shadow-[14px_14px_0_#000] md:p-12">
				<p
					className={`mx-auto mb-5 inline-block border-4 border-black bg-[#69e7ff] px-4 py-2 text-xs font-black uppercase text-black ${monoFont.className}`}
				>
					ready when you are
				</p>
				<h2
					className={`mx-auto max-w-4xl text-5xl leading-[0.9] tracking-[-0.04em] text-black md:text-7xl ${displayFont.className}`}
				>
					Tell it what to make. Let the catalog do the routing.
				</h2>
				<p
					className={`mx-auto mt-6 max-w-2xl text-base font-semibold leading-relaxed text-black md:text-lg ${monoFont.className}`}
				>
					Generate images, edit with references, inspect the exact
					model path, save versions, organize results, and keep
					creating without touching a maze of settings.
				</p>
				<div className="mt-10 flex justify-center">
					<BrutalButton
						href={isAuthenticated ? "/generate" : "/login"}
					>
						{isAuthenticated ? "Launch AgentStudio" : "Sign In"}
						<ArrowRight className="size-5" />
					</BrutalButton>
				</div>
			</div>
		</section>
	)
}

function Footer() {
	return (
		<footer className="border-t-4 border-black bg-black py-8 text-white">
			<div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between md:px-8">
				<div className="flex items-center gap-3">
					<div className="border-4 border-white bg-[#ff6bcb] p-1">
						<AgentStudioLogo size="8" />
					</div>
					<span
						className={`font-black uppercase ${displayFont.className}`}
					>
						AgentStudio
					</span>
				</div>
				<span
					className={`text-xs font-bold uppercase text-white/80 ${monoFont.className}`}
				>
					Current models. Explicit routes. Built for visual work.
				</span>
			</div>
		</footer>
	)
}

export function LandingPage({ isAuthenticated }: LandingPageProps) {
	return (
		<div
			className={`min-h-dvh bg-[#fff7d6] text-black ${displayFont.variable} ${monoFont.variable}`}
		>
			<StickyNav isAuthenticated={isAuthenticated} />
			<main>
				<HeroSection isAuthenticated={isAuthenticated} />
				<FeatureMarquee />
				<WorkflowSection />
				<ImageModelsSection />
				<ChatModelsSection />
				<FeatureGridSection />
				<InputAndArtifactsSection />
				<ControlRoomSection />
				<FinalCTASection isAuthenticated={isAuthenticated} />
			</main>
			<Footer />
		</div>
	)
}
