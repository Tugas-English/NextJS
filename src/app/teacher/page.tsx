import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, BookMarked, Users, FileText } from "lucide-react";
import Link from "next/link";

export default function TeacherDashboard() {
    const stats = [
        {
            title: "Total Activities",
            value: "124",
            icon: <Activity className='h-6 w-6' />,
            link: "/teacher/activities",
        },
        {
            title: "Assignments",
            value: "24",
            icon: <FileText className='h-6 w-6' />,
            link: "/teacher/assignments",
        },
        {
            title: "Students",
            value: "85",
            icon: <Users className='h-6 w-6' />,
            link: "#",
        },
        {
            title: "Learning Modules",
            value: "12",
            icon: <BookMarked className='h-6 w-6' />,
            link: "#",
        },
    ];

    return (
        <div className='space-y-6'>
            <h1 className='text-3xl font-bold'>Teacher Dashboard</h1>

            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
                {stats.map((stat, index) => (
                    <Link key={index} href={stat.link}>
                        <Card className='hover:bg-accent transition-colors'>
                            <CardHeader className='flex flex-row items-center justify-between pb-2'>
                                <CardTitle className='text-sm font-medium'>
                                    {stat.title}
                                </CardTitle>
                                {stat.icon}
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>
                                    {stat.value}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className='grid gap-6 lg:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                    </CardHeader>
                    <CardContent></CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pending Assignments</CardTitle>
                    </CardHeader>
                    <CardContent></CardContent>
                </Card>
            </div>
        </div>
    );
}
