// import { getStudentAssignments } from '@/lib/actions/student-assignments';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Pagination } from '@/components/ui/pagination';
// import Link from 'next/link';
// import { formatDistanceToNow, isPast, format } from 'date-fns';
// import { id } from 'date-fns/locale';
// import {
//   Brain,
//   BarChart3,
//   Clock,
//   FileText,
//   AlertTriangle,
//   CheckCircle,
//   Calendar,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';

// interface AssignmentsListProps {
//   page: number;
//   perPage: number;
//   search?: string;
//   skill?: string | string[];
//   hotsType?: string | string[];
//   difficulty?: number[];
//   status: string;
// }

// export default async function AssignmentsList({
//   page,
//   perPage,
//   search,
//   skill,
//   hotsType,
//   difficulty,
//   status,
// }: AssignmentsListProps) {
//   const {
//     data: assignments,
//     pageCount,
//     totalCount,
//     error,
//   } = await getStudentAssignments({
//     page,
//     perPage,
//     search,
//     skill,
//     hotsType,
//     difficulty,
//     status,
//   });

//   if (error) {
//     return <div className="p-4 text-center text-red-500">{error}</div>;
//   }

//   if (assignments.length === 0) {
//     return (
//       <div className="rounded-lg border p-8 text-center">
//         <FileText className="text-muted-foreground mx-auto h-12 w-12" />
//         <h3 className="mt-4 text-lg font-medium">
//           {status === 'active' && 'Tidak ada tugas aktif'}
//           {status === 'completed' && 'Tidak ada tugas selesai'}
//           {status === 'revision' && 'Tidak ada tugas yang perlu direvisi'}
//         </h3>
//         <p className="text-muted-foreground mt-2 text-sm">
//           {status === 'active' && 'Anda tidak memiliki tugas aktif saat ini.'}
//           {status === 'completed' && 'Anda belum menyelesaikan tugas apapun.'}
//           {status === 'revision' &&
//             'Anda tidak memiliki tugas yang perlu direvisi.'}
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <p className="text-muted-foreground text-sm">
//           Menampilkan <strong>{assignments.length}</strong> dari{' '}
//           <strong>{totalCount}</strong> tugas
//         </p>
//       </div>

//       <div className="space-y-4">
//         {assignments.map((item) => {
//           const dueDate = item.assignment.dueDate
//             ? new Date(item.assignment.dueDate)
//             : null;
//           const isOverdue = dueDate && isPast(dueDate);
//           const hasSubmission = !!item.submission?.id;
//           const isDraft = item.submission?.isDraft;
//           const hasEvaluation = !!item.evaluation?.id;

//           let statusBadge;
//           if (status === 'active') {
//             if (hasEvaluation) {
//               let score = 0;

//               try {
//                 if (
//                   typeof item.evaluation.scores === 'object' &&
//                   item.evaluation.scores !== null
//                 ) {
//                   score = item.evaluation.scores.total || 0;
//                 } else if (typeof item.evaluation.scores === 'string') {
//                   const parsedScores = JSON.parse(item.evaluation.scores);
//                   score = parsedScores?.total || 0;
//                 }
//               } catch (error) {
//                 console.error('Error parsing evaluation scores:', error);
//                 score = 0;
//               }

//               statusBadge = (
//                 <Badge
//                   variant="outline"
//                   className="border-green-200 bg-green-50 text-green-700"
//                 >
//                   <CheckCircle className="mr-1 h-3 w-3" />
//                   Nilai: {score}
//                 </Badge>
//               );
//             } else if (hasSubmission && !isDraft) {
//               statusBadge = (
//                 <Badge
//                   variant="outline"
//                   className="border-blue-200 bg-blue-50 text-blue-700"
//                 >
//                   <Clock className="mr-1 h-3 w-3" />
//                   Menunggu Penilaian
//                 </Badge>
//               );
//             } else if (hasSubmission && isDraft) {
//               statusBadge = (
//                 <Badge
//                   variant="outline"
//                   className="border-yellow-200 bg-yellow-50 text-yellow-700"
//                 >
//                   <FileText className="mr-1 h-3 w-3" />
//                   Draft Tersimpan
//                 </Badge>
//               );
//             } else if (isOverdue) {
//               statusBadge = (
//                 <Badge variant="destructive">
//                   <AlertTriangle className="mr-1 h-3 w-3" />
//                   Terlambat
//                 </Badge>
//               );
//             } else {
//               statusBadge = (
//                 <Badge
//                   variant="outline"
//                   className="border-green-200 bg-green-50 text-green-700"
//                 >
//                   <Clock className="mr-1 h-3 w-3" />
//                   Belum Dikerjakan
//                 </Badge>
//               );
//             }
//           } else if (status === 'completed') {
//             let score = 0;

