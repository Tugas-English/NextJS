import { CreateActivityForm } from "@/app/teacher/activities/_components/activitity-create-form";
import { getServerSession } from "@/lib/session";

export default async function CreateActivityPage() {
    const session = await getServerSession();
    return <CreateActivityForm user={session?.user} />;
}
