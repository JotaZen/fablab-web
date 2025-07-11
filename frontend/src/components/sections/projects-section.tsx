import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionTitle, Subtitle } from "@/components/common/titles";
import { PlaceholderImage } from "@/components/common/images";
import { ExternalLink, Calendar, Users, Award } from "lucide-react";

const projects = [
  {
    title: "Prótesis Robótica Open Source",
    description: "Desarrollo de una mano protésica impresa en 3D con control mioeléctrico y feedback háptico.",
    category: "Biomédica",
    status: "En desarrollo",
    duration: "6 meses",
    team: "4 estudiantes",
    technologies: ["Impresión 3D", "Arduino", "Sensores", "CAD"],
    featured: true,
  },
  {
    title: "Drone de Monitoreo Ambiental",
    description: "UAV con sensores IoT para monitoreo de calidad del aire y parámetros ambientales urbanos.",
    category: "IoT",
    status: "Completado",
    duration: "4 meses",
    team: "3 estudiantes",
    technologies: ["Manufactura CNC", "Electrónica", "IoT", "Análisis de datos"],
    featured: false,
  },
  {
    title: "Sistema de Riego Inteligente",
    description: "Automatización de riego para agricultura urbana con sensores de humedad y control remoto.",
    category: "Agricultura Tech",
    status: "En desarrollo",
    duration: "3 meses",
    team: "2 estudiantes",
    technologies: ["Sensores", "IoT", "Impresión 3D", "App móvil"],
    featured: false,
  },
  {
    title: "Robot Educativo Modular",
    description: "Kit educativo de robótica modular diseñado para enseñanza de programación en colegios.",
    category: "Educación",
    status: "Prototipo",
    duration: "5 meses",
    team: "5 estudiantes",
    technologies: ["Diseño modular", "Electrónica", "Software educativo", "UX/UI"],
    featured: true,
  },
];

const statusColors = {
  "Completado": "bg-green-500",
  "En desarrollo": "bg-blue-500",
  "Prototipo": "bg-yellow-500",
};

const categoryColors = {
  "Biomédica": "border-red-200 bg-red-50",
  "IoT": "border-blue-200 bg-blue-50",
  "Agricultura Tech": "border-green-200 bg-green-50",
  "Educación": "border-purple-200 bg-purple-50",
};

export function ProjectsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <Badge className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
            <Award className="w-4 h-4 mr-2" />
            Proyectos Destacados
          </Badge>

          <SectionTitle gradient>
            Innovación en Acción
          </SectionTitle>

          <Subtitle className="max-w-3xl mx-auto">
            Descubre los proyectos que nuestros estudiantes desarrollan aplicando
            tecnologías de vanguardia para resolver problemas reales
          </Subtitle>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {projects.map((project, index) => (
            <Card
              key={index}
              className={`group hover:shadow-2xl transition-all duration-300 ${project.featured ? "lg:col-span-2" : ""
                }`}
            >
              <div className={project.featured ? "grid lg:grid-cols-2 gap-0" : ""}>
                {/* Image */}
                <div className="relative overflow-hidden">
                  <PlaceholderImage
                    width={project.featured ? 600 : 400}
                    height={300}
                    text={project.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    rounded="none"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                      {project.status}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={categoryColors[project.category as keyof typeof categoryColors]}
                    >
                      {project.category}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <CardHeader className="p-0">
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {project.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0 space-y-4">
                      {/* Project Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          {project.duration}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Users className="w-4 h-4 mr-2" />
                          {project.team}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div>
                        <p className="text-sm font-medium mb-2">Tecnologías:</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  <div className="mt-6">
                    <Button variant="outline" className="w-full group-hover:bg-blue-50 group-hover:border-blue-200">
                      Ver Detalles
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
          >
            Ver Todos los Proyectos
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
