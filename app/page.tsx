import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { 
  Users, 
  Target, 
  Heart, 
  Award, 
  ArrowRight, 
  Play, 
  Star, 
  Quote, 
  Calendar,
  MapPin,
  Briefcase,
  TrendingUp,
  Globe,
  Building,
  GraduationCap,
  MessageCircle,
  Search,
  Mail,
  ExternalLink,
  Clock,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Alumni Success Stories Data
const successStories = [
  {
    name: "Dr. Hery Rajaonson",
    role: "Directeur Général BCM",
    promotion: "Promotion 1998",
    image: "/images/univ1.jpeg",
    quote: "La formation en économie à l'Université d'Antananarivo m'a donné les bases solides pour comprendre les enjeux macroéconomiques de Madagascar.",
    achievement: "A dirigé la transformation digitale du secteur bancaire malgache"
  },
  {
    name: "Miora Razafy",
    role: "Ministre de l'Économie",
    promotion: "Promotion 2005",
    image: "/images/univ2.jpeg",
    quote: "L'excellence académique et l'esprit de solidarité appris dans cette mention continuent de guider mes décisions politiques.",
    achievement: "Première femme ministre de l'Économie de Madagascar"
  },
  {
    name: "Jean-Claude Andrianasolo",
    role: "CEO StartupMada",
    promotion: "Promotion 2010",
    image: "/images/univ3.jpeg",
    quote: "L'innovation et l'entrepreneuriat étaient déjà encouragés dans nos cours. Aujourd'hui, je forme la nouvelle génération d'entrepreneurs.",
    achievement: "A créé 3  entreprises qui emploient plus de 500 personnes"
  },
  {
    name: "John Doe",
    role: "CEO John",
    promotion: "Promotion 2010",
    image: "/images/univ3.jpeg",
    quote: "L'innovation et l'entrepreneuriat étaient déjà encouragés dans nos cours. Aujourd'hui, je forme la nouvelle génération d'entrepreneurs.",
    achievement: "A créé 4 entreprises qui emploient plus de 500 personnes"
  }
]

// Recent News Data
const recentNews = [
  {
    type: "Événement",
    title: "Conférence sur l'Économie Numérique",
    date: "15 Mars 2024",
    location: "Amphi 500, Campus Ankatso",
    description: "Table ronde avec nos alumni leaders du secteur tech et numérique",
    isUpcoming: true
  },
  {
    type: "Succès",
    title: "Prix d'Excellence Académique",
    date: "10 Mars 2024",
    location: "Université d'Antananarivo",
    description: "La Mention Économie remporte le prix de la meilleure formation en sciences économiques",
    isUpcoming: false
  },
  {
    type: "Projet",
    title: "Lancement du Programme de Mentorat",
    date: "8 Mars 2024",
    location: "En ligne",
    description: "50 alumni expérimentés accompagnent les nouveaux diplômés dans leur insertion professionnelle",
    isUpcoming: false
  },
  {
    type: "Anniversaire",
    title: "Préparatifs du 60ème Anniversaire",
    date: "5 Mars 2024",
    location: "Comité d'organisation",
    description: "Formation des équipes pour l'organisation de la grande célébration de décembre 2024",
    isUpcoming: false
  }
]

// Quick Actions Data
const quickActions = [
  {
    title: "Annuaire Alumni",
    description: "Trouvez et connectez-vous avec vos anciens camarades",
    icon: Search,
    href: "/members",
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "Offres d'Emploi",
    description: "Découvrez les opportunités partagées par notre réseau",
    icon: Briefcase,
    href: "/jobs",
    color: "from-green-500 to-green-600"
  },
  {
    title: "Mentorat",
    description: "Trouvez un mentor ou devenez mentor",
    icon: Users,
    href: "/mentoring",
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "Événements à Venir",
    description: "Inscrivez-vous aux prochains événements",
    icon: Calendar,
    href: "/events",
    color: "from-orange-500 to-orange-600"
  }
]

// Partners Data
const partners = [
  {
    category: "Institutions Financières",
    partners: [
      {
        name: "BOA Madagascar",
        description: "Banque de premier plan offrant des opportunités de carrière",
        type: "Banque",
        website: "https://www.boa.mg"
      },
      {
        name: "BNI Madagascar",
        description: "Partenaire historique pour l'insertion professionnelle",
        type: "Banque",
        website: "https://www.bni.mg"
      },
      {
        name: "Société Générale Madagascar",
        description: "Collaborations en formations et recrutement",
        type: "Banque",
        website: "https://www.societegenerale.mg"
      }
    ]
  },
  {
    category: "Secteur Public & Institutions",
    partners: [
      {
        name: "Ministère de l'Économie et des Finances",
        description: "Partenaire institutionnel pour les politiques économiques",
        type: "Institution",
        website: "#"
      },
      {
        name: "INSTAT Madagascar",
        description: "Collaboration en recherche et statistiques économiques",
        type: "Institut",
        website: "https://www.instat.mg"
      },
      {
        name: "Banque Centrale de Madagascar",
        description: "Expertise en politique monétaire et financière",
        type: "Institution",
        website: "https://www.banky-foiben.mg"
      }
    ]
  },
  {
    category: "Entreprises & Multinationales",
    partners: [
      {
        name: "Orange Madagascar",
        description: "Innovation technologique et transformation digitale",
        type: "Télécommunications",
        website: "https://www.orange.mg"
      },
      {
        name: "Total Energies Madagascar",
        description: "Secteur énergétique et développement durable",
        type: "Énergie",
        website: "https://www.total.mg"
      },
      {
        name: "QMM (QIT Madagascar Minerals)",
        description: "Exploitation minière responsable et économie locale",
        type: "Mines",
        website: "#"
      }
    ]
  },
  {
    category: "Organisations Internationales",
    partners: [
      {
        name: "Banque Mondiale",
        description: "Projets de développement économique et social",
        type: "Organisation Internationale",
        website: "https://www.worldbank.org"
      },
      {
        name: "BAD (Banque Africaine de Développement)",
        description: "Financement du développement africain",
        type: "Institution Financière",
        website: "https://www.afdb.org"
      },
      {
        name: "PNUD Madagascar",
        description: "Programmes de développement humain durable",
        type: "Agence ONU",
        website: "https://www.undp.org"
      }
    ]
  }
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center hero-gradient">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('/images/univ1.jpeg')`,
          }}
        />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              60 ans d'Excellence • 1964-2024
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Ensemble vers l'
              <span className="text-primary">Excellence</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Rejoignez notre communauté d'anciens étudiants de la Mention Économie et construisons ensemble un avenir brillant
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 rounded-2xl shadow-lg" asChild>
                <Link href="/members/register">
                  <Users className="mr-2 h-5 w-5" />
                  Rejoindre l'Alumni
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-2xl bg-white/80 backdrop-blur"
                asChild
              >
                <Link href="/contact">
                  Nous contacter
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Hub */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Actions Rapides</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Accédez rapidement aux services les plus demandés par notre communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {quickActions.map((action, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                <Link href={action.href} className="block">
                  <div className={`h-2 bg-gradient-to-r ${action.color}`}></div>
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto h-16 w-16 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-sm">
                      {action.description}
                    </CardDescription>
                    <div className="flex items-center justify-center mt-4 text-sm text-primary group-hover:text-primary/80">
                      Accéder <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Success Stories */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-6 w-6 text-yellow-500" />
              <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                Témoignages
              </Badge>
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Alumni Inspirants</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez les parcours exceptionnels de nos anciens étudiants qui façonnent l'économie malgache
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {successStories.map((story, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full shadow-lg border-0 bg-white overflow-hidden">
                      <CardHeader className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                          <Image
                            src={story.image}
                            alt={story.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardTitle className="text-xl text-blue-900">{story.name}</CardTitle>
                        <Badge variant="secondary" className="w-fit mx-auto">
                          {story.promotion}
                        </Badge>
                        <p className="text-sm font-medium text-primary">{story.role}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="relative">
                          <Quote className="absolute -top-2 -left-2 h-6 w-6 text-blue-200" />
                          <p className="text-sm text-gray-600 italic pl-4">
                            "{story.quote}"
                          </p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-xs text-blue-800 font-medium">
                            <Award className="inline h-4 w-4 mr-1" />
                            {story.achievement}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12" />
              <CarouselNext className="hidden md:flex -right-12" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Notre Mission</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Créer un réseau solide d'entraide et de développement professionnel pour tous nos diplômés
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center shadow-lg rounded-2xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Networking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Connectez-vous avec des professionnels de votre domaine et élargissez votre réseau
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg rounded-2xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Mentorat</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Bénéficiez de l'expérience de nos anciens ou devenez mentor pour les nouveaux diplômés
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg rounded-2xl border-0 bg-gradient-to-br from-purple-50 to-violet-50">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Solidarité</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Soutenez les projets communautaires et participez à des initiatives sociales
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg rounded-2xl border-0 bg-gradient-to-br from-orange-50 to-red-50">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Célébrez les réussites et inspirez les futures générations d'étudiants
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent News & Events */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="h-6 w-6 text-blue-600" />
              <Badge variant="outline" className="border-blue-600 text-blue-700">
                Actualités
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Dernières Nouvelles</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Restez informé des derniers événements, succès et projets de notre communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {recentNews.map((news, index) => (
              <Card key={index} className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={news.isUpcoming ? "default" : "secondary"}>
                      {news.type}
                    </Badge>
                    {news.isUpcoming && (
                      <Badge variant="outline" className="text-green-700 border-green-500">
                        À venir
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl text-blue-900">{news.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {news.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {news.location}
                  </div>
                  <p className="text-gray-700">{news.description}</p>
                  {news.isUpcoming && (
                    <Button size="sm" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      En savoir plus
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/news">
                Voir toutes les actualités
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Campus Gallery Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Notre Université</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez les espaces qui ont façonné votre parcours et continuent d'inspirer les nouvelles générations
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="ml-0">
                {[
                  { src: "/images/univ1.jpeg", alt: "Campus principal - Vue d'ensemble" },
                  { src: "/images/univ2.jpeg", alt: "Bibliothèque universitaire" },
                  { src: "/images/univ3.jpeg", alt: "Amphithéâtre moderne" },
                  { src: "/images/univ4.jpeg", alt: "Espace étudiant" },
                  { src: "/images/univ5.jpeg", alt: "Laboratoires de recherche" },
                  { src: "/images/univ6.jpeg", alt: "Cour intérieure" },
                ].map((image, index) => (
                  <CarouselItem key={index} className="pl-0 md:basis-1/2 lg:basis-1/3">
                    <div className="p-2">
                      <Card className="overflow-hidden border-0 shadow-lg rounded-2xl bg-white">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={index < 3}
                          />
                        </div>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground text-center font-medium">
                            {image.alt}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-8 size-10 bg-white/90 backdrop-blur shadow-lg border-2 hover:bg-white" />
              <CarouselNext className="hidden md:flex -right-8 size-10 bg-white/90 backdrop-blur shadow-lg border-2 hover:bg-white" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Notre Impact en Chiffres</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              60 ans d'excellence se traduisent par des résultats concrets et un impact durable sur l'économie malgache
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <Card className="text-center p-6 shadow-lg border-0 bg-white">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">2500+</div>
              <div className="text-muted-foreground font-medium">Diplômés formés</div>
              <div className="text-xs text-blue-600 mt-1">Depuis 1964</div>
            </Card>
            <Card className="text-center p-6 shadow-lg border-0 bg-white">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">60</div>
              <div className="text-muted-foreground font-medium">Années d'excellence</div>
              <div className="text-xs text-blue-600 mt-1">1964-2024</div>
            </Card>
            <Card className="text-center p-6 shadow-lg border-0 bg-white">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">85%</div>
              <div className="text-muted-foreground font-medium">Taux d'insertion</div>
              <div className="text-xs text-blue-600 mt-1">Dans les 6 mois</div>
            </Card>
            <Card className="text-center p-6 shadow-lg border-0 bg-white">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">150+</div>
              <div className="text-muted-foreground font-medium">Entreprises créées</div>
              <div className="text-xs text-blue-600 mt-1">Par nos alumni</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
              <Building className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-800 mb-2">Secteur Public</div>
              <div className="text-green-700">35% de nos diplômés</div>
              <div className="text-sm text-green-600 mt-2">Ministères, institutions publiques</div>
            </Card>
            <Card className="text-center p-6 shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <Briefcase className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-800 mb-2">Secteur Privé</div>
              <div className="text-blue-700">45% de nos diplômés</div>
              <div className="text-sm text-blue-600 mt-2">Banques, multinationales, PME</div>
            </Card>
            <Card className="text-center p-6 shadow-lg border-0 bg-gradient-to-br from-purple-50 to-violet-50">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-purple-800 mb-2">Entrepreneuriat</div>
              <div className="text-purple-700">20% de nos diplômés</div>
              <div className="text-sm text-purple-600 mt-2">Créateurs d'entreprises</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Building className="h-8 w-8 text-blue-600" />
              <Badge variant="outline" className="text-lg px-6 py-2 border-blue-600 text-blue-700">
                Partenariats
              </Badge>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">
              Nos Partenaires Stratégiques
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Un réseau solide d'institutions, entreprises et organisations qui collaborent avec notre communauté 
              pour créer des opportunités et développer l'économie malgache
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {partners.flatMap((category) =>
                  category.partners.map((partner, partnerIndex) => (
                    <CarouselItem key={`${category.category}-${partnerIndex}`} className="md:basis-1/2 lg:basis-1/3">
                      <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden h-full">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="secondary" className="text-xs">
                              {partner.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {category.category}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-blue-900 group-hover:text-blue-700 transition-colors">
                              {partner.name}
                            </CardTitle>
                            {partner.website !== "#" && (
                              <ExternalLink className="h-4 w-4 text-blue-600 group-hover:text-blue-800 transition-colors" />
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {partner.description}
                          </p>
                          {partner.website !== "#" && (
                            <Button variant="outline" size="sm" className="w-full group-hover:bg-blue-50 transition-colors" asChild>
                              <Link href={partner.website} target="_blank" rel="noopener noreferrer">
                                <Globe className="mr-2 h-4 w-4" />
                                Visiter le site
                              </Link>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 bg-white/90 backdrop-blur shadow-lg border-2 hover:bg-white" />
              <CarouselNext className="hidden md:flex -right-12 bg-white/90 backdrop-blur shadow-lg border-2 hover:bg-white" />
            </Carousel>
          </div>

          <div className="text-center mt-16">
            <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white max-w-4xl mx-auto">
              <CardContent className="p-10">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Users className="h-8 w-8 text-blue-200" />
                  <h3 className="text-2xl font-bold">Rejoignez Notre Réseau de Partenaires</h3>
                  <Users className="h-8 w-8 text-blue-200" />
                </div>
                <p className="text-lg opacity-90 mb-8 leading-relaxed">
                  Votre organisation souhaite collaborer avec notre association d'alumni ? 
                  Découvrez les opportunités de partenariat et rejoignez un réseau dynamique 
                  d'acteurs engagés pour le développement économique de Madagascar.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Devenir Partenaire
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600"
                    asChild
                  >
                    <Link href="/contact">
                      <Mail className="mr-2 h-5 w-5" />
                      Nous Contacter
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Prêt à rejoindre notre communauté ?</h2>
            <p className="text-xl opacity-90">
              Découvrez les opportunités qui vous attendent et connectez-vous avec des professionnels inspirants
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-2xl" asChild>
                <Link href="/about">
                  En savoir plus
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-2xl border-white text-white hover:bg-white hover:text-primary"
                asChild
              >
                <Link href="/members">
                  <Play className="mr-2 h-5 w-5" />
                  Découvrir les membres
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
