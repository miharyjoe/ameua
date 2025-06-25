import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"
import { db } from "@/schema/schema"
import { news } from "@/schema/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"

interface NewsDetailProps {
  params: Promise<{ id: string }>
}

async function getNewsArticle(id: string) {
  try {
    const article = await db.select().from(news).where(eq(news.id, id))
    
    if (!article.length || !article[0].published) {
      return null
    }
    
    return article[0]
  } catch (error) {
    console.error("Error fetching news article:", error)
    return null
  }
}

async function getRelatedNews(currentId: string, category: string) {
  try {
    const relatedArticles = await db
      .select()
      .from(news)
      .where(eq(news.published, true))
      .limit(3)
    
    // Filter out current article and try to match category
    return relatedArticles
      .filter(article => article.id !== currentId)
      .slice(0, 3)
  } catch (error) {
    console.error("Error fetching related news:", error)
    return []
  }
}

export default async function NewsDetail({ params }: NewsDetailProps) {
  // Properly await the params Promise - this is the fix for React 19 + Next.js 15
  const resolvedParams = await params
  const { id } = resolvedParams
  
  const article = await getNewsArticle(id)
  
  if (!article) {
    notFound()
  }
  
  const relatedNews = await getRelatedNews(id, article.category)
  
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/news/${id}`
  const shareTitle = article.title

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/news">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux actualités
              </Link>
            </Button>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                {article.category}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    {article.createdAt.toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Par {article.author}</span>
                </div>
              </div>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Article Content */}
              <div className="lg:col-span-2 space-y-8">
                {article.image && (
                  <div className="aspect-video rounded-2xl overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-lg leading-relaxed">
                    {article.content}
                  </div>
                </div>
                
                {/* Share Section */}
                <Card className="bg-muted/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Share2 className="h-5 w-5" />
                        <span className="font-medium">Partager cet article</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Facebook className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Twitter className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Author Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">À propos de l'auteur</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{article.author}</p>
                        <p className="text-sm text-muted-foreground">Rédacteur</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Articles */}
                {relatedNews.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Articles similaires</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {relatedNews.map((relatedArticle) => (
                        <Link
                          key={relatedArticle.id}
                          href={`/news/${relatedArticle.id}`}
                          className="block group"
                        >
                          <div className="space-y-2">
                            {relatedArticle.image && (
                              <div className="aspect-video rounded-lg overflow-hidden">
                                <img
                                  src={relatedArticle.image}
                                  alt={relatedArticle.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                                {relatedArticle.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {relatedArticle.createdAt.toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Newsletter Subscription */}
                <Card className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
                  <CardContent className="p-6 text-center space-y-4">
                    <h3 className="text-lg font-bold">Restez informés</h3>
                    <p className="text-sm opacity-90">
                      Abonnez-vous à notre newsletter pour recevoir toutes nos actualités
                    </p>
                    <div className="space-y-2">
                      <input
                        type="email"
                        placeholder="Votre email"
                        className="w-full px-3 py-2 rounded-lg text-foreground"
                      />
                      <Button variant="secondary" className="w-full">
                        S'abonner
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 