import { SignIn } from '@clerk/nextjs';
import { getAuthenticatedUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { profile } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function SignInPage() {
  const user = await getAuthenticatedUser();

  if (user) {
    const userProfile = await db.query.profile.findFirst({
      where: eq(profile.userId, user.id),
    });
    redirect(userProfile ? '/dashboard' : '/onboarding');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-teal-900 mb-2">
            Monsoon Preparedness
          </h1>
          <p className="text-gray-600">
            Be prepared. Stay safe. Act with confidence.
          </p>
        </div>
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
      </div>
    </div>
  );
}
