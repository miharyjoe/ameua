"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Menu, User, LogIn } from "lucide-react"

const navigationItems = [
  { name: "Accueil", href: "/" },
  { name: "À propos", href: "/about" },
  { name: "Membres", href: "/members" },
  { name: "Actualités", href: "/news" },
  { name: "Projets", href: "/projects" },
  { name: "Contact", href: "/contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative h-10 w-10 rounded-2xl flex items-center justify-center overflow-hidden">
              {/* Replace '/logo.png' with your actual logo path */}
              <Image
                src="/images/logo3.png"
                alt="Alumni Association Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-blue-600">Alumni de la Mention Economie</span>
              <Separator className="bg-blue-600 my-1 w-3/4 mx-auto hidden sm:block" />
              <span className="text-xs text-muted-foreground hidden sm:block text-center">Université d'Antananarivo</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/*<Button variant="ghost" size="sm" asChild>
              <Link href="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Connexion
              </Link>
            </Button>*/}
            <Button size="sm" asChild>
              <Link href="/members/register">
                <User className="h-4 w-4 mr-2" />
                Rejoindre
              </Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium transition-colors hover:text-primary py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                    <Link href="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Connexion
                    </Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild>
                    <Link href="/members/register">
                      <User className="h-4 w-4 mr-2" />
                      Rejoindre
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
