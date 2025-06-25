"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Newspaper, Users, BarChart3, Plus, Settings, Shield, UserCheck } from "lucide-react"
import Link from "next/link"

interface AdminStats {
  users: {
    total: number
    admins: number
    regular: number
    members: number
  }
  events: {
    upcoming: number
    archived: number
    total: number
  }
  news: {
    published: number
    drafts: number
    total: number
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Chargement du dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Admin</h1>
              <p className="text-muted-foreground">Gérez les événements, actualités et utilisateurs</p>
            </div>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/admin/events/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvel Événement
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/news/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Actualité
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Événements à venir</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.events.upcoming || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.events.total ? `${stats.events.total} événements au total` : 'Aucun événement'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Événements archivés</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.events.archived || 0}</div>
                <p className="text-xs text-muted-foreground">Événements passés</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Actualités publiées</CardTitle>
                <Newspaper className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.news.published || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.news.drafts ? `${stats.news.drafts} brouillons` : 'Aucun brouillon'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.users.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.users.admins || 0} admin{(stats?.users.admins || 0) > 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Membres Alumni</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.users.members || 0}</div>
                <p className="text-xs text-muted-foreground">Profils complétés</p>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="events">Gestion des Événements</TabsTrigger>
              <TabsTrigger value="news">Gestion des Actualités</TabsTrigger>
              <TabsTrigger value="users">Gestion des Utilisateurs</TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle>Événements récents</CardTitle>
                  <CardDescription>Gérez vos événements à venir et archivés</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">À venir</p>
                            <p className="text-2xl font-bold">{stats?.events.upcoming || 0}</p>
                          </div>
                          <Calendar className="h-8 w-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-gray-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Archivés</p>
                            <p className="text-2xl font-bold">{stats?.events.archived || 0}</p>
                          </div>
                          <BarChart3 className="h-8 w-8 text-gray-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Actions rapides</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" asChild>
                        <Link href="/admin/events">
                          <Calendar className="mr-2 h-4 w-4" />
                          Voir tous les événements
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link href="/admin/events/create">
                          <Plus className="mr-2 h-4 w-4" />
                          Créer un événement
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="news">
              <Card>
                <CardHeader>
                  <CardTitle>Actualités récentes</CardTitle>
                  <CardDescription>Gérez vos actualités et publications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Publiées</p>
                            <p className="text-2xl font-bold">{stats?.news.published || 0}</p>
                          </div>
                          <Newspaper className="h-8 w-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-orange-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Brouillons</p>
                            <p className="text-2xl font-bold">{stats?.news.drafts || 0}</p>
                          </div>
                          <Settings className="h-8 w-8 text-orange-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Actions rapides</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" asChild>
                        <Link href="/admin/news">
                          <Newspaper className="mr-2 h-4 w-4" />
                          Voir toutes les actualités
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link href="/admin/news/create">
                          <Plus className="mr-2 h-4 w-4" />
                          Créer une actualité
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des utilisateurs</CardTitle>
                  <CardDescription>Gérez les rôles et permissions des utilisateurs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <Card className="border-l-4 border-l-purple-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Administrateurs</p>
                            <p className="text-2xl font-bold">{stats?.users.admins || 0}</p>
                          </div>
                          <Shield className="h-8 w-8 text-purple-500" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Utilisateurs</p>
                            <p className="text-2xl font-bold">{stats?.users.regular || 0}</p>
                          </div>
                          <Users className="h-8 w-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Membres Alumni</p>
                            <p className="text-2xl font-bold">{stats?.users.members || 0}</p>
                          </div>
                          <UserCheck className="h-8 w-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Actions rapides</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" asChild>
                        <Link href="/admin/users">
                          <Users className="mr-2 h-4 w-4" />
                          Gérer les utilisateurs
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/members">
                          <UserCheck className="mr-2 h-4 w-4" />
                          Voir les membres
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
} 