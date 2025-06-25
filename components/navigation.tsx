"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Menu, 
  User, 
  LogIn, 
  LogOut, 
  Settings, 
  UserCircle, 
  Home,
  Info,
  Users,
  Newspaper,
  FolderOpen,
  Mail,
  ChevronRight,
  LayoutDashboard
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "À propos", href: "/about", icon: Info },
  { name: "Membres", href: "/members", icon: Users },
  { name: "Actualités", href: "/news", icon: Newspaper },
  { name: "Projets", href: "/projects", icon: FolderOpen },
  { name: "Contact", href: "/contact", icon: Mail },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()
  const isLoading = status === "loading"
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const isActivePath = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Enhanced Logo Section */}
          <Link href="/" className="flex items-center space-x-3 min-w-0 flex-shrink group">
            <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Image
                src="/images/logo3.png"
                alt="Alumni Association Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm sm:text-base lg:text-lg leading-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent truncate group-hover:from-blue-700 group-hover:to-blue-900 transition-all duration-300">
                <span className="hidden sm:inline">Alumni de la Mention Economie</span>
                <span className="sm:hidden">Alumni Economie</span>
              </span>
              <div className="h-0.5 bg-gradient-to-r from-blue-500 to-transparent w-3/4 hidden sm:block" />
              <span className="text-xs text-muted-foreground/80 hidden lg:block font-medium">
                Université d'Antananarivo
              </span>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navigationItems.map((item) => {
              const isActive = isActivePath(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap group",
                    isActive 
                      ? "text-blue-700 bg-blue-50 shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Enhanced Desktop Authentication */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse hidden lg:block" />
              </div>
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-blue-200 transition-all duration-200">
                    <Avatar className="h-8 w-8 border-2 border-background shadow-md">
                      <AvatarImage src={session.user?.image || undefined} alt={session.user?.name || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold">
                        {session.user?.name ? getUserInitials(session.user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session.user?.image || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                          {session.user?.name ? getUserInitials(session.user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 min-w-0">
                        <p className="text-sm font-semibold leading-none truncate">{session.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {session.user?.email}
                        </p>
                        <Badge variant="secondary" className="w-fit text-xs">
                          Membre actif
                        </Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/account" className="flex items-center">
                      <UserCircle className="mr-3 h-4 w-4 text-blue-600" />
                      <span>Mon compte</span>
                      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/account/settings" className="flex items-center">
                      <Settings className="mr-3 h-4 w-4 text-gray-600" />
                      <span>Paramètres</span>
                      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                    </Link>
                  </DropdownMenuItem>
                  {/* Show admin dashboard link only for admin users */}
                  {session.user?.role === 'admin' && (
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/admin" className="flex items-center">
                        <LayoutDashboard className="mr-3 h-4 w-4 text-purple-600" />
                        <span>Dashboard Admin</span>
                        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer focus:text-red-700 focus:bg-red-50">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild className="hidden lg:flex hover:bg-blue-50 hover:text-blue-700 transition-colors">
                  <Link href="/auth/sign-in">
                    <LogIn className="h-4 w-4 mr-2" />
                    Connexion
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="lg:hidden hover:bg-blue-50 hover:text-blue-700">
                  <Link href="/auth/sign-in">
                    <LogIn className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200">
                  <Link href="/auth/sign-up">
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">S'inscrire</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Enhanced Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="flex-shrink-0 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[380px] bg-background/95 backdrop-blur-xl border-l shadow-2xl">
              <SheetHeader className="pb-6 border-b">
                <SheetTitle className="text-left font-semibold text-lg bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Menu de navigation
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col space-y-6 mt-6">
                {/* Enhanced Navigation Links */}
                <div className="space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = isActivePath(item.href)
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                          isActive 
                            ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-muted-foreground")} />
                        <span>{item.name}</span>
                        {isActive && <div className="ml-auto h-2 w-2 bg-blue-600 rounded-full" />}
                      </Link>
                    )
                  })}
                </div>
                
                <Separator className="my-6" />
                
                {/* Enhanced Mobile Authentication */}
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-xl animate-pulse">
                      <div className="h-12 w-12 bg-gray-300 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-300 rounded w-3/4" />
                        <div className="h-3 bg-gray-300 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ) : session ? (
                  <div className="space-y-6">
                    {/* Enhanced User Info Card */}
                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
                      <div className="relative">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                          <AvatarImage src={session.user?.image || undefined} alt={session.user?.name || "User"} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold">
                            {session.user?.name ? getUserInitials(session.user.name) : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate text-blue-900">{session.user?.name}</p>
                        <p className="text-xs text-blue-700/70 truncate">{session.user?.email}</p>
                        <Badge variant="secondary" className="w-fit text-xs mt-1 bg-blue-200 text-blue-800">
                          Membre actif
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Enhanced User Actions */}
                    <div className="space-y-3">
                      <Button variant="ghost" size="sm" className="w-full justify-start h-12 hover:bg-blue-50 hover:text-blue-700 transition-colors" asChild>
                        <Link href="/account" onClick={() => setIsOpen(false)}>
                          <UserCircle className="h-5 w-5 mr-3 text-blue-600" />
                          <span>Mon compte</span>
                          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start h-12 hover:bg-gray-50 transition-colors" asChild>
                        <Link href="/account/settings" onClick={() => setIsOpen(false)}>
                          <Settings className="h-5 w-5 mr-3 text-gray-600" />
                          <span>Paramètres</span>
                          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                        </Link>
                      </Button>
                      {/* Show admin dashboard link only for admin users */}
                      {session.user?.role === 'admin' && (
                        <Button variant="ghost" size="sm" className="w-full justify-start h-12 hover:bg-purple-50 hover:text-purple-700 transition-colors" asChild>
                          <Link href="/admin" onClick={() => setIsOpen(false)}>
                            <LayoutDashboard className="h-5 w-5 mr-3 text-purple-600" />
                            <span>Dashboard Admin</span>
                            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                          </Link>
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                        onClick={() => {
                          setIsOpen(false)
                          handleSignOut()
                        }}
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        <span>Se déconnecter</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button variant="ghost" size="sm" className="w-full justify-start h-12 hover:bg-blue-50 hover:text-blue-700 transition-colors" asChild>
                      <Link href="/auth/sign-in" onClick={() => setIsOpen(false)}>
                        <LogIn className="h-5 w-5 mr-3" />
                        <span>Connexion</span>
                      </Link>
                    </Button>
                    <Button size="sm" className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200" asChild>
                      <Link href="/auth/sign-up" onClick={() => setIsOpen(false)}>
                        <User className="h-5 w-5 mr-3" />
                        <span>S'inscrire</span>
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
