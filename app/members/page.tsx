"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Briefcase, GraduationCap, Quote, Users, Globe } from "lucide-react"

const members = [
  {
    id: 1,
    name: "Dr. Marie Dubois",
    promo: "2008",
    currentRole: "Directrice Innovation",
    company: "TechCorp",
    location: "Paris, France",
    image: "https://placehold.co/150x150",
    expertise: ["Innovation", "Management", "Tech"],
  },
  {
    id: 2,
    name: "Jean-Pierre Martin",
    promo: "2010",
    currentRole: "Consultant Senior",
    company: "McKinsey & Co",
    location: "Londres, UK",
    image: "https://placehold.co/150x150",
    expertise: ["Stratégie", "Consulting", "Finance"],
  },
  {
    id: 3,
    name: "Sarah Johnson",
    promo: "2012",
    currentRole: "Avocate d'affaires",
    company: "Johnson & Associates",
    location: "New York, USA",
    image: "https://placehold.co/150x150",
    expertise: ["Droit", "M&A", "Corporate"],
  },
  {
    id: 4,
    name: "Ahmed Ben Ali",
    promo: "2009",
    currentRole: "Directeur Financier",
    company: "BankCorp",
    location: "Dubai, UAE",
    image: "https://placehold.co/150x150",
    expertise: ["Finance", "Banking", "Investment"],
  },
  {
    id: 5,
    name: "Lisa Chen",
    promo: "2015",
    currentRole: "Product Manager",
    company: "Google",
    location: "San Francisco, USA",
    image: "https://placehold.co/150x150",
    expertise: ["Product", "Tech", "AI"],
  },
  {
    id: 6,
    name: "Pierre Moreau",
    promo: "2011",
    currentRole: "Entrepreneur",
    company: "GreenTech Solutions",
    location: "Lyon, France",
    image: "https://placehold.co/150x150",
    expertise: ["Entrepreneurship", "GreenTech", "Sustainability"],
  },
]

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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPromo, setSelectedPromo] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.currentRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPromo = !selectedPromo || member.promo === selectedPromo
    const matchesLocation = !selectedLocation || member.location.includes(selectedLocation)

    return matchesSearch && matchesPromo && matchesLocation
  })

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
                  <CardTitle className="flex items-center">
                    <Search className="mr-2 h-5 w-5" />
                    Rechercher des membres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                      placeholder="Nom, poste, entreprise..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="rounded-xl"
                    />
                    <Select value={selectedPromo} onValueChange={setSelectedPromo}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Promotion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les promos</SelectItem>
                        <SelectItem value="2008">Promo 2008</SelectItem>
                        <SelectItem value="2009">Promo 2009</SelectItem>
                        <SelectItem value="2010">Promo 2010</SelectItem>
                        <SelectItem value="2011">Promo 2011</SelectItem>
                        <SelectItem value="2012">Promo 2012</SelectItem>
                        <SelectItem value="2015">Promo 2015</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Localisation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les villes</SelectItem>
                        <SelectItem value="Paris">Paris</SelectItem>
                        <SelectItem value="Londres">Londres</SelectItem>
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="Dubai">Dubai</SelectItem>
                        <SelectItem value="San Francisco">San Francisco</SelectItem>
                        <SelectItem value="Lyon">Lyon</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="rounded-xl">Rechercher</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMembers.map((member) => (
                  <Card
                    key={member.id}
                    className="shadow-lg rounded-2xl border-0 bg-white overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto w-20 h-20 rounded-2xl overflow-hidden mb-4">
                        <img
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <Badge variant="outline" className="mx-auto w-fit">
                        Promo {member.promo}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{member.currentRole}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="ml-6">{member.company}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>{member.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {member.expertise.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full rounded-xl" variant="outline">
                        Contacter
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
