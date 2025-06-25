"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  ArrowLeft, 
  Search, 
  Shield, 
  User, 
  Mail, 
  Building, 
  Calendar,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Trash2
} from "lucide-react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UserData {
  id: string
  name: string | null
  email: string
  role: string
  image: string | null
  emailVerified: Date | null
  memberId: string | null
  firstName: string | null
  lastName: string | null
  promotion: number | null
  currentRole: string | null
  company: string | null
  memberCreatedAt: Date | null
}

export default function UsersManagement() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [newRole, setNewRole] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        // Update local state
        setUsers(prev => 
          prev.map(user => 
            user.id === selectedUser.id 
              ? { ...user, role: newRole }
              : user
          )
        )
        setShowRoleDialog(false)
        setSelectedUser(null)
        setNewRole("")
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Erreur lors de la mise à jour du rôle')
      }
    } catch (error) {
      console.error("Error updating role:", error)
      alert('Erreur lors de la mise à jour du rôle')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove user from local state
        setUsers(prev => prev.filter(user => user.id !== selectedUser.id))
        setShowDeleteDialog(false)
        setSelectedUser(null)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Erreur lors de la suppression de l\'utilisateur')
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      alert('Erreur lors de la suppression de l\'utilisateur')
    } finally {
      setIsDeleting(false)
    }
  }

  const openRoleDialog = (user: UserData) => {
    setSelectedUser(user)
    setNewRole(user.role)
    setShowRoleDialog(true)
  }

  const openDeleteDialog = (user: UserData) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  const getUserInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    users: users.filter(u => u.role === 'user').length,
    members: users.filter(u => u.memberId).length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Chargement des utilisateurs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour au dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
                <p className="text-muted-foreground">Gérez les rôles et permissions des utilisateurs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Utilisateurs inscrits</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
                <p className="text-xs text-muted-foreground">Avec droits admin</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.users}</div>
                <p className="text-xs text-muted-foreground">Utilisateurs standard</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Membres Alumni</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.members}</div>
                <p className="text-xs text-muted-foreground">Profils complétés</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Rechercher par nom, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filtrer par rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="admin">Administrateurs</SelectItem>
                    <SelectItem value="user">Utilisateurs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des Utilisateurs</CardTitle>
              <CardDescription>
                Gérez les rôles et permissions de tous les utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut Membre</TableHead>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.image || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                              {getUserInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {user.firstName && user.lastName 
                                ? `${user.firstName} ${user.lastName}`
                                : user.name || "Nom non défini"
                              }
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ID: {user.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.role === 'admin' ? 'default' : 'secondary'}
                          className={user.role === 'admin' ? 'bg-purple-600' : ''}
                        >
                          {user.role === 'admin' ? (
                            <>
                              <Shield className="mr-1 h-3 w-3" />
                              Administrateur
                            </>
                          ) : (
                            <>
                              <User className="mr-1 h-3 w-3" />
                              Utilisateur
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.memberId ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <UserCheck className="mr-1 h-3 w-3" />
                            Membre Alumni
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            <UserX className="mr-1 h-3 w-3" />
                            Non membre
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.company ? (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{user.company}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openRoleDialog(user)}>
                              <Shield className="mr-2 h-4 w-4" />
                              Changer le rôle
                            </DropdownMenuItem>
                            {user.memberId && (
                              <DropdownMenuItem asChild>
                                <Link href={`/members`}>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Voir le profil membre
                                </Link>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => openDeleteDialog(user)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer l'utilisateur
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Role Change Dialog */}
      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Changer le rôle de l'utilisateur</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de modifier le rôle de {selectedUser?.name || selectedUser?.email}.
              Cette action prendra effet immédiatement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Utilisateur
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Administrateur
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRoleChange}
              disabled={isUpdating || !newRole}
            >
              {isUpdating ? "Mise à jour..." : "Confirmer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Supprimer l'utilisateur
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur{" "}
              <span className="font-medium">
                {selectedUser?.name || selectedUser?.email}
              </span>{" "}
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="text-red-600 font-medium text-sm mb-3">
              ⚠️ Cette action est irréversible et supprimera :
            </div>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>Le compte utilisateur</li>
              <li>Le profil membre (si existant)</li>
              <li>Toutes les sessions actives</li>
              <li>Les données associées</li>
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer définitivement
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
