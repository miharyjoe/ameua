"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Upload, Check } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    promo: "",
    currentRole: "",
    company: "",
    location: "",
    linkedin: "",
    bio: "",
    expertise: [],
    acceptTerms: false,
    acceptNewsletter: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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
                Votre demande d'inscription a été envoyée avec succès. Vous recevrez un email de confirmation sous peu.
              </p>
            </div>
            <Button className="w-full rounded-xl" asChild>
              <a href="/">Retour à l'accueil</a>
            </Button>
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
                    <Label htmlFor="promo">Promotion *</Label>
                    <Select value={formData.promo} onValueChange={(value) => handleInputChange("promo", value)}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Sélectionnez votre promotion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">Promotion 2024</SelectItem>
                        <SelectItem value="2023">Promotion 2023</SelectItem>
                        <SelectItem value="2022">Promotion 2022</SelectItem>
                        <SelectItem value="2021">Promotion 2021</SelectItem>
                        <SelectItem value="2020">Promotion 2020</SelectItem>
                        <SelectItem value="2019">Promotion 2019</SelectItem>
                        <SelectItem value="2018">Promotion 2018</SelectItem>
                        <SelectItem value="2017">Promotion 2017</SelectItem>
                        <SelectItem value="2016">Promotion 2016</SelectItem>
                        <SelectItem value="2015">Promotion 2015</SelectItem>
                        <SelectItem value="autre">Autre (préciser dans la bio)</SelectItem>
                      </SelectContent>
                    </Select>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">Profil LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={formData.linkedin}
                        onChange={(e) => handleInputChange("linkedin", e.target.value)}
                        className="rounded-xl"
                        placeholder="https://linkedin.com/in/..."
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
                </div>

                {/* Photo Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Photo de profil</h3>

                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-2xl p-8 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Glissez-déposez votre photo ou cliquez pour sélectionner
                    </p>
                    <Button type="button" variant="outline" className="rounded-xl">
                      Choisir une photo
                    </Button>
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
