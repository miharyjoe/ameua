"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Target, DollarSign, Users, Calendar, Tag, Upload, Trash2, Plus, X } from "lucide-react"
import Link from "next/link"

export default function CreateProject() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
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
    testimonial: "",
    totalRaised: undefined as number | undefined,
  })

  const handleInputChange = (field: string, value: string | number | boolean) => {
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
    setIsSubmitting(true)
    
    try {
      const formDataToSend = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          formDataToSend.append(key, value.toString())
        }
      })

      // Add needs as JSON string (filter out empty strings)
      const filteredNeeds = needs.filter(need => need.trim() !== '')
      formDataToSend.append('needs', JSON.stringify(filteredNeeds))

      // Add testimonial as JSON string if project is finished
      if (formData.isFinished && formData.testimonial) {
        const testimonialObj = {
          text: formData.testimonial,
          author: "Bénéficiaire" // You might want to make this configurable
        }
        formDataToSend.append('testimonial', JSON.stringify(testimonialObj))
      }

      // Add file if selected
      if (selectedFile) {
        formDataToSend.append('image', selectedFile)
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }

      router.push("/admin/projects")
    } catch (error) {
      console.error("Error creating project:", error)
      alert('Erreur lors de la création du projet')
    } finally {
      setIsSubmitting(false)
    }
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
              <h1 className="text-3xl font-bold">Créer un Projet</h1>
              <p className="text-muted-foreground">Lancez votre nouveau projet communautaire</p>
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
                      placeholder="Ex: Bourses d'Excellence Étudiantes"
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
                      placeholder="Décrivez votre projet..."
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
                      placeholder="Ex: Éducation, Infrastructure, Entrepreneuriat"
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
                      placeholder="Ex: 15 bourses attribuées cette année"
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
                        placeholder="50000"
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
                        placeholder="0"
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
                        placeholder="0"
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
                  <p className="text-sm text-muted-foreground">
                    Listez les besoins spécifiques de votre projet
                  </p>
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
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="rounded-xl"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      {filePreview ? 'Changer l\'image' : 'Ajouter une image'}
                    </Button>
                    
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
                        Cochez si le projet est déjà terminé
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
                          placeholder="120000"
                        />
                        <p className="text-sm text-muted-foreground">
                          Le montant total levé pour ce projet terminé
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="testimonial">Témoignage</Label>
                        <Textarea
                          id="testimonial"
                          name="testimonial"
                          value={formData.testimonial}
                          onChange={(e) => handleInputChange('testimonial', e.target.value)}
                          placeholder="Ce projet a transformé ma vie..."
                          className="min-h-[100px]"
                        />
                        <p className="text-sm text-muted-foreground">
                          Un témoignage d'un bénéficiaire du projet
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    "Création en cours..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Créer le projet
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