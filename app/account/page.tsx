"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Upload, Check, AlertCircle, Facebook, Linkedin, Settings, Trash2, X } from "lucide-react"
import { MemberStatus } from "@/types/member"
import { useToast } from "@/components/ui/toast"

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast, ToastContainer } = useToast()
  
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
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [deleteImage, setDeleteImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [memberStatus, setMemberStatus] = useState<MemberStatus | null>(null)

  // Check authentication and load member data
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in?callbackUrl=/account')
    } else if (status === 'authenticated') {
      loadMemberData()
    }
  }, [status, router])

  const loadMemberData = async () => {
    try {
      const response = await fetch('/api/members/register')
      const data = await response.json()
      setMemberStatus(data)
      
      if (data.member) {
        const member = data.member
        setFormData({
          firstName: member.firstName || "",
          lastName: member.lastName || "",
          email: member.email || "",
          phone: member.phone || "",
          promotion: member.promotion?.toString() || "",
          currentRole: member.currentRole || "",
          company: member.company || "",
          location: member.location || "",
          linkedin: member.linkedin || "",
          facebook: member.facebook || "",
          bio: member.bio || "",
          expertise: member.expertise ? JSON.parse(member.expertise).join(', ') : "",
        })
        
        if (member.profileImage) {
          setFilePreview(member.profileImage)
        }
        
        // Reset states
        setDeleteImage(false)
        setSelectedFile(null)
      }
    } catch (error) {
      console.error('Error loading member data:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const formDataToSend = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'expertise') {
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
      
      // Add delete image flag
      if (deleteImage) {
        formDataToSend.append('deleteImage', 'true')
      }

      const response = await fetch('/api/members/update', {
        method: 'POST',
        body: formDataToSend,
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Reset image states after successful update
        setDeleteImage(false)
        setSelectedFile(null)
        
        // Reload member data to show updates
        await loadMemberData()
        
        // Show success toast
        toast({
          variant: "success",
          title: "Mise à jour réussie !",
          description: "Vos informations ont été mises à jour avec succès."
        })
        
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(result.error || 'An error occurred')
        toast({
          variant: "error",
          title: "Erreur de mise à jour",
          description: result.error || 'Une erreur est survenue'
        })
      }
    } catch (error) {
      console.error('Update error:', error)
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
      setDeleteImage(false) // Reset delete flag when new file is selected
      const reader = new FileReader()
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteImage = () => {
    setDeleteImage(true)
    setSelectedFile(null)
    setFilePreview(null)
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Not a member
  if (memberStatus && !memberStatus.isMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="max-w-md mx-auto shadow-2xl rounded-2xl border-0">
          <CardContent className="text-center p-8 space-y-6">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
              <User className="h-8 w-8 text-orange-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-orange-800">Pas encore membre</h2>
              <p className="text-muted-foreground">
                Vous devez d'abord vous inscrire en tant que membre pour accéder à cette page.
              </p>
            </div>
            <div className="space-y-2">
              <Button className="w-full rounded-xl" asChild>
                <a href="/members/register">S'inscrire comme membre</a>
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
              <Settings className="mr-2 h-4 w-4" />
              Mon Compte
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              Modifier mes
              <span className="text-primary"> Informations</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Mettez à jour vos informations personnelles et professionnelles
            </p>
          </div>

          {/* Success Alert */}
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Vos informations ont été mises à jour avec succès !
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Update Form */}
          <Card className="shadow-2xl rounded-2xl border-0 bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">Mes informations</CardTitle>
              <CardDescription>Modifiez vos informations personnelles et professionnelles</CardDescription>
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
                      />
                    </div>
                  </div>
                </div>

                {/* Bio & Expertise */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">À propos de vous</h3>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="rounded-xl min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expertise">Domaines d'expertise</Label>
                    <Input
                      id="expertise"
                      value={formData.expertise}
                      onChange={(e) => handleInputChange("expertise", e.target.value)}
                      className="rounded-xl"
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
                    {filePreview && !deleteImage && (
                      <div className="flex flex-col items-center space-y-3">
                        <div className="relative">
                          <img 
                            src={filePreview} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover rounded-2xl"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-8 w-8 p-0 rounded-full"
                            onClick={handleDeleteImage}
                            title="Supprimer la photo"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Photo actuelle
                        </p>
                      </div>
                    )}

                    {deleteImage && (
                      <div className="flex flex-col items-center space-y-3 p-4 bg-red-50 rounded-2xl border border-red-200">
                        <div className="w-32 h-32 bg-red-100 rounded-2xl flex items-center justify-center">
                          <Trash2 className="h-8 w-8 text-red-500" />
                        </div>
                        <p className="text-sm text-red-600 font-medium">
                          Photo marquée pour suppression
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDeleteImage(false)
                            if (memberStatus?.member?.profileImage) {
                              setFilePreview(memberStatus.member.profileImage)
                            }
                          }}
                          className="rounded-xl"
                        >
                          Annuler la suppression
                        </Button>
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
                      <div className="space-y-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="rounded-xl"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          {filePreview && !deleteImage ? 'Changer la photo' : 'Ajouter une photo'}
                        </Button>
                        
                        {filePreview && !deleteImage && !selectedFile && (
                          <Button 
                            type="button" 
                            variant="destructive" 
                            className="rounded-xl ml-2"
                            onClick={handleDeleteImage}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer la photo
                          </Button>
                        )}
                      </div>
                      
                      {selectedFile && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Nouveau fichier: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full text-lg py-6 rounded-2xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Mise à jour en cours...
                    </>
                  ) : (
                    <>
                      <Settings className="mr-2 h-5 w-5" />
                      Mettre à jour mes informations
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
} 