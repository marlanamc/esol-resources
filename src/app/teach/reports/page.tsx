import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { isAdmin, canUseTeacherTools } from "@/lib/auth/roles";
import TeacherReportCard from "@/components/dashboard/TeacherReportCard";
import { ParticipationList } from "@/components/workspace/ParticipationList";
import { resolveTeachClassId } from "@/lib/teach/active-class";
import { getClassParticipation } from "@/lib/teach/participation";
export const metadata = { title: "Participation | My ESOL Class" };
export default async function TeachReportsPage({
    searchParams,
}: {
    searchParams: Promise<{ classId?: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    if (!canUseTeacherTools(session.user)) redirect("/dashboard");
    const params = await searchParams;
    const { classId, classes } = await resolveTeachClassId(
        session.user.id,
        isAdmin(session.user),
        params.classId,
    );
    const students = classId ? await getClassParticipation(classId) : [];
    return (
        <div className="space-y-6">
            <div>
                <p className="workspace-eyebrow mb-2">Student progress</p>
                <h1 className="font-display text-3xl font-bold">
                    Participation
                </h1>
                <p className="text-sm text-text-muted mt-2">
                    See who is practicing, what they worked on, and who may need
                    a check-in.
                </p>
            </div>
            <ParticipationList
                students={students}
                classId={classId}
                now={new Date().getTime()}
            />
            <p className="text-xs text-text-muted">
                Active enrollment only. System accounts and students excluded
                from reporting are omitted, so this count may differ from your
                class roster. Activity reflects app use, not mastery.
            </p>
            {classId && (
                <TeacherReportCard
                    key={classId}
                    classes={classes.map((c) => ({
                        id: c.id,
                        name: c.name,
                        studentCount: students.length,
                    }))}
                    activeClassId={classId}
                    showClassFilter={false}
                    compact
                />
            )}
        </div>
    );
}
