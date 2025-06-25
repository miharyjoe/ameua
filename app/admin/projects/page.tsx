"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Target, 
  Users, 
  Clock, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  ArrowLeft,
  DollarSign,
  CheckCircle
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

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        // Convert date strings to Date objects
        const projectsWithDates = data.map((project: any) => ({
          ...project,
          deadline: project.deadline ? new Date(project.deadline) : null,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt),
        }))
        setProjects(projectsWithDates)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFinished = async (projectId: string) => {
    try {
      const project = projects.find(p => p.id === projectId)
      if (!project) return

      const formData = new FormData()
      
      // Add all current project fields
      formData.append('title', project.title)
      formData.append('description', project.description)
      formData.append('category', project.category)
      formData.append('goal', project.goal.toString())
      formData.append('raised', project.raised.toString())
      formData.append('contributors', project.contributors.toString())
      if (project.deadline) {
        formData.append('deadline', project.deadline.toISOString().split('T')[0])
      }
      formData.append('impact', project.impact || '')
      formData.append('needs', project.needs || '')
      formData.append('isFinished', (!project.isFinished).toString()) // Toggle finished status
      formData.append('testimonial', project.testimonial || '')
      if (project.totalRaised) {
        formData.append('totalRaised', project.totalRaised.toString())
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        body: formData,
      })

      if (response.ok) {
        setProjects(prev =>
          prev.map(project =>
            project.id === projectId ? { ...project, isFinished: !project.isFinished } : project
          )
        )
      }
    } catch (error) {
      console.error("Error toggling project status:", error)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProjects(prev => prev.filter(project => project.id !== projectId))
      }
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const currentProjects = projects.filter(project => !project.isFinished)
  const finishedProjects = projects.filter(project => project.isFinished)

  const ProjectCard = ({ project, isFinished = false }: { project: Project; isFinished?: boolean }) => (
    <Card className="shadow-lg rounded-2xl border-0 bg-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="relative">
          <img
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            className="w-full h-48 lg:h-full object-cover"
          />
          <Badge className="absolute top-4 left-4">{project.category}</Badge>
          {isFinished && (
            <Badge variant="default" className="absolute top-4 right-4 bg-green-600">
              <CheckCircle className="mr-1 h-3 w-3" />
              Terminé
            </Badge>
          )}
        </div>
        
        <div className="lg:col-span-2 p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{project.title}</h3>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          </div>
          
          {/* Progress for current projects */}
          {!isFinished && (
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
          )}

          {/* Stats for finished projects */}
          {isFinished && project.totalRaised && (
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Total levé</p>
                  <p className="text-2xl font-bold text-green-800">
                    {project.totalRaised.toLocaleString()}€
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>
          )}

          {/* Contributors and deadline */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{project.contributors}</div>
              <div className="text-xs text-muted-foreground">Contributeurs</div>
            </div>
            {project.deadline && !isFinished && (
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">
                  <Clock className="h-5 w-5 inline mr-1" />
                  {Math.ceil(
                    (project.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                  )}j
                </div>
                <div className="text-xs text-muted-foreground">Restants</div>
              </div>
            )}
          </div>

          {/* Impact */}
          {project.impact && (
            <div className="bg-blue-50 p-4 rounded-xl">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Impact
              </h4>
              <p className="text-sm text-blue-700">{project.impact}</p>
            </div>
          )}

          {/* Needs for current projects */}
          {!isFinished && project.needs && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Besoins actuels:</h4>
              <div className="flex flex-wrap gap-1">
                {JSON.parse(project.needs).map((need: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {need}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Testimonial for finished projects */}
          {isFinished && project.testimonial && (
            <div className="border-l-4 border-green-500 pl-4">
              <p className="italic text-muted-foreground mb-2">
                "{JSON.parse(project.testimonial).text}"
              </p>
              <p className="text-sm font-medium">— {JSON.parse(project.testimonial).author}</p>
            </div>
          )}
          
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/projects/${project.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Voir
              </Link>
            </Button>
            
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/projects/${project.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleToggleFinished(project.id)}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {project.isFinished ? "Marquer en cours" : "Marquer terminé"}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer le projet ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Le projet sera définitivement supprimé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleDeleteProject(project.id)}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Chargement des projets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-8 bg-gradient-to-br from-green-50 to-emerald-100">
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
                <h1 className="text-3xl font-bold">Gestion des Projets</h1>
                <p className="text-muted-foreground">Gérez vos projets en cours et terminés</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/admin/projects/create">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Projet
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="current">
                Projets en cours ({currentProjects.length})
              </TabsTrigger>
              <TabsTrigger value="finished">
                Projets terminés ({finishedProjects.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-6">
              {currentProjects.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun projet en cours</h3>
                    <p className="text-muted-foreground mb-4">
                      Commencez par créer votre premier projet
                    </p>
                    <Button asChild>
                      <Link href="/admin/projects/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Créer un projet
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                currentProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              )}
            </TabsContent>

            <TabsContent value="finished" className="space-y-6">
              {finishedProjects.length === 0 ? (
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
                finishedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} isFinished />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
} 