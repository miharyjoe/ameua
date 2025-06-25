import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Clock, ArrowRight, ImageIcon, Eye, X } from "lucide-react"
import Link from "next/link"
import { db } from "@/schema/schema"
import { events, news } from "@/schema/schema"
import { eq } from "drizzle-orm"
import { NewsPageClient } from "./news-page-client"

// Fetch events and news from database
async function getEvents() {
  try {
    const upcomingEvents = await db.select().from(events).where(eq(events.upcoming, true))
    const archivedEvents = await db.select().from(events).where(eq(events.upcoming, false))
    return { upcomingEvents, archivedEvents }
  } catch (error) {
    console.error("Error fetching events:", error)
    // Fallback to static data if database is not available
    return {
      upcomingEvents: [
        {
          id: "1",
          title: "Conférence Innovation & Leadership",
          date: new Date("2024-02-15"),
          time: "18:00",
          location: "Auditorium Central, Paris",
          description: "Rencontrez des leaders d'opinion et découvrez les dernières tendances en innovation.",
          attendees: 120,
          image: "https://placehold.co/200x300",
          category: "Conférence",
          upcoming: true,
          images: null,
          report: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          title: "Networking Afterwork",
          date: new Date("2024-02-22"),
          time: "19:00",
          location: "Rooftop Sky Bar, Lyon",
          description: "Soirée networking décontractée pour échanger avec d'autres alumni.",
          attendees: 45,
          image: "https://placehold.co/200x300",
          category: "Networking",
          upcoming: true,
          images: null,
          report: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      archivedEvents: [
        {
          id: "3",
          title: "Gala Annuel 2023",
          date: new Date("2023-12-10"),
          time: "19:00",
          location: "Château de Versailles",
          description: "Une soirée exceptionnelle pour célébrer nos réussites et renforcer nos liens.",
          attendees: 200,
          image: "https://placehold.co/200x300",
          category: "Gala",
          upcoming: false,
          images: JSON.stringify(["https://placehold.co/150x200", "https://placehold.co/150x200"]),
          report: "Un événement mémorable qui a rassemblé 200 alumni dans un cadre prestigieux.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
    }
  }
}

async function getNews() {
  try {
    const newsArticles = await db.select().from(news).where(eq(news.published, true))
    return newsArticles
  } catch (error) {
    console.error("Error fetching news:", error)
    // Fallback to static data if database is not available
    return [
      {
        id: "1",
        title: "Nouveau partenariat avec TechCorp",
        createdAt: new Date("2024-01-20"),
        category: "Partenariat",
        excerpt: "Nous sommes fiers d'annoncer notre nouveau partenariat stratégique avec TechCorp pour offrir des opportunités exclusives à nos membres.",
        content: "Contenu complet de l'article...",
        image: "https://placehold.co/200x300",
        author: "Marie Dubois",
        published: true,
        updatedAt: new Date(),
      },
      {
        id: "2",
        title: "Lancement du programme de mentorat",
        createdAt: new Date("2024-01-15"),
        category: "Programme",
        excerpt: "Notre nouveau programme de mentorat connecte les jeunes diplômés avec des professionnels expérimentés de notre réseau.",
        content: "Contenu complet de l'article...",
        image: "https://placehold.co/200x300",
        author: "Jean-Pierre Martin",
        published: true,
        updatedAt: new Date(),
      },
    ]
  }
}

export default async function NewsPage() {
  const { upcomingEvents, archivedEvents } = await getEvents()
  const newsArticles = await getNews()

  return (
    <NewsPageClient 
      upcomingEvents={upcomingEvents}
      archivedEvents={archivedEvents}
      newsArticles={newsArticles}
    />
  )
}
