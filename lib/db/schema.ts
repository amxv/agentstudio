import type { InferSelectModel } from "drizzle-orm"
import {
	boolean,
	foreignKey,
	json,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
	varchar,
	integer
} from "drizzle-orm/pg-core"

export const user = pgTable("User", {
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	email: varchar("email", { length: 64 }).notNull(),
	name: varchar("name", { length: 100 }),
	password: varchar("password", { length: 64 })
})

export type User = InferSelectModel<typeof user>

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

export const vote = pgTable(
	"Vote",
	{
		imageId: uuid("imageId")
			.notNull()
			.references(() => image.id),
		userId: uuid("userId")
			.notNull()
			.references(() => user.id),
		isUpvoted: boolean("isUpvoted").notNull()
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.imageId, table.userId] })
		}
	}
)

export type Vote = InferSelectModel<typeof vote>

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
