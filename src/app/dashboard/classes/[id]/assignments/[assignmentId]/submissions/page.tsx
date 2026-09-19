import { redirect } from "next/navigation";
export default async function LegacyPage({params}:{params:Promise<{id:string;assignmentId:string;}>}) {
    const {id,assignmentId} = await params;
    redirect(`/teach/classes/${encodeURIComponent(id)}/assignments/${encodeURIComponent(assignmentId)}/submissions`);
}
