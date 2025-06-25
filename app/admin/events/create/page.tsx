"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Calendar, MapPin, Users, Image, Tag, Upload, X, Trash2, Images } from "lucide-react"
import Link from "next/link"

export default function CreateEvent() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  
  // Multiple images state for gallery
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    attendees: 0,
    upcoming: true,
    images: "",
    report: "",
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

  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Limit to 10 images total
    const remainingSlots = 10 - galleryFiles.length
    const newFiles = files.slice(0, remainingSlots)

    // Create previews
    const newPreviews: string[] = []
    let loadedCount = 0

    newFiles.forEach((file, index) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews[index] = e.target?.result as string
        loadedCount++
        
        if (loadedCount === newFiles.length) {
          setGalleryFiles(prev => [...prev, ...newFiles])
          setGalleryPreviews(prev => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index))
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index))
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

      // Add main image if selected
      if (selectedFile) {
        console.log('Adding main image file to FormData:', { name: selectedFile.name, size: selectedFile.size, type: selectedFile.type })
        formDataToSend.append('image', selectedFile)
      }

      // Add gallery images if selected
      if (galleryFiles.length > 0) {
        console.log(`Adding ${galleryFiles.length} gallery images to FormData`)
        galleryFiles.forEach((file, index) => {
          formDataToSend.append(`galleryImage_${index}`, file)
        })
        formDataToSend.append('galleryImageCount', galleryFiles.length.toString())
      }

      // Debug: Log all FormData entries
      console.log('FormData entries:')
      for (const [key, value] of formDataToSend.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value)
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Failed to create event')
      }

      router.push("/admin/events")
    } catch (error) {
      console.error("Error creating event:", error)
      alert('Erreur lors de la création de l\'événement')
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
              <Link href="/admin/events">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux événements
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Créer un Événement</h1>
              <p className="text-muted-foreground">Organisez votre prochain événement</p>
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
                    <Calendar className="h-5 w-5" />
                    Informations générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre de l'événement</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ex: Conférence Innovation & Leadership"
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
                      placeholder="Décrivez votre événement..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Heure</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Lieu
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Ex: Auditorium Central, Paris"
                      required
                    />
                  </div>

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
                      placeholder="Ex: Conférence, Networking, Innovation (séparées par des virgules)"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Saisissez les catégories séparées par des virgules
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attendees" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Nombre de participants attendus
                    </Label>
                    <Input
                      id="attendees"
                      name="attendees"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.attendees}
                      onChange={(e) => handleInputChange('attendees', Number(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Image principale de l'événement
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

              {/* Multiple Images Gallery */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Images className="h-5 w-5" />
                    Galerie d'images (Optionnel)
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez jusqu'à 10 images pour créer une galerie photos de l'événement
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Gallery Previews */}
                  {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {galleryPreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Galerie ${index + 1}`}
                            className="w-full h-24 object-cover rounded-xl"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeGalleryImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Upload Area */}
                  {galleryFiles.length < 10 && (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-2xl p-6 text-center">
                      <Images className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground mb-4 text-sm">
                        Sélectionnez plusieurs images ({galleryFiles.length}/10)
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryFilesChange}
                        className="hidden"
                        id="gallery-upload"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="rounded-xl"
                        onClick={() => document.getElementById('gallery-upload')?.click()}
                      >
                        Ajouter des images
                      </Button>
                    </div>
                  )}
                  
                  {galleryFiles.length >= 10 && (
                    <p className="text-sm text-muted-foreground text-center p-4 bg-muted/50 rounded-xl">
                      Limite de 10 images atteinte
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statut de l'événement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-row items-start space-x-3 space-y-0">
                    <Checkbox
                      id="upcoming"
                      name="upcoming"
                      checked={formData.upcoming}
                      onCheckedChange={(value) => handleInputChange('upcoming', value)}
                    />
                    <div className="space-y-1 leading-none">
                      <Label htmlFor="upcoming">
                        Événement à venir
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Décochez si l'événement est archivé
                      </p>
                    </div>
                  </div>

                  {/* Report section - only show when event is archived */}
                  {!formData.upcoming && (
                    <div className="space-y-2">
                      <Label htmlFor="report">Compte-rendu de l'événement</Label>
                      <Textarea
                        id="report"
                        name="report"
                        value={formData.report}
                        onChange={(e) => handleInputChange('report', e.target.value)}
                        placeholder="Rédigez un compte-rendu de l'événement..."
                        className="min-h-[100px]"
                      />
                      <p className="text-sm text-muted-foreground">
                        Le compte-rendu sera affiché avec l'événement archivé
                      </p>
                    </div>
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
                      Créer l'événement
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/events">
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