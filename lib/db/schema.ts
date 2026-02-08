import type { InferSelectModel } from "drizzle-orm"
import {
	boolean,
	foreignKey,
	integer,
	json,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
	varchar
} from "drizzle-orm/pg-core"

export const user = pgTable("User", {
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	email: varchar("email", { length: 64 }).notNull(),
	name: varchar("name", { length: 100 }),
	password: varchar("password", { length: 64 })
})

export type User = InferSelectModel<typeof user>

export const chat = pgTable("Chat", {
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	createdAt: timestamp("createdAt").notNull(),
	title: text("title").notNull(),
	userId: uuid("userId")
		.notNull()
		.references(() => user.id),
	visibility: varchar("visibility", { enum: ["public", "private"] })
		.notNull()
		.default("private")
})

export type Chat = InferSelectModel<typeof chat>

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://chat-sdk.dev/docs/migration-guides/message-parts
export const messageDeprecated = pgTable("Message", {
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	chatId: uuid("chatId")
		.notNull()
		.references(() => chat.id),
	role: varchar("role").notNull(),
	content: json("content").notNull(),
	createdAt: timestamp("createdAt").notNull()
})

export type MessageDeprecated = InferSelectModel<typeof messageDeprecated>

export const message = pgTable("Message_v2", {
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	chatId: uuid("chatId")
		.notNull()
		.references(() => chat.id),
	role: varchar("role").notNull(),
	parts: json("parts").notNull(),
	attachments: json("attachments").notNull(),
	createdAt: timestamp("createdAt").notNull()
})

export type DBMessage = InferSelectModel<typeof message>

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://chat-sdk.dev/docs/migration-guides/message-parts
export const voteDeprecated = pgTable(
	"Vote",
	{
		chatId: uuid("chatId")
			.notNull()
			.references(() => chat.id),
		messageId: uuid("messageId")
			.notNull()
			.references(() => messageDeprecated.id),
		isUpvoted: boolean("isUpvoted").notNull()
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.chatId, table.messageId] })
		}
	}
)

export type VoteDeprecated = InferSelectModel<typeof voteDeprecated>

export const vote = pgTable(
	"Vote_v2",
	{
		chatId: uuid("chatId")
			.notNull()
			.references(() => chat.id),
		messageId: uuid("messageId")
			.notNull()
			.references(() => message.id),
		isUpvoted: boolean("isUpvoted").notNull()
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.chatId, table.messageId] })
		}
	}
)

export type Vote = InferSelectModel<typeof vote>

export const document = pgTable(
	"Document",
	{
		id: uuid("id").notNull().defaultRandom(),
		createdAt: timestamp("createdAt").notNull(),
		title: text("title").notNull(),
		content: text("content"),
		kind: varchar("text", { enum: ["text", "image", "sheet", "slides"] })
			.notNull()
			.default("text"),
		userId: uuid("userId")
			.notNull()
			.references(() => user.id)
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.id, table.createdAt] })
		}
	}
)

export type Document = InferSelectModel<typeof document>

export const suggestion = pgTable(
	"Suggestion",
	{
		id: uuid("id").notNull().defaultRandom(),
		documentId: uuid("documentId").notNull(),
		documentCreatedAt: timestamp("documentCreatedAt").notNull(),
		originalText: text("originalText").notNull(),
		suggestedText: text("suggestedText").notNull(),
		description: text("description"),
		isResolved: boolean("isResolved").notNull().default(false),
		userId: uuid("userId")
			.notNull()
			.references(() => user.id),
		createdAt: timestamp("createdAt").notNull()
	},
	(table) => ({
		pk: primaryKey({ columns: [table.id] }),
		documentRef: foreignKey({
			columns: [table.documentId, table.documentCreatedAt],
			foreignColumns: [document.id, document.createdAt]
		})
	})
)

export type Suggestion = InferSelectModel<typeof suggestion>

export const stream = pgTable(
	"Stream",
	{
		id: uuid("id").notNull().defaultRandom(),
		chatId: uuid("chatId").notNull(),
		createdAt: timestamp("createdAt").notNull()
	},
	(table) => ({
		pk: primaryKey({ columns: [table.id] }),
		chatRef: foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id]
		})
	})
)

export type Stream = InferSelectModel<typeof stream>

export const project = pgTable("Project", {
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	createdAt: timestamp("createdAt").notNull(),
	title: text("title").notNull(),
	description: text("description"),
	userId: uuid("userId")
		.notNull()
		.references(() => user.id),
	visibility: varchar("visibility", { enum: ["public", "private"] })
		.notNull()
		.default("private")
})

export type Project = InferSelectModel<typeof project>

export const image = pgTable("Image", {
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	projectId: uuid("projectId")
		.notNull()
		.references(() => project.id),
	prompt: text("prompt").notNull(),
	negativePrompt: text("negativePrompt"),
	model: varchar("model", { length: 100 }).notNull(),
	style: varchar("style", { length: 100 }),
	width: integer("width").notNull().default(1024),
	height: integer("height").notNull().default(1024),
	steps: integer("steps").notNull().default(50),
	seed: integer("seed"),
	guidanceScale: integer("guidanceScale").notNull().default(7),
	imageUrl: text("imageUrl"),
	status: varchar("status", {
		enum: ["pending", "generating", "completed", "failed"]
	})
		.notNull()
		.default("pending"),
	errorMessage: text("errorMessage"),
	userId: uuid("userId")
		.notNull()
		.references(() => user.id),
	createdAt: timestamp("createdAt").notNull(),
	completedAt: timestamp("completedAt")
})

export type DBImage = InferSelectModel<typeof image>

export const collection = pgTable("Collection", {
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	createdAt: timestamp("createdAt").notNull(),
	title: text("title").notNull(),
	description: text("description"),
	userId: uuid("userId")
		.notNull()
		.references(() => user.id),
	visibility: varchar("visibility", { enum: ["public", "private"] })
		.notNull()
		.default("private")
})

export type Collection = InferSelectModel<typeof collection>

export const collectionImage = pgTable(
	"CollectionImage",
	{
		collectionId: uuid("collectionId")
			.notNull()
			.references(() => collection.id),
		imageId: uuid("imageId")
			.notNull()
			.references(() => image.id),
		addedAt: timestamp("addedAt").notNull()
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.collectionId, table.imageId] })
		}
	}
)

export type CollectionImage = InferSelectModel<typeof collectionImage>

export const prompt = pgTable("Prompt", {
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	title: text("title").notNull(),
	content: text("content").notNull(),
	category: varchar("category", { length: 100 }),
	tags: json("tags"),
	isPublic: boolean("isPublic").notNull().default(false),
	userId: uuid("userId")
		.notNull()
		.references(() => user.id),
	createdAt: timestamp("createdAt").notNull(),
	usageCount: integer("usageCount").notNull().default(0)
})

export type Prompt = InferSelectModel<typeof prompt>
