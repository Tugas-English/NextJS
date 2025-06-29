import { db } from "@/db";
import { eq } from "drizzle-orm";
import { courseStudents, user } from "@/db/schema";
import { AnalyticsTab } from "./analytics-tab";

interface AnalyticsTabWrapperProps {
    courseId: string;
}

export async function AnalyticsTabWrapper({
    courseId,
}: AnalyticsTabWrapperProps) {
    const scoreDistribution = [
        { score: "90-100", count: 5 },
        { score: "80-89", count: 15 },
        { score: "70-79", count: 8 },
        { score: "60-69", count: 4 },
        { score: "< 60", count: 0 },
    ];

    const studentsData = await db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
        })
        .from(courseStudents)
        .innerJoin(user, eq(courseStudents.studentId, user.id))
        .where(eq(courseStudents.courseId, courseId));

    const studentsWithScores = studentsData.map((student) => ({
        ...student,
        averageScore: 70 + Math.floor(Math.random() * 25),
    }));

    return (
        <AnalyticsTab
            studentsWithScores={studentsWithScores}
            scoreDistribution={scoreDistribution}
        />
    );
}
