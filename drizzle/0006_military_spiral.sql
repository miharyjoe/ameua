CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"goal" integer NOT NULL,
	"raised" integer DEFAULT 0 NOT NULL,
	"contributors" integer DEFAULT 0 NOT NULL,
	"deadline" timestamp,
	"image" text,
	"impact" text,
	"needs" text,
	"isFinished" boolean DEFAULT false NOT NULL,
	"testimonial" text,
	"totalRaised" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
