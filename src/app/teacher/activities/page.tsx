import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Plus } from "lucide-react";

const activities = [
    {
        id: "1",
        title: "Analyzing News Articles",
        skill: "Reading",
        hotsType: "Analyze",
        createdAt: "2024-03-15",
    },
];

export default function ActivitiesPage() {
    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Activities</h1>
                <Link href='/teacher/activities/create'>
                    <Button>
                        <Plus className='mr-2 h-4 w-4' />
                        Create Activity
                    </Button>
                </Link>
            </div>

            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Skill</TableHead>
                            <TableHead>HOTS Type</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className='text-right'>
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activities.map((activity) => (
                            <TableRow key={activity.id}>
                                <TableCell className='font-medium'>
                                    {activity.title}
                                </TableCell>
                                <TableCell>{activity.skill}</TableCell>
                                <TableCell>{activity.hotsType}</TableCell>
                                <TableCell>{activity.createdAt}</TableCell>
                                <TableCell className='text-right space-x-2'>
                                    <Button variant='outline' size='sm' asChild>
                                        <Link
                                            href={`/teacher/activities/${activity.id}`}
                                        >
                                            Edit
                                        </Link>
                                    </Button>
                                    <Button variant='destructive' size='sm'>
                                        Delete
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
