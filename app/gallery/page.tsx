import { auth } from "@/app/(auth)/auth"
import { getUserImages } from "@/lib/actions/generate"
import { ImageGrid } from "@/components/image-grid"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Images } from "lucide-react"
import Link from "next/link"

export default async function GalleryPage() {
	const session = await auth()

	if (!session?.user) {
		redirect("/login")
	}

	const images = await getUserImages()

	return (
		<div className="flex flex-col min-w-0 h-dvh bg-background">
			<header className="flex items-center justify-between px-4 py-3 border-b">
				<div>
					<h1 className="text-xl font-semibold flex items-center gap-2">
						<Images className="h-5 w-5" />
						My Gallery
					</h1>
					<p className="text-sm text-muted-foreground">
						Browse and manage your AI-generated images
					</p>
				</div>
				<Link href="/generate">
					<Button className="rounded-2xl">
						<Plus className="h-4 w-4 mr-2" />
						Generate New
					</Button>
				</Link>
			</header>

			<main className="flex-1 overflow-auto">
				<div className="w-full mx-auto max-w-6xl px-4 py-6">
					{images.length > 0 ? (
						<ImageGrid images={images} />
					) : (
						<div className="flex flex-col items-center justify-center min-h-[400px] text-center">
							<Images className="h-16 w-16 text-muted-foreground mb-4" />
							<h2 className="text-xl font-semibold mb-2">
								No images yet
							</h2>
							<p className="text-muted-foreground mb-6 max-w-md">
								Start creating amazing AI-generated images to
								build your gallery
							</p>
							<Link href="/generate">
								<Button className="rounded-2xl">
									<Plus className="h-4 w-4 mr-2" />
									Create Your First Image
								</Button>
							</Link>
						</div>
					)}
				</div>
			</main>
		</div>
	)
}
