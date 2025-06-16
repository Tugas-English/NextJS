import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, FileText, Calendar, CheckCircle } from "lucide-react";

// Data dummy untuk assignments
const assignments = [
    {
        id: "1",
        title: "Analyzing News Articles",
        activityTitle: "Critical News Analysis",
        dueDate: "2024-07-15",
        submissions: 12,
        pending: 5,
        isChallenge: false,
    },
    {
        id: "2",
        title: "Creative Story Writing",
        activityTitle: "Story Creation with Twist",
        dueDate: "2024-07-20",
        submissions: 8,
        pending: 8,
        isChallenge: false,
    },
    {
        id: "3",
        title: "Weekly Challenge: Environmental Debate",
        activityTitle: "Environmental Issues Debate",
        dueDate: "2024-07-10",
        submissions: 15,
        pending: 2,
        isChallenge: true,
    },
    {
        id: "4",
        title: "Podcast Script Writing",
        activityTitle: "Audio Content Creation",
        dueDate: "2024-07-25",
        submissions: 0,
        pending: 0,
        isChallenge: false,
    },
];

export default function AssignmentsTeacherPage() {
    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Assignments</h1>
                <Link href='/teacher/assignments/create'>
                    <Button>
                        <Plus className='mr-2 h-4 w-4' />
                        Create Assignment
                    </Button>
                </Link>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-card border rounded-lg p-4 flex items-center gap-4'>
                    <div className='bg-primary/10 p-3 rounded-full'>
                        <FileText className='h-6 w-6 text-primary' />
                    </div>
                    <div>
                        <p className='text-sm text-muted-foreground'>
                            Total Assignments
                        </p>
                        <p className='text-2xl font-bold'>
                            {assignments.length}
                        </p>
                    </div>
                </div>

                <div className='bg-card border rounded-lg p-4 flex items-center gap-4'>
                    <div className='bg-amber-500/10 p-3 rounded-full'>
                        <Calendar className='h-6 w-6 text-amber-500' />
                    </div>
                    <div>
                        <p className='text-sm text-muted-foreground'>
                            Pending Submissions
                        </p>
                        <p className='text-2xl font-bold'>
                            {assignments.reduce(
                                (acc, curr) => acc + curr.pending,
                                0
                            )}
                        </p>
                    </div>
                </div>

                <div className='bg-card border rounded-lg p-4 flex items-center gap-4'>
                    <div className='bg-green-500/10 p-3 rounded-full'>
                        <CheckCircle className='h-6 w-6 text-green-500' />
                    </div>
                    <div>
                        <p className='text-sm text-muted-foreground'>
                            Completed Submissions
                        </p>
                        <p className='text-2xl font-bold'>
                            {assignments.reduce(
                                (acc, curr) =>
                                    acc + (curr.submissions - curr.pending),
                                0
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Assignment</TableHead>
                            <TableHead>Activity</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Submissions</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className='text-right'>
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assignments.map((assignment) => (
                            <TableRow key={assignment.id}>
                                <TableCell className='font-medium'>
                                    <div className='flex items-center'>
                                        {assignment.title}
                                        {assignment.isChallenge && (
                                            <Badge
                                                variant='secondary'
                                                className='ml-2'
                                            >
                                                Challenge
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {assignment.activityTitle}
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={`${
                                            new Date(assignment.dueDate) <
                                            new Date()
                                                ? "text-red-500"
                                                : ""
                                        }`}
                                    >
                                        {assignment.dueDate}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {assignment.submissions > 0 ? (
                                        <span>
                                            {assignment.submissions -
                                                assignment.pending}
                                            /{assignment.submissions} reviewed
                                        </span>
                                    ) : (
                                        <span className='text-muted-foreground'>
                                            No submissions
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {new Date(assignment.dueDate) <
                                    new Date() ? (
                                        <Badge variant='destructive'>
                                            Expired
                                        </Badge>
                                    ) : assignment.pending > 0 ? (
                                        <Badge
                                            variant='outline'
                                            className='bg-amber-50 text-amber-700 border-amber-200'
                                        >
                                            Pending Review
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant='outline'
                                            className='bg-green-50 text-green-700 border-green-200'
                                        >
                                            Active
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className='text-right space-x-2'>
                                    <Button variant='outline' size='sm' asChild>
                                        <Link
                                            href={`/teacher/assignments/${assignment.id}`}
                                        >
                                            View
                                        </Link>
                                    </Button>
                                    <Button variant='outline' size='sm' asChild>
                                        <Link
                                            href={`/teacher/assignments/${assignment.id}/edit`}
                                        >
                                            Edit
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
