"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Newspaper, User, Image, Tag, FileText, Upload, X, Trash2 } from "lucide-react"
import Link from "next/link"

export default function CreateNews() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    published: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

      const response = await fetch('/api/news', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Failed to create news')
      }

      router.push("/admin/news")
    } catch (error) {
      console.error("Error creating news:", error)
      alert('Erreur lors de la création de l\'article')
    } finally {
      setIsSubmitting(false)
    }
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
              <h1 className="text-3xl font-bold">Créer une Actualité</h1>
              <p className="text-muted-foreground">Rédigez votre nouvel article</p>
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
                  <div>
                    <Label htmlFor="title">Titre de l'article</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Résumé/Extrait</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      placeholder="Un court résumé de votre article..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Contenu de l'article</Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Rédigez le contenu complet de votre article..."
                      className="min-h-[200px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Catégories</Label>
                      <Input
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        placeholder="Ex: Actualité, Partenariat, Innovation (séparées par des virgules)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="author">Auteur</Label>
                      <Input
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                        placeholder="Ex: Marie Dubois"
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
                  {filePreview && (
                    <div className="flex flex-col items-center space-y-3 p-4 bg-muted/50 rounded-2xl">
                      <img
                        src={filePreview}
                        alt="Aperçu"
                        className="w-32 h-32 object-cover rounded-2xl"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setFilePreview(null)
                          setSelectedFile(null)
                        }}
                        className="rounded-xl"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
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
                        {filePreview ? 'Changer l\'image' : 'Ajouter une image'}
                      </Button>
                    </div>
                    
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Fichier sélectionné: {selectedFile.name}
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
                        Publier immédiatement
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Si décoché, l'article sera sauvegardé comme brouillon
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    "Création en cours..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {formData.published ? "Publier l'article" : "Sauvegarder le brouillon"}
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