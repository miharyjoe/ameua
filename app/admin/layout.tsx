import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  // Redirect if not authenticated
  if (!session) {
    redirect('/auth/sign-in?callbackUrl=/admin')
  }
  
  // Show access denied if not admin
  if (session.user.role !== 'admin') {
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