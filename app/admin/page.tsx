"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
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
  lastUpdated: string
}

// Skeleton component for loading states
const StatCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-[100px]" />
      <Skeleton className="h-4 w-4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-[60px] mb-2" />
      <Skeleton className="h-3 w-[120px]" />
    </CardContent>
  </Card>
)

const TabContentSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-[150px] mb-2" />
      <Skeleton className="h-4 w-[300px]" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-[80px] mb-2" />
                <Skeleton className="h-8 w-[60px]" />
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-[80px] mb-2" />
                <Skeleton className="h-8 w-[60px]" />
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-[120px]" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[150px]" />
          <Skeleton className="h-10 w-[130px]" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastFetch, setLastFetch] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
    
    // Set up periodic refresh every 5 minutes
    const interval = setInterval(() => {
      fetchStats(true) // Silent refresh
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const fetchStats = async (silent = false) => {
    if (!silent) setLoading(true)
    
    try {
      const url = lastFetch 
        ? `/api/admin/stats?lastFetch=${encodeURIComponent(lastFetch)}`
        : '/api/admin/stats'
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        
        // Only update if we got new data (not a 304 Not Modified)
        if (response.status !== 304 && data) {
          setStats(data)
          setLastFetch(data.lastUpdated)
        }
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error)
    } finally {
      if (!silent) setLoading(false)
    }
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
            {loading && !stats ? (
              // Show skeletons during initial load
              Array.from({ length: 5 }).map((_, i) => (
                <StatCardSkeleton key={i} />
              ))
            ) : (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Événements à venir</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {stats ? (
                      <>
                        <div className="text-2xl font-bold">{stats.events.upcoming}</div>
                        <p className="text-xs text-muted-foreground">
                          {stats.events.total ? `${stats.events.total} événements au total` : 'Aucun événement'}
                        </p>
                      </>
                    ) : (
                      <>
                        <Skeleton className="h-8 w-[60px] mb-2" />
                        <Skeleton className="h-3 w-[120px]" />
                      </>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Événements archivés</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {stats ? (
                      <>
                        <div className="text-2xl font-bold">{stats.events.archived}</div>
                        <p className="text-xs text-muted-foreground">Événements passés</p>
                      </>
                    ) : (
                      <>
                        <Skeleton className="h-8 w-[60px] mb-2" />
                        <Skeleton className="h-3 w-[120px]" />
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Actualités publiées</CardTitle>
                    <Newspaper className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {stats ? (
                      <>
                        <div className="text-2xl font-bold">{stats.news.published}</div>
                        <p className="text-xs text-muted-foreground">
                          {stats.news.drafts ? `${stats.news.drafts} brouillons` : 'Aucun brouillon'}
                        </p>
                      </>
                    ) : (
                      <>
                        <Skeleton className="h-8 w-[60px] mb-2" />
                        <Skeleton className="h-3 w-[120px]" />
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {stats ? (
                      <>
                        <div className="text-2xl font-bold">{stats.users.total}</div>
                        <p className="text-xs text-muted-foreground">
                          {stats.users.admins} admin{stats.users.admins > 1 ? 's' : ''}
                        </p>
                      </>
                    ) : (
                      <>
                        <Skeleton className="h-8 w-[60px] mb-2" />
                        <Skeleton className="h-3 w-[120px]" />
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Membres Alumni</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {stats ? (
                      <>
                        <div className="text-2xl font-bold">{stats.users.members}</div>
                        <p className="text-xs text-muted-foreground">Profils complétés</p>
                      </>
                    ) : (
                      <>
                        <Skeleton className="h-8 w-[60px] mb-2" />
                        <Skeleton className="h-3 w-[120px]" />
                      </>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="events">Gestion des Événements</TabsTrigger>
              <TabsTrigger value="news">Gestion des Actualités</TabsTrigger>
              <TabsTrigger value="users">Gestion des Utilisateurs</TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              {loading && !stats ? (
                <TabContentSkeleton />
              ) : (
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
                              {stats ? (
                                <p className="text-2xl font-bold">{stats.events.upcoming}</p>
                              ) : (
                                <Skeleton className="h-8 w-[60px]" />
                              )}
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
                              {stats ? (
                                <p className="text-2xl font-bold">{stats.events.archived}</p>
                              ) : (
                                <Skeleton className="h-8 w-[60px]" />
                              )}
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
              )}
            </TabsContent>

            <TabsContent value="news">
              {loading && !stats ? (
                <TabContentSkeleton />
              ) : (
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
                              {stats ? (
                                <p className="text-2xl font-bold">{stats.news.published}</p>
                              ) : (
                                <Skeleton className="h-8 w-[60px]" />
                              )}
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
                              {stats ? (
                                <p className="text-2xl font-bold">{stats.news.drafts}</p>
                              ) : (
                                <Skeleton className="h-8 w-[60px]" />
                              )}
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
              )}
            </TabsContent>

            <TabsContent value="users">
              {loading && !stats ? (
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-[150px] mb-2" />
                    <Skeleton className="h-4 w-[300px]" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="border-l-4 border-l-purple-500">
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Skeleton className="h-4 w-[80px] mb-2" />
                                <Skeleton className="h-8 w-[60px]" />
                              </div>
                              <Skeleton className="h-8 w-8 rounded" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-[120px]" />
                      <div className="flex gap-2">
                        <Skeleton className="h-10 w-[150px]" />
                        <Skeleton className="h-10 w-[130px]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
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
                              {stats ? (
                                <p className="text-2xl font-bold">{stats.users.admins}</p>
                              ) : (
                                <Skeleton className="h-8 w-[60px]" />
                              )}
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
                              {stats ? (
                                <p className="text-2xl font-bold">{stats.users.regular}</p>
                              ) : (
                                <Skeleton className="h-8 w-[60px]" />
                              )}
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
                              {stats ? (
                                <p className="text-2xl font-bold">{stats.users.members}</p>
                              ) : (
                                <Skeleton className="h-8 w-[60px]" />
                              )}
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
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
} 