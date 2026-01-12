"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { OrganizationChecker } from "@/components/organization/OrganizationChecker";
import { OrganizationSwitcher } from "@/components/organization/OrganizationSwitcher";

type NavItem = {
	name: string;
	href: string;
};

const navigation: NavItem[] = [
	{ name: "Dashboard", href: "/dashboard" },
	{ name: "Products", href: "/dashboard/products" },
	{ name: "Inventory", href: "/dashboard/inventory" },
	{ name: "Sales", href: "/dashboard/sales" },
	{ name: "Manufacturing", href: "/dashboard/manufacturing" },
	{ name: "Purchasing", href: "/dashboard/purchasing" },
	{ name: "Team", href: "/dashboard/team" },
];

type DashboardLayoutProps = {
	children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const pathname = usePathname();

	return (
		<OrganizationChecker>
			<div className="flex h-screen bg-slate-950">
				{/* Sidebar */}
				<div className="w-64 border-r border-slate-800 bg-slate-900/60">
					<div className="border-b border-slate-800 p-4">
						<OrganizationSwitcher />
					</div>
					<nav className="space-y-1 p-4">
						{navigation.map((item) => {
							const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
							return (
								<Link
									key={item.href}
									href={item.href}
									className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
										isActive
											? "bg-slate-800 text-white"
											: "text-slate-400 hover:bg-slate-800/50 hover:text-white"
									}`}
								>
									{item.name}
								</Link>
							);
						})}
					</nav>
				</div>

				{/* Main content */}
				<div className="flex-1 overflow-auto">
					<div className="p-8">{children}</div>
				</div>
			</div>
		</OrganizationChecker>
	);
}
