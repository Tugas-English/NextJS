import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ArrowLeft, FileText, Clock, Calendar, User } from "lucide-react";

// Data dummy untuk detail assignment
const assignment = {
    id: "1",
    title: "Analyzing News Articles",
    activityTitle: "Critical News Analysis",
    description:
        "Analyze the provided news article and identify bias, perspective, and rhetorical devices used by the author.",
    dueDate: "2024-07-15",
    isChallenge: false,
    rubric: {
        name: "HOTS Reading Rubric",
        maxScore: 100,
    },
    createdAt: "2024-06-20",
};

// Data dummy untuk submissions
const submissions = [
    {
        id: "1",
        studentName: "Ahmad Fauzi",
        submittedAt: "2024-07-10 14:30",
        status: "evaluated",
        score: 85,
    },
    {
        id: "2",
        studentName: "Siti Nuraini",
        submittedAt: "2024-07-12 09:15",
        status: "evaluated",
        score: 92,
    },
    {
        id: "3",
        studentName: "Budi Santoso",
        submittedAt: "2024-07-13 16:45",
        status: "pending",
        score: null,
    },
    {
        id: "4",
        studentName: "Dewi Lestari",
        submittedAt: "2024-07-14 11:20",
        status: "pending",
        score: null,
    },
    {
        id: "5",
        studentName: "Eko Prasetyo",
        submittedAt: "2024-07-14 13:05",
        status: "pending",
        score: null,
    },
];

export default function AssignmentDetailPage({
    params,
}: {
    params: { id: string };
}) {
    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-2'>
                <Button variant='ghost' size='icon' asChild>
                    <Link href='/teacher/assignments'>
                        <ArrowLeft className='h-4 w-4' />
                    </Link>
                </Button>
                <h1 className='text-3xl font-bold'>{assignment.title}</h1>
                {assignment.isChallenge && (
                    <Badge variant='secondary'>Challenge</Badge>
                )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>Assignment Details</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='flex items-center gap-2'>
                                <FileText className='h-4 w-4 text-muted-foreground' />
                                <div>
                                    <p className='text-sm text-muted-foreground'>
                                        Activity
                                    </p>
                                    <p className='font-medium'>
                                        {assignment.activityTitle}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center gap-2'>
                                <Calendar className='h-4 w-4 text-muted-foreground' />
                                <div>
                                    <p className='text-sm text-muted-foreground'>
                                        Due Date
                                    </p>
                                    <p className='font-medium'>
                                        {assignment.dueDate}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center gap-2'>
                                <Clock className='h-4 w-4 text-muted-foreground' />
                                <div>
                                    <p className='text-sm text-muted-foreground'>
                                        Created At
                                    </p>
                                    <p className='font-medium'>
                                        {assignment.createdAt}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center gap-2'>
                                <User className='h-4 w-4 text-muted-foreground' />
                                <div>
                                    <p className='text-sm text-muted-foreground'>
                                        Rubric
                                    </p>
                                    <p className='font-medium'>
                                        {assignment.rubric.name}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className='text-sm text-muted-foreground mb-1'>
                                Instructions
                            </p>
                            <p>{assignment.description}</p>
                        </div>

                        <div className='flex justify-end'>
                            <Button variant='outline' asChild>
                                <Link
                                    href={`/teacher/assignments/${params.id}/edit`}
                                >
                                    Edit Assignment
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Submission Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='bg-card border rounded-lg p-4'>
                                    <p className='text-sm text-muted-foreground'>
                                        Total Submissions
                                    </p>
                                    <p className='text-2xl font-bold'>
                                        {submissions.length}
                                    </p>
                                </div>

                                <div className='bg-card border rounded-lg p-4'>
                                    <p className='text-sm text-muted-foreground'>
                                        Pending Review
                                    </p>
                                    <p className='text-2xl font-bold'>
                                        {
                                            submissions.filter(
                                                (s) => s.status === "pending"
                                            ).length
                                        }
                                    </p>
                                </div>

                                <div className='bg-card border rounded-lg p-4'>
                                    <p className='text-sm text-muted-foreground'>
                                        Average Score
                                    </p>
                                    <p className='text-2xl font-bold'>
                                        {Math.round(
                                            submissions
                                                .filter(
                                                    (s) =>
                                                        s.status === "evaluated"
                                                )
                                                .reduce(
                                                    (acc, curr) =>
                                                        acc + (curr.score || 0),
                                                    0
                                                ) /
                                                submissions.filter(
                                                    (s) =>
                                                        s.status === "evaluated"
                                                ).length
                                        )}
                                    </p>
                                </div>

                                <div className='bg-card border rounded-lg p-4'>
                                    <p className='text-sm text-muted-foreground'>
                                        Highest Score
                                    </p>
                                    <p className='text-2xl font-bold'>
                                        {Math.max(
                                            ...submissions
                                                .filter(
                                                    (s) =>
                                                        s.status === "evaluated"
                                                )
                                                .map((s) => s.score || 0)
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Student Submissions</CardTitle>
                    <CardDescription>
                        Review and evaluate student work
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Submitted At</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead className='text-right'>
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.map((submission) => (
                                <TableRow key={submission.id}>
                                    <TableCell className='font-medium'>
                                        {submission.studentName}
                                    </TableCell>
                                    <TableCell>
                                        {submission.submittedAt}
                                    </TableCell>
                                    <TableCell>
                                        {submission.status === "evaluated" ? (
                                            <Badge
                                                variant='outline'
                                                className='bg-green-50 text-green-700 border-green-200'
                                            >
                                                Evaluated
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant='outline'
                                                className='bg-amber-50 text-amber-700 border-amber-200'
                                            >
                                                Pending Review
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {submission.score !== null ? (
                                            <span>
                                                {submission.score}/
                                                {assignment.rubric.maxScore}
                                            </span>
                                        ) : (
                                            <span className='text-muted-foreground'>
                                                -
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            asChild
                                        >
                                            <Link
                                                href={`/teacher/assignments/${params.id}/submissions/${submission.id}`}
                                            >
                                                {submission.status ===
                                                "evaluated"
                                                    ? "View"
                                                    : "Evaluate"}
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
