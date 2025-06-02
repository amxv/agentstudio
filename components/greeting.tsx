"use client"

import { motion } from "framer-motion"
import { useSession } from "next-auth/react"

export const Greeting = () => {
	const { data: session } = useSession()

	// Get the user's name, fallback to email or "there"
	const getUserName = () => {
		if (session?.user?.name) {
			return session.user.name
		}
		if (session?.user?.email) {
			// Extract first part of email as fallback
			return session.user.email.split("@")[0]
		}
		return "there"
	}

	return (
		<div
			key="overview"
			className="max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center"
		>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 10 }}
				transition={{ delay: 0.5 }}
				className="text-4xl tracking-tight mb-4"
			>
				Hi {getUserName()},
			</motion.div>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 10 }}
				transition={{ delay: 0.6 }}
				className="text-4xl text-zinc-500 font-light tracking-tight"
			>
				What can I create for you today?
			</motion.div>
		</div>
	)
}
