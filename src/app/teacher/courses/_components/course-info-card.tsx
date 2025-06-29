import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { HOTSPieChart } from "./chart-components";

interface CourseInfoCardProps {
    course: any;
}

export function CourseInfoCard({ course }: CourseInfoCardProps) {
    if (!course) {
        return null;
    }

    const hotsDistribution = [
        { name: "Analyze", value: 35 },
        { name: "Evaluate", value: 25 },
        { name: "Create", value: 20 },
        { name: "Problem-solve", value: 15 },
        { name: "Infer", value: 5 },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informasi Kelas</CardTitle>
                <CardDescription>Detail dan jadwal kelas</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-4'>
                        <div>
                            <h3 className='text-sm font-medium text-muted-foreground'>
                                Periode
                            </h3>
                            <p>
                                {course.startDate
                                    ? format(
                                          new Date(course.startDate),
                                          "dd MMM yyyy"
                                      )
                                    : "-"}{" "}
                                -{" "}
                                {course.endDate
                                    ? format(
                                          new Date(course.endDate),
                                          "dd MMM yyyy"
                                      )
                                    : "-"}
                            </p>
                        </div>
                        <div>
                            <h3 className='text-sm font-medium text-muted-foreground'>
                                Skill Utama
                            </h3>
                            <p>{course.primarySkill || "Mixed"}</p>
                        </div>
                        <div>
                            <h3 className='text-sm font-medium text-muted-foreground'>
                                Maksimum Siswa
                            </h3>
                            <p>{course.maxStudents || 30}</p>
                        </div>
                        <div>
                            <h3 className='text-sm font-medium text-muted-foreground'>
                                Status
                            </h3>
                            <Badge
                                variant={
                                    course.isActive ? "default" : "outline"
                                }
                            >
                                {course.isActive ? "Aktif" : "Nonaktif"}
                            </Badge>
                        </div>
                    </div>
                    <div className='space-y-4'>
                        <div>
                            <h3 className='text-sm font-medium'>
                                Distribusi HOTS
                            </h3>
                            <div className='h-48 mt-2'>
                                <HOTSPieChart data={hotsDistribution} />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
