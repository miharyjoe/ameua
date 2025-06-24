import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { UserCircle, Mail, Calendar, Settings } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mon Compte - AMEUA",
  description: "Gérez votre profil et vos informations personnelles",
}

export default async function AccountPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/account")
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mon Compte</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos informations personnelles et vos paramètres
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Summary Card */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={session.user?.image || undefined} alt={session.user?.name || "User"} />
                  <AvatarFallback className="bg-blue-600 text-white text-lg">
                    {session.user?.name ? getUserInitials(session.user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{session.user?.name}</h2>
                <p className="text-muted-foreground text-sm">{session.user?.email}</p>
                <Badge variant="secondary" className="mt-2">
                  Membre
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCircle className="h-5 w-5 mr-2" />
                Informations du profil
              </CardTitle>
              <CardDescription>
                Vos informations personnelles et de contact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                  <p className="mt-1">{session.user?.name || "Non renseigné"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="mt-1 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {session.user?.email}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Statut du compte</label>
                  <p className="mt-1">
                    <Badge variant="secondary">Actif</Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Membre depuis</label>
                  <p className="mt-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date().toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>
                Gérez votre compte et vos préférences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <Button variant="outline" asChild className="justify-start">
                  <Link href="/account/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres du compte
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <Link href="/members">
                    <UserCircle className="h-4 w-4 mr-2" />
                    Voir les membres
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 