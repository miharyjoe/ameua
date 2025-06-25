"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface AdminProtectionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AdminProtection({ children, fallback }: AdminProtectionProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in?callbackUrl=' + encodeURIComponent(window.location.pathname))
    }
  }, [status, router])

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentification requise</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Vous devez être connecté pour accéder à cette page.
            </p>
            <Button asChild>
              <Link href="/auth/sign-in">Se connecter</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Not admin
  if (session?.user?.role !== 'admin') {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Accès refusé
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Vous n'avez pas les permissions nécessaires pour accéder à cette page. 
                Seuls les administrateurs peuvent voir ce contenu.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Accueil
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/account">Mon compte</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin user - render children
  return <>{children}</>
} 