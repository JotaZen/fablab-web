import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BodyText } from "@/components/common/text";
import {
  Cpu,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Linkedin,
  Youtube,
  ExternalLink
} from "lucide-react";

const quickLinks = [
  { href: "/proyectos", label: "Proyectos" },
  { href: "/tecnologias", label: "Tecnologías" },
  { href: "/equipo", label: "Equipo" },
  { href: "/blog", label: "Blog" },
];

const technologies = [
  { href: "/tecnologias/impresion-3d", label: "Impresión 3D" },
  { href: "/tecnologias/diseno-cad", label: "Diseño CAD" },
  { href: "/tecnologias/electronica", label: "Electrónica" },
  { href: "/tecnologias/cnc", label: "CNC" },
];


export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">FabLab INACAP</h3>
                <p className="text-sm text-muted-foreground">Laboratorio Tecnológico</p>
              </div>
            </div>

            <BodyText className="max-w-sm">
              Impulsando la innovación a través de la fabricación digital,
              prototipado rápido y tecnologías emergentes.
            </BodyText>

            {/* Social Links */}
            <div className="flex space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="https://instagram.com/fablab_inacap" target="_blank">
                  <Instagram className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="https://linkedin.com/company/fablab-inacap" target="_blank">
                  <Linkedin className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="https://youtube.com/@fablab-inacap" target="_blank">
                  <Youtube className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Tecnologías</h4>
            <ul className="space-y-3">
              {technologies.map((tech) => (
                <li key={tech.href}>
                  <Link
                    href={tech.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {tech.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  Av. Vicuña Mackenna 20000<br />
                  San Joaquín, Santiago<br />
                  Chile
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <Link
                  href="mailto:fablab@inacap.cl"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  fablab@inacap.cl
                </Link>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <Link
                  href="tel:+56212345678"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  +56 2 1234 5678
                </Link>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              asChild
            >
              <Link href="/contacto">
                Contáctanos
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 FabLab INACAP. Todos los derechos reservados.
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/privacidad" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacidad
            </Link>
            <Link href="/terminos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Términos
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
