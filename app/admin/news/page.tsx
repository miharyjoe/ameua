"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { measurePerformance, PerformanceMonitor } from "@/lib/performance"
import { 
  Newspaper, 
  Calendar, 
  User, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  ArrowLeft,
  FileText,
  RefreshCw,
  X
} from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  author: string
  published: boolean
  createdAt: Date
  updatedAt: Date
}

interface ApiError extends Error {
  status: number
}

class NewsApiClient {
  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const endTimer = measurePerformance(`API: ${options.method || 'GET'} ${url}`)
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const error = new Error(await response.text()) as ApiError
        error.status = response.status
        throw error
      }

      return response.json()
    } finally {
      endTimer()
    }
  }

  async fetchNews(): Promise<NewsArticle[]> {
    const endTimer = measurePerformance('NewsApiClient.fetchNews')
    
    try {
      const data = await this.request<any[]>('/api/news')
      return data.map((article: any) => ({
        ...article,
        createdAt: new Date(article.createdAt),
        updatedAt: new Date(article.updatedAt),
      }))
    } finally {
      endTimer()
    }
  }

  async togglePublish(articleId: string, published: boolean): Promise<void> {
    const endTimer = measurePerformance('NewsApiClient.togglePublish')
    
    try {
      await this.request(`/api/news/${articleId}/toggle-publish`, {
        method: 'PATCH',
        body: JSON.stringify({ published }),
      })
    } finally {
      endTimer()
    }
  }

  async deleteArticle(articleId: string): Promise<void> {
    const endTimer = measurePerformance('NewsApiClient.deleteArticle')
    
    try {
      await this.request(`/api/news/${articleId}`, {
        method: 'DELETE',
      })
    } finally {
      endTimer()
    }
  }
}

const newsApi = new NewsApiClient()

// Loading skeleton component
const ArticleCardSkeleton = () => (
  <Card className="shadow-lg rounded-2xl border-0 bg-white overflow-hidden">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Skeleton className="w-full h-48 lg:h-32" />
      <div className="lg:col-span-2 p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-18" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  </Card>
)

