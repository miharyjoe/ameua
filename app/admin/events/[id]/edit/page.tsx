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
import { ArrowLeft, Save, Calendar, MapPin, Users, Image, Tag, Upload, X, Trash2 } from "lucide-react"
import Link from "next/link"
import { EventSchema, type EventSchemaType } from "@/schema"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

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

  const form = useForm<EventSchemaType>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      image: "",
      category: "",
      attendees: 0,
      upcoming: true,
      images: "",
      report: "",
    },
  })

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
        
        form.reset({
          title: event.title,
          description: event.description,
          date: dateString,
          time: event.time,
          location: event.location,
          image: event.image || "",
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

  const onSubmit = async (data: EventSchemaType) => {
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

      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        body: formData,
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Informations générales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre de l'événement</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Conférence Innovation & Leadership" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Décrivez votre événement..."
                              className="min-h-[100px]"
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
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Heure</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Lieu
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Auditorium Central, Paris" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                              placeholder="Ex: Conférence, Networking, Innovation (séparées par des virgules)"
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
                      name="attendees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Nombre de participants
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                    <CardTitle>Statut et informations supplémentaires</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="upcoming"
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
                              Événement à venir
                            </FormLabel>
                            <FormDescription>
                              Décochez si l'événement est archivé
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="report"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Compte-rendu (pour les événements archivés)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Rédigez un compte-rendu de l'événement..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Ce champ est optionnel et s'affiche pour les événements archivés
                          </FormDescription>
                          <FormMessage />
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
            </Form>
          </div>
        </div>
      </section>
    </div>
  )
} 