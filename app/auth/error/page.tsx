import { Suspense } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface AuthErrorPageProps {
  searchParams: Promise<{ error?: string; code?: string }>
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const { error, code } = await searchParams

  const getErrorMessage = (error: string | undefined, code: string | undefined) => {
    switch (error) {
      case "CredentialsSignin":
        return {
          title: "Sign In Failed",
          message: code || "Invalid credentials. Please check your email and password.",
        }
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
        return {
          title: "OAuth Error",
          message: "There was a problem with the OAuth provider. Please try again.",
        }
      case "EmailCreateAccount":
        return {
          title: "Email Error",
          message: "Could not create account with this email. Please try again.",
        }
      case "Callback":
        return {
          title: "Callback Error",
          message: "There was a problem with the authentication callback.",
        }
      case "OAuthAccountNotLinked":
        return {
          title: "Account Not Linked",
          message: "This account is not linked to your profile. Please sign in with your original method.",
        }
      case "EmailSignin":
        return {
          title: "Email Sign In Error",
          message: "Unable to sign in with email. Please try again.",
        }
      case "SessionRequired":
        return {
          title: "Session Required",
          message: "You must be signed in to access this page.",
        }
      default:
        return {
          title: "Authentication Error",
          message: "An unexpected error occurred during authentication. Please try again.",
        }
    }
  }

  const errorInfo = getErrorMessage(error, code)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-900">
              {errorInfo.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                {errorInfo.message}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/auth/sign-in">
                  Try Again
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  Go Home
                </Link>
              </Button>
            </div>

            {error && (
              <div className="text-xs text-gray-500 mt-4">
                <details>
                  <summary className="cursor-pointer hover:text-gray-700">
                    Technical Details
                  </summary>
                  <div className="mt-2 bg-gray-100 p-2 rounded text-xs">
                    <p><strong>Error:</strong> {error}</p>
                    {code && <p><strong>Code:</strong> {code}</p>}
                  </div>
                </details>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 