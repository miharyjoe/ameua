"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Target, DollarSign, Users, Calendar, Tag, Upload, Trash2, Plus, X } from "lucide-react"
import Link from "next/link"

interface EditProjectProps {
  params: Promise<{ id: string }>
}

export default function EditProject({ params }: EditProjectProps) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [deleteImage, setDeleteImage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [needs, setNeeds] = useState<string[]>([''])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    goal: 0,
    raised: 0,
    contributors: 0,
    deadline: "",
    impact: "",
    isFinished: false,
    testimonialText: "",
    testimonialAuthor: "",
    totalRaised: undefined as number | undefined,
  })

  // Resolve params on component mount
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
    }
    resolveParams()
  }, [params])

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    if (resolvedParams?.id) {
      fetchProject()
    }
  }, [resolvedParams])

  const fetchProject = async () => {
    if (!resolvedParams?.id) return
    
    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}`)
      if (response.ok) {
        const project = await response.json()
        
        // Parse testimonial
        let testimonialText = ""
        let testimonialAuthor = ""
        if (project.testimonial) {
          try {
            const testimonial = JSON.parse(project.testimonial)
            testimonialText = testimonial.text || ""
            testimonialAuthor = testimonial.author || ""
          } catch (error) {
            console.error('Error parsing testimonial:', error)
          }
        }

        // Parse needs
        if (project.needs) {
          try {
            const parsedNeeds = JSON.parse(project.needs)
            if (Array.isArray(parsedNeeds) && parsedNeeds.length > 0) {
              setNeeds(parsedNeeds)
            }
          } catch (error) {
            console.error('Error parsing needs:', error)
          }
        }
        
        setFormData({
          title: project.title,
          description: project.description,
          category: project.category,
          goal: project.goal,
          raised: project.raised,
          contributors: project.contributors,
          deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : "",
          impact: project.impact || "",
          isFinished: project.isFinished,
          testimonialText,
          testimonialAuthor,
          totalRaised: project.totalRaised,
        })
        
        if (project.image) {
          setFilePreview(project.image)
        }
      }
    } catch (error) {
      console.error("Error fetching project:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setDeleteImage(false)
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

  const addNeed = () => {
    setNeeds([...needs, ''])
  }

  const removeNeed = (index: number) => {
    setNeeds(needs.filter((_, i) => i !== index))
  }

  const updateNeed = (index: number, value: string) => {
    const newNeeds = [...needs]
    newNeeds[index] = value
    setNeeds(newNeeds)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resolvedParams?.id) return
    
    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && key !== 'testimonialText' && key !== 'testimonialAuthor') {
          formDataToSend.append(key, value.toString())
        }
      })

      // Add needs as JSON string (filter out empty strings)
      const filteredNeeds = needs.filter(need => need.trim() !== '')
      formDataToSend.append('needs', JSON.stringify(filteredNeeds))

      // Add testimonial as JSON string if project is finished
      if (formData.isFinished && (formData.testimonialText || formData.testimonialAuthor)) {
        const testimonialObj = {
          text: formData.testimonialText || "",
          author: formData.testimonialAuthor || "Bénéficiaire"
        }
        formDataToSend.append('testimonial', JSON.stringify(testimonialObj))
      }

      // Add file if selected
      if (selectedFile) {
        formDataToSend.append('image', selectedFile)
      }
      
      // Add delete image flag
      if (deleteImage) {
        formDataToSend.append('deleteImage', 'true')
      }

      const response = await fetch(`/api/projects/${resolvedParams.id}`, {
        method: 'PUT',
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Failed to update project')
      }

      router.push("/admin/projects")
    } catch (error) {
      console.error("Error updating project:", error)
      alert('Erreur lors de la mise à jour du projet')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !resolvedParams) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Chargement du projet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <section className="py-8 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux projets
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Modifier le Projet</h1>
              <p className="text-muted-foreground">Mettez à jour les informations de votre projet</p>
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
                    <Target className="h-5 w-5" />
                    Informations générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre du projet</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Catégorie
                    </Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="impact">Impact attendu</Label>
                    <Textarea
                      id="impact"
                      name="impact"
                      value={formData.impact}
                      onChange={(e) => handleInputChange('impact', e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Objectifs financiers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal">Objectif de financement (€)</Label>
                      <Input
                        id="goal"
                        name="goal"
                        type="number"
                        min="1"
                        value={formData.goal}
                        onChange={(e) => handleInputChange('goal', Number(e.target.value))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="raised">Montant déjà levé (€)</Label>
                      <Input
                        id="raised"
                        name="raised"
                        type="number"
                        min="0"
                        value={formData.raised}
                        onChange={(e) => handleInputChange('raised', Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contributors" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Nombre de contributeurs
                      </Label>
                      <Input
                        id="contributors"
                        name="contributors"
                        type="number"
                        min="0"
                        value={formData.contributors}
                        onChange={(e) => handleInputChange('contributors', Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date limite (optionnel)
                      </Label>
                      <Input
                        id="deadline"
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Besoins du projet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {needs.map((need, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={need}
                        onChange={(e) => updateNeed(index, e.target.value)}
                        placeholder="Ex: Financement, Bénévoles, Équipements"
                        className="flex-1"
                      />
                      {needs.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeNeed(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addNeed}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un besoin
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Image du projet
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
                        onClick={() => setDeleteImage(false)}
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
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="rounded-xl"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      {filePreview && !deleteImage ? 'Changer l\'image' : 'Ajouter une image'}
                    </Button>
                    
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
                  <CardTitle>Statut du projet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <Checkbox
                      id="isFinished"
                      name="isFinished"
                      checked={formData.isFinished}
                      onCheckedChange={(value) => handleInputChange('isFinished', value)}
                    />
                    <div className="space-y-1 leading-none">
                      <Label htmlFor="isFinished">
                        Projet terminé
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Cochez si le projet est terminé
                      </p>
                    </div>
                  </div>

                  {formData.isFinished && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="totalRaised">Montant total levé (€)</Label>
                        <Input
                          id="totalRaised"
                          name="totalRaised"
                          type="number"
                          min="0"
                          value={formData.totalRaised || ''}
                          onChange={(e) => handleInputChange('totalRaised', Number(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="testimonialText">Témoignage</Label>
                        <Textarea
                          id="testimonialText"
                          name="testimonialText"
                          value={formData.testimonialText}
                          onChange={(e) => handleInputChange('testimonialText', e.target.value)}
                          placeholder="Ce projet a transformé ma vie..."
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="testimonialAuthor">Auteur du témoignage</Label>
                        <Input
                          id="testimonialAuthor"
                          name="testimonialAuthor"
                          value={formData.testimonialAuthor}
                          onChange={(e) => handleInputChange('testimonialAuthor', e.target.value)}
                          placeholder="Nom du bénéficiaire"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    "Mise à jour en cours..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Mettre à jour le projet
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/projects">
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