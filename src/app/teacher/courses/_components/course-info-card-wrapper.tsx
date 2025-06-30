import { getCourseById } from '@/lib/actions/courses';
import { CourseInfoCard } from './course-info-card';

interface CourseInfoCardWrapperProps {
  courseId: string;
}

export async function CourseInfoCardWrapper({
  courseId,
}: CourseInfoCardWrapperProps) {
  const course = await getCourseById(courseId);

  if (!course) {
    return null;
  }

  return <CourseInfoCard course={course} />;
}
