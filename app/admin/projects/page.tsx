"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { measurePerformance, PerformanceMonitor } from "@/lib/performance"
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
  CheckCircle,
  RefreshCw,
  X
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

interface ApiError extends Error {
  status: number
}

class ProjectsApiClient {
  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const endTimer = measurePerformance(`API: ${options.method || 'GET'} ${url}`)
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const error = new Error(await response.text()) as ApiError
        error.status = response.status
        throw error
      }

      return response.json()
    } finally {
      endTimer()
    }
  }

  async fetchProjects(): Promise<Project[]> {
    const endTimer = measurePerformance('ProjectsApiClient.fetchProjects')
    
    try {
      const data = await this.request<any[]>('/api/projects')
      return data.map((project: any) => ({
        ...project,
        deadline: project.deadline ? new Date(project.deadline) : null,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
      }))
    } finally {
      endTimer()
    }
  }

  async toggleFinished(projectId: string, isFinished: boolean): Promise<void> {
    const endTimer = measurePerformance('ProjectsApiClient.toggleFinished')
    
    try {
      await this.request(`/api/projects/${projectId}/toggle-finished`, {
        method: 'PATCH',
        body: JSON.stringify({ isFinished }),
      })
    } finally {
      endTimer()
    }
  }

  async deleteProject(projectId: string): Promise<void> {
    const endTimer = measurePerformance('ProjectsApiClient.deleteProject')
    
    try {
      await this.request(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })
    } finally {
      endTimer()
    }
  }
}

const projectsApi = new ProjectsApiClient()

// Loading skeleton component
const ProjectCardSkeleton = () => (
  <Card className="shadow-lg rounded-2xl border-0 bg-white overflow-hidden">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Skeleton className="w-full h-48 lg:h-32" />
      <div className="lg:col-span-2 p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-2 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  </Card>
)

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("current")
  const [error, setError] = useState<string | null>(null)
  const [operationLoading, setOperationLoading] = useState<{[key: string]: boolean}>({})
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  
  const { toast, ToastContainer } = useToast()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) setRefreshing(true)
      if (!showRefreshIndicator) setLoading(true)
      
      const projectsData = await projectsApi.fetchProjects()
      setProjects(projectsData)
      setError(null)
    } catch (error) {
      console.error("Error fetching projects:", error)
      setError("Erreur lors du chargement des projets")
    } finally {
      setLoading(false)
      if (showRefreshIndicator) setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchProjects(true)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Only refresh if we don't have data or if there's an error
    if (projects.length === 0 || error) {
      fetchProjects(true)
    }
  }

  const handleToggleFinished = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    if (!project) return

    // Optimistic update
    const newFinishedState = !project.isFinished
    setProjects(prev =>
      prev.map(p =>
        p.id === projectId ? { ...p, isFinished: newFinishedState } : p
      )
    )

    // Set loading state for this specific operation
    setOperationLoading(prev => ({ ...prev, [`toggle-${projectId}`]: true }))

    try {
      await projectsApi.toggleFinished(projectId, newFinishedState)
      toast({
        variant: "success",
        title: "Succès",
        description: `Projet ${newFinishedState ? 'marqué comme terminé' : 'marqué comme en cours'}`
      })
    } catch (error) {
      // Revert optimistic update on error
      setProjects(prev =>
        prev.map(p =>
          p.id === projectId ? { ...p, isFinished: !newFinishedState } : p
        )
      )
      console.error("Error toggling project status:", error)
      setError("Erreur lors de la mise à jour du statut du projet")
      toast({
        variant: "error",
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut du projet"
      })
    } finally {
      setOperationLoading(prev => ({ ...prev, [`toggle-${projectId}`]: false }))
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    // Optimistic update
    setProjects(prev => prev.filter(project => project.id !== projectId))
    
    // Set loading state
    setOperationLoading(prev => ({ ...prev, [`delete-${projectId}`]: true }))

    try {
      await projectsApi.deleteProject(projectId)
      toast({
        variant: "success",
        title: "Succès",
        description: "Projet supprimé avec succès"
      })
    } catch (error) {
      // Refresh data on error to restore state
      fetchProjects()
      console.error("Error deleting project:", error)
      setError("Erreur lors de la suppression du projet")
      toast({
        variant: "error",
        title: "Erreur",
        description: "Erreur lors de la suppression du projet"
      })
    } finally {
      setOperationLoading(prev => ({ ...prev, [`delete-${projectId}`]: false }))
    }
  }

  const currentProjects = projects.filter(project => !project.isFinished)
  const finishedProjects = projects.filter(project => project.isFinished)

  // Debug component for development
  const DebugPanel = () => {
    const [stats, setStats] = useState<Record<string, any>>({})
    
    useEffect(() => {
      const interval = setInterval(() => {
        setStats(PerformanceMonitor.getInstance().getStats())
      }, 1000)
      
      return () => clearInterval(interval)
    }, [])

    if (process.env.NODE_ENV !== 'development' && !showDebugPanel) return null

    return (
      <div className="fixed bottom-4 left-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-bold text-sm">Performance Stats</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowDebugPanel(false)}
            className="text-white hover:bg-gray-800"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-1 text-xs">
          {Object.entries(stats).map(([operation, stat]) => (
            <div key={operation} className="flex justify-between">
              <span className="truncate mr-2">{operation}:</span>
              <span>{stat.latest}ms (avg: {stat.avg}ms)</span>
            </div>
          ))}
          {Object.keys(stats).length === 0 && (
            <div className="text-gray-400">No metrics yet...</div>
          )}
        </div>
      </div>
    )
  }

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
              disabled={operationLoading[`toggle-${project.id}`]}
            >
              {operationLoading[`toggle-${project.id}`] ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              {project.isFinished ? "Marquer en cours" : "Marquer terminé"}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  disabled={operationLoading[`delete-${project.id}`]}
                >
                  {operationLoading[`delete-${project.id}`] ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
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
      <div className="flex flex-col">
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
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-8">
          <div className="container mx-auto px-4 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <ToastContainer />
      <DebugPanel />
      
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
            <div className="flex gap-2">
              {process.env.NODE_ENV === 'development' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDebugPanel(!showDebugPanel)}
                >
                  Debug
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Actualiser
              </Button>
              <Button asChild>
                <Link href="/admin/projects/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau Projet
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Show error banner if there's an error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 mx-4 mt-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setError(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

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