//             try {
//               // Cek apakah scores sudah berupa objek
//               if (
//                 typeof item.evaluation?.scores === 'object' &&
//                 item.evaluation.scores !== null
//               ) {
//                 score = item.evaluation.scores.total || 0;
//               }
//               // Jika masih berupa string, parse dengan aman
//               else if (typeof item.evaluation?.scores === 'string') {
//                 const parsedScores = JSON.parse(item.evaluation.scores);
//                 score = parsedScores?.total || 0;
//               }
//             } catch (error) {
//               console.error('Error parsing evaluation scores:', error);
//               score = 0;
//             }

//             statusBadge = (
//               <Badge
//                 variant="outline"
//                 className="border-green-200 bg-green-50 text-green-700"
//               >
//                 <CheckCircle className="mr-1 h-3 w-3" />
//                 Nilai: {score}
//               </Badge>
//             );
//           } else if (status === 'revision') {
//             statusBadge = (
//               <Badge
//                 variant="outline"
//                 className="border-orange-200 bg-orange-50 text-orange-700"
//               >
//                 <AlertTriangle className="mr-1 h-3 w-3" />
//                 Perlu Revisi
//               </Badge>
//             );
//           }

//           return (
//             <Card key={item.assignment.id} className="overflow-hidden">
//               <CardContent className="p-0">
//                 <div className="p-6">
//                   <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//                     <h3 className="text-lg font-semibold">
//                       {item.assignment.title}
//                     </h3>
//                     {statusBadge}
//                   </div>

//                   {item.activity && (
//                     <div className="mb-4 flex flex-wrap gap-2">
//                       {item.activity.skill && (
//                         <Badge variant="outline" className="capitalize">
//                           {item.activity.skill}
//                         </Badge>
//                       )}
//                       {item.activity.hotsType && (
//                         <Badge variant="secondary" className="capitalize">
//                           <Brain className="mr-1 h-3 w-3" />
//                           {item.activity.hotsType}
//                         </Badge>
//                       )}
//                       {item.activity.difficulty && (
//                         <Badge
//                           className={cn(
//                             'capitalize',
//                             item.activity.difficulty <= 2
//                               ? 'bg-green-500'
//                               : item.activity.difficulty <= 4
//                                 ? 'bg-yellow-500'
//                                 : 'bg-red-500',
//                             'text-white',
//                           )}
//                         >
//                           <BarChart3 className="mr-1 h-3 w-3" />
//                           Level {item.activity.difficulty}
//                         </Badge>
//                       )}
//                     </div>
//                   )}

//                   <div className="text-muted-foreground mb-4 flex flex-col gap-4 text-sm md:flex-row">
//                     {dueDate && (
//                       <div className="flex items-center gap-1">
//                         <Calendar className="h-4 w-4" />
//                         <span>
//                           {isOverdue ? 'Tenggat: ' : 'Tenggat: '}
//                           <span
//                             className={
//                               isOverdue ? 'text-destructive font-medium' : ''
//                             }
//                           >
//                             {format(dueDate, 'd MMMM yyyy', { locale: id })}
//                           </span>{' '}
//                           (
//                           {formatDistanceToNow(dueDate, {
//                             addSuffix: true,
//                             locale: id,
//                           })}
//                           )
//                         </span>
//                       </div>
//                     )}

//                     {item.teacher && (
//                       <div className="flex items-center gap-1">
//                         <span>Diberikan oleh: {item.teacher.name}</span>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex flex-wrap gap-2">
//                     <Button asChild>
//                       <Link href={`/student/assignments/${item.assignment.id}`}>
//                         {status === 'active' &&
//                           !hasSubmission &&
//                           'Kerjakan Tugas'}
//                         {status === 'active' &&
//                           hasSubmission &&
//                           isDraft &&
//                           'Lanjutkan Tugas'}
//                         {status === 'active' &&
//                           hasSubmission &&
//                           !isDraft &&
//                           'Lihat Tugas'}
//                         {status === 'completed' && 'Lihat Hasil'}
//                         {status === 'revision' && 'Revisi Tugas'}
//                       </Link>
//                     </Button>

//                     {item.activity && (
//                       <Button variant="outline" asChild>
//                         <Link href={`/student/activities/${item.activity.id}`}>
//                           Lihat Aktivitas
//                         </Link>
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {pageCount > 1 && (
//         <div className="mt-8 flex justify-center">
//           <Pagination
//             currentPage={page}
//             totalPages={pageCount}
//             baseUrl="/student/assignments"
//             searchParams={{
//               search,
//               skill,
//               hotsType,
//               difficulty: difficulty
//                 ? `${difficulty[0]}-${difficulty[1]}`
//                 : undefined,
//               status,
//               tab: status,
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
