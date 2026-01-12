# ERP System API Documentation

## Overview

This document provides comprehensive API documentation for the PlantIQ ERP system, including data flows, service architecture, and API endpoints.

## Architecture

### Technology Stack
- **Database**: PostgreSQL with Drizzle ORM
- **API**: tRPC v11 (type-safe RPC)
- **Frontend**: Next.js 15 with App Router
- **Authentication**: Better Auth with organization support
- **Authorization**: ERP role-based access control (RBAC)

### Service Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│  - React Components                                         │
│  - Client-side State Management                            │
│  - tRPC Client                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTP/JSON (tRPC)
┌──────────────────▼──────────────────────────────────────────┐
│                  API Layer (tRPC Routers)                    │
│  - Authentication Middleware                                │
│  - Authorization (Role-based)                               │
│  - Input Validation (Zod)                                   │
│  - Business Logic                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                  Database Layer (Drizzle ORM)                │
│  - Query Functions                                          │
│  - Mutation Functions                                       │
│  - Audit Logging                                            │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                   PostgreSQL Database                        │
│  - Multi-tenant (org scoped)                                │
│  - Transactional                                            │
└─────────────────────────────────────────────────────────────┘
```

### Multi-Tenancy Model

All data is scoped by `organizationId`. Every table includes an `organizationId` foreign key that cascades on delete, ensuring complete data isolation between organizations.

## Data Flow Diagrams

### 1. Sales to Production Flow

```
┌─────────────┐
│    Lead     │
└──────┬──────┘
       │ Convert
┌──────▼──────┐
│    Quote    │
└──────┬──────┘
       │ Accept
┌──────▼──────────────┐
│   Sales Order       │
│   status: draft     │
└──────┬──────────────┘
       │ Confirm
┌──────▼──────────────────────────────────────────┐
│   Sales Order                                    │
│   status: confirmed                              │
│   ┌─────────────────────────────────────┐       │
│   │ Trigger: Auto-create MOs             │       │
│   │ For each line item:                  │       │
│   │   - Get product BOM                  │       │
│   │   - Create Manufacturing Order       │       │
│   │   - Link to Sales Order Line         │       │
│   └─────────────────────────────────────┘       │
└────────────────┬─────────────────────────────────┘
                 │
        ┌────────▼──────────────┐
        │ Manufacturing Orders  │
        │ status: confirmed     │
        └────────┬──────────────┘
                 │ Start Production
        ┌────────▼──────────────┐
        │ Manufacturing Orders  │
        │ status: in_progress   │
        │ ┌──────────────────┐  │
        │ │ Work Orders      │  │
        │ │ (from routings)  │  │
        │ └──────────────────┘  │
        └────────┬──────────────┘
                 │ Complete
        ┌────────▼──────────────────────────────┐
        │ Manufacturing Orders                  │
        │ status: done                          │
        │ ┌──────────────────────────────────┐  │
        │ │ Trigger: Stock Moves             │  │
        │ │ - Move from virtual to internal  │  │
        │ │ - Update salesOrderLine qty      │  │
        │ │ - Generate costing entries       │  │
        │ └──────────────────────────────────┘  │
        └───────────────────────────────────────┘
```

### 2. Inventory Flow

```
Purchase Order Receive:
┌──────────────┐        ┌──────────────┐
│   Vendor     │───────▶│   Internal   │  (+stock)
│   Location   │        │   Location   │
└──────────────┘        └──────────────┘

MO Component Reserve (on confirm):
┌──────────────┐        ┌──────────────┐
│   Internal   │───────▶│   Reserved   │
│   Location   │        │   (virtual)  │
└──────────────┘        └──────────────┘

MO Complete (finished goods):
┌──────────────┐        ┌──────────────┐
│   Virtual    │───────▶│   Internal   │  (+finished goods)
│  Production  │        │   Location   │
└──────────────┘        └──────────────┘

Sales Order Deliver:
┌──────────────┐        ┌──────────────┐
│   Internal   │───────▶│   Customer   │  (-stock)
│   Location   │        │   Location   │
└──────────────┘        └──────────────┘
```

### 3. Accounting Integration Flow

```
Sales Order (invoiced):
┌───────────────┐        ┌───────────────────┐
│ Sales Order   │───────▶│ Customer Invoice  │
└───────────────┘        └─────────┬─────────┘
                                   │
                         ┌─────────▼──────────┐
                         │  Journal Entry     │
                         │  DR: AR            │
                         │  CR: Revenue       │
                         └────────────────────┘

Purchase Order (received):
┌───────────────┐        ┌───────────────────┐
│Purchase Order │───────▶│  Vendor Bill      │
└───────────────┘        └─────────┬─────────┘
                                   │
                         ┌─────────▼──────────┐
                         │  Journal Entry     │
                         │  DR: Expense       │
                         │  CR: AP            │
                         └────────────────────┘

