import { getServerSession } from '@/lib/session';
import CreateRubricsForm from '../_components/rubrics-create-form';

export default async function CreateRubricsPage() {
  const session = await getServerSession();
  return <CreateRubricsForm user={session?.user} />;
}
