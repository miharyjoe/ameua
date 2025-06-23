import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Clock, ArrowRight, ImageIcon } from "lucide-react"
import Link from "next/link"

const upcomingEvents = [
  {
    id: 1,
    title: "Conférence Innovation & Leadership",
    date: "2024-02-15",
    time: "18:00",
    location: "Auditorium Central, Paris",
    description: "Rencontrez des leaders d'opinion et découvrez les dernières tendances en innovation.",
    attendees: 120,
    image: "https://placehold.co/200x300",
    category: "Conférence",
  },
  {
    id: 2,
    title: "Networking Afterwork",
    date: "2024-02-22",
    time: "19:00",
    location: "Rooftop Sky Bar, Lyon",
    description: "Soirée networking décontractée pour échanger avec d'autres alumni.",
    attendees: 45,
    image: "https://placehold.co/200x300",
    category: "Networking",
  },
  {
    id: 3,
    title: "Atelier Entrepreneuriat",
    date: "2024-03-05",
    time: "14:00",
    location: "Incubateur TechHub, Marseille",
    description: "Workshop pratique sur la création d'entreprise avec des entrepreneurs expérimentés.",
    attendees: 30,
    image: "https://placehold.co/200x300",
    category: "Formation",
  },
]

const pastEvents = [
  {
    id: 1,
    title: "Gala Annuel 2023",
    date: "2023-12-10",
    location: "Château de Versailles",
    description: "Une soirée exceptionnelle pour célébrer nos réussites et renforcer nos liens.",
    attendees: 200,
    images: [
      "https://placehold.co/150x200",
      "https://placehold.co/150x200",
      "https://placehold.co/150x200",
    ],
    report: "Un événement mémorable qui a rassemblé 200 alumni dans un cadre prestigieux.",
  },
  {
    id: 2,
    title: "Forum Carrières 2023",
    date: "2023-11-15",
    location: "Campus Universitaire",
    description: "Rencontres entre étudiants et professionnels pour l'orientation de carrière.",
    attendees: 150,
    images: ["https://placehold.co/150x200", "https://placehold.co/150x200"],
    report: "Plus de 30 entreprises représentées et de nombreuses opportunités créées.",
  },
]

const news = [
  {
    id: 1,
    title: "Nouveau partenariat avec TechCorp",
    date: "2024-01-20",
    category: "Partenariat",
    excerpt:
      "Nous sommes fiers d'annoncer notre nouveau partenariat stratégique avec TechCorp pour offrir des opportunités exclusives à nos membres.",
    image: "https://placehold.co/200x300",
    author: "Marie Dubois",
  },
  {
    id: 2,
    title: "Lancement du programme de mentorat",
    date: "2024-01-15",
    category: "Programme",
    excerpt:
      "Notre nouveau programme de mentorat connecte les jeunes diplômés avec des professionnels expérimentés de notre réseau.",
    image: "https://placehold.co/200x300",
    author: "Jean-Pierre Martin",
  },
  {
    id: 3,
    title: "Bourse d'excellence 2024",
    date: "2024-01-10",
    category: "Éducation",
    excerpt: "Candidatures ouvertes pour notre bourse d'excellence destinée aux étudiants méritants de l'université.",
    image: "https://placehold.co/200x300",
    author: "Sarah Johnson",
  },
]

export default function NewsPage() {
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
                            {new Date(event.date).toLocaleDateString("fr-FR", {
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
                {pastEvents.map((event) => (
                  <Card key={event.id} className="shadow-lg rounded-2xl border-0 bg-white overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold">{event.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>
                              {new Date(event.date).toLocaleDateString("fr-FR", {
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
                        <div className="bg-muted/50 p-4 rounded-xl">
                          <h4 className="font-semibold mb-2">Compte-rendu</h4>
                          <p className="text-sm text-muted-foreground">{event.report}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">Galerie photos</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {event.images.map((image, index) => (
                            <div key={index} className="aspect-video rounded-xl overflow-hidden">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`${event.title} - Photo ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                              />
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full rounded-xl">
                          Voir toutes les photos
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
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
                {news.map((article) => (
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
                        <span>{new Date(article.date).toLocaleDateString("fr-FR")}</span>
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
