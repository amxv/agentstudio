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
			"Polished commercial images, product detail, readable type, and strong prompt following.",
		tone: "bg-[#b8ff4d]"
	},
	{
		name: "GPT Image 2 Edit",
		provider: "OpenAI",
		description:
			"Refine uploaded references, preserve key details, and turn rough directions into clean edits.",
		tone: "bg-[#69e7ff]"
	},
	{
		name: "GPT Image 1.5",
		provider: "OpenAI",
		description:
			"A premium OpenAI option when you want another high-quality visual direction.",
		tone: "bg-[#ffd447]"
	},
	{
		name: "Nano Banana Pro",
		provider: "Google",
		description:
			"Gemini 3 Pro image generation for high-resolution concepts and layered creative briefs.",
		tone: "bg-[#ff6bcb]"
	},
	{
		name: "Nano Banana Pro Edit",
		provider: "Google",
		description:
			"Multi-reference editing for combining images while keeping subjects and styles consistent.",
		tone: "bg-[#b8ff4d]"
	},
	{
		name: "Seedream 4.5",
		provider: "ByteDance",
		description:
			"Sharp visual exploration with strong materials, layouts, and overall consistency.",
		tone: "bg-[#ff8a4c]"
	},
	{
		name: "Seedream 5 Lite",
		provider: "ByteDance",
		description:
			"Fast drafts and high-volume exploration when you want many directions quickly.",
		tone: "bg-[#69e7ff]"
	},
	{
		name: "Seedream 5 Lite Edit",
		provider: "ByteDance",
		description:
			"Quick reference-based edits for testing variations without slowing the creative loop.",
		tone: "bg-[#ffd447]"
	},
	{
		name: "FLUX.2 Pro",
		provider: "Black Forest Labs",
		description:
			"Professional text-to-image generation for refined concepts and production-style drafts.",
		tone: "bg-[#ff6bcb]"
	},
	{
		name: "FLUX.2 Pro Edit",
		provider: "Black Forest Labs",
		description:
			"Reliable multi-reference edits for transformations, composites, and visual remixes.",
		tone: "bg-[#b8ff4d]"
	},
	{
		name: "Ideogram v4",
		provider: "Ideogram",
		description:
			"Posters, logos, signage, social graphics, and images where text needs to hold up.",
		tone: "bg-[#69e7ff]"
	},
	{
		name: "Krea 2 Large",
		provider: "Krea",
		description:
			"High-fidelity style exploration for polished campaign, moodboard, and concept work.",
		tone: "bg-[#ff8a4c]"
	},
	{
		name: "Nano Banana Lite",
		provider: "Google",
		description:
			"Responsive Gemini drafts for lightweight iteration and quick creative checks.",
		tone: "bg-[#ffd447]"
	},
	{
		name: "FLUX.2 Klein 9B",
		provider: "Black Forest Labs",
		description:
			"Lower-cost FLUX.2 experimentation for early ideas and fast visual sampling.",
		tone: "bg-[#ff6bcb]"
	}
]

const chatModels: ModelCard[] = [
	{
		name: "Claude Fable 5",
		provider: "Anthropic",
		description:
			"Long creative sessions, campaign thinking, and multi-step image plans.",
		tone: "bg-[#ffd447]"
	},
	{
		name: "Claude Opus 4.8",
		provider: "Anthropic",
		description:
			"Deep planning for complex briefs, brand systems, and tricky revisions.",
		tone: "bg-[#ff8a4c]"
	},
	{
		name: "Claude Sonnet 5",
		provider: "Anthropic",
		description:
			"Balanced creative direction, prompt writing, and everyday agent work.",
		tone: "bg-[#b8ff4d]"
	},
	{
		name: "Claude Haiku 4.5",
		provider: "Anthropic",
		description:
			"Fast creative feedback when you want quick turns and light planning.",
		tone: "bg-[#69e7ff]"
	},
	{
		name: "GPT-5.5",
		provider: "OpenAI",
		description:
			"OpenAI planning for tool use, structured prompts, and complex tasks.",
		tone: "bg-[#ff6bcb]"
	},
	{
		name: "Gemini 3.5 Flash",
		provider: "Google",
		description:
			"Capable Gemini responses for fast ideation and production support.",
		tone: "bg-[#b8ff4d]"
	},
	{
		name: "Gemini 3.1 Pro Preview",
		provider: "Google",
		description:
			"Advanced Gemini preview for multimodal briefs and reasoning-heavy asks.",
		tone: "bg-[#ffd447]"
	},
	{
		name: "Gemini 3.1 Flash-Lite",
		provider: "Google",
		description:
			"Cost-efficient Gemini for high-volume chats and quick prompt passes.",
		tone: "bg-[#69e7ff]"
	}
]

