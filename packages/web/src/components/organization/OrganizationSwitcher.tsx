"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

type Organization = {
	id: string;
	name: string;
	slug: string | null;
};

export function OrganizationSwitcher() {
	const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
	const [organizations, setOrganizations] = useState<Organization[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		loadOrganizations();
	}, []);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	async function loadOrganizations() {
		try {
			const res = await fetch("/api/trpc/organization.listUserOrganizations", {
				credentials: "include",
			});
			const data = await res.json();
			// tRPC with superjson wraps data in result.data.json
			const result = data.result?.data?.json ?? data.result?.data;
			if (result) {
				setOrganizations(result.orgsList || []);
				setCurrentOrg(result.activeOrg || null);
			}
		} catch (error) {
			console.error("Failed to load organizations:", error);
		} finally {
			setLoading(false);
		}
	}

	async function switchOrganization(orgId: string) {
		setIsOpen(false);
		await fetch("/api/trpc/organization.setCurrentOrganization", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ json: { organizationId: orgId } }),
			credentials: "include",
		});
		window.location.reload();
	}

	if (loading) {
		return (
			<div className="flex items-center gap-2">
				<div className="h-4 w-24 animate-pulse rounded bg-slate-700" />
			</div>
		);
	}

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-800"
			>
				<div className="flex items-center gap-2 min-w-0">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
						{currentOrg?.name?.charAt(0).toUpperCase() || "?"}
					</div>
					<div className="min-w-0">
						<div className="truncate text-sm font-medium text-white">
							{currentOrg?.name || "Select Organization"}
						</div>
					</div>
				</div>
				<svg
					className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{isOpen && (
				<div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-slate-700 bg-slate-800 py-1 shadow-xl">
					{organizations.map((org) => (
						<button
							key={org.id}
							onClick={() => switchOrganization(org.id)}
							className="flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-slate-700"
						>
							<div className="flex items-center gap-2">
								<div className="flex h-6 w-6 items-center justify-center rounded bg-slate-600 text-xs font-medium text-white">
									{org.name.charAt(0).toUpperCase()}
								</div>
								<span className="text-white">{org.name}</span>
							</div>
							{org.id === currentOrg?.id && (
								<svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
								</svg>
							)}
						</button>
					))}
					<div className="border-t border-slate-700 mt-1 pt-1">
						<Link
							href="/onboarding/create-organization"
							className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
							onClick={() => setIsOpen(false)}
						>
							<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
							</svg>
							Create new organization
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}
