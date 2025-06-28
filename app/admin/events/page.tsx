"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Archive,
  Eye,
  ArrowLeft,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Event {
  id: string
  title: string
  description: string
  date: Date
  time: string
  location: string
  category: string
  attendees: number
  image: string
  upcoming: boolean
  images?: string
  report?: string
  createdAt: Date
  updatedAt: Date
}

// Loading skeleton component
const EventCardSkeleton = () => (
  <Card className="shadow-lg rounded-2xl border-0 bg-white overflow-hidden">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Skeleton className="w-full h-48 lg:h-32" />
      <div className="lg:col-span-2 p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-18" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  </Card>
)

export default function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) setRefreshing(true)
      if (!showRefreshIndicator) setLoading(true)
      
      console.log("Fetching events from API...")
      const response = await fetch('/api/events')
      console.log("API response status:", response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("API response error:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      console.log("Raw data from API:", data)
      
      // Convert date strings to Date objects
      const eventsWithDates = data.map((event: any) => ({
        ...event,
        date: new Date(event.date),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
      }))
      
      console.log("Events with converted dates:", eventsWithDates.length)
      setEvents(eventsWithDates)
      setError(null)
    } catch (error) {
      console.error("Detailed error fetching events:", error)
    } finally {
      setLoading(false)
      if (showRefreshIndicator) setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchEvents(true)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Refresh data when switching tabs
    if (value !== activeTab) {
      fetchEvents(true)
    }
  }

  const handleArchiveEvent = async (eventId: string) => {
    try {
      const event = events.find(e => e.id === eventId)
      if (!event) return

      const formData = new FormData()
      
      // Add all current event fields
      formData.append('title', event.title)
      formData.append('description', event.description)
      formData.append('date', event.date.toISOString().split('T')[0])
      formData.append('time', event.time)
      formData.append('location', event.location)
      formData.append('category', event.category)
      formData.append('attendees', event.attendees.toString())
      formData.append('upcoming', 'false') // Set to archived
      formData.append('images', event.images || '')
      formData.append('report', event.report || '')

      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        body: formData,
      })

      if (response.ok) {
        setEvents(prev =>
          prev.map(event =>
            event.id === eventId ? { ...event, upcoming: false } : event
          )
        )
      }
    } catch (error) {
      console.error("Error archiving event:", error)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setEvents(prev => prev.filter(event => event.id !== eventId))
      }
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }

  const handleRestoreEvent = async (eventId: string) => {
    try {
      const event = events.find(e => e.id === eventId)
      if (!event) return

      const formData = new FormData()
      
      // Add all current event fields
      formData.append('title', event.title)
      formData.append('description', event.description)
      formData.append('date', event.date.toISOString().split('T')[0])
      formData.append('time', event.time)
      formData.append('location', event.location)
      formData.append('category', event.category)
      formData.append('attendees', event.attendees.toString())
      formData.append('upcoming', 'true') // Set to upcoming
      formData.append('images', event.images || '')
      formData.append('report', event.report || '')

      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        body: formData,
      })

      if (response.ok) {
        setEvents(prev =>
          prev.map(event =>
            event.id === eventId ? { ...event, upcoming: true } : event
          )
        )
      }
    } catch (error) {
      console.error("Error restoring event:", error)
    }
  }

  const upcomingEventsList = events.filter(event => event.upcoming)
  const archivedEventsList = events.filter(event => !event.upcoming)

  const EventCard = ({ event, isArchived = false }: { event: Event; isArchived?: boolean }) => (
    <Card className="shadow-lg rounded-2xl border-0 bg-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="relative">
          <img
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-48 lg:h-full object-cover"
          />
          <Badge className="absolute top-4 left-4">{event.category}</Badge>
        </div>
        
        <div className="lg:col-span-2 p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{event.title}</h3>
              <div className="space-y-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    {event.date.toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{event.attendees} participants</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-muted-foreground">{event.description}</p>
          
          {isArchived && event.report && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1">Compte-rendu</h4>
              <p className="text-sm text-muted-foreground">{event.report}</p>
            </div>
          )}
          
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/events/${event.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Voir
              </Link>
            </Button>
            
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/events/${event.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Link>
            </Button>
            
            {!isArchived ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Archive className="mr-2 h-4 w-4" />
                    Archiver
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Archiver l'événement ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      L'événement sera déplacé vers les archives. Vous pourrez le restaurer plus tard.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleArchiveEvent(event.id)}>
                      Archiver
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button variant="outline" size="sm" onClick={() => handleRestoreEvent(event.id)}>
                <Archive className="mr-2 h-4 w-4" />
                Restaurer
              </Button>
            )}
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer l'événement ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. L'événement sera définitivement supprimé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleDeleteEvent(event.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </Card>
  )

  if (error && events.length === 0) {
    return (
      <div className="flex flex-col">
        <section className="py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour au dashboard
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">Gestion des Événements</h1>
                  <p className="text-muted-foreground">Gérez vos événements à venir et archivés</p>
                </div>
              </div>
              <Button asChild>
                <Link href="/admin/events/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvel Événement
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-destructive">Erreur de chargement</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour au dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Gestion des Événements</h1>
                <p className="text-muted-foreground">Gérez vos événements à venir et archivés</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Actualisation...' : 'Actualiser'}
              </Button>
              <Button asChild>
                <Link href="/admin/events/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvel Événement
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upcoming">
                Événements à venir ({upcomingEventsList.length})
              </TabsTrigger>
              <TabsTrigger value="archived">
                Événements archivés ({archivedEventsList.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {loading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <EventCardSkeleton key={i} />
                  ))}
                </div>
              ) : upcomingEventsList.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun événement à venir</h3>
                    <p className="text-muted-foreground mb-4">
                      Commencez par créer votre premier événement
                    </p>
                    <Button asChild>
                      <Link href="/admin/events/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Créer un événement
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                upcomingEventsList.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              )}
            </TabsContent>

            <TabsContent value="archived" className="space-y-6">
              {loading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <EventCardSkeleton key={i} />
                  ))}
                </div>
              ) : archivedEventsList.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Archive className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun événement archivé</h3>
                    <p className="text-muted-foreground">
                      Les événements archivés apparaîtront ici
                    </p>
                  </CardContent>
                </Card>
              ) : (
                archivedEventsList.map((event) => (
                  <EventCard key={event.id} event={event} isArchived />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}