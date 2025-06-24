import { Suspense } from "react"
import { SignUpForm } from "@/components/sign-up-form"
import { Loader2 } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-600">
            Join us today and get started
          </p>
        </div>
        
        <Suspense 
          fallback={
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          }
        >
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  )
}