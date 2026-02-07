import { auth } from "@/app/(auth)/auth"
import { GenerateForm } from "@/components/generate-form"
import { redirect } from "next/navigation"

export default async function GeneratePage() {
	const session = await auth()

	if (!session?.user) {
		redirect("/login")
	}

	return (
		<div className="flex flex-col min-w-0 h-dvh bg-background">
			<header className="flex items-center justify-between px-4 py-3 border-b">
				<div>
					<h1 className="text-xl font-semibold">Generate Images</h1>
					<p className="text-sm text-muted-foreground">
						Create stunning AI-generated images with advanced models
					</p>
				</div>
			</header>

			<main className="flex-1 overflow-auto">
				<div className="w-full mx-auto max-w-4xl px-4 py-6">
					<GenerateForm />
				</div>
			</main>
		</div>
	)
}
