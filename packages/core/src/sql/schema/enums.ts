import { pgEnum } from "drizzle-orm/pg-core";

// Tenant type
const tenantTypeOptions = ["company", "individual"] as const;
export const tenantTypeEnum = pgEnum("tenantType", tenantTypeOptions);
export type TenantType = (typeof tenantTypeOptions)[number];

// Sales & CRM
const leadStatusOptions = ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"] as const;
export const leadStatusEnum = pgEnum("lead_status", leadStatusOptions);
export type LeadStatus = (typeof leadStatusOptions)[number];

const quoteStatusOptions = ["draft", "sent", "accepted", "rejected", "expired"] as const;
export const quoteStatusEnum = pgEnum("quote_status", quoteStatusOptions);
export type QuoteStatus = (typeof quoteStatusOptions)[number];

const salesOrderStatusOptions = ["draft", "confirmed", "in_production", "ready", "delivered", "invoiced", "cancelled"] as const;
export const salesOrderStatusEnum = pgEnum("sales_order_status", salesOrderStatusOptions);
export type SalesOrderStatus = (typeof salesOrderStatusOptions)[number];

// Production
const bomTypeOptions = ["manufacturing", "kit", "phantom"] as const;
export const bomTypeEnum = pgEnum("bom_type", bomTypeOptions);
export type BomType = (typeof bomTypeOptions)[number];

const moStatusOptions = ["draft", "planned", "confirmed", "in_progress", "done", "cancelled"] as const;
export const moStatusEnum = pgEnum("mo_status", moStatusOptions);
export type MoStatus = (typeof moStatusOptions)[number];

const workOrderStatusOptions = ["pending", "in_progress", "completed", "cancelled"] as const;
export const workOrderStatusEnum = pgEnum("work_order_status", workOrderStatusOptions);
export type WorkOrderStatus = (typeof workOrderStatusOptions)[number];

// Inventory
const productTypeOptions = ["storable", "consumable", "service"] as const;
export const productTypeEnum = pgEnum("product_type", productTypeOptions);
export type ProductType = (typeof productTypeOptions)[number];

const stockMoveTypeOptions = ["in", "out", "internal", "adjustment", "production"] as const;
export const stockMoveTypeEnum = pgEnum("stock_move_type", stockMoveTypeOptions);
export type StockMoveType = (typeof stockMoveTypeOptions)[number];

// Purchasing
const poStatusOptions = ["draft", "sent", "confirmed", "received", "cancelled"] as const;
export const poStatusEnum = pgEnum("po_status", poStatusOptions);
export type PoStatus = (typeof poStatusOptions)[number];

// Accounting
const accountTypeOptions = ["asset", "liability", "equity", "revenue", "expense"] as const;
export const accountTypeEnum = pgEnum("account_type", accountTypeOptions);
export type AccountType = (typeof accountTypeOptions)[number];

const journalTypeOptions = ["general", "sales", "purchase", "cash", "bank"] as const;
export const journalTypeEnum = pgEnum("journal_type", journalTypeOptions);
export type JournalType = (typeof journalTypeOptions)[number];

const invoiceStatusOptions = ["draft", "posted", "paid", "cancelled"] as const;
export const invoiceStatusEnum = pgEnum("invoice_status", invoiceStatusOptions);
export type InvoiceStatus = (typeof invoiceStatusOptions)[number];
