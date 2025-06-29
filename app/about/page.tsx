import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar, Users, Target, Award, Heart, Star, BookOpen, Trophy, Palette, Building, Music, Lightbulb, Briefcase, GraduationCap, Network } from "lucide-react"

const timelineEvents = [
  {
    year: "1964",
    title: "Fondation de la Mention Économie",
    description: "Création de la Mention Économie à l'Université d'Antananarivo, marquant le début d'une aventure académique exceptionnelle",
  },
  {
    year: "1980s",
    title: "Premiers diplômés",
    description: "Formation des premières générations d'économistes qui contribueront au développement du pays",
  },
  {
    year: "1990s",
    title: "Expansion et modernisation",
    description: "Adaptation aux transformations du paysage économique national et international",
  },
  {
    year: "2000s",
    title: "Renforcement académique",
    description: "Développement des programmes de recherche et consolidation de l'excellence académique",
  },
  {
    year: "2010",
    title: "Création de l'association alumni",
    description: "Fondation de l'association des anciens étudiants pour renforcer les liens entre les générations",
  },
  {
    year: "2024",
    title: "60ème anniversaire",
    description: "Célébration de six décennies d'excellence avec des milliers d'alumni formés et un impact majeur sur l'économie malgache",
  },
]

const teamMembers = [
  {
    name: "RASOLOELISON LANTONIAINA",
    role: "Président",
    promo: "",
    image: "",
    description: "",
  },
  {
    name: "RAKOTOARIMANANA TANTELINIANIAINA",
    role: "Vice-présidente",
    promo: "",
    image: "",
    description: "",
  },
  {
    name: "RAKOTO DAVID OLIVANIAINA",
    role: "Vice-président",
    promo: "",
    image: "",
    description: "",
  },
  {
    name: "RAMAROKOTO MAMOLOLOLONA",
    role: "Secrétaire Général",
    promo: "",
    image: "",
    description: "",
  },
  {
    name: "MAHAZOASY FREDDIE",
    role: "Secrétaire Général",
    promo: "",
    image: "",
    description: "",
  },
  {
    name: "RANDRIAMANAMPISO AHOLIMALALA",
    role: "Trésorière",
    promo: "",
    image: "utilisateur.png",
    description: "",
  },
  {
    name: "NOMENJANAHARY HANJA",
    role: "Trésorier",
    promo: "",
    image: "utilisateur.png",
    description: "",
  },
  {
    name: "ANDRIMAMY JOEDA",
    role: "Responsable Communication",
    promo: "",
    image: "utilisateur.png",
    description: "",
  },
  {
    name: "ANDRIANARY FENO",
    role: "Responsable Communication",
    promo: "",
    image: "utilisateur.png",
    description: "",
  },
  {
    name: "ZAFISOAPRINIVO ROSNY",
    role: "Responsable Communication",
    promo: "",
    image: "utilisateur.png",
    description: "",
  },
  {
    name: "MANATO",
    role: "Responsable Communication",
    promo: "",
    image: "utilisateur.png",
    description: "",
  },
  {
    name: "ANDRIANISHTHOAR ANA TAHIRY",
    role: "Responsable RSE",
    promo: "",
    image: "utilisateur.png",
    description: "",
  },
  {
    name: "RAKOTOMANGA ANDRIANIOHARY",
    role: "Conseiller",
    promo: "",
    image: "utilisateur.png",
    description: "",
  },
  {
    name: "RAZAFIMBOLA RIJALY",
    role: "Conseillère",
    promo: "",
    image: "utilisateur.png",
    description: "",
  },
  {
    name: "RAKOTOMANGA MALALA",
    role: "Conseillère",
    promo: "",
    image: "utilisateur.png",
    description: "",
  },
  {
    name: "BAZAFINDRABE BAKOLY",
    role: "Conseillère",
    promo: "",
    image: "utilisateur.png",
    description: "",
  },
  {
    name: "RANARIVONY LOIC",
    role: "Conseiller",
    promo: "",
    image: "utilisateur.png",
    description: "",
  },
  {
    name: "JIMALSON GIOVANNI",
    role: "Conseiller",
    promo: "",
    image: "utilisateur.png",
    description: "",
  },
  {
    name: "RANDRIANANDRASANA TOKY",
    role: "Conseiller",
    promo: "",
    image: "",
    description: "",
  },
  {
    name: "BENALAZA DONALDI DIAS",
    role: "Conseiller",
    promo: "",
    image: "",
    description: "",
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

const projectObjectives = [
  {
    category: "Identité & Rayonnement",
    icon: Palette,
    color: "from-pink-50 to-rose-50",
    iconColor: "text-pink-600",
    titleColor: "text-pink-900",
    objectives: [
      "Créer une identité visuelle distinctive pour marquer la célébration (concours de logo, slogan)",
      "Consolider l'excellence qui perdure au sein de la mention Économie à travers ses recherches",
      "Valoriser la capacité et les réalisations de nos membres (anciens et étudiants actuels)"
    ]
  },
  {
    category: "Réseau & Communauté",
    icon: Network,
    color: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-600",
    titleColor: "text-blue-900",
    objectives: [
      "Renforcer le sentiment d'appartenance par la création d'un vaste réseau d'Alumni",
      "Créer un pont englobant toute la grande famille de la mention Économie",
      "Établir une cohésion durable entre tous les économistes de notre communauté"
    ]
  },
  {
    category: "Infrastructure & Héritage",
    icon: Building,
    color: "from-green-50 to-emerald-50",
    iconColor: "text-green-600",
    titleColor: "text-green-900",
    objectives: [
      "Perpétuer l'héritage par la construction d'un nouvel amphithéâtre de 1 300 places",
      "Rénover les salles de classes pour améliorer les conditions d'apprentissage",
      "Créer des espaces modernes adaptés aux besoins pédagogiques actuels"
    ]
  },
  {
    category: "Innovation & Carrières",
    icon: Lightbulb,
    color: "from-purple-50 to-violet-50",
    iconColor: "text-purple-600",
    titleColor: "text-purple-900",
    objectives: [
      "Cultiver la gestion de projets, la créativité et l'adéquation théorie-pratique",
      "Orienter les étudiants vers des métiers innovants et d'avenir",
      "Offrir des ressources de qualité aux recruteurs et partenaires"
    ]
  },
  {
    category: "Culture & Engagement",
    icon: Music,
    color: "from-orange-50 to-red-50",
    iconColor: "text-orange-600",
    titleColor: "text-orange-900",
    objectives: [
      "Marquer la célébration par un événement culturel attractif pour les jeunes",
      "Organiser des activités engageantes avec des artistes appréciés",
      "Créer des moments fédérateurs pour toute la communauté"
    ]
  },
  {
    category: "Recherche & Excellence",
    icon: GraduationCap,
    color: "from-cyan-50 to-blue-50",
    iconColor: "text-cyan-600",
    titleColor: "text-cyan-900",
    objectives: [
      "Ouvrir le spectre des doctorants en matière de recherche",
      "Encourager l'innovation dans les domaines d'études économiques",
      "Développer des partenariats académiques et professionnels"
    ]
  }
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              60 ans d'Excellence • 1964-2024
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              Alumni de la Mention
              <span className="text-primary"> Économie</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Découvrez l'histoire exceptionnelle de la Mention Économie de l'Université d'Antananarivo, 
              60 ans d'excellence académique et de formation des futurs décideurs économiques de Madagascar
            </p>
          </div>
        </div>
      </section>

      {/* 60th Anniversary Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <Badge variant="outline" className="text-lg px-6 py-2 border-yellow-500 text-yellow-700">
                  Anniversaire Historique
                </Badge>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">
                60 Ans d'Excellence et d'Innovation
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                      <h3 className="text-xl font-bold text-blue-900">Notre Héritage</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Fondée en 1964, la Mention Économie de l'Université d'Antananarivo a franchi en 2024 
                      une étape symbolique de son parcours : <strong>soixante ans d'existence, d'apprentissage et d'excellence</strong>. 
                      Depuis sa création, elle a formé des milliers d'étudiants, accompagné des chercheurs et des 
                      professionnels, et contribué activement au développement économique et social de Madagascar.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Heart className="h-6 w-6 text-green-600" />
                      <h3 className="text-xl font-bold text-green-900">Nos Valeurs</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Au fil des décennies, la Mention Économie a su évoluer pour répondre aux défis de son époque, 
                      s'adaptant aux transformations du paysage économique national et international. 
                      Mais une chose est restée constante : son engagement envers ses <strong>valeurs fondamentales</strong> 
                      que sont l'excellence, l'équité et l'inclusion.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-violet-50">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Star className="h-6 w-6 text-purple-600" />
                      <h3 className="text-xl font-bold text-purple-900">Notre Mission</h3>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        Cette célébration historique nous permet de :
                      </p>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span><strong>Honorer le passé</strong> en mettant en lumière les grandes réalisations de ces six décennies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span><strong>Fédérer le présent</strong> en renforçant la cohésion et l'esprit de famille au sein de la Mention</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span><strong>Préparer l'avenir</strong> en inspirant les générations futures et en consolidant notre rôle</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Users className="h-6 w-6 text-orange-600" />
                      <h3 className="text-xl font-bold text-orange-900">L'Avenir Ensemble</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Aujourd'hui, la Mention Économie continue d'être un acteur clé dans la formation des futurs 
                      décideurs et experts en sciences économiques. Ce 60ème anniversaire est l'occasion de réfléchir 
                      ensemble aux enjeux d'un monde en constante évolution et d'imaginer les prochaines étapes de notre développement.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="text-center mt-12">
              <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Rejoignez Cette Célébration Historique</h3>
                  <p className="text-lg opacity-90 mb-6">
                    Nous vous invitons à prendre part à cette célébration historique, à partager vos expériences 
                    et à écrire, ensemble, les prochaines pages de cette belle aventure !
                  </p>
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                    Participer à la Célébration
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Project Objectives Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Target className="h-8 w-8 text-blue-600" />
              <Badge variant="outline" className="text-lg px-6 py-2 border-blue-600 text-blue-700">
                Projet d'Anniversaire
              </Badge>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">
              Nos Objectifs pour les 60 Ans
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Un projet ambitieux et structuré pour célébrer notre héritage tout en construisant l'avenir 
              de la Mention Économie et de sa communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {projectObjectives.map((category, index) => (
              <Card key={index} className={`shadow-lg rounded-2xl border-0 bg-gradient-to-br ${category.color} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-2xl bg-white/80 flex items-center justify-center">
                      <category.icon className={`h-6 w-6 ${category.iconColor}`} />
                    </div>
                    <CardTitle className={`text-xl ${category.titleColor}`}>
                      {category.category}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {category.objectives.map((objective, objIndex) => (
                      <li key={objIndex} className="flex items-start gap-3">
                        <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${category.iconColor.replace('text-', 'bg-')}`}></div>
                        <span className="text-gray-700 text-sm leading-relaxed">
                          {objective}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white max-w-4xl mx-auto">
              <CardContent className="p-10">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Star className="h-8 w-8 text-yellow-300" />
                  <h3 className="text-2xl font-bold">Une Vision d'Excellence</h3>
                  <Star className="h-8 w-8 text-yellow-300" />
                </div>
                <p className="text-lg opacity-90 mb-8 leading-relaxed">
                  Ces objectifs reflètent notre engagement à honorer le passé, dynamiser le présent et 
                  préparer l'avenir. Ensemble, nous construisons un projet qui marquera durablement 
                  l'histoire de la Mention Économie et renforcera sa position de leader dans la formation 
                  des futurs décideurs économiques de Madagascar.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                    <Users className="mr-2 h-5 w-5" />
                    Rejoindre le Projet
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    <Briefcase className="mr-2 h-5 w-5" />
                    Devenir Partenaire
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Six Décennies d'Histoire</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              De 1964 à 2024 : une chronologie de l'excellence académique et de l'innovation pédagogique
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

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center shadow-lg rounded-2xl border-0 bg-white overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-20 h-20 rounded-2xl overflow-hidden mb-3">
                    <img
                      src={member.image || "utilisateur.png"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-sm font-semibold leading-tight">{member.name}</CardTitle>
                  <Badge variant="secondary" className="mx-auto w-fit text-xs">
                    {member.role}
                  </Badge>
                </CardHeader>
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
