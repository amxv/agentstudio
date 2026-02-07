import { auth } from "@/app/(auth)/auth"
import { redirect } from "next/navigation"
import { FolderOpen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function CollectionsPage() {
	const session = await auth()

	if (!session?.user) {
		redirect("/login")
	}

	return (
		<div className="flex flex-col min-w-0 h-dvh bg-background">
			<header className="flex items-center justify-between px-4 py-3 border-b">
				<div>
					<h1 className="text-xl font-semibold flex items-center gap-2">
						<FolderOpen className="h-5 w-5" />
						Collections
					</h1>
					<p className="text-sm text-muted-foreground">
						Organize your images into collections
					</p>
				</div>
				<Button className="rounded-2xl">
					<Plus className="h-4 w-4 mr-2" />
					New Collection
				</Button>
			</header>

			<main className="flex-1 overflow-auto">
				<div className="w-full mx-auto max-w-6xl px-4 py-6">
					<div className="flex flex-col items-center justify-center min-h-[400px] text-center">
						<FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
						<h2 className="text-xl font-semibold mb-2">
							No collections yet
						</h2>
						<p className="text-muted-foreground mb-6 max-w-md">
							Create collections to organize your generated images
							by theme, project, or style
						</p>
						<Button className="rounded-2xl">
							<Plus className="h-4 w-4 mr-2" />
							Create Your First Collection
						</Button>
					</div>
				</div>
			</main>
		</div>
	)
}
