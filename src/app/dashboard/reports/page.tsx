import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isTeacherAdmin } from "@/lib/roles";
import { buildIndependentLearnerWhere } from "@/lib/learner-mode";
import TeacherReportCard from "@/components/dashboard/TeacherReportCard";

export const metadata = {
  title: "Activity Reports | Class Companion",
  description: "View daily and weekly activity reports for your classes",
};

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const userRole = session.user.role;
  const userId = session.user.id;
  const admin = isTeacherAdmin(session.user);

  if (userRole !== "teacher") {
    redirect("/dashboard");
  }

  // Fetch teacher's classes
  const classes = admin
    ? await prisma.class.findMany({
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              enrollments: {
                where: {
                  student: {
                    isSystemAccount: false,
                  },
                },
              },
            },
          },
        },
        orderBy: { name: "asc" },
      })
    : await prisma.class.findMany({
        where: { teacherId: userId },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              enrollments: {
                where: {
                  student: {
                    isSystemAccount: false,
                  },
                },
              },
            },
          },
        },
        orderBy: { name: "asc" },
      });

  // Format classes for dropdown
  const formattedClasses = classes.map((cls) => ({
    id: cls.id,
    name: cls.name,
    studentCount: cls._count.enrollments,
  }));

  // Get counts for learner type filter (admin only)
  const classroomCount = formattedClasses.reduce((sum, c) => sum + c.studentCount, 0);
  const independentCount = admin
    ? await prisma.user.count({
        where: {
          role: "student",
          isSystemAccount: false,
          ...buildIndependentLearnerWhere(),
        },
      })
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-text mb-2">
            Activity Reports
          </h1>
          <p className="text-text-muted">
            Track student engagement and popular activities across your classes
          </p>
        </div>

        {/* Report Card */}
        <TeacherReportCard
          classes={formattedClasses}
          showLearnerTypeFilter={admin}
          classroomCount={classroomCount}
          independentCount={independentCount}
        />
      </div>
    </div>
  );
}
