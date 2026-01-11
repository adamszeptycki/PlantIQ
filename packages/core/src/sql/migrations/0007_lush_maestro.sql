CREATE TABLE "manufacturing_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"organization_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"bom_id" uuid,
	"mo_number" text NOT NULL,
	"status" "mo_status" DEFAULT 'draft' NOT NULL,
	"quantity_to_produce" numeric(10, 2) NOT NULL,
	"quantity_produced" numeric(10, 2) DEFAULT '0' NOT NULL,
	"scheduled_start_date" date,
	"scheduled_end_date" date,
	"actual_start_date" date,
	"actual_end_date" date,
	"responsible_person" uuid,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "boms" ALTER COLUMN "bom_type" SET DEFAULT 'manufacturing';--> statement-breakpoint
ALTER TABLE "manufacturing_orders" ADD CONSTRAINT "manufacturing_orders_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manufacturing_orders" ADD CONSTRAINT "manufacturing_orders_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manufacturing_orders" ADD CONSTRAINT "manufacturing_orders_bom_id_boms_id_fk" FOREIGN KEY ("bom_id") REFERENCES "public"."boms"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manufacturing_orders" ADD CONSTRAINT "manufacturing_orders_responsible_person_user_id_fk" FOREIGN KEY ("responsible_person") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;