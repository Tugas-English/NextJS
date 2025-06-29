import { getActivities } from "@/lib/actions/modules";
import CreateModuleForm from "../_components/modules-create-form";

export default async function CreateModulePage() {
    const activitiesPromise = getActivities();

    return <CreateModuleForm activitiesPromise={activitiesPromise} />;
}
