"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OrganizationSelectorModal } from "./OrganizationSelectorModal";

type Organization = {
	id: string;
	name: string;
	slug: string | null;
};

type OrganizationCheckerProps = {
	children: React.ReactNode;
};

export function OrganizationChecker({ children }: OrganizationCheckerProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [showSelector, setShowSelector] = useState(false);
	const [organizations, setOrganizations] = useState<Organization[]>([]);

	useEffect(() => {
		checkOrganization();
	}, []);

	async function checkOrganization() {
		try {
			const res = await fetch("/api/trpc/organization.listUserOrganizations", {
				credentials: "include",
			});

			// Handle unauthorized - redirect to login
			if (res.status === 401) {
				const callbackUrl = encodeURIComponent(window.location.pathname);
				router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`);
				return;
			}

			const data = await res.json();

			// Handle error response
			if (data.error) {
				console.error("API error:", data.error);
				// Check if it's an auth error
				if (data.error.message === "UNAUTHORIZED" || data.error.code === "UNAUTHORIZED") {
					const callbackUrl = encodeURIComponent(window.location.pathname);
					router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`);
					return;
				}
				router.push("/onboarding/create-organization");
				return;
			}

			// tRPC with superjson wraps data in result.data.json
			const result = data.result?.data?.json ?? data.result?.data;

			if (!result) {
				console.log("No result in response, redirecting to create org");
				router.push("/onboarding/create-organization");
				return;
			}

			const { orgsList, activeOrg } = result;
			console.log("Orgs list:", orgsList, "Active org:", activeOrg);

			if (!orgsList || orgsList.length === 0) {
				console.log("No organizations found, redirecting to create org");
				router.push("/onboarding/create-organization");
				return;
			}

			if (activeOrg) {
				console.log("Has active org, showing content");
				setLoading(false);
				return;
			}

			if (orgsList.length === 1) {
				console.log("Single org without active, auto-selecting:", orgsList[0].id);
				await setActiveOrg(orgsList[0].id);
				window.location.reload();
				return;
			}

			// Multiple orgs, no active - show selector
			console.log("Multiple orgs, showing selector");
			setOrganizations(orgsList);
			setShowSelector(true);
			setLoading(false);
		} catch (error) {
			console.error("Failed to check organization:", error);
			router.push("/onboarding/create-organization");
		}
	}

	async function setActiveOrg(orgId: string) {
		await fetch("/api/trpc/organization.setCurrentOrganization", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ json: { organizationId: orgId } }),
			credentials: "include",
		});
	}

	async function handleSelectOrg(orgId: string) {
		await setActiveOrg(orgId);
		setShowSelector(false);
		window.location.reload();
	}

	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center bg-slate-950">
				<div className="text-center">
					<div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-blue-500 mx-auto" />
					<p className="text-slate-400">Loading...</p>
				</div>
			</div>
		);
	}

	if (showSelector) {
		return (
			<OrganizationSelectorModal
				organizations={organizations}
				onSelect={handleSelectOrg}
			/>
		);
	}

	return <>{children}</>;
}
