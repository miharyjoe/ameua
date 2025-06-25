"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote, Award, Building, ExternalLink, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

// Client wrapper for Alumni Success Stories Carousel
export function AlumniCarousel({ successStories }: { successStories: any[] }) {
  return (
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
  )
}

// Client wrapper for Campus Gallery Carousel
export function CampusCarousel() {
  const campusImages = [
    { src: "/images/univ1.jpeg", alt: "Campus principal - Vue d'ensemble" },
    { src: "/images/univ2.jpeg", alt: "Campus principal - Vue d'ensemble" },
    { src: "/images/univ3.jpeg", alt: "Campus principal - Vue d'ensemble" },
    { src: "/images/univ4.jpeg", alt: "Campus principal - Vue d'ensemble" },
    { src: "/images/univ5.jpeg", alt: "Campus principal - Vue d'ensemble" },
    { src: "/images/univ6.jpeg", alt: "Cour intérieure" },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {campusImages.map((image, index) => (
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
  )
}

// Client wrapper for Partners Carousel
export function PartnersCarousel({ partners }: { partners: any[] }) {
  return (
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
            category.partners.map((partner: any, partnerIndex: number) => (
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
  )
} 