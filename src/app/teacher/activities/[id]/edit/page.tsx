import { notFound } from "next/navigation";
import { getActivityById } from "@/lib/actions/activities";
import { ActivityEditForm } from "../../_components/acitivity-edit-form";
import { getServerSession } from "@/lib/session";

type ActivityEditProps = {
    params: { id: string };
};

export default async function ActivityEditPage({ params }: ActivityEditProps) {
    const session = await getServerSession();
    const activity = await getActivityById(params.id);

    if (!activity) {
        notFound();
    }

    return <ActivityEditForm activity={activity} userId={session?.user.id} />;
}
