import CreateAssignmentForm from "../_components/assignments-create-form";
import {
    getActivities,
    getCourses,
    getModules,
    getRubrics,
} from "@/lib/actions/assignments";

export default async function CreateAssignmentPage() {
    const promises = Promise.all([
        getActivities(),
        getModules(),
        getRubrics(),
        getCourses(),
    ]);

    return <CreateAssignmentForm promises={promises} />;
}
