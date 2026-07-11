import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-teal-900 mb-2">404</h1>
          <p className="text-2xl font-semibold text-gray-800">Page not found</p>
        </div>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Don&apos;t worry, let&apos;s get you back on track.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button className="bg-teal-600 hover:bg-teal-700">
              Go Home
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              Go Back
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
