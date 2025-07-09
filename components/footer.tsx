import Link from "next/link"
import { Facebook, Linkedin, MessageCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
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
            </div>
            <p className="text-sm text-muted-foreground">Réseau des anciens étudiants - Ensemble vers l'excellence</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Navigation</h3>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block hover:text-primary transition-colors">
                À propos
              </Link>
              <Link href="/members" className="block hover:text-primary transition-colors">
                Membres
              </Link>
              <Link href="/news" className="block hover:text-primary transition-colors">
                Actualités
              </Link>
              <Link href="/projects" className="block hover:text-primary transition-colors">
                Projets
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Services</h3>
            <div className="space-y-2 text-sm">
              <Link href="/students" className="block hover:text-primary transition-colors">
                Espace Étudiants
              </Link>
              <Link href="/partnerships" className="block hover:text-primary transition-colors">
                Partenariats
              </Link>
              <Link href="/gallery" className="block hover:text-primary transition-colors">
                Galerie
              </Link>
              <Link href="/hall-of-fame" className="block hover:text-primary transition-colors">
                Hall of Fame
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Contact</h3>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">info@ameua.mg</p>
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Alumni Association. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
