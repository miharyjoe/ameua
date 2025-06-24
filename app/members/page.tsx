"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Briefcase, GraduationCap, Quote, Users, Globe, ChevronLeft, ChevronRight, Mail, Phone, Linkedin, Facebook } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Member } from "@/types/member"

interface PaginationData {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}



const testimonials = [
  {
    name: "Dr. Marie Dubois",
    role: "Directrice Innovation chez TechCorp",
    promo: "Promo 2008",
    quote:
      "L'association m'a permis de développer un réseau international exceptionnel. Les connexions que j'ai établies ont été déterminantes pour ma carrière.",
    image: "https://placehold.co/100x100",
  },
  {
    name: "Jean-Pierre Martin",
    role: "Consultant Senior chez McKinsey",
    promo: "Promo 2010",
    quote:
      "Le mentorat que j'ai reçu de la part d'anciens diplômés m'a aidé à naviguer les défis de ma carrière. Aujourd'hui, je rends la pareille en accompagnant les jeunes.",
    image: "https://placehold.co/100x100",
  },
  {
    name: "Sarah Johnson",
    role: "Avocate d'affaires",
    promo: "Promo 2012",
    quote:
      "Participer aux projets de l'association m'a donné l'opportunité de contribuer à des causes qui me tiennent à cœur tout en développant mes compétences de leadership.",
    image: "https://placehold.co/100x100",
  },
]

