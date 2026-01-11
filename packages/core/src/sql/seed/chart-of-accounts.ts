import type { InsertAccount } from "../schema/accounting";

/**
 * Standard Chart of Accounts for Manufacturing ERP
 * Organized by account type: Assets, Liabilities, Equity, Revenue, Expenses
 */
export const getStandardChartOfAccounts = (organizationId: string): InsertAccount[] => {
	return [
		// ASSETS (1000-1999)
		{ organizationId, code: "1000", name: "Assets", accountType: "asset", parentId: null, balance: "0", isActive: true, description: "All company assets" },

		// Current Assets
		{ organizationId, code: "1100", name: "Current Assets", accountType: "asset", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "1110", name: "Cash", accountType: "asset", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "1120", name: "Accounts Receivable", accountType: "asset", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "1130", name: "Inventory - Raw Materials", accountType: "asset", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "1140", name: "Inventory - Work in Process", accountType: "asset", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "1150", name: "Inventory - Finished Goods", accountType: "asset", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "1160", name: "Prepaid Expenses", accountType: "asset", parentId: null, balance: "0", isActive: true },

		// Fixed Assets
		{ organizationId, code: "1500", name: "Fixed Assets", accountType: "asset", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "1510", name: "Property, Plant & Equipment", accountType: "asset", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "1520", name: "Accumulated Depreciation", accountType: "asset", parentId: null, balance: "0", isActive: true },

		// LIABILITIES (2000-2999)
		{ organizationId, code: "2000", name: "Liabilities", accountType: "liability", parentId: null, balance: "0", isActive: true, description: "All company liabilities" },

		// Current Liabilities
		{ organizationId, code: "2100", name: "Current Liabilities", accountType: "liability", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "2110", name: "Accounts Payable", accountType: "liability", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "2120", name: "Accrued Expenses", accountType: "liability", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "2130", name: "Sales Tax Payable", accountType: "liability", parentId: null, balance: "0", isActive: true },

		// Long-term Liabilities
		{ organizationId, code: "2500", name: "Long-term Liabilities", accountType: "liability", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "2510", name: "Long-term Debt", accountType: "liability", parentId: null, balance: "0", isActive: true },

		// EQUITY (3000-3999)
		{ organizationId, code: "3000", name: "Equity", accountType: "equity", parentId: null, balance: "0", isActive: true, description: "Owner's equity" },
		{ organizationId, code: "3100", name: "Owner's Equity", accountType: "equity", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "3200", name: "Retained Earnings", accountType: "equity", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "3300", name: "Current Year Earnings", accountType: "equity", parentId: null, balance: "0", isActive: true },

		// REVENUE (4000-4999)
		{ organizationId, code: "4000", name: "Revenue", accountType: "revenue", parentId: null, balance: "0", isActive: true, description: "All company revenue" },
		{ organizationId, code: "4100", name: "Product Sales", accountType: "revenue", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "4200", name: "Service Revenue", accountType: "revenue", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "4300", name: "Other Revenue", accountType: "revenue", parentId: null, balance: "0", isActive: true },

		// EXPENSES (5000-9999)
		{ organizationId, code: "5000", name: "Cost of Goods Sold", accountType: "expense", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "5100", name: "Raw Materials", accountType: "expense", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "5200", name: "Direct Labor", accountType: "expense", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "5300", name: "Manufacturing Overhead", accountType: "expense", parentId: null, balance: "0", isActive: true },

		{ organizationId, code: "6000", name: "Operating Expenses", accountType: "expense", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "6100", name: "Salaries & Wages", accountType: "expense", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "6200", name: "Rent", accountType: "expense", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "6300", name: "Utilities", accountType: "expense", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "6400", name: "Insurance", accountType: "expense", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "6500", name: "Office Supplies", accountType: "expense", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "6600", name: "Marketing & Advertising", accountType: "expense", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "6700", name: "Travel & Entertainment", accountType: "expense", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "6800", name: "Professional Fees", accountType: "expense", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "6900", name: "Depreciation", accountType: "expense", parentId: null, balance: "0", isActive: true },

		{ organizationId, code: "8000", name: "Other Expenses", accountType: "expense", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "8100", name: "Interest Expense", accountType: "expense", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "8200", name: "Bank Fees", accountType: "expense", parentId: null, balance: "0", isActive: true },
		{ organizationId, code: "8300", name: "Miscellaneous", accountType: "expense", parentId: null, balance: "0", isActive: true },
	];
};
