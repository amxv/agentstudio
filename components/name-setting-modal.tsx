"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/toast"

interface NameSettingModalProps {
	children: React.ReactNode
}

export function NameSettingModal({ children }: NameSettingModalProps) {
	const { data: session, update } = useSession()
	const [open, setOpen] = useState(false)
	const [name, setName] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	// Update the local name state when session changes or modal opens
	useEffect(() => {
		if (open) {
			setName(session?.user?.name || "")
		}
	}, [session?.user?.name, open])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			const response = await fetch("/api/user/name", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ name: name.trim() })
			})

			if (!response.ok) {
				throw new Error("Failed to update name")
			}

			const data = await response.json()

			// Update the session with the new name from the API response
			await update({
				...session,
				user: {
					...session?.user,
					name: data.user.name
				}
			})

			toast({
				type: "success",
				description: "Name updated successfully!"
			})

			setOpen(false)
		} catch (error) {
			toast({
				type: "error",
				description: "Failed to update name. Please try again."
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<User className="h-5 w-5" />
						Set Your Name
					</DialogTitle>
					<DialogDescription>
						Set your display name to personalize your experience.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter your name"
							required
							maxLength={100}
						/>
					</div>
					<div className="flex justify-end space-x-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Saving..." : "Save"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
