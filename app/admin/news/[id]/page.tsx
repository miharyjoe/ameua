"use client"

import { useState, useEffect, use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Edit, 
  FileText,
  Trash2,
  Eye,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  image: string | null
  category: string
  author: string
  published: boolean
  createdAt: Date
  updatedAt: Date
}

interface NewsViewProps {
  params: Promise<{ id: string }>
}

export default function NewsView({ params }: NewsViewProps) {
  const { id } = use(params)
  const router = useRouter()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    fetchArticle()
  }, [id])

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/news/${id}`)
      if (response.ok) {
        const articleData = await response.json()
        setArticle({
          ...articleData,
          createdAt: new Date(articleData.createdAt),
          updatedAt: new Date(articleData.updatedAt),
        })
      }
    } catch (error) {
      console.error("Error fetching article:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push("/admin/news")
      } else {
        alert('Erreur lors de la suppression de l\'article')
      }
    } catch (error) {
      console.error("Error deleting article:", error)
      alert('Erreur lors de la suppression de l\'article')
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleTogglePublish = async () => {
    if (!article) return
    
    setIsToggling(true)
    try {
      const formData = new FormData()
      
      // Add all current article fields
      formData.append('title', article.title)
      formData.append('excerpt', article.excerpt)
      formData.append('content', article.content)
      formData.append('category', article.category)
      formData.append('author', article.author)
      formData.append('published', (!article.published).toString()) // Toggle published status
      
      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        body: formData,
      })

      if (response.ok) {
        setArticle(prev => prev ? { ...prev, published: !prev.published } : null)
      } else {
        alert('Erreur lors de la modification du statut')
      }
    } catch (error) {
      console.error("Error updating article:", error)
      alert('Erreur lors de la modification du statut')
    } finally {
      setIsToggling(false)
      setShowPublishDialog(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Chargement de l'article...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Article non trouvé</h1>
          <p className="text-muted-foreground mb-4">L'article que vous recherchez n'existe pas.</p>
          <Button asChild>
            <Link href="/admin/news">Retour aux actualités</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/news">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour aux actualités
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={article.published ? "default" : "secondary"}>
                    {article.published ? "Publié" : "Brouillon"}
                  </Badge>
                  <Badge variant="outline">{article.category}</Badge>
                </div>
                <h1 className="text-3xl font-bold">{article.title}</h1>
                <p className="text-muted-foreground">
                  Créé le {article.createdAt.toLocaleDateString("fr-FR")} • 
                  Modifié le {article.updatedAt.toLocaleDateString("fr-FR")} • 
                  Par {article.author}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {article.published && (
                <Button variant="outline" asChild>
                  <Link href={`/news/${id}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Voir public
                  </Link>
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link href={`/admin/news/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPublishDialog(true)}
                disabled={isToggling}
              >
                <FileText className="mr-2 h-4 w-4" />
                {article.published ? "Dépublier" : "Publier"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Article Image */}
              {article.image && (
                <Card>
                  <CardContent className="p-0">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Excerpt */}
              <Card>
                <CardHeader>
                  <CardTitle>Résumé</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground">
                    {article.excerpt}
                  </p>
                </CardContent>
              </Card>

              {/* Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Contenu de l'article</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-lg max-w-none">
                    <div className="whitespace-pre-wrap">
                      {article.content}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Article Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Détails de l'article</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Date de publication</p>
                      <p className="text-sm text-muted-foreground">
                        {article.createdAt.toLocaleDateString("fr-FR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Auteur</p>
                      <p className="text-sm text-muted-foreground">{article.author}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Statut</p>
                      <p className="text-sm text-muted-foreground">
                        {article.published ? "Publié" : "Brouillon"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href={`/admin/news/${id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier l'article
                    </Link>
                  </Button>
                  
                  {article.published && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href={`/news/${id}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Voir la version publique
                      </Link>
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowPublishDialog(true)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {article.published ? "Dépublier l'article" : "Publier l'article"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Publish/Unpublish Confirmation Dialog */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {article.published ? "Dépublier l'article" : "Publier l'article"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {article.published 
                ? "Voulez-vous dépublier cet article ? Il ne sera plus visible publiquement."
                : "Voulez-vous publier cet article ? Il deviendra visible publiquement."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleTogglePublish}
              disabled={isToggling}
            >
              {isToggling 
                ? "Modification..." 
                : article.published 
                  ? "Dépublier" 
                  : "Publier"
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 