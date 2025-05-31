import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "avatar.vercel.sh"
			}
		]
	},
	experimental: {
		reactCompiler: true
	}
}

export default nextConfig
