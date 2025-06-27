"use server";
import { CreateActivityForm } from "@/components/teacher/form/create-activity";
import { getServerSession } from "@/lib/session";

export default async function CreateActivityPage() {
    const session = await getServerSession();
    return (
        <div className=''>
            <CreateActivityForm user={session?.user} />
        </div>
    );
}