Manufacturing Order (complete):
┌───────────────┐        ┌───────────────────┐
│  MO Complete  │───────▶│  Costing Entry    │
└───────────────┘        └─────────┬─────────┘
                                   │
                         ┌─────────▼──────────┐
                         │  Journal Entry     │
                         │  DR: Inventory     │
                         │  CR: Raw Materials │
                         │  CR: Labor         │
                         └────────────────────┘
```

### 4. Authorization Flow

```
┌───────────────┐
│   User Login  │
└───────┬───────┘
        │
┌───────▼───────────────────┐
│  Better Auth Session      │
│  - user.id                │
│  - activeOrganizationId   │
└───────┬───────────────────┘
        │
┌───────▼───────────────────┐
│  tRPC Middleware          │
│  - enforceUserIsAuthed    │
│  - enforceOrganization    │
└───────┬───────────────────┘
        │
┌───────▼───────────────────┐
│  ERP Role Middleware      │
│  - Check userErpRoles     │
│  - Admin has all access   │
└───────┬───────────────────┘
        │
┌───────▼───────────────────┐
│  Router Procedures        │
│  - salesProcedure         │
│  - plannerProcedure       │
│  - buyerProcedure         │
│  - workerProcedure        │
│  - supervisorProcedure    │
│  - financeProcedure       │
│  - adminProcedure         │
└───────┬───────────────────┘
        │