export default function MembersPage() {
  const [searchName, setSearchName] = useState("")
  const [searchCompany, setSearchCompany] = useState("")
  const [searchRole, setSearchRole] = useState("")
  const [selectedPromo, setSelectedPromo] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 12,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [currentPage, setCurrentPage] = useState(1)

  // Memoized search params to prevent unnecessary re-renders
  const searchParams = useMemo(() => ({
    name: searchName.trim(),
    company: searchCompany.trim(),
    role: searchRole.trim(),
    promotion: selectedPromo.trim(),
    location: selectedLocation.trim(),
    page: currentPage,
  }), [searchName, searchCompany, searchRole, selectedPromo, selectedLocation, currentPage])

  // Fetch members from API with optimized error handling
  const fetchMembers = useCallback(async (params: typeof searchParams) => {
    try {
      setLoading(true)
      setError(null)
      
      const urlParams = new URLSearchParams()
      // Only append non-empty parameters
      if (params.name) urlParams.append('name', params.name)
      if (params.company) urlParams.append('company', params.company)
      if (params.role) urlParams.append('role', params.role)
      if (params.promotion) urlParams.append('promotion', params.promotion)
      if (params.location) urlParams.append('location', params.location)
      urlParams.append('page', params.page.toString())
      urlParams.append('limit', '12')

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      const response = await fetch(`/api/members?${urlParams}`, {
        cache: 'no-cache',
        headers: { 
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      setMembers(data.members || [])
      setPagination(data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 12,
        hasNextPage: false,
        hasPrevPage: false,
      })
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Request timeout - please try again')
        } else {
          setError(error.message || 'Failed to fetch members')
        }
      } else {
        setError('Network error')
      }
      console.error('Fetch members error:', error)
      
      // Set empty state on error
      setMembers([])
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 12,
        hasNextPage: false,
        hasPrevPage: false,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced fetch for better UX - only for text inputs
  useEffect(() => {
    const hasTextInput = searchName || searchCompany || searchRole || selectedLocation
    const delay = hasTextInput ? 300 : 0 // Only debounce text inputs, not pagination
    
    const timer = setTimeout(() => {
      fetchMembers(searchParams)
    }, delay)

    return () => clearTimeout(timer)
  }, [searchParams, fetchMembers])

  // Reset to page 1 when filters change (but not on initial load)
  useEffect(() => {
    const hasFilters = searchName || searchCompany || searchRole || selectedPromo || selectedLocation
    const shouldReset = hasFilters && currentPage !== 1
    
    if (shouldReset) {
      setCurrentPage(1)
    }
  }, [searchName, searchCompany, searchRole, selectedPromo, selectedLocation, currentPage])

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page)
    }
  }



  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Users className="mr-2 h-4 w-4" />
              Espace Membres
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              Notre
              <span className="text-primary"> Communauté</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Découvrez les membres de notre réseau, leurs parcours inspirants et connectez-vous avec des professionnels
              de votre domaine
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="directory" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 rounded-2xl">
              <TabsTrigger value="directory" className="rounded-xl">
                Annuaire
              </TabsTrigger>
              <TabsTrigger value="map" className="rounded-xl">
                Carte
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="rounded-xl">
                Témoignages
              </TabsTrigger>
            </TabsList>

            <TabsContent value="directory" className="space-y-8">
              {/* Filters */}
              <Card className="shadow-lg rounded-2xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Search className="mr-2 h-5 w-5" />
                      Rechercher des membres
                    </div>
                    {loading && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Recherche...
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="searchName" className="text-sm font-medium">Nom</Label>
                      <Input
                        id="searchName"
                        placeholder="Rechercher par nom..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="searchCompany" className="text-sm font-medium">Entreprise</Label>
                      <Input
                        id="searchCompany"
                        placeholder="Rechercher par entreprise..."
                        value={searchCompany}
                        onChange={(e) => setSearchCompany(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="searchRole" className="text-sm font-medium">Poste</Label>
                      <Input
                        id="searchRole"
                        placeholder="Rechercher par poste..."
                        value={searchRole}
                        onChange={(e) => setSearchRole(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="selectedPromo" className="text-sm font-medium">Promotion</Label>
                      <Input
                        id="selectedPromo"
                        placeholder="ex: 2015"
                        value={selectedPromo}
                        onChange={(e) => setSelectedPromo(e.target.value)}
                        className="rounded-xl"
                        type="number"
                        min="1990"
                        max="2030"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="selectedLocation" className="text-sm font-medium">Localisation</Label>
                      <Input
                        id="selectedLocation"
                        placeholder="ex: Paris"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2 flex items-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchName("")
                          setSearchCompany("")
                          setSearchRole("")
                          setSelectedPromo("")
                          setSelectedLocation("")
                          setCurrentPage(1) // Reset to first page when clearing filters
                        }}
                        className="w-full rounded-xl"
                        disabled={!searchName && !searchCompany && !searchRole && !selectedPromo && !selectedLocation}
                      >
                        Effacer les filtres
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <Card className="shadow-lg rounded-2xl border-0 border-red-200 bg-red-50">
                  <CardContent className="text-center py-12">
                    <div className="text-red-600 mb-4 space-y-2">
                      <div className="text-lg font-medium">Erreur de chargement</div>
                      <p className="text-sm">{error}</p>
                    </div>
                    <div className="space-x-2">
                      <Button 
                        onClick={() => fetchMembers(searchParams)} 
                        variant="outline"
                        className="rounded-xl"
                      >
                        Réessayer
                      </Button>
                      <Button 
                        onClick={() => {
                          setSearchName("")
                          setSearchCompany("")
                          setSearchRole("")
                          setSelectedPromo("")
                          setSelectedLocation("")
                          setCurrentPage(1)
                        }} 
                        variant="secondary"
                        className="rounded-xl"
                      >
                        Réinitialiser
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Members Grid */}
              {!loading && !error && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {members.length === 0 ? (
                      <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground">Aucun membre trouvé</p>
                      </div>
                    ) : (
                      members.map((member) => (
                  <Card
                    key={member.id}
                    className="shadow-md rounded-xl border-0 bg-white overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.01]"
                  >
                    {/* Compact Header */}
                    <div className="p-4 pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-gray-100 flex-shrink-0">
                          {member.image && member.image !== "/placeholder.svg" ? (
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                              <div className="text-sm font-bold text-blue-600">
                                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">{member.name}</h3>
                          <Badge variant="outline" className="text-xs mt-1 px-2 py-0.5">
                            Promo {member.promo}
                          </Badge>
                        </div>
                        {/* Social Icons */}
                        <div className="flex space-x-1">
                          {member.linkedin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                              asChild
                            >
                              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                                <Linkedin className="h-3.5 w-3.5" />
                              </a>
                            </Button>
                          )}
                          {member.facebook && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                              asChild
                            >
                              <a href={member.facebook} target="_blank" rel="noopener noreferrer" title="Facebook">
                                <Facebook className="h-3.5 w-3.5" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 pb-4 space-y-3">
                      {/* Professional Info */}
                      <div className="space-y-2">
                        <div className="flex items-center text-xs">
                          <Briefcase className="h-3 w-3 text-blue-600 mr-2 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 truncate">{member.currentRole}</div>
                            <div className="text-gray-600 truncate">{member.company}</div>
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                          <span className="truncate">{member.location}</span>
                        </div>
                      </div>

                      {/* Bio - Compact */}
                      {member.bio && (
                        <div className="text-xs text-gray-700 line-clamp-2 leading-relaxed">
                          {member.bio}
                        </div>
                      )}

                      {/* Expertise - Compact */}
                      {member.expertise.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {member.expertise.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0.5 rounded-md">
                              {skill}
                            </Badge>
                          ))}
                          {member.expertise.length > 2 && (
                            <Badge variant="outline" className="text-xs px-1.5 py-0.5 rounded-md">
                              +{member.expertise.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Contact Button - Compact */}
                      <div className="pt-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="w-full rounded-lg font-medium py-2 text-xs" variant="outline">
                              <Mail className="mr-1.5 h-3 w-3" />
                              Contacter
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56 rounded-lg" align="center">
                            <DropdownMenuLabel className="font-medium text-sm py-2">Contact</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="p-0">
                              <a href={`mailto:${member.email}`} className="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded-md mx-1 my-0.5">
                                <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center mr-2">
                                  <Mail className="h-3 w-3 text-blue-600" />
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                  <span className="font-medium text-xs">Email</span>
                                  <span className="text-xs text-muted-foreground truncate">
                                    {member.email}
                                  </span>
                                </div>
                              </a>
                            </DropdownMenuItem>
                            {member.phone && (
                              <DropdownMenuItem asChild className="p-0">
                                <a href={`tel:${member.phone}`} className="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded-md mx-1 my-0.5">
                                  <div className="w-6 h-6 rounded-md bg-green-50 flex items-center justify-center mr-2">
                                    <Phone className="h-3 w-3 text-green-600" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-xs">Téléphone</span>
                                    <span className="text-xs text-muted-foreground">
                                      {member.phone}
                                    </span>
                                  </div>
                                </a>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                      ))
                    )}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="rounded-xl"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Précédent
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          let pageNum
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1
                          } else if (currentPage <= 3) {
                            pageNum = i + 1
                          } else if (currentPage >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i
                          } else {
                            pageNum = currentPage - 2 + i
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className="rounded-xl w-10"
                            >
                              {pageNum}
                            </Button>
                          )
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className="rounded-xl"
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}

                  {/* Results summary */}
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    Affichage de {((currentPage - 1) * pagination.limit) + 1} à{' '}
                    {Math.min(currentPage * pagination.limit, pagination.totalCount)} sur{' '}
                    {pagination.totalCount} membres
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="map" className="space-y-8">
              <Card className="shadow-lg rounded-2xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    Carte des Membres
                  </CardTitle>
                  <CardDescription>Découvrez où se trouvent nos membres à travers le monde</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-muted rounded-2xl flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Globe className="h-16 w-16 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">
                        Carte interactive des membres (à implémenter avec une API de cartes)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center shadow-lg rounded-2xl border-0">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-primary">150</div>
                    <div className="text-sm text-muted-foreground">France</div>
                  </CardContent>
                </Card>
                <Card className="text-center shadow-lg rounded-2xl border-0">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-primary">80</div>
                    <div className="text-sm text-muted-foreground">Europe</div>
                  </CardContent>
                </Card>
                <Card className="text-center shadow-lg rounded-2xl border-0">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-primary">120</div>
                    <div className="text-sm text-muted-foreground">Amérique du Nord</div>
                  </CardContent>
                </Card>
                <Card className="text-center shadow-lg rounded-2xl border-0">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-primary">150</div>
                    <div className="text-sm text-muted-foreground">Autres</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Témoignages Inspirants</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Découvrez comment notre réseau a transformé la carrière de nos membres
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="shadow-lg rounded-2xl border-0 bg-white">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden">
                          <img
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {testimonial.promo}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start">
                        <Quote className="h-6 w-6 text-primary mr-2 mt-1 flex-shrink-0" />
                        <p className="text-muted-foreground italic">{testimonial.quote}</p>
                      </div>
                      <div className="text-sm font-medium text-primary">{testimonial.role}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Rejoignez Notre Réseau</h2>
            <p className="text-xl opacity-90">
              Vous êtes diplômé de notre université ? Inscrivez-vous dès maintenant pour faire partie de cette
              communauté exceptionnelle
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-2xl" asChild>
              <a href="/members/register">
                <GraduationCap className="mr-2 h-5 w-5" />
                S'inscrire maintenant
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