const features = [
	{
		icon: Brain,
		title: "Agentic brief handling",
		description:
			"Describe the outcome you want; the assistant decides whether to generate, edit, or create a supporting artifact."
	},
	{
		icon: Wand2,
		title: "Prompt refinement",
		description:
			"Start loose or specific. Short notes become richer image prompts while detailed art direction stays intact."
	},
	{
		icon: FileImage,
		title: "Model transparency",
		description:
			"Each result records the prompt, model, settings, and time so you can understand what worked."
	},
	{
		icon: History,
		title: "Revision history",
		description:
			"Every edit becomes a new version. Compare directions and return to the strongest one."
	},
	{
		icon: Upload,
		title: "Reference-aware editing",
		description:
			"Upload, drag, paste, or link images for edits, style references, and multi-image compositions."
	},
	{
		icon: RatioIcon,
		title: "Aspect ratio control",
		description:
			"Move between square, widescreen, portrait, landscape, and presentation-friendly formats."
	},
	{
		icon: Images,
		title: "Gallery",
		description:
			"Review finished images, copy prompts, download assets, and reuse past directions."
	},
	{
		icon: FolderOpen,
		title: "Collections",
		description:
			"Organize output by campaign, client, product line, moodboard, or internal review."
	},
	{
		icon: Bookmark,
		title: "Prompt library",
		description:
			"Save prompts that reliably produce useful looks, then reuse them when the style fits."
	},
	{
		icon: Presentation,
		title: "Slide visuals",
		description:
			"Turn outlines or markdown into presentation-ready slide images."
	},
	{
		icon: FileText,
		title: "Written artifacts",
		description:
			"Draft campaign copy, notes, or supporting text alongside the visual direction."
	},
	{
		icon: Table2,
		title: "Sheets",
		description:
			"Create simple structured tables for image plans, variants, content lists, and reviews."
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
						14 image models
					</span>
					<span className="border-2 border-black bg-[#69e7ff] px-3 py-1">
						Reference edits
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
							creative brief
						</span>
					</div>
					<span
						className={`border-2 border-black bg-white px-2 py-1 text-[10px] font-bold uppercase text-black ${monoFont.className}`}
					>
						model picker
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
										mode: generate
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
						Agentic image generation and editing
					</div>
					<h1
						className={`max-w-5xl text-5xl leading-[0.88] tracking-[-0.04em] text-black sm:text-7xl lg:text-8xl ${displayFont.className}`}
					>
						BRIEF IT. EDIT IT. SHIP THE IMAGE.
					</h1>
					<p
						className={`mt-8 max-w-2xl border-l-4 border-black pl-5 text-lg font-semibold leading-relaxed text-black md:text-xl ${monoFont.className}`}
					>
						AgentStudio is a conversational workspace for exploring
						image models, building visual directions, editing with
						references, and keeping every strong variation
						organized. Give it the brief; the agent plans the next
						creative move.
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
							Try Agent Chat
						</BrutalButton>
					</div>
					<div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
						{[
							["14", "image models"],
							["8", "planning models"],
							["∞", "reference edits"]
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
		"Brief",
		"Generate",
		"Reference edit",
		"Version",
		"Upload",
		"Paste",
		"Link",
		"Compare models",
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
			title: "Brief the agent",
			body: "Describe the campaign, product shot, logo exploration, poster, style, or edit you want to test."
		},
		{
			icon: Brain,
			title: "It plans the shot",
			body: "The assistant turns messy creative direction into a clear prompt, edit plan, or artifact request."
		},
		{
			icon: Braces,
			title: "Use the right model",
			body: "GPT Image, Nano Banana, Seedream, FLUX, Ideogram, and Krea are available for different visual jobs."
		},
		{
			icon: Download,
			title: "Keep the winners",
			body: "Compare versions, download final assets, copy useful prompts, and organize the work in the gallery."
		}
	]

	return (
		<section className="border-b-4 border-black bg-[#69e7ff] py-20 md:py-28">
			<div className="mx-auto max-w-7xl px-4 md:px-8">
				<SectionHeader
					kicker="How it works"
					title="From rough brief to usable visual direction."
					description="Use it like a creative operator: add references, ask for changes, compare models, save the best versions, and keep moving."
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
					kicker="Image models"
					title="Explore generation and editing models from one workspace."
					description="Use OpenAI, Google, ByteDance, Black Forest Labs, Ideogram, and Krea models for polished generations, fast drafts, typography-heavy graphics, and reference-based edits."
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
					kicker="Agent models"
					title="Bring a serious planning model into the creative loop."
					description="Claude, GPT-5.5, and Gemini models help turn rough asks into clear prompts, edit plans, model choices, and supporting artifacts."
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
					kicker="Workspace"
					title="Built for exploration, not one-off generations."
					description="Evaluate directions, keep references attached, preserve prompt history, compare revisions, and turn promising ideas into assets."
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
		["Images", "Generate, edit, compare, version, and download visuals."],
		[
			"Slides",
			"Turn outlines or markdown into visual presentation slides."
		],
		["Text", "Draft campaign copy and notes beside the image work."],
		["Sheets", "Create structured plans, variants, and content lists."]
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
						Give it references, not just prompts.
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
						Use one workspace for the whole creative pass.
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
			label: "See which model made each result"
		},
		{ icon: Eye, label: "Compare versions before committing" },
		{ icon: Search, label: "Keep strong outputs discoverable" },
		{ icon: Palette, label: "Reuse prompts that produce the right look" },
		{ icon: Clock, label: "Return to every previous revision" },
		{ icon: Moon, label: "Work in dark or light mode" },
		{ icon: Smartphone, label: "Create from desktop or mobile" },
		{ icon: Zap, label: "Use fast drafts or premium models" }
	]

	return (
		<section className="border-b-4 border-black bg-[#fff7d6] py-20 md:py-28">
			<div className="mx-auto max-w-7xl px-4 md:px-8">
				<div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
					<SectionHeader
						kicker="Why it matters"
						title="A better way to test agentic image tools."
						description="Most tools split chat, model playgrounds, editing apps, and asset libraries. AgentStudio keeps the agent, models, references, versions, and artifacts in one creative loop."
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
					Start with a brief. Leave with directions you can compare.
				</h2>
				<p
					className={`mx-auto mt-6 max-w-2xl text-base font-semibold leading-relaxed text-black md:text-lg ${monoFont.className}`}
				>
					Explore models, edit with references, understand what
					worked, and keep every strong variation organized for the
					next round.
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
					Agentic image generation and editing workspace.
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