┌───────▼───────────────────┐
│  Business Logic           │
└───────────────────────────┘
```

## API Endpoints

### Authentication & Authorization

All ERP endpoints require authentication and an active organization. Additional role requirements are noted per router.

### 1. Products Router (`products.*`)
**Required Role**: `planner` or `admin`

#### `products.create`
Create a new product.

**Input**:
```typescript
{
  sku: string;
  name: string;
  description?: string;
  productType: "storable" | "consumable" | "service";
  uom: string;
  listPrice?: number;
  cost?: number;
  canBeSold?: boolean;
  canBePurchased?: boolean;
  canBeManufactured?: boolean;
  leadTime?: number; // days
  reorderPoint?: number;
  reorderQuantity?: number;
  image?: string;
  isActive?: boolean;
}
```

**Output**: Product object

**Audit**: Logs create action with full product data

#### `products.update`
Update an existing product.

**Input**:
```typescript
{
  id: string; // UUID
  // Any product fields to update
}
```

**Output**: Updated product object

**Audit**: Logs update action with before/after state

#### `products.delete`
Delete a product.

**Input**:
```typescript
{
  id: string; // UUID
}
```

**Output**: `{ success: true, product: Product }`

**Audit**: Logs delete action with final state

#### `products.list`
List products with pagination and search.

**Input**:
```typescript
{
  search?: string;
  limit: number; // default: 50
  offset: number; // default: 0
}
```

**Output**:
```typescript
{
  products: Product[];
  total: number;
  hasMore: boolean;
}
```

#### `products.get`
Get a single product by ID.

**Input**:
```typescript
{
  id: string; // UUID
}
```

**Output**: Product object

### 2. Sales Router (`sales.*`)
**Required Role**: `sales` or `admin`

#### Customer Operations
- `sales.createCustomer`: Create a new customer
- `sales.updateCustomer`: Update customer details
- `sales.deleteCustomer`: Delete a customer
- `sales.listCustomers`: List customers with pagination
- `sales.getCustomer`: Get customer by ID

#### Lead Operations
- `sales.createLead`: Create a new lead
- `sales.updateLead`: Update lead details (including status)
- `sales.deleteLead`: Delete a lead
- `sales.listLeads`: List leads with status filtering
- `sales.getLead`: Get lead by ID

#### Quote Operations
- `sales.createQuote`: Create a quote with line items
- `sales.updateQuote`: Update quote details
- `sales.addQuoteLine`: Add line item to quote
- `sales.updateQuoteLine`: Update quote line item
- `sales.deleteQuoteLine`: Remove quote line item
- `sales.updateQuoteStatus`: Change quote status (draft → sent → accepted/rejected)
- `sales.listQuotes`: List quotes with filtering
- `sales.getQuote`: Get quote with line items

#### Sales Order Operations
- `sales.createSalesOrder`: Create sales order (optionally from quote)
- `sales.updateSalesOrder`: Update sales order details
- `sales.addSalesOrderLine`: Add line item
- `sales.updateSalesOrderLine`: Update line item
- `sales.deleteSalesOrderLine`: Remove line item
- `sales.confirmSalesOrder`: Confirm order (triggers MO creation if product has BOM)
- `sales.listSalesOrders`: List sales orders with status filtering
- `sales.getSalesOrder`: Get sales order with line items

### 3. Manufacturing Router (`manufacturing.*`)
**Required Role**: `supervisor` or `admin`

#### BOM Operations
- `manufacturing.createBom`: Create bill of materials for a product
- `manufacturing.updateBom`: Update BOM details
- `manufacturing.addBomLine`: Add component to BOM
- `manufacturing.updateBomLine`: Update component quantity
- `manufacturing.deleteBomLine`: Remove component
- `manufacturing.getBom`: Get BOM with components
- `manufacturing.listBoms`: List BOMs

#### Manufacturing Order Operations
- `manufacturing.createManufacturingOrder`: Create MO
- `manufacturing.updateManufacturingOrder`: Update MO details
- `manufacturing.updateManufacturingOrderStatus`: Change status (draft → confirmed → in_progress → done)
  - **On confirm**: Creates work orders from routing, reserves components
  - **On done**: Creates stock moves, updates sales order quantities, generates costing entries
- `manufacturing.listManufacturingOrders`: List MOs with filtering
- `manufacturing.getManufacturingOrder`: Get MO with details

#### Work Order Operations
- `manufacturing.updateWorkOrderStatus`: Update work order status (for shop floor)
- `manufacturing.createTimeEntry`: Log time worked on work order
- `manufacturing.updateTimeEntry`: Update time entry
- `manufacturing.listWorkOrders`: List work orders (filtered for shop floor)
- `manufacturing.getWorkOrder`: Get work order details

### 4. Purchasing Router (`purchasing.*`)
**Required Role**: `buyer` or `admin`

#### Vendor Operations
- `purchasing.createVendor`: Create a new vendor
- `purchasing.updateVendor`: Update vendor details
- `purchasing.deleteVendor`: Delete a vendor
- `purchasing.listVendors`: List vendors
- `purchasing.getVendor`: Get vendor by ID

#### Purchase Order Operations
- `purchasing.createPurchaseOrder`: Create PO with line items
- `purchasing.updatePurchaseOrder`: Update PO details
- `purchasing.addPurchaseOrderLine`: Add line item
- `purchasing.updatePurchaseOrderLine`: Update line item
- `purchasing.deletePurchaseOrderLine`: Remove line item
- `purchasing.updatePurchaseOrderStatus`: Change status (draft → sent → confirmed → received)
  - **On received**: Creates stock moves from vendor to internal location
- `purchasing.listPurchaseOrders`: List POs with filtering
- `purchasing.getPurchaseOrder`: Get PO with line items

#### Purchase Suggestions
- `purchasing.getPurchaseSuggestions`: Get purchase suggestions based on:
  - Products below reorder point
  - Component requirements from confirmed manufacturing orders

### 5. Inventory Router (`inventory.*`)
**Required Role**: `planner` or `admin`

#### Location Operations
- `inventory.createLocation`: Create inventory location
- `inventory.updateLocation`: Update location details
- `inventory.listLocations`: List all locations

#### Stock Operations
- `inventory.getStock`: Get stock levels by product
- `inventory.getStockByProduct`: Get all stock locations for a product
- `inventory.adjustStock`: Manual stock adjustment
- `inventory.createStockMove`: Create stock move between locations

#### Stock Move Operations
- `inventory.listStockMoves`: List stock movements with filtering

### 6. Accounting Router (`accounting.*`)
**Required Role**: `finance` or `admin`

#### Chart of Accounts
- `accounting.createAccount`: Create account in COA
- `accounting.updateAccount`: Update account details
- `accounting.listAccounts`: List all accounts
- `accounting.getAccount`: Get account with balance

#### Journal Operations
- `accounting.createJournal`: Create journal (e.g., Sales, Purchase, General)
- `accounting.listJournals`: List all journals
- `accounting.getJournal`: Get journal details

#### Journal Entry Operations
- `accounting.createJournalEntry`: Create manual journal entry
- `accounting.addJournalLine`: Add line to journal entry
- `accounting.postJournalEntry`: Post entry (updates account balances)
- `accounting.listJournalEntries`: List entries with filtering
- `accounting.getJournalEntry`: Get entry with lines

#### Invoice Operations
- `accounting.createInvoice`: Create customer/vendor invoice
- `accounting.updateInvoice`: Update invoice details
- `accounting.postInvoice`: Post invoice (creates journal entry)
- `accounting.listInvoices`: List invoices with filtering
- `accounting.getInvoice`: Get invoice details

### 7. Dashboard Router (`dashboard.*`)
**Required Role**: Any authenticated user with organization

#### Metrics
- `dashboard.getSalesMetrics`: Get sales summary (orders, revenue, quotes, customers)
- `dashboard.getInventoryMetrics`: Get inventory summary (products, low stock, value)
- `dashboard.getProductionMetrics`: Get production summary (MOs by status)
- `dashboard.getFinancialMetrics`: Get financial summary (AR, AP, open POs)

#### Reports
- `dashboard.getSalesReport`: Sales report with date range filtering
  - Orders by status
  - Top 10 customers by value
- `dashboard.getInventoryReport`: Inventory report
  - Product stock levels
  - Low stock items
- `dashboard.getProductionReport`: Production report with date range filtering
  - MOs by status
  - Top 10 products by MO count
- `dashboard.getFinancialReport`: Financial report with date range filtering
  - Revenue summary (invoiced, paid, outstanding)
  - Expense summary (billed, paid, outstanding)
  - Invoices by status

### 8. Audit Router (`audit.*`)
**Required Role**: `admin` only

#### Audit Log Operations
- `audit.list`: List audit logs with filtering
  - Filter by: entityType, entityId, userId
  - Pagination: limit, offset
- `audit.get`: Get single audit log with full details

### 9. ERP Roles Router (`erpRoles.*`)
**Required Role**: `admin` only

#### Role Management
- `erpRoles.listUsersWithRoles`: List all users with their ERP roles
- `erpRoles.getUserRoles`: Get roles for specific user
- `erpRoles.addRole`: Add ERP role to user
- `erpRoles.removeRole`: Remove ERP role from user
- `erpRoles.setRoles`: Set all roles for user (replaces existing)

## Role Permissions Matrix

| Router | Required Role(s) | Description |
|--------|-----------------|-------------|
| `products` | planner, admin | Product catalog management |
| `inventory` | planner, admin | Inventory and location management |
| `sales` | sales, admin | Customer, leads, quotes, sales orders |
| `manufacturing` | supervisor, admin | BOMs, MOs, work orders |
| `purchasing` | buyer, admin | Vendors, POs, purchase suggestions |
| `accounting` | finance, admin | COA, journals, invoices |
| `dashboard` | any authenticated | Metrics and reports |
| `audit` | admin | Audit trail viewing |
| `erpRoles` | admin | User role management |

**Note**: Users with `admin` role have access to ALL endpoints.

## Error Handling

### Standard Error Codes

- `UNAUTHORIZED`: User not authenticated
- `FORBIDDEN`: User lacks required ERP role
- `BAD_REQUEST`: Missing organization or invalid input
- `NOT_FOUND`: Entity not found
- `INTERNAL_SERVER_ERROR`: Unexpected error

### Error Response Format

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "User must have planner or admin role to access this resource"
  }
}
```

