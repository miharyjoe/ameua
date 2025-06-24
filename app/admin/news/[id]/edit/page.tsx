"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Newspaper, User, Image, Tag, FileText, Upload, X, Trash2 } from "lucide-react"
import Link from "next/link"
import { NewsSchema, type NewsSchemaType } from "@/schema"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface EditNewsProps {
  params: Promise<{ id: string }>
}

export default function EditNews({ params }: EditNewsProps) {
  const { id } = use(params)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [deleteImage, setDeleteImage] = useState(false)
  const [loading, setLoading] = useState(true)

  const form = useForm<NewsSchemaType>({
    resolver: zodResolver(NewsSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      image: "",
      category: "",
      author: "",
      published: false,
    },
  })

  useEffect(() => {
    fetchNews()
  }, [id])

  const fetchNews = async () => {
    try {
      const response = await fetch(`/api/news/${id}`)
      if (response.ok) {
        const article = await response.json()
        
        form.reset({
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          image: article.image || "",
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

  const onSubmit = async (data: NewsSchemaType) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      
      // Add all form fields
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })

      // Add file if selected
      if (selectedFile) {
        formData.append('image', selectedFile)
      }
      
      // Add delete image flag
      if (deleteImage) {
        formData.append('deleteImage', 'true')
      }

      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        body: formData,
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Newspaper className="h-5 w-5" />
                      Informations générales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre de l'article</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Nouveau partenariat avec TechCorp" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Résumé/Extrait</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Un court résumé de votre article..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Ce résumé apparaîtra dans la liste des articles
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Contenu de l'article
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Rédigez le contenu complet de votre article..."
                              className="min-h-[200px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Tag className="h-4 w-4" />
                              Catégories
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ex: Actualité, Partenariat, Innovation (séparées par des virgules)"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Saisissez les catégories séparées par des virgules
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Auteur
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Marie Dubois" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                            // Restore original image if it exists
                            const originalImage = form.getValues('image')
                            if (originalImage) {
                              setFilePreview(originalImage)
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
                    <FormField
                      control={form.control}
                      name="published"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Publier l'article
                            </FormLabel>
                            <FormDescription>
                              Si décoché, l'article sera sauvegardé comme brouillon
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? (
                      "Mise à jour en cours..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {form.watch("published") ? "Mettre à jour et publier" : "Mettre à jour le brouillon"}
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
            </Form>
          </div>
        </div>
      </section>
    </div>
  )
} 