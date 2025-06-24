"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Newspaper, 
  Calendar, 
  User, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  ArrowLeft,
  FileText
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

export default function NewsManagement() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news')
      if (response.ok) {
        const data = await response.json()
        // Convert date strings to Date objects
        const articlesWithDates = data.map((article: any) => ({
          ...article,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt),
        }))
        setArticles(articlesWithDates)
      }
    } catch (error) {
      console.error("Error fetching news:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePublish = async (articleId: string) => {
    try {
      const article = articles.find(a => a.id === articleId)
      if (!article) return

      const formData = new FormData()
      
      // Add all current article fields
      formData.append('title', article.title)
      formData.append('excerpt', article.excerpt)
      formData.append('content', article.content)
      formData.append('category', article.category)
      formData.append('author', article.author)
      formData.append('published', (!article.published).toString()) // Toggle published status

      const response = await fetch(`/api/news/${articleId}`, {
        method: 'PUT',
        body: formData,
      })

      if (response.ok) {
        setArticles(prev =>
          prev.map(article =>
            article.id === articleId ? { ...article, published: !article.published } : article
          )
        )
      }
    } catch (error) {
      console.error("Error toggling publish status:", error)
    }
  }

  const handleDeleteArticle = async (articleId: string) => {
    try {
      const response = await fetch(`/api/news/${articleId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setArticles(prev => prev.filter(article => article.id !== articleId))
      }
    } catch (error) {
      console.error("Error deleting article:", error)
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
            >
              <FileText className="mr-2 h-4 w-4" />
              {article.published ? "Dépublier" : "Publier"}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
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
            <Button asChild>
              <Link href="/admin/news/create">
                <Plus className="mr-2 h-4 w-4" />
                Nouvel Article
              </Link>
            </Button>
          </div>
        </div>
      </section>

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