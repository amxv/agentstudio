import reactCompiler from "eslint-plugin-react-compiler"
import pluginReactHooks from "eslint-plugin-react-hooks"
import nextEslint from "@next/eslint-plugin-next"
import globals from "globals"
import tseslint from "typescript-eslint"

export default [
	nextEslint.flatConfig.recommended,
	nextEslint.flatConfig.coreWebVitals,
	{
		name: "project/custom",
		files: [
			"app/**/*.{js,jsx,ts,tsx}",
			"components/**/*.{js,jsx,ts,tsx}",
			"lib/**/*.{js,jsx,ts,tsx}",
			"hooks/**/*.{js,jsx,ts,tsx}"
		],
		ignores: [
			"**/node_modules/**",
			"**/.next/**",
			"**/dist/**",
			"**/build/**",
			"**/.vercel/**",
			"**/public/**",
			"**/*.css",
			"**/*.md",
			"**/components/ui/**"
		],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaFeatures: { jsx: true },
				sourceType: "module",
				ecmaVersion: "latest"
			},
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		plugins: {
			"react-hooks": pluginReactHooks,
			"react-compiler": reactCompiler
		},
		rules: {
			// React Hooks rules
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",

			// React Compiler rule
			"react-compiler/react-compiler": "error"
		}
	}
]
