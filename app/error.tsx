'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for monitoring
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-red-600 mb-2">500</h1>
          <p className="text-2xl font-semibold text-gray-800">Something went wrong</p>
        </div>
        <p className="text-gray-600 mb-2">
          An unexpected error has occurred. Our team has been notified.
        </p>
        {error.digest && (
          <p className="text-sm text-gray-500 mb-8 font-mono break-all">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => reset()}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
