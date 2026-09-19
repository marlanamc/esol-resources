import { redirect } from "next/navigation";
export default async function LegacyNewClass({searchParams}:{searchParams:Promise<{sourceClassId?:string}>}) {
    const {sourceClassId} = await searchParams;
    redirect(`/teach/classes/new${sourceClassId ? `?sourceClassId=${encodeURIComponent(sourceClassId)}` : ""}`);
}
