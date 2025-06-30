import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, MoreHorizontal, UserPlus, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { db } from '@/db';
import { count, eq } from 'drizzle-orm';
import { courseStudents, courseAssignments, user } from '@/db/schema';

interface StudentsTabProps {
  courseId: string;
}

export async function StudentsTab({ courseId }: StudentsTabProps) {
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

  const assignmentsResult = await db
    .select({ count: count() })
    .from(courseAssignments)
    .where(eq(courseAssignments.courseId, courseId));

  const totalAssignments = assignmentsResult[0]?.count || 0;

  const studentsWithStats = studentsData.map((student) => ({
    ...student,
    averageScore: 70 + Math.floor(Math.random() * 25), // Nilai 70-95
    completedAssignments: Math.floor(
      totalAssignments * (0.5 + Math.random() * 0.5),
    ),
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Daftar Siswa</CardTitle>
            <CardDescription>
              {studentsData.length} siswa terdaftar dalam kelas ini
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Tambah</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {studentsWithStats.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rata-rata Nilai</TableHead>
                <TableHead>Tugas Selesai</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentsWithStats.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={student.image || undefined}
                          alt={student.name}
                        />
                        <AvatarFallback>
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.averageScore >= 80 ? 'default' : 'outline'
                      }
                    >
                      {student.averageScore}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>
                        {student.completedAssignments}/{totalAssignments}
                      </span>
                      <Progress
                        value={
                          totalAssignments > 0
                            ? (student.completedAssignments /
                                totalAssignments) *
                              100
                            : 0
                        }
                        className="w-20"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link
                            href={`/teacher/students/${student.id}`}
                            className="flex w-full items-center"
                          >
                            Lihat Profil
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>Kirim Pesan</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive flex items-center gap-2">
                          <X className="h-4 w-4" />
                          <span>Hapus dari Kelas</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              Belum ada siswa yang terdaftar di kelas ini
            </p>
            <Button className="mt-4">
              <UserPlus className="mr-2 h-4 w-4" />
              Tambahkan Siswa
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
