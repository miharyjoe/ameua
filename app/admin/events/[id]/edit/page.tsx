"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Calendar, MapPin, Users, Image, Tag, Upload, X, Trash2 } from "lucide-react"
import Link from "next/link"

interface EditEventProps {
  params: Promise<{ id: string }>
}

export default function EditEvent({ params }: EditEventProps) {
  const { id } = use(params)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [deleteImage, setDeleteImage] = useState(false)
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${id}`)
      if (response.ok) {
        const event = await response.json()
        // Convert date to string format for input
        const dateString = new Date(event.date).toISOString().split('T')[0]
        
        setFormData({
          title: event.title,
          description: event.description,
          date: dateString,
          time: event.time,
          location: event.location,
          category: event.category,
          attendees: event.attendees,
          upcoming: event.upcoming,
          images: event.images || "",
          report: event.report || "",
        })
        
        if (event.image) {
          setFilePreview(event.image)
        }
      }
    } catch (error) {
      console.error("Error fetching event:", error)
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

      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Failed to update event')
      }

      router.push("/admin/events")
    } catch (error) {
      console.error("Error updating event:", error)
      alert('Erreur lors de la mise à jour de l\'événement')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Chargement de l'événement...</p>
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
              <Link href="/admin/events">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux événements
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Modifier l'Événement</h1>
              <p className="text-muted-foreground">Mettez à jour les informations de votre événement</p>
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
                  <div>
                    <Label htmlFor="title">Titre de l'événement</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="time">Heure</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Lieu</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Catégories</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="attendees">Nombre de participants</Label>
                    <Input
                      id="attendees"
                      name="attendees"
                      type="number"
                      min="0"
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
                    Image de l'événement
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
                          // Restore original image if it exists from the fetched event data
                          if (filePreview) {
                            // The filePreview was set from the original event image
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
                  <CardTitle>Statut et informations supplémentaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="report">Compte-rendu (pour les événements archivés)</Label>
                    <Textarea
                      id="report"
                      name="report"
                      value={formData.report}
                      onChange={(e) => handleInputChange('report', e.target.value)}
                      className="min-h-[100px]"
                    />
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
                      Mettre à jour l'événement
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