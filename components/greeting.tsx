import { motion } from "framer-motion"

export const Greeting = () => {
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
				Hi Mallesh,
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
