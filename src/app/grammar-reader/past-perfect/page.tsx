// TODO: Create past-perfect.ts content file before enabling this page
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Past Perfect - Coming Soon | ESOL Teacher Resources",
    description: "Past Perfect guide coming soon.",
};

export default async function PastPerfectPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    // Redirect to dashboard until content is created
    redirect("/dashboard");
}
