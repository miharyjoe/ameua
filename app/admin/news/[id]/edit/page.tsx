"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Newspaper, User, Image, Tag, FileText, Upload, X, Trash2 } from "lucide-react"
import Link from "next/link"

interface EditNewsProps {
  params: Promise<{ id: string }>
}

export default function EditNews({ params }: EditNewsProps) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [deleteImage, setDeleteImage] = useState(false)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    published: false,
  })

  // Resolve params on component mount
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
    }
    resolveParams()
  }, [params])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    if (resolvedParams?.id) {
      fetchNews()
    }
  }, [resolvedParams])

  const fetchNews = async () => {
    if (!resolvedParams?.id) return
    
    try {
      const response = await fetch(`/api/news/${resolvedParams.id}`)
      if (response.ok) {
        const article = await response.json()
        
        setFormData({
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          author: article.author,
          published: article.published,
        })
        
        if (article.image) {
          setFilePreview(article.image)
        }
      }
    } catch (error) {
      console.error("Error fetching news:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setDeleteImage(false) // Reset delete flag when new file is selected
      const reader = new FileReader()
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteImage = () => {
    setDeleteImage(true)
    setSelectedFile(null)
    setFilePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resolvedParams?.id) return
    
    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString())
      })

      // Add file if selected
      if (selectedFile) {
        formDataToSend.append('image', selectedFile)
      }
      
      // Add delete image flag
      if (deleteImage) {
        formDataToSend.append('deleteImage', 'true')
      }

      const response = await fetch(`/api/news/${resolvedParams.id}`, {
        method: 'PUT',
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Failed to update news')
      }

      router.push("/admin/news")
    } catch (error) {
      console.error("Error updating news:", error)
      alert('Erreur lors de la mise à jour de l\'article')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !resolvedParams) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Chargement de l'article...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <section className="py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/news">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux actualités
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Modifier l'Actualité</h1>
              <p className="text-muted-foreground">Mettez à jour votre article</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5" />
                    Informations générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre de l'article</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ex: Nouveau partenariat avec TechCorp"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Résumé/Extrait</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      placeholder="Un court résumé de votre article..."
                      className="min-h-[80px]"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Ce résumé apparaîtra dans la liste des articles
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Contenu de l'article
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Rédigez le contenu complet de votre article..."
                      className="min-h-[200px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Catégories
                      </Label>
                      <Input
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        placeholder="Ex: Actualité, Partenariat, Innovation (séparées par des virgules)"
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        Saisissez les catégories séparées par des virgules
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Auteur
                      </Label>
                      <Input
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                        placeholder="Ex: Marie Dubois"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Image de couverture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filePreview && !deleteImage && (
                    <div className="flex flex-col items-center space-y-3 p-4 bg-muted/50 rounded-2xl">
                      <img
                        src={filePreview}
                        alt="Aperçu"
                        className="w-32 h-32 object-cover rounded-2xl"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('file-upload')?.click()}
                          className="rounded-xl"
                        >
                          Changer l'image
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handleDeleteImage}
                          className="rounded-xl"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  )}

                  {deleteImage && (
                    <div className="flex flex-col items-center space-y-3 p-4 bg-red-50 rounded-2xl border border-red-200">
                      <div className="w-32 h-32 bg-red-100 rounded-2xl flex items-center justify-center">
                        <Trash2 className="h-8 w-8 text-red-500" />
                      </div>
                      <p className="text-sm text-red-600 font-medium">
                        Image marquée pour suppression
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDeleteImage(false)
                          // Restore original image if it exists from the fetched article data
                          if (filePreview) {
                            // The filePreview was set from the original article image
                            // No need to do anything as filePreview will show again
                          }
                        }}
                        className="rounded-xl"
                      >
                        Annuler la suppression
                      </Button>
                    </div>
                  )}
                  
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-2xl p-8 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Glissez-déposez votre photo ou cliquez pour sélectionner
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <div className="space-y-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="rounded-xl"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        {filePreview && !deleteImage ? 'Changer l\'image' : 'Ajouter une image'}
                      </Button>
                    </div>
                    
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Nouveau fichier: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Publication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <Checkbox
                      id="published"
                      name="published"
                      checked={formData.published}
                      onCheckedChange={(value) => handleInputChange('published', value)}
                    />
                    <div className="space-y-1 leading-none">
                      <Label htmlFor="published">
                        Publier l'article
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Si décoché, l'article sera sauvegardé comme brouillon
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    "Mise à jour en cours..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {formData.published ? "Mettre à jour et publier" : "Mettre à jour le brouillon"}
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/news">
                    Annuler
                  </Link>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
} 