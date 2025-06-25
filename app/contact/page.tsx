"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Linkedin, 
  MessageCircle,
  Users,
  Send,
  Clock,
  Globe,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    promotion: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    // Basic client-side validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      setSubmitStatus({
        type: 'error',
        message: 'Veuillez remplir tous les champs obligatoires'
      })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.'
        })
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          promotion: '',
          subject: '',
          message: ''
        })
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Une erreur est survenue lors de l\'envoi du message'
        })
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
      setSubmitStatus({
        type: 'error',
        message: 'Erreur de connexion. Veuillez vérifier votre connexion internet et réessayer.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              Contactez-nous
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-900">
              Restons en Contact
            </h1>
            <p className="text-xl text-blue-700 mb-8">
              Nous sommes là pour vous accompagner et répondre à toutes vos questions. 
              Rejoignez notre communauté active !
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-blue-900">Formulaire de Contact</h2>
                <p className="text-muted-foreground mb-8">
                  Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.
                </p>
              </div>

              {/* Status Alert */}
              {submitStatus.type && (
                <Alert className={submitStatus.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                  {submitStatus.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                    {submitStatus.message}
                  </AlertDescription>
                </Alert>
              )}

              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-blue-600" />
                    Votre Message
                  </CardTitle>
                  <CardDescription>
                    Tous les champs marqués d'un * sont obligatoires
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input 
                          id="firstName" 
                          placeholder="Votre prénom" 
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Votre nom" 
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="votre.email@exemple.com" 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="promotion">Promotion</Label>
                      <Input 
                        id="promotion" 
                        placeholder="Année de diplôme (ex: 2020)" 
                        value={formData.promotion}
                        onChange={(e) => handleInputChange('promotion', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet *</Label>
                      <Input 
                        id="subject" 
                        placeholder="Sujet de votre message" 
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Décrivez votre demande en détail..." 
                        className="min-h-[120px]"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        required 
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-blue-900">Informations de Contact</h2>
                <p className="text-muted-foreground mb-8">
                  Plusieurs moyens pour nous joindre et rester connectés.
                </p>
              </div>

              {/* Contact Details */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    Coordonnées Officielles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email de l'association</p>
                      <a 
                        href="mailto:info@ameua.mg" 
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        info@ameua.mg
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Adresse</p>
                      <p className="text-sm text-muted-foreground">
                        Faculté de Droit, d'Économie, de Gestion et de Sociologie<br />
                        Université d'Antananarivo<br />
                        BP 566, Antananarivo 101, Madagascar
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Heures de permanence</p>
                      <p className="text-sm text-muted-foreground">
                        Lundi - Vendredi: 8h00 - 16h00<br />
                        Samedi: 8h00 - 12h00
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    Réseaux Sociaux
                  </CardTitle>
                  <CardDescription>
                    Suivez-nous et restez informés de nos actualités
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link 
                    href="https://facebook.com/alumni.economie.antananarivo" 
                    className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group"
                  >
                    <Facebook className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium group-hover:text-blue-700">Facebook</p>
                      <p className="text-sm text-muted-foreground">@alumni.economie.antananarivo</p>
                    </div>
                  </Link>
                  
                  <Link 
                    href="https://linkedin.com/company/alumni-economie-antananarivo" 
                    className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group"
                  >
                    <Linkedin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium group-hover:text-blue-700">LinkedIn</p>
                      <p className="text-sm text-muted-foreground">Alumni Économie Antananarivo</p>
                    </div>
                  </Link>
                  
                  <Link 
                    href="https://wa.me/261340000000" 
                    className="flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors group"
                  >
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium group-hover:text-green-700">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">+261 34 00 000 00</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              {/* Discussion Groups */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Groupes de Discussion
                  </CardTitle>
                  <CardDescription>
                    Rejoignez nos communautés actives par promotion et centres d'intérêt
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link 
                    href="https://t.me/alumni_economie_antananarivo" 
                    className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group"
                  >
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium group-hover:text-blue-700">Groupe Telegram Général</p>
                      <p className="text-sm text-muted-foreground">Discussions générales et annonces</p>
                    </div>
                  </Link>
                  
                  <Link 
                    href="https://chat.whatsapp.com/alumni-promotions" 
                    className="flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors group"
                  >
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium group-hover:text-green-700">WhatsApp par Promotion</p>
                      <p className="text-sm text-muted-foreground">Groupes spécifiques par année de diplôme</p>
                    </div>
                  </Link>
                  
                  <Link 
                    href="https://discord.gg/alumni-economie" 
                    className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors group"
                  >
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium group-hover:text-purple-700">Discord Professional</p>
                      <p className="text-sm text-muted-foreground">Networking et opportunités professionnelles</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Une Question ? Un Projet ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Notre équipe est à votre disposition pour vous accompagner dans vos démarches.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4" asChild>
              <Link href="/members/register">
                <Users className="mr-2 h-5 w-5" />
                Devenir Membre
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="/about">
                En savoir plus
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
