CREATE TABLE "bom_line_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"organization_id" uuid NOT NULL,
	"bom_id" uuid NOT NULL,
	"component_id" uuid NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	"scrap_percent" numeric(5, 2) DEFAULT '0',
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "boms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"organization_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"bom_type" "bom_type" DEFAULT 'manufacture' NOT NULL,
	"quantity" numeric(10, 2) DEFAULT '1' NOT NULL,
	"is_active" boolean DEFAULT true,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "bom_line_items" ADD CONSTRAINT "bom_line_items_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bom_line_items" ADD CONSTRAINT "bom_line_items_bom_id_boms_id_fk" FOREIGN KEY ("bom_id") REFERENCES "public"."boms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bom_line_items" ADD CONSTRAINT "bom_line_items_component_id_products_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boms" ADD CONSTRAINT "boms_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boms" ADD CONSTRAINT "boms_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;