## Audit Logging

All create, update, and delete operations on critical entities are automatically logged to the `audit_logs` table. Each log includes:

- User who performed the action
- Organization context
- Entity type and ID
- Before/after state (for updates)
- Changes made (for updates)
- IP address and user agent
- Timestamp

Audit logs are immutable and can only be viewed by admins.

## Data Integrity

### Multi-Tenancy
All queries automatically filter by `organizationId` from the user's session, ensuring complete data isolation.

### Cascading Deletes
Deleting an organization cascades to all related data:
- Products, BOMs, MOs
- Customers, leads, quotes, sales orders
- Vendors, purchase orders
- Stock, locations, stock moves
- Accounts, journals, invoices
- Audit logs
- User ERP roles

### Foreign Key Constraints
All relationships use foreign keys with appropriate cascade rules to maintain referential integrity.

## Testing

The test suite includes:

1. **Unit Tests**: Query and mutation functions
2. **Integration Tests**: Multi-table operations (e.g., SO → MO flow)
3. **Authorization Tests**: Role-based access control
4. **Multi-Tenancy Tests**: Data isolation between organizations
5. **Audit Tests**: Logging accuracy and completeness

Run tests with:
```bash
pnpm --filter @plantiq/core test
```

## Migration Management

Database migrations are managed via Drizzle Kit:

### Generate Migration
```bash
pnpm --filter @plantiq/core db:generate:migrations
```

### Apply Migration
```bash
pnpm --filter @plantiq/core db:migrate:local  # for local dev
```

## Future Enhancements

### Planned Features (Not Yet Implemented)

1. **Async Jobs**
   - Background processing for long-running operations
   - Email notifications
   - Report generation
   - Scheduled tasks (e.g., reorder point checks)

2. **Advanced Reporting**
   - Custom report builder
   - Chart visualizations
   - Export to Excel/PDF

3. **Batch Operations**
   - Bulk import/export
   - Mass updates
   - Batch approval workflows

4. **Webhooks**
   - Event-driven integrations
   - Third-party system notifications

5. **Document Management**
   - File attachments
   - Document version control
   - Template management

## Support

For API questions or issues, please refer to:
- GitHub Issues: https://github.com/anthropics/claude-code/issues
- Documentation: This file

---

**Generated with Claude Code**
**Version**: 1.0.0
**Last Updated**: 2026-01-11
