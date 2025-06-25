"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Target, Heart, Users, TrendingUp, DollarSign, Clock, CheckCircle, ArrowRight } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  category: string
  goal: number
  raised: number
  contributors: number
  deadline: Date | null
  image: string | null
  impact: string | null
  needs: string | null
  isFinished: boolean
  testimonial: string | null
  totalRaised: number | null
  createdAt: Date
  updatedAt: Date
}

const impactStats = [
  { label: "Projets réalisés", value: "25+", icon: CheckCircle },
  { label: "Fonds levés", value: "2.5M€", icon: DollarSign },
  { label: "Bénéficiaires", value: "10,000+", icon: Users },
  { label: "Contributeurs", value: "500+", icon: Heart },
]

// Loading skeleton component
const ProjectCardSkeleton = () => (
  <Card className="shadow-lg rounded-2xl border-0 bg-white overflow-hidden">
    <div className="relative">
      <Skeleton className="w-full h-48" />
      <div className="absolute top-4 left-4">
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-2 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </CardContent>
  </Card>
)

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      const data = await response.json()
      
      // Convert date strings to Date objects
      const projectsWithDates = data.map((project: any) => ({
        ...project,
        deadline: project.deadline ? new Date(project.deadline) : null,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
      }))
      
      setProjects(projectsWithDates)
    } catch (error) {
      console.error("Error fetching projects:", error)
      setError("Erreur lors du chargement des projets")
    } finally {
      setLoading(false)
    }
  }

  const currentProjects = projects.filter(project => !project.isFinished)
  const successStories = projects.filter(project => project.isFinished)

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
                Projets Actuels ({currentProjects.length})
              </TabsTrigger>
              <TabsTrigger value="success" className="rounded-xl">
                Réussites ({successStories.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Projets en cours</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Soutenez nos initiatives actuelles et contribuez à leur réussite
                </p>
              </div>

              {error ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={fetchProjects} variant="outline">
                      Réessayer
                    </Button>
                  </CardContent>
                </Card>
              ) : loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <ProjectCardSkeleton key={index} />
                  ))}
                </div>
              ) : currentProjects.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun projet en cours</h3>
                    <p className="text-muted-foreground">
                      Nouveaux projets à venir bientôt
                    </p>
                  </CardContent>
                </Card>
              ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {currentProjects.map((project) => {
                    const needs = project.needs ? JSON.parse(project.needs) : []
                    
                    return (
                  <Card key={project.id} className="shadow-lg rounded-2xl border-0 bg-white overflow-hidden">
                    <div className="relative">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-48 object-cover"
                            loading="lazy"
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
                                {project.deadline 
                                  ? Math.max(0, Math.ceil(
                                      (project.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                                    ))
                                  : "∞"
                                }
                                {project.deadline ? "j" : ""}
                          </div>
                              <div className="text-xs text-muted-foreground">
                                {project.deadline ? "Restants" : "Pas de limite"}
                              </div>
                        </div>
                      </div>

                      {/* Impact */}
                          {project.impact && (
                      <div className="bg-green-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Impact
                        </h4>
                        <p className="text-sm text-green-700">{project.impact}</p>
                      </div>
                          )}

                      {/* Needs */}
                          {needs.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Besoins actuels:</h4>
                        <div className="flex flex-wrap gap-1">
                                {needs.slice(0, 3).map((need: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {need}
                            </Badge>
                          ))}
                                {needs.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{needs.length - 3}
                                  </Badge>
                                )}
                        </div>
                      </div>
                          )}

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
                    )
                  })}
              </div>
              )}

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

              {loading ? (
                <div className="space-y-8">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="shadow-lg rounded-2xl border-0 bg-white overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Skeleton className="w-full h-[300px]" />
                        <div className="p-6 space-y-4">
                          <Skeleton className="h-8 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                          <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                          </div>
                          <Skeleton className="h-20 w-full" />
                          <Skeleton className="h-16 w-full" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : successStories.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun projet terminé</h3>
                    <p className="text-muted-foreground">
                      Les projets terminés apparaîtront ici
                    </p>
                  </CardContent>
                </Card>
              ) : (
              <div className="space-y-8">
                  {successStories.map((story) => {
                    const testimonial = story.testimonial ? JSON.parse(story.testimonial) : null
                    
                    return (
                  <Card key={story.id} className="shadow-lg rounded-2xl border-0 bg-white overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="relative">
                        <img
                          src={story.image || "/placeholder.svg"}
                          alt={story.title}
                          className="w-full h-full object-cover min-h-[300px]"
                              loading="lazy"
                        />
                            <Badge className="absolute top-4 left-4 bg-green-600">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Terminé
                            </Badge>
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
                                  {(story.totalRaised || story.raised).toLocaleString()}€
                            </div>
                            <div className="text-sm text-green-700">Fonds levés</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-xl">
                            <div className="text-2xl font-bold text-blue-600">{story.contributors}</div>
                            <div className="text-sm text-blue-700">Contributeurs</div>
                          </div>
                        </div>

                        {/* Impact */}
                            {story.impact && (
                        <div className="bg-muted/50 p-4 rounded-xl">
                          <h4 className="font-semibold mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Impact réalisé
                          </h4>
                          <p className="text-sm text-muted-foreground">{story.impact}</p>
                        </div>
                            )}

                        {/* Testimonial */}
                            {testimonial && (
                        <div className="border-l-4 border-primary pl-4">
                                <p className="italic text-muted-foreground mb-2">"{testimonial.text}"</p>
                                <p className="text-sm font-medium">— {testimonial.author}</p>
                        </div>
                            )}
                      </div>
                    </div>
                  </Card>
                    )
                  })}
              </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
