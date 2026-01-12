"use client";

import Link from "next/link";

type Organization = {
	id: string;
	name: string;
	slug: string | null;
};

type OrganizationSelectorModalProps = {
	organizations: Organization[];
	onSelect: (orgId: string) => void;
};

export function OrganizationSelectorModal({
	organizations,
	onSelect,
}: OrganizationSelectorModalProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
			<div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
				<h2 className="mb-2 text-xl font-bold text-white">
					Select Organization
				</h2>
				<p className="mb-6 text-sm text-slate-400">
					Choose an organization to continue
				</p>

				<div className="space-y-2">
					{organizations.map((org) => (
						<button
							key={org.id}
							onClick={() => onSelect(org.id)}
							className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-left transition-colors hover:border-blue-500 hover:bg-slate-700"
						>
							<div className="font-medium text-white">{org.name}</div>
							{org.slug && (
								<div className="text-sm text-slate-400">{org.slug}</div>
							)}
						</button>
					))}
				</div>

				<div className="mt-6 border-t border-slate-800 pt-4">
					<Link
						href="/onboarding/create-organization"
						className="block w-full rounded-lg border border-dashed border-slate-700 px-4 py-3 text-center text-sm text-slate-400 transition-colors hover:border-slate-500 hover:text-white"
					>
						+ Create new organization
					</Link>
				</div>
			</div>
		</div>
	);
}
