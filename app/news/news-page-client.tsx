"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Clock, ArrowRight, ImageIcon, Eye, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Image Gallery Modal Component
function ImageGalleryModal({ 
  images, 
  isOpen, 
  onClose, 
  eventTitle 
}: { 
  images: string[], 
  isOpen: boolean, 
  onClose: () => void, 
  eventTitle: string 
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Galerie - {eventTitle}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 max-h-[calc(90vh-80px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="aspect-video rounded-xl overflow-hidden">
                <img
                  src={image}
                  alt={`${eventTitle} - Photo ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Client Component for Gallery Interaction
function EventGallery({ images, eventTitle }: { images: string[], eventTitle: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const displayImages = images.slice(0, 4) // Show max 4 images in preview
  const hasMore = images.length > 4

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {displayImages.map((image, index) => (
          <div 
            key={index} 
            className="aspect-video rounded-xl overflow-hidden cursor-pointer group relative"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`${eventTitle} - Photo ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {hasMore && index === 3 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold">+{images.length - 4} photos</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <Button 
        variant="outline" 
        className="w-full rounded-xl" 
        onClick={() => setIsModalOpen(true)}
      >
        <Eye className="mr-2 h-4 w-4" />
        Voir toutes les photos ({images.length})
      </Button>

      <ImageGalleryModal
        images={images}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventTitle={eventTitle}
      />
    </>
  )
}

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

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  image: string | null
  category: string
  author: string
  published: boolean
  createdAt: Date
  updatedAt: Date
}

interface NewsPageClientProps {
  upcomingEvents: Event[]
  archivedEvents: Event[]
  newsArticles: NewsArticle[]
}

export function NewsPageClient({ upcomingEvents, archivedEvents, newsArticles }: NewsPageClientProps) {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Calendar className="mr-2 h-4 w-4" />
              Actualités & Événements
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              Restez
              <span className="text-primary"> Connectés</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Découvrez nos dernières actualités, participez à nos événements et restez au cœur de la vie de notre
              communauté
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 rounded-2xl">
              <TabsTrigger value="events" className="rounded-xl">
                Événements
              </TabsTrigger>
              <TabsTrigger value="archives" className="rounded-xl">
                Archives
              </TabsTrigger>
              <TabsTrigger value="news" className="rounded-xl">
                Actualités
              </TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Événements à venir</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Ne manquez pas nos prochains événements et inscrivez-vous dès maintenant
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="shadow-lg rounded-2xl border-0 bg-white overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-4 left-4">{event.category}</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <div className="space-y-2">
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
                          <span>{event.attendees} participants inscrits</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-base">{event.description}</CardDescription>
                      <Button className="w-full rounded-xl">
                        S'inscrire à l'événement
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="archives" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Archives des événements</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Revivez nos événements passés à travers photos et comptes-rendus
                </p>
              </div>

              <div className="space-y-8">
                {archivedEvents.map((event) => {
                  const eventImages = event.images ? JSON.parse(event.images) : []
                  
                  return (
                    <Card key={event.id} className="shadow-lg rounded-2xl border-0 bg-white overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-2xl font-bold">{event.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-2 h-4 w-4" />
                              <span>
                                {event.date.toLocaleDateString("fr-FR", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
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
                          <p className="text-muted-foreground">{event.description}</p>
                          {event.report && (
                            <div className="bg-muted/50 p-4 rounded-xl">
                              <h4 className="font-semibold mb-2">Compte-rendu</h4>
                              <p className="text-sm text-muted-foreground">{event.report}</p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <ImageIcon className="h-5 w-5 text-muted-foreground" />
                              <span className="font-medium">Galerie photos</span>
                            </div>
                            {eventImages.length > 0 && (
                              <Badge variant="outline">{eventImages.length} photos</Badge>
                            )}
                          </div>
                          
                          {eventImages.length > 0 ? (
                            <EventGallery images={eventImages} eventTitle={event.title} />
                          ) : (
                            <div className="aspect-video rounded-xl bg-muted/30 flex items-center justify-center">
                              <div className="text-center">
                                <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">Aucune photo disponible</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="news" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Dernières actualités</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Restez informés des dernières nouvelles de notre association
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="shadow-lg rounded-2xl border-0 bg-white overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-4 left-4">{article.category}</Badge>
                    </div>
                    <CardHeader>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{article.createdAt.toLocaleDateString("fr-FR")}</span>
                        <span className="mx-2">•</span>
                        <span>Par {article.author}</span>
                      </div>
                      <CardTitle className="text-xl">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-base">{article.excerpt}</CardDescription>
                      <Button variant="outline" className="w-full rounded-xl" asChild>
                        <Link href={`/news/${article.id}`}>
                          Lire la suite
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Newsletter Subscription */}
              <Card className="shadow-lg rounded-2xl border-0 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
                <CardContent className="text-center p-8 space-y-6">
                  <h3 className="text-2xl font-bold">Restez informés</h3>
                  <p className="text-lg opacity-90">
                    Abonnez-vous à notre newsletter pour recevoir toutes nos actualités
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Votre email"
                      className="flex-1 px-4 py-3 rounded-xl text-foreground"
                    />
                    <Button variant="secondary" className="px-6 py-3 rounded-xl">
                      S'abonner
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
} 