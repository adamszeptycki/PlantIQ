"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
	name: string;
	href: string;
};

const navigation: NavItem[] = [
	{ name: "Dashboard", href: "/erp" },
	{ name: "Products", href: "/erp/products" },
	{ name: "Inventory", href: "/erp/inventory" },
	{ name: "Sales", href: "/erp/sales" },
	{ name: "Manufacturing", href: "/erp/manufacturing" },
	{ name: "Purchasing", href: "/erp/purchasing" },
];

type ErpLayoutProps = {
	children: ReactNode;
};

export default function ErpLayout({ children }: ErpLayoutProps) {
	const pathname = usePathname();

	return (
		<div className="flex h-screen bg-slate-950">
			{/* Sidebar */}
			<div className="w-64 border-r border-slate-800 bg-slate-900/60">
				<div className="flex h-16 items-center border-b border-slate-800 px-6">
					<h1 className="text-xl font-bold text-white">PlantIQ ERP</h1>
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
	);
}
