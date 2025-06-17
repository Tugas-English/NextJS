import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Activity, BookMarked, Users, FileText, LineChart } from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
    const stats = [
        {
            title: "My Progress",
            value: "14%",
            icon: <LineChart className='h-6 w-6' />,
            link: "/student/activities",
        },
        {
            title: "Assignments",
            value: "5",
            icon: <FileText className='h-6 w-6' />,
            link: "/student/assignments",
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
            <h1 className='text-3xl font-bold'>Student Dashboard</h1>

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
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 dark:from-blue-950/50 dark:to-indigo-950/50 dark:border-blue-800">
                    <CardHeader>
                        <CardTitle className="text-2xl text-blue-800 dark:text-blue-300">🏆 Weekly HOTS Challenge</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3>Write an opinion letter about the future of AI in education.</h3>
                        <p className="text-sm text-muted-foreground mt-2">Collect before June 23, 2025 to get <strong>300 XP</strong> and exclusive <strong>badges</strong>!</p>
                    </CardContent>
                    <CardFooter>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Start Challenge</Button>
                    </CardFooter>
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
