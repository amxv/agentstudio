CREATE TABLE IF NOT EXISTS "Collection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"userId" uuid NOT NULL,
	"visibility" varchar DEFAULT 'private' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CollectionImage" (
	"collectionId" uuid NOT NULL,
	"imageId" uuid NOT NULL,
	"addedAt" timestamp NOT NULL,
	CONSTRAINT "CollectionImage_collectionId_imageId_pk" PRIMARY KEY("collectionId","imageId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projectId" uuid NOT NULL,
	"prompt" text NOT NULL,
	"negativePrompt" text,
	"model" varchar(100) NOT NULL,
	"style" varchar(100),
	"width" integer DEFAULT 1024 NOT NULL,
	"height" integer DEFAULT 1024 NOT NULL,
	"steps" integer DEFAULT 50 NOT NULL,
	"seed" integer,
	"guidanceScale" integer DEFAULT 7 NOT NULL,
	"imageUrl" text,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"errorMessage" text,
	"userId" uuid NOT NULL,
	"createdAt" timestamp NOT NULL,
	"completedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"userId" uuid NOT NULL,
	"visibility" varchar DEFAULT 'private' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Prompt" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"category" varchar(100),
	"tags" json,
	"isPublic" boolean DEFAULT false NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp NOT NULL,
	"usageCount" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE IF EXISTS "Chat" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE IF EXISTS "Document" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE IF EXISTS "Message_v2" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE IF EXISTS "Message" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE IF EXISTS "Stream" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE IF EXISTS "Suggestion" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE IF EXISTS "Vote_v2" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE IF EXISTS "Chat" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "Document" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "Message_v2" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "Message" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "Stream" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "Suggestion" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "Vote_v2" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "Vote" CASCADE;--> statement-breakpoint
CREATE TABLE "Vote" (
	"imageId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"isUpvoted" boolean NOT NULL,
	CONSTRAINT "Vote_imageId_userId_pk" PRIMARY KEY("imageId","userId")
);
--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" varchar(100);--> statement-breakpoint
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CollectionImage" ADD CONSTRAINT "CollectionImage_collectionId_Collection_id_fk" FOREIGN KEY ("collectionId") REFERENCES "public"."Collection"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CollectionImage" ADD CONSTRAINT "CollectionImage_imageId_Image_id_fk" FOREIGN KEY ("imageId") REFERENCES "public"."Image"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Image" ADD CONSTRAINT "Image_projectId_Project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_imageId_Image_id_fk" FOREIGN KEY ("imageId") REFERENCES "public"."Image"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
