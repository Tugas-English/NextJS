import { getModules } from "@/lib/actions/modules";
import { getActivities, getStudents } from "@/lib/actions/assignments";
import CreateCourseForm from "../_components/course-create-form";

export default async function CreateCoursePage() {
    const promises = Promise.all([
        getModules({
            perPage: 100,
        }),
        getActivities(),
        getStudents(),
    ]);

    return <CreateCourseForm promises={promises} />;
}
