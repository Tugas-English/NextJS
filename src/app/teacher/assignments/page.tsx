import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, FileText, Calendar, CheckCircle } from "lucide-react";
import { SearchParams } from "@/types";
import { getServerSession } from "@/lib/session";
import { getAssignments } from "@/lib/actions/assignments";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { AssignmentsTable } from "./_components/assignments-table";

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

interface AssignmentsPageProps {
    searchParams: Promise<SearchParams>;
}

export default async function AssignmentsTeacherPage(
    props: AssignmentsPageProps
) {
    const session = await getServerSession();
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const perPage = Number(searchParams.perPage) || 10;
    const search = searchParams.search?.toString();

    const assignmentsPromises = Promise.all([
        getAssignments({
            page,
            perPage,
            search,
            assignedBy: session?.user?.id,
        }),
    ]);
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
            <Suspense
                fallback={
                    <DataTableSkeleton
                        columnCount={6}
                        filterCount={3}
                        rowCount={5}
                    />
                }
            >
                <AssignmentsTable promises={assignmentsPromises} />
            </Suspense>
        </div>
    );
}
