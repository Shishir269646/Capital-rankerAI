"use client";

import { useEffect } from 'react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <Container>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-24 w-24 text-red-500 mb-6" />
        <h2 className="text-4xl font-bold text-gray-800 mb-3">Something went wrong!</h2>
        <p className="text-lg text-gray-600 mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Error Details: {error.message}
        </p>
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="w-full max-w-sm"
        >
          Try again
        </Button>
      </div>
    </Container>
  )
}
