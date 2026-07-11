import { auth, currentUser } from '@clerk/nextjs/server';
import { db, initializeDatabase } from '@/lib/db';
import { user } from '@/lib/db/schema';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}

/** Clerk is the source of identity; this keeps the app's existing user row in sync. */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.primaryEmailAddress?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) throw new Error('A verified email address is required to use this application.');

  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || clerkUser.username || 'Citizen';

  try {
    await initializeDatabase();
    await db
      .insert(user)
      .values({
        id: userId,
        name,
        email,
        emailVerified: clerkUser.emailAddresses.some((address) => address.verification?.status === 'verified'),
      })
      .onConflictDoUpdate({
        target: user.id,
        set: { name, email, updatedAt: new Date() },
      });
  } catch (error) {
    console.error('[auth] failed to sync clerk user to database', error);
  }

  return { id: userId, name, email };
}

export async function requireAuthenticatedUser(): Promise<AuthenticatedUser> {
  const authenticatedUser = await getAuthenticatedUser();
  if (!authenticatedUser) throw new Error('Unauthorized');
  return authenticatedUser;
}
