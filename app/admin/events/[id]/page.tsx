"use client"

import { useState, useEffect, use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowLeft, 
  Edit, 
  Archive, 
  ArchiveRestore,
  Trash2,
  ImageIcon,
  Tag
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

interface Event {
  id: string
  title: string
  description: string
  date: Date
  time: string
  location: string
  image: string | null
  category: string
  attendees: number
  upcoming: boolean
  images: string | null
  report: string | null
  createdAt: Date
  updatedAt: Date
}

interface EventViewProps {
  params: Promise<{ id: string }>
}

export default function EventView({ params }: EventViewProps) {
  const { id } = use(params)
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showArchiveDialog, setShowArchiveDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${id}`)
      if (response.ok) {
        const eventData = await response.json()
        setEvent({
          ...eventData,
          date: new Date(eventData.date),
          createdAt: new Date(eventData.createdAt),
          updatedAt: new Date(eventData.updatedAt),
        })
      }
    } catch (error) {
      console.error("Error fetching event:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push("/admin/events")
      } else {
        alert('Erreur lors de la suppression de l\'événement')
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      alert('Erreur lors de la suppression de l\'événement')
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleArchive = async () => {
    if (!event) return
    
    setIsArchiving(true)
    try {
      const formData = new FormData()
      formData.append('upcoming', (!event.upcoming).toString())
      
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        body: formData,
      })

      if (response.ok) {
        setEvent(prev => prev ? { ...prev, upcoming: !prev.upcoming } : null)
      } else {
        alert('Erreur lors de la modification du statut')
      }
    } catch (error) {
      console.error("Error updating event:", error)
      alert('Erreur lors de la modification du statut')
    } finally {
      setIsArchiving(false)
      setShowArchiveDialog(false)
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

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Événement non trouvé</h1>
          <p className="text-muted-foreground mb-4">L'événement que vous recherchez n'existe pas.</p>
          <Button asChild>
            <Link href="/admin/events">Retour aux événements</Link>
          </Button>
        </div>
      </div>
    )
  }

  const eventImages = event.images ? JSON.parse(event.images) : []

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/events">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour aux événements
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={event.upcoming ? "default" : "secondary"}>
                    {event.upcoming ? "À venir" : "Archivé"}
                  </Badge>
                  <Badge variant="outline">
                    <Tag className="mr-1 h-3 w-3" />
                    {event.category}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold">{event.title}</h1>
                <p className="text-muted-foreground">
                  Créé le {event.createdAt.toLocaleDateString("fr-FR")} • 
                  Modifié le {event.updatedAt.toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/admin/events/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowArchiveDialog(true)}
                disabled={isArchiving}
              >
                {event.upcoming ? (
                  <>
                    <Archive className="mr-2 h-4 w-4" />
                    Archiver
                  </>
                ) : (
                  <>
                    <ArchiveRestore className="mr-2 h-4 w-4" />
                    Restaurer
                  </>
                )}
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
              {/* Event Image */}
              {event.image && (
                <Card>
                  <CardContent className="p-0">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {event.description}
                  </p>
                </CardContent>
              </Card>

              {/* Report (for archived events) */}
              {!event.upcoming && event.report && (
                <Card>
                  <CardHeader>
                    <CardTitle>Compte-rendu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {event.report}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Gallery */}
              {eventImages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Galerie photos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {eventImages.map((image: string, index: number) => (
                        <div key={index} className="aspect-video rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`${event.title} - Photo ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Détails de l'événement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {event.date.toLocaleDateString("fr-FR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p>{event.time}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p>{event.location}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <p>{event.attendees} participants</p>
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
                    <Link href={`/admin/events/${id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier l'événement
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowArchiveDialog(true)}
                  >
                    {event.upcoming ? (
                      <>
                        <Archive className="mr-2 h-4 w-4" />
                        Archiver l'événement
                      </>
                    ) : (
                      <>
                        <ArchiveRestore className="mr-2 h-4 w-4" />
                        Restaurer l'événement
                      </>
                    )}
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
              Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.
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

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {event.upcoming ? "Archiver l'événement" : "Restaurer l'événement"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {event.upcoming 
                ? "Voulez-vous archiver cet événement ? Il ne sera plus visible dans les événements à venir."
                : "Voulez-vous restaurer cet événement ? Il redeviendra visible dans les événements à venir."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              disabled={isArchiving}
            >
              {isArchiving 
                ? "Modification..." 
                : event.upcoming 
                  ? "Archiver" 
                  : "Restaurer"
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 