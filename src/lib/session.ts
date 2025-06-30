'use server';
import { headers } from 'next/headers';
import { auth } from './auth';
import { redirect } from 'next/navigation';

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    redirect('/auth/signin');
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== 'admin') {
    redirect('/unauthorized');
  }
  return session;
}
