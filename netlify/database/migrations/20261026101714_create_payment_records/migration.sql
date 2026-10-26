CREATE TABLE "payment_checkouts" (
	"id" text PRIMARY KEY,
	"session_hash" text NOT NULL,
	"email" text NOT NULL,
	"product" text NOT NULL,
	"description" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"recurring" boolean DEFAULT false NOT NULL,
	"save_card" boolean DEFAULT false NOT NULL,
	"provider_id" text UNIQUE,
	"plan_id" text,
	"status" text DEFAULT 'CREATED' NOT NULL,
	"vault_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_plans" (
	"id" text PRIMARY KEY,
	"provider_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_receipts" (
	"id" text PRIMARY KEY,
	"checkout_id" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"claimed_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payment_receipts" ADD CONSTRAINT "payment_receipts_checkout_id_payment_checkouts_id_fkey" FOREIGN KEY ("checkout_id") REFERENCES "payment_checkouts"("id");