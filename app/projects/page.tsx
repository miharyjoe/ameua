import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Heart, Users, TrendingUp, DollarSign, Clock, CheckCircle, ArrowRight } from "lucide-react"

const currentProjects = [
  {
    id: 1,
    title: "Bourses d'Excellence Étudiantes",
    description: "Programme de bourses pour soutenir les étudiants méritants en difficulté financière.",
    category: "Éducation",
    goal: 50000,
    raised: 32000,
    contributors: 45,
    deadline: "2024-06-30",
    image: "https://placehold.co/200x300",
    impact: "15 bourses attribuées cette année",
    needs: ["Financement", "Bénévoles pour sélection"],
  },
  {
    id: 2,
    title: "Incubateur Alumni Startups",
    description: "Accompagnement des projets entrepreneuriaux portés par nos diplômés.",
    category: "Entrepreneuriat",
    goal: 100000,
    raised: 75000,
    contributors: 28,
    deadline: "2024-12-31",
    image: "https://placehold.co/200x300",
    impact: "8 startups accompagnées, 3 levées de fonds",
    needs: ["Mentors expérimentés", "Financement", "Espaces de coworking"],
  },
  {
    id: 3,
    title: "Rénovation Laboratoire Recherche",
    description: "Modernisation des équipements du laboratoire de recherche de l'université.",
    category: "Infrastructure",
    goal: 80000,
    raised: 45000,
    contributors: 62,
    deadline: "2024-09-15",
    image: "https://placehold.co/200x300",
    impact: "Bénéficiera à 200+ étudiants chercheurs",
    needs: ["Équipements scientifiques", "Financement", "Expertise technique"],
  },
]

const successStories = [
  {
    id: 1,
    title: "Centre de Formation Numérique",
    description: "Formation aux métiers du numérique pour 500 jeunes défavorisés.",
    completed: "2023",
    totalRaised: 120000,
    contributors: 89,
    impact: "500 jeunes formés, 85% d'insertion professionnelle",
    image: "https://placehold.co/200x300",
    testimonial: {
      text: "Ce projet a transformé ma vie. Grâce à cette formation, j'ai trouvé un emploi dans le développement web.",
      author: "Karim, bénéficiaire",
    },
  },
  {
    id: 2,
    title: "Bibliothèque Numérique Africaine",
    description: "Création d'une bibliothèque numérique pour les universités africaines partenaires.",
    completed: "2022",
    totalRaised: 85000,
    contributors: 156,
    impact: "50,000 étudiants ont accès à 10,000 ressources",
    image: "https://placehold.co/200x300",
    testimonial: {
      text: "Un projet qui a révolutionné l'accès à l'information dans notre université.",
      author: "Dr. Amina Kone, Université de Bamako",
    },
  },
]

const impactStats = [
  { label: "Projets réalisés", value: "25+", icon: CheckCircle },
  { label: "Fonds levés", value: "2.5M€", icon: DollarSign },
  { label: "Bénéficiaires", value: "10,000+", icon: Users },
  { label: "Contributeurs", value: "500+", icon: Heart },
]

export default function ProjectsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Target className="mr-2 h-4 w-4" />
              Projets en Cours
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              Ensemble pour
              <span className="text-primary"> l'Impact</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Découvrez nos projets communautaires et contribuez à créer un impact positif durable dans l'éducation et
              la société
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center shadow-lg rounded-2xl border-0 bg-white">
                <CardContent className="pt-6 space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 rounded-2xl">
              <TabsTrigger value="current" className="rounded-xl">
                Projets Actuels
              </TabsTrigger>
              <TabsTrigger value="success" className="rounded-xl">
                Réussites
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Projets en cours</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Soutenez nos initiatives actuelles et contribuez à leur réussite
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {currentProjects.map((project) => (
                  <Card key={project.id} className="shadow-lg rounded-2xl border-0 bg-white overflow-hidden">
                    <div className="relative">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-4 left-4">{project.category}</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <CardDescription className="text-base">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Progression</span>
                          <span className="text-muted-foreground">
                            {Math.round((project.raised / project.goal) * 100)}%
                          </span>
                        </div>
                        <Progress value={(project.raised / project.goal) * 100} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{project.raised.toLocaleString()}€ levés</span>
                          <span>Objectif: {project.goal.toLocaleString()}€</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="space-y-1">
                          <div className="text-2xl font-bold text-primary">{project.contributors}</div>
                          <div className="text-xs text-muted-foreground">Contributeurs</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-2xl font-bold text-primary">
                            <Clock className="h-5 w-5 inline mr-1" />
                            {Math.ceil(
                              (new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                            )}
                            j
                          </div>
                          <div className="text-xs text-muted-foreground">Restants</div>
                        </div>
                      </div>

                      {/* Impact */}
                      <div className="bg-green-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Impact
                        </h4>
                        <p className="text-sm text-green-700">{project.impact}</p>
                      </div>

                      {/* Needs */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Besoins actuels:</h4>
                        <div className="flex flex-wrap gap-1">
                          {project.needs.map((need, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {need}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button className="rounded-xl">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Contribuer
                        </Button>
                        <Button variant="outline" className="rounded-xl">
                          <Users className="h-4 w-4 mr-2" />
                          Bénévolat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Call to Action */}
              <Card className="shadow-lg rounded-2xl border-0 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
                <CardContent className="text-center p-8 space-y-6">
                  <h3 className="text-2xl font-bold">Vous avez un projet ?</h3>
                  <p className="text-lg opacity-90">
                    Proposez votre initiative et mobilisez notre communauté pour la réaliser
                  </p>
                  <Button size="lg" variant="secondary" className="rounded-2xl">
                    Proposer un projet
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="success" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Nos réussites</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Découvrez les projets que nous avons menés à bien grâce à la mobilisation de notre communauté
                </p>
              </div>

              <div className="space-y-8">
                {successStories.map((story) => (
                  <Card key={story.id} className="shadow-lg rounded-2xl border-0 bg-white overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="relative">
                        <img
                          src={story.image || "/placeholder.svg"}
                          alt={story.title}
                          className="w-full h-full object-cover min-h-[300px]"
                        />
                        <Badge className="absolute top-4 left-4 bg-green-600">Terminé en {story.completed}</Badge>
                      </div>
                      <div className="p-6 space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-2xl font-bold">{story.title}</h3>
                          <p className="text-muted-foreground">{story.description}</p>
                        </div>

                        {/* Success Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-green-50 rounded-xl">
                            <div className="text-2xl font-bold text-green-600">
                              {story.totalRaised.toLocaleString()}€
                            </div>
                            <div className="text-sm text-green-700">Fonds levés</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-xl">
                            <div className="text-2xl font-bold text-blue-600">{story.contributors}</div>
                            <div className="text-sm text-blue-700">Contributeurs</div>
                          </div>
                        </div>

                        {/* Impact */}
                        <div className="bg-muted/50 p-4 rounded-xl">
                          <h4 className="font-semibold mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Impact réalisé
                          </h4>
                          <p className="text-sm text-muted-foreground">{story.impact}</p>
                        </div>

                        {/* Testimonial */}
                        <div className="border-l-4 border-primary pl-4">
                          <p className="italic text-muted-foreground mb-2">"{story.testimonial.text}"</p>
                          <p className="text-sm font-medium">— {story.testimonial.author}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
