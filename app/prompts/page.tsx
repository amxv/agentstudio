import { auth } from "@/app/(auth)/auth"
import { redirect } from "next/navigation"
import { Heart, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function PromptsPage() {
	const session = await auth()

	if (!session?.user) {
		redirect("/login")
	}

	return (
		<div className="flex flex-col min-w-0 h-dvh bg-background">
			<header className="flex items-center justify-between px-4 py-3 border-b">
				<div>
					<h1 className="text-xl font-semibold flex items-center gap-2">
						<Heart className="h-5 w-5" />
						Saved Prompts
					</h1>
					<p className="text-sm text-muted-foreground">
						Your favorite prompts for quick reuse
					</p>
				</div>
				<Button className="rounded-2xl">
					<Plus className="h-4 w-4 mr-2" />
					Save Prompt
				</Button>
			</header>

			<main className="flex-1 overflow-auto">
				<div className="w-full mx-auto max-w-6xl px-4 py-6">
					<div className="flex flex-col items-center justify-center min-h-[400px] text-center">
						<Heart className="h-16 w-16 text-muted-foreground mb-4" />
						<h2 className="text-xl font-semibold mb-2">
							No saved prompts yet
						</h2>
						<p className="text-muted-foreground mb-6 max-w-md">
							Save prompts from your generated images to reuse
							them later or share with others
						</p>
						<Button className="rounded-2xl">
							<Plus className="h-4 w-4 mr-2" />
							Browse Prompt Library
						</Button>
					</div>
				</div>
			</main>
		</div>
	)
}
