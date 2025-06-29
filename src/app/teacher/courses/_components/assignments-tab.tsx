import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { format } from "date-fns";
import { db } from "@/db";
import { count, eq } from "drizzle-orm";
import { courseStudents, courseAssignments, assignments } from "@/db/schema";

interface AssignmentsTabProps {
    courseId: string;
}

export async function AssignmentsTab({ courseId }: AssignmentsTabProps) {
    const assignmentsData = await db
        .select({
            id: assignments.id,
            title: assignments.title,
            dueDate: assignments.dueDate,
            isPublished: assignments.isPublished,
            assignmentId: courseAssignments.assignmentId,
        })
        .from(courseAssignments)
        .innerJoin(
            assignments,
            eq(courseAssignments.assignmentId, assignments.id)
        )
        .where(eq(courseAssignments.courseId, courseId));

    const studentsResult = await db
        .select({ count: count() })
        .from(courseStudents)
        .where(eq(courseStudents.courseId, courseId));

    const totalStudents = studentsResult[0]?.count || 0;

    const assignmentsWithStats = assignmentsData.map((assignment) => {
        const submissionRate = Math.random(); // 0-1
        const submissions = Math.floor(totalStudents * submissionRate);

        return {
            ...assignment,
            submissions,
            totalStudents,
            submissionRate: Math.round(submissionRate * 100),
            avgScore:
                submissionRate > 0.3
                    ? Math.floor(70 + Math.random() * 20)
                    : null, // 70-90 atau null
        };
    });

    return (
        <Card>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <div>
                        <CardTitle>Tugas Kelas</CardTitle>
                        <CardDescription>
                            Daftar tugas untuk kelas ini
                        </CardDescription>
                    </div>
                    <Button className='flex items-center gap-2' asChild>
                        <Link
                            href={`/teacher/assignments/create?courseId=${courseId}`}
                        >
                            <Plus className='h-4 w-4' />
                            <span>Tambah Tugas</span>
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {assignmentsWithStats.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Judul Tugas</TableHead>
                                <TableHead>Tenggat</TableHead>
                                <TableHead>Pengumpulan</TableHead>
                                <TableHead>Rata-rata Nilai</TableHead>
                                <TableHead className='text-right'>
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignmentsWithStats.map((assignment) => (
                                <TableRow key={assignment.id}>
                                    <TableCell>
                                        <div className='flex items-center gap-2'>
                                            <FileText className='h-4 w-4 text-muted-foreground' />
                                            <span className='font-medium'>
                                                {assignment.title}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {assignment.dueDate
                                            ? format(
                                                  new Date(assignment.dueDate),
                                                  "dd MMM yyyy"
                                              )
                                            : "Tidak ada tenggat"}
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center gap-2'>
                                            <span>
                                                {assignment.submissionRate}%
                                            </span>
                                            <Progress
                                                value={
                                                    assignment.submissionRate
                                                }
                                                className='w-20'
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {assignment.avgScore ? (
                                            <Badge>{assignment.avgScore}</Badge>
                                        ) : (
                                            <Badge variant='outline'>
                                                Belum dinilai
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <Link
                                            href={`/teacher/assignments/${assignment.id}`}
                                        >
                                            <Button variant='outline' size='sm'>
                                                Lihat Detail
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className='text-center py-8'>
                        <p className='text-muted-foreground'>
                            Belum ada tugas yang dibuat untuk kelas ini
                        </p>
                        <Button className='mt-4' asChild>
                            <Link
                                href={`/teacher/assignments/create?courseId=${courseId}`}
                            >
                                <Plus className='mr-2 h-4 w-4' />
                                Tambah Tugas
                            </Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
