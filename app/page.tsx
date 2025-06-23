import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Users, Target, Heart, Award, ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center hero-gradient">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('/placeholder.svg?height=800&width=1200')`,
          }}
        />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Réseau des Diplômés
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Ensemble vers l'
              <span className="text-primary">Excellence</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Rejoignez notre communauté d'anciens étudiants et construisons ensemble un avenir brillant
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

      {/* Campus Gallery Section */}
      <section className="py-20 bg-muted/30">
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

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Membres actifs</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-primary">25</div>
              <div className="text-muted-foreground">Promotions</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-primary">15</div>
              <div className="text-muted-foreground">Projets actifs</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-primary">30+</div>
              <div className="text-muted-foreground">Partenaires</div>
            </div>
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
