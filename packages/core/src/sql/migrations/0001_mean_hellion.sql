CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"organization_id" uuid NOT NULL,
	"sku" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"product_type" "product_type" DEFAULT 'storable' NOT NULL,
	"uom" text DEFAULT 'unit' NOT NULL,
	"list_price" numeric(12, 2),
	"cost" numeric(12, 2),
	"can_be_sold" boolean DEFAULT true,
	"can_be_purchased" boolean DEFAULT true,
	"can_be_manufactured" boolean DEFAULT false,
	"lead_time" integer DEFAULT 0,
	"reorder_point" numeric(10, 2),
	"reorder_quantity" numeric(10, 2),
	"image" text,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;