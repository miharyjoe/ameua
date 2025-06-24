"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, Upload, Check, AlertCircle, Facebook, Linkedin, User } from "lucide-react"
import { MemberStatus } from "@/types/member"

export default function RegisterPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    promotion: "",
    currentRole: "",
    company: "",
    location: "",
    linkedin: "",
    facebook: "",
    bio: "",
    expertise: "",
    acceptTerms: false,
    acceptNewsletter: false,
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [memberStatus, setMemberStatus] = useState<MemberStatus | null>(null)

  // Check authentication and member status
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in?callbackUrl=/members/register')
    } else if (status === 'authenticated') {
      // Pre-fill email from session
      setFormData(prev => ({
        ...prev,
        email: session.user?.email || ''
      }))
      
      // Check if user is already a member
      fetch('/api/members/register')
        .then(res => res.json())
        .then(data => {
          setMemberStatus(data)
        })
        .catch(console.error)
    }
  }, [status, session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formDataToSend = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'expertise') {
          // Convert comma-separated string to JSON array
          const expertiseArray = value.toString().split(',').map(item => item.trim()).filter(item => item)
          formDataToSend.append(key, JSON.stringify(expertiseArray))
        } else {
          formDataToSend.append(key, value.toString())
        }
      })

      // Add file if selected
      if (selectedFile) {
        formDataToSend.append('profileImage', selectedFile)
      }

      const response = await fetch('/api/members/register', {
        method: 'POST',
        body: formDataToSend,
      })

      const result = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        setError(result.error || 'An error occurred')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Already a member
  if (memberStatus?.isMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="max-w-md mx-auto shadow-2xl rounded-2xl border-0">
          <CardContent className="text-center p-8 space-y-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div className="space-y-2">
              <Button className="w-full rounded-xl" asChild>
                <a href="/members">Voir l'annuaire</a>
              </Button>
              <Button variant="outline" className="w-full rounded-xl" asChild>
                <a href="/">Retour à l'accueil</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <Card className="max-w-md mx-auto shadow-2xl rounded-2xl border-0">
          <CardContent className="text-center p-8 space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-green-800">Inscription réussie !</h2>
              <p className="text-muted-foreground">
                Votre inscription a été enregistrée avec succès. Vous êtes maintenant membre de notre communauté !
              </p>
            </div>
            <div className="space-y-2">
              <Button className="w-full rounded-xl" asChild>
                <a href="/members">Voir l'annuaire</a>
              </Button>
              <Button variant="outline" className="w-full rounded-xl" asChild>
                <a href="/">Retour à l'accueil</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="text-sm px-4 py-2 mb-4">
              <UserPlus className="mr-2 h-4 w-4" />
              Inscription
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              Rejoignez notre
              <span className="text-primary"> Communauté</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Remplissez ce formulaire pour devenir membre de notre association d'anciens étudiants
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Registration Form */}
          <Card className="shadow-2xl rounded-2xl border-0 bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">Formulaire d'inscription</CardTitle>
              <CardDescription>Toutes les informations marquées d'un * sont obligatoires</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Informations personnelles</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="rounded-xl"
                        required
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Informations académiques</h3>

                  <div className="space-y-2">
                    <Label htmlFor="promotion">Promotion *</Label>
                    <Input
                      id="promotion"
                      type="number"
                      min="1990"
                      max="2030"
                      value={formData.promotion}
                      onChange={(e) => handleInputChange("promotion", e.target.value)}
                      className="rounded-xl"
                      placeholder="ex: 2015"
                      required
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Informations professionnelles</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentRole">Poste actuel *</Label>
                      <Input
                        id="currentRole"
                        value={formData.currentRole}
                        onChange={(e) => handleInputChange("currentRole", e.target.value)}
                        className="rounded-xl"
                        placeholder="ex: Ingénieur logiciel"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Entreprise *</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        className="rounded-xl"
                        placeholder="ex: Google"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="rounded-xl"
                      placeholder="ex: Paris, France"
                      required
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Réseaux sociaux</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="flex items-center">
                        <Linkedin className="mr-2 h-4 w-4" />
                        Profil LinkedIn
                      </Label>
                      <Input
                        id="linkedin"
                        value={formData.linkedin}
                        onChange={(e) => handleInputChange("linkedin", e.target.value)}
                        className="rounded-xl"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facebook" className="flex items-center">
                        <Facebook className="mr-2 h-4 w-4" />
                        Profil Facebook
                      </Label>
                      <Input
                        id="facebook"
                        value={formData.facebook}
                        onChange={(e) => handleInputChange("facebook", e.target.value)}
                        className="rounded-xl"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">À propos de vous</h3>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="rounded-xl min-h-[100px]"
                      placeholder="Parlez-nous de votre parcours, vos projets, vos centres d'intérêt..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expertise">Domaines d'expertise</Label>
                    <Input
                      id="expertise"
                      value={formData.expertise}
                      onChange={(e) => handleInputChange("expertise", e.target.value)}
                      className="rounded-xl"
                      placeholder="ex: Développement web, Intelligence artificielle, Marketing digital"
                    />
                    <p className="text-sm text-muted-foreground">
                      Séparez vos domaines d'expertise par des virgules
                    </p>
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Photo de profil</h3>

                  <div className="space-y-4">
                    {filePreview && (
                      <div className="flex justify-center">
                        <img 
                          src={filePreview} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-2xl"
                        />
                      </div>
                    )}
                    
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-2xl p-8 text-center">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Glissez-déposez votre photo ou cliquez pour sélectionner
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="rounded-xl"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        Choisir une photo
                      </Button>
                      {selectedFile && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Fichier sélectionné: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, acceptTerms: checked as boolean }))
                      }
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      J'accepte les{" "}
                      <a href="/terms" className="text-primary hover:underline">
                        conditions d'utilisation
                      </a>{" "}
                      et la{" "}
                      <a href="/privacy" className="text-primary hover:underline">
                        politique de confidentialité
                      </a>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceptNewsletter"
                      checked={formData.acceptNewsletter}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, acceptNewsletter: checked as boolean }))
                      }
                    />
                    <Label htmlFor="acceptNewsletter" className="text-sm">
                      Je souhaite recevoir la newsletter et les informations sur les événements
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full text-lg py-6 rounded-2xl"
                  disabled={!formData.acceptTerms || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Inscription en cours...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Envoyer ma candidature
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