export default function NewsManagement() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("published")
  const [error, setError] = useState<string | null>(null)
  const [operationLoading, setOperationLoading] = useState<{[key: string]: boolean}>({})
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  
  const { toast, ToastContainer } = useToast()

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) setRefreshing(true)
      if (!showRefreshIndicator) setLoading(true)
      
      const articlesData = await newsApi.fetchNews()
      setArticles(articlesData)
      setError(null)
    } catch (error) {
      console.error("Error fetching news:", error)
      setError("Erreur lors du chargement des actualités")
    } finally {
      setLoading(false)
      if (showRefreshIndicator) setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchNews(true)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (articles.length === 0 || error) {
      fetchNews(true)
    }
  }

  const handleTogglePublish = async (articleId: string) => {
    const article = articles.find(a => a.id === articleId)
    if (!article) return

    const newPublishedState = !article.published
    setArticles(prev =>
      prev.map(a =>
        a.id === articleId ? { ...a, published: newPublishedState } : a
      )
    )

    setOperationLoading(prev => ({ ...prev, [`toggle-${articleId}`]: true }))

    try {
      await newsApi.togglePublish(articleId, newPublishedState)
      toast({
        variant: "success",
        title: "Succès",
        description: "Statut de publication mis à jour avec succès"
      })
    } catch (error) {
      setArticles(prev =>
        prev.map(a =>
          a.id === articleId ? { ...a, published: !newPublishedState } : a
        )
      )
      console.error("Error toggling publish status:", error)
      setError("Erreur lors de la mise à jour du statut de publication")
      toast({
        variant: "error",
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut de publication"
      })
    } finally {
      setOperationLoading(prev => ({ ...prev, [`toggle-${articleId}`]: false }))
    }
  }

  const handleDeleteArticle = async (articleId: string) => {
    setArticles(prev => prev.filter(article => article.id !== articleId))
    
    setOperationLoading(prev => ({ ...prev, [`delete-${articleId}`]: true }))

    try {
      await newsApi.deleteArticle(articleId)
      toast({
        variant: "success",
        title: "Succès",
        description: "Article supprimé avec succès"
      })
    } catch (error) {
      fetchNews()
      console.error("Error deleting article:", error)
      setError("Erreur lors de la suppression de l'article")
      toast({
        variant: "error",
        title: "Erreur",
        description: "Erreur lors de la suppression de l'article"
      })
    } finally {
      setOperationLoading(prev => ({ ...prev, [`delete-${articleId}`]: false }))
    }
  }

  const publishedArticles = articles.filter(article => article.published)
  const draftArticles = articles.filter(article => !article.published)

  const ArticleCard = ({ article, isDraft = false }: { article: NewsArticle; isDraft?: boolean }) => (
    <Card className="shadow-lg rounded-2xl border-0 bg-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="relative">
          <img
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-48 lg:h-full object-cover"
          />
          <Badge className="absolute top-4 left-4">{article.category}</Badge>
          {isDraft && (
            <Badge variant="secondary" className="absolute top-4 right-4">
              Brouillon
            </Badge>
          )}
        </div>
        
        <div className="lg:col-span-2 p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{article.title}</h3>
              <div className="space-y-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{article.createdAt.toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  <span>{article.author}</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-muted-foreground">{article.excerpt}</p>
          
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/news/${article.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Voir
              </Link>
            </Button>
            
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/news/${article.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleTogglePublish(article.id)}
              disabled={operationLoading[`toggle-${article.id}`]}
            >
              {operationLoading[`toggle-${article.id}`] ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              {article.published ? "Dépublier" : "Publier"}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  disabled={operationLoading[`delete-${article.id}`]}
                >
                  {operationLoading[`delete-${article.id}`] ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer l'article ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. L'article sera définitivement supprimé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleDeleteArticle(article.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </Card>
  )

  // Debug component for development
  const DebugPanel = () => {
    const [stats, setStats] = useState<Record<string, any>>({})
    
    useEffect(() => {
      const interval = setInterval(() => {
        setStats(PerformanceMonitor.getInstance().getStats())
      }, 1000)
      
      return () => clearInterval(interval)
    }, [])

    if (process.env.NODE_ENV !== 'development' && !showDebugPanel) return null

    return (
      <div className="fixed bottom-4 left-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-bold text-sm">Performance Stats</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowDebugPanel(false)}
            className="text-white hover:bg-gray-800"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-1 text-xs">
          {Object.entries(stats).map(([operation, stat]) => (
            <div key={operation} className="flex justify-between">
              <span className="truncate mr-2">{operation}:</span>
              <span>{stat.latest}ms (avg: {stat.avg}ms)</span>
            </div>
          ))}
          {Object.keys(stats).length === 0 && (
            <div className="text-gray-400">No metrics yet...</div>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Chargement des actualités...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <ToastContainer />
      <DebugPanel />
      
      <section className="py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour au dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Gestion des Actualités</h1>
                <p className="text-muted-foreground">Gérez vos articles publiés et brouillons</p>
              </div>
            </div>
            <div className="flex gap-2">
              {process.env.NODE_ENV === 'development' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDebugPanel(!showDebugPanel)}
                >
                  Debug
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Actualiser
              </Button>
              <Button asChild>
                <Link href="/admin/news/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvel Article
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Show error banner if there's an error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 mx-4 mt-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setError(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="published" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="published">
                Articles publiés ({publishedArticles.length})
              </TabsTrigger>
              <TabsTrigger value="drafts">
                Brouillons ({draftArticles.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="published" className="space-y-6">
              {publishedArticles.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Newspaper className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun article publié</h3>
                    <p className="text-muted-foreground mb-4">
                      Commencez par créer et publier votre premier article
                    </p>
                    <Button asChild>
                      <Link href="/admin/news/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Créer un article
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                publishedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))
              )}
            </TabsContent>

            <TabsContent value="drafts" className="space-y-6">
              {draftArticles.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun brouillon</h3>
                    <p className="text-muted-foreground">
                      Les brouillons en cours de rédaction apparaîtront ici
                    </p>
                  </CardContent>
                </Card>
              ) : (
                draftArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} isDraft />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
} 