import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar, Users, Target, Award, Heart } from "lucide-react"

const timelineEvents = [
  {
    year: "2010",
    title: "Création de l'association",
    description: "Fondation par la première promotion de diplômés avec 25 membres fondateurs",
  },
  {
    year: "2015",
    title: "Premier projet social",
    description: "Lancement du programme de bourses d'études pour étudiants méritants",
  },
  {
    year: "2018",
    title: "Expansion internationale",
    description: "Ouverture de chapitres dans 5 pays avec plus de 200 membres",
  },
  {
    year: "2020",
    title: "Transformation digitale",
    description: "Lancement de la plateforme en ligne et des événements virtuels",
  },
  {
    year: "2024",
    title: "Nouvelle ère",
    description: "Plus de 500 membres actifs et 15 projets communautaires en cours",
  },
]

const teamMembers = [
  {
    name: "Dr. Marie Dubois",
    role: "Présidente",
    promo: "Promo 2008",
    image: "https://placehold.co/200x200",
    description: "Directrice Innovation chez TechCorp",
  },
  {
    name: "Jean-Pierre Martin",
    role: "Vice-Président",
    promo: "Promo 2010",
    image: "https://placehold.co/200x200",
    description: "Consultant en Management",
  },
  {
    name: "Sarah Johnson",
    role: "Secrétaire Générale",
    promo: "Promo 2012",
    image: "https://placehold.co/200x200",
    description: "Avocate d'affaires",
  },
  {
    name: "Ahmed Ben Ali",
    role: "Trésorier",
    promo: "Promo 2009",
    image: "https://placehold.co/200x200",
    description: "Directeur Financier",
  },
]

const objectives = [
  {
    icon: Users,
    title: "Networking Professionnel",
    description: "Faciliter les connexions entre diplômés pour créer des opportunités d'affaires et de collaboration",
  },
  {
    icon: Target,
    title: "Développement de Carrière",
    description: "Accompagner nos membres dans leur évolution professionnelle à travers le mentorat et la formation",
  },
  {
    icon: Heart,
    title: "Solidarité et Entraide",
    description: "Soutenir les membres en difficulté et promouvoir l'esprit de solidarité de notre communauté",
  },
  {
    icon: Award,
    title: "Excellence Académique",
    description: "Maintenir les liens avec l'université et soutenir l'excellence de la formation",
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Notre Histoire
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              À propos de notre
              <span className="text-primary"> Association</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Découvrez l'histoire, la mission et les valeurs qui animent notre communauté d'anciens étudiants depuis
              plus de 14 ans
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Notre Parcours</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une histoire de croissance, d'innovation et de solidarité
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 h-full w-0.5 bg-primary/20"></div>

              {timelineEvents.map((event, index) => (
                <div
                  key={index}
                  className={`relative flex items-center mb-12 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                    <Card className="shadow-lg rounded-2xl border-0 bg-white">
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline" className="text-primary border-primary">
                            {event.year}
                          </Badge>
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">{event.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Objectifs</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Les piliers qui guident notre action au quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {objectives.map((objective, index) => (
              <Card key={index} className="shadow-lg rounded-2xl border-0 bg-white">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <objective.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{objective.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{objective.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Notre Bureau</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              L'équipe dirigeante qui œuvre pour le développement de notre communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center shadow-lg rounded-2xl border-0 bg-white overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-24 h-24 rounded-2xl overflow-hidden mb-4">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <Badge variant="secondary" className="mx-auto w-fit">
                    {member.role}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-primary font-medium">{member.promo}</p>
                  <CardDescription className="text-sm">{member.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Documents Officiels</h2>
            <p className="text-xl opacity-90">
              Consultez nos statuts et règlements pour mieux comprendre notre fonctionnement
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-2xl">
                <Download className="mr-2 h-5 w-5" />
                Télécharger les Statuts
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-2xl border-white text-white hover:bg-white hover:text-primary"
              >
                <Download className="mr-2 h-5 w-5" />
                Règlement Intérieur
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
