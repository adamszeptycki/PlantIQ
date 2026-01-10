import { z } from "zod";

// Customers
export const CreateCustomerSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email().nullable().optional(),
	phone: z.string().nullable().optional(),
	address: z.string().nullable().optional(),
	city: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	zipCode: z.string().nullable().optional(),
	country: z.string().nullable().optional(),
	taxId: z.string().nullable().optional(),
	creditLimit: z.string().nullable().optional(),
	notes: z.string().nullable().optional(),
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial();

export const ListCustomersSchema = z.object({
	search: z.string().nullable().optional(),
	limit: z.number().int().min(1).max(100).default(50),
	offset: z.number().int().min(0).default(0),
});

// Leads
export const CreateLeadSchema = z.object({
	name: z.string().min(1, "Name is required"),
	company: z.string().nullable().optional(),
	email: z.string().email().nullable().optional(),
	phone: z.string().nullable().optional(),
	status: z
		.enum(["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"])
		.default("new"),
	assignedTo: z.string().uuid().nullable().optional(),
	estimatedValue: z.string().nullable().optional(),
	notes: z.string().nullable().optional(),
});

export const UpdateLeadSchema = CreateLeadSchema.partial();

export const ListLeadsSchema = z.object({
	status: z.string().nullable().optional(),
	assignedTo: z.string().uuid().nullable().optional(),
	search: z.string().nullable().optional(),
	limit: z.number().int().min(1).max(100).default(50),
	offset: z.number().int().min(0).default(0),
});

export type CreateCustomerArgs = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerArgs = z.infer<typeof UpdateCustomerSchema>;
export type ListCustomersArgs = z.infer<typeof ListCustomersSchema>;
export type CreateLeadArgs = z.infer<typeof CreateLeadSchema>;
export type UpdateLeadArgs = z.infer<typeof UpdateLeadSchema>;
export type ListLeadsArgs = z.infer<typeof ListLeadsSchema>;
