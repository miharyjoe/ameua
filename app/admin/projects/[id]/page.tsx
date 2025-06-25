"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Target, 
  Users, 
  DollarSign, 
  Clock, 
  ArrowLeft, 
  Edit, 
  CheckCircle,
  Trash2,
  TrendingUp
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

interface ProjectViewProps {
  params: Promise<{ id: string }>
}

export default function ProjectView({ params }: ProjectViewProps) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showFinishDialog, setShowFinishDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  // Resolve params on component mount
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (resolvedParams?.id) {
      fetchProject()
    }
  }, [resolvedParams])

  const fetchProject = async () => {
    if (!resolvedParams?.id) return
    
    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}`)
      if (response.ok) {
        const projectData = await response.json()
        setProject({
          ...projectData,
          deadline: projectData.deadline ? new Date(projectData.deadline) : null,
          createdAt: new Date(projectData.createdAt),
          updatedAt: new Date(projectData.updatedAt),
        })
      }
    } catch (error) {
      console.error("Error fetching project:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!resolvedParams?.id) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push("/admin/projects")
      } else {
        alert('Erreur lors de la suppression du projet')
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      alert('Erreur lors de la suppression du projet')
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleToggleFinished = async () => {
    if (!project || !resolvedParams?.id) return
    
    setIsToggling(true)
    try {
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
      
      const response = await fetch(`/api/projects/${resolvedParams.id}`, {
        method: 'PUT',
        body: formData,
      })

      if (response.ok) {
        setProject(prev => prev ? { ...prev, isFinished: !prev.isFinished } : null)
      } else {
        alert('Erreur lors de la modification du statut')
      }
    } catch (error) {
      console.error("Error updating project:", error)
      alert('Erreur lors de la modification du statut')
    } finally {
      setIsToggling(false)
      setShowFinishDialog(false)
    }
  }

  if (loading || !resolvedParams) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Chargement du projet...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Projet non trouvé</h1>
          <p className="text-muted-foreground mb-4">Le projet que vous recherchez n'existe pas.</p>
          <Button asChild>
            <Link href="/admin/projects">Retour aux projets</Link>
          </Button>
        </div>
      </div>
    )
  }

  const needs = project.needs ? JSON.parse(project.needs) : []
  const testimonial = project.testimonial ? JSON.parse(project.testimonial) : null

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-8 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/projects">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour aux projets
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={project.isFinished ? "default" : "secondary"} className={project.isFinished ? "bg-green-600" : ""}>
                    {project.isFinished ? (
                      <>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Terminé
                      </>
                    ) : (
                      "En cours"
                    )}
                  </Badge>
                  <Badge variant="outline">{project.category}</Badge>
                </div>
                <h1 className="text-3xl font-bold">{project.title}</h1>
                <p className="text-muted-foreground">
                  Créé le {project.createdAt.toLocaleDateString("fr-FR")} • 
                  Modifié le {project.updatedAt.toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/admin/projects/${resolvedParams.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFinishDialog(true)}
                disabled={isToggling}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {project.isFinished ? "Marquer en cours" : "Marquer terminé"}
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
              {/* Project Image */}
              {project.image && (
                <Card>
                  <CardContent className="p-0">
                    <img
                      src={project.image}
                      alt={project.title}
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
                    {project.description}
                  </p>
                </CardContent>
              </Card>

              {/* Impact */}
              {project.impact && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{project.impact}</p>
                  </CardContent>
                </Card>
              )}

              {/* Needs (for current projects) */}
              {!project.isFinished && needs.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Besoins actuels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {needs.map((need: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {need}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Testimonial (for finished projects) */}
              {project.isFinished && testimonial && (
                <Card>
                  <CardHeader>
                    <CardTitle>Témoignage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-l-4 border-green-500 pl-4">
                      <p className="italic text-muted-foreground mb-2">
                        "{testimonial.text}"
                      </p>
                      <p className="text-sm font-medium">— {testimonial.author}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques du projet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!project.isFinished ? (
                    <>
                      {/* Progress for current projects */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Progression</span>
                          <span className="text-muted-foreground">
                            {Math.round((project.raised / project.goal) * 100)}%
                          </span>
                        </div>
                        <Progress value={(project.raised / project.goal) * 100} className="h-3" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {project.raised.toLocaleString()}€
                          </div>
                          <div className="text-xs text-blue-700">Levés</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {project.goal.toLocaleString()}€
                          </div>
                          <div className="text-xs text-green-700">Objectif</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    project.totalRaised && (
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-800">
                          {project.totalRaised.toLocaleString()}€
                        </div>
                        <div className="text-sm text-green-700">Total levé</div>
                      </div>
                    )
                  )}
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Contributeurs</span>
                    </div>
                    <span className="font-bold">{project.contributors}</span>
                  </div>
                  
                  {project.deadline && !project.isFinished && (
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-sm text-orange-700">Date limite</span>
                      </div>
                      <span className="font-bold text-orange-800">
                        {project.deadline.toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href={`/admin/projects/${resolvedParams.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier le projet
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowFinishDialog(true)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {project.isFinished ? "Marquer en cours" : "Marquer terminé"}
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
              Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
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

      {/* Toggle Finished Confirmation Dialog */}
      <AlertDialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {project.isFinished ? "Marquer le projet en cours" : "Marquer le projet terminé"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {project.isFinished 
                ? "Voulez-vous marquer ce projet comme étant en cours ? Il apparaîtra dans les projets actuels."
                : "Voulez-vous marquer ce projet comme terminé ? Il apparaîtra dans les réussites."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleFinished}
              disabled={isToggling}
            >
              {isToggling 
                ? "Modification..." 
                : project.isFinished 
                  ? "Marquer en cours" 
                  : "Marquer terminé"
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 