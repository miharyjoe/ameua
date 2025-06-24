import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, Shield, Bell, Palette, ArrowLeft, Key, Mail } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Paramètres - AMEUA",
  description: "Gérez vos préférences et paramètres de compte",
}

export default async function SettingsPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/account/settings")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/account">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos préférences et paramètres de compte
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Sécurité du compte
            </CardTitle>
            <CardDescription>
              Gérez vos paramètres de sécurité et de connexion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Mot de passe</h4>
                <p className="text-sm text-muted-foreground">
                  Dernière modification: Il y a quelques jours
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/forgot-password">
                    <Key className="h-4 w-4 mr-2" />
                    Changer le mot de passe
                  </Link>
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Email de connexion</h4>
                <p className="text-sm text-muted-foreground">
                  {session.user?.email}
                </p>
                <Badge variant="secondary" className="text-xs">
                  Vérifié
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choisissez comment et quand vous souhaitez être notifié
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications par email</h4>
                  <p className="text-sm text-muted-foreground">
                    Recevez des mises à jour sur les événements et actualités
                  </p>
                </div>
                <Badge variant="secondary">Activé</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Nouvelles et actualités</h4>
                  <p className="text-sm text-muted-foreground">
                    Notifications sur les nouvelles publications
                  </p>
                </div>
                <Badge variant="secondary">Activé</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Événements et projets</h4>
                  <p className="text-sm text-muted-foreground">
                    Alertes sur les nouveaux événements et projets
                  </p>
                </div>
                <Badge variant="secondary">Activé</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Préférences d'affichage
            </CardTitle>
            <CardDescription>
              Personnalisez l'apparence de l'interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Thème</h4>
                  <p className="text-sm text-muted-foreground">
                    Choisissez entre le mode clair et sombre
                  </p>
                </div>
                <Badge variant="outline">Système</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Langue</h4>
                  <p className="text-sm text-muted-foreground">
                    Langue d'affichage de l'interface
                  </p>
                </div>
                <Badge variant="outline">Français</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Actions du compte
            </CardTitle>
            <CardDescription>
              Gérez les paramètres avancés de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Button variant="outline" className="justify-start" disabled>
                <Mail className="h-4 w-4 mr-2" />
                Exporter mes données
                <Badge variant="secondary" className="ml-auto text-xs">
                  Bientôt
                </Badge>
              </Button>
              <Button variant="outline" className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50" disabled>
                <Settings className="h-4 w-4 mr-2" />
                Supprimer le compte
                <Badge variant="secondary" className="ml-auto text-xs">
                  Contactez-nous
                </Badge>
              </Button>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Besoin d'aide ?</strong> Contactez notre équipe support pour toute question 
                concernant votre compte ou vos paramètres.
              </p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <Link href="/contact">
                  Contacter le support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 