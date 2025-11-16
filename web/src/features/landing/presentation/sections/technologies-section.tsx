import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/cards/card";
import { Badge } from "@/shared/ui/badges/badge";
import { SectionTitle, Subtitle } from "@/shared/ui/texts/titles";
import { BodyText } from "@/shared/ui/texts/text";
import { PlaceholderImage } from "@/shared/ui/media/images";
import { 
  Printer, 
  Cpu, 
  Zap, 
  Cog, 
  Microscope, 
  Palette,
  ArrowRight
} from "lucide-react";

const technologies = [
  {
    icon: Printer,
    title: "Impresión 3D",
    description: "Tecnología FDM, SLA y SLS para prototipado rápido y manufactura de piezas complejas.",
    features: ["Filamentos especializados", "Alta precisión", "Materiales diversos"],
    status: "Disponible",
    color: "blue"
  },
  {
    icon: Cpu,
    title: "Diseño Paramétrico",
    description: "Software CAD avanzado para modelado 3D y simulación de productos innovadores.",
    features: ["Fusion 360", "SolidWorks", "Grasshopper"],
    status: "Disponible",
    color: "purple"
  },
  {
    icon: Zap,
    title: "Electrónica",
    description: "Desarrollo de prototipos electrónicos con Arduino, Raspberry Pi y componentes IoT.",
    features: ["Microcontroladores", "Sensores", "Actuadores"],
    status: "En desarrollo",
    color: "green"
  },
  {
    icon: Cog,
    title: "Manufactura CNC",
    description: "Mecanizado de precisión para materiales metálicos y no metálicos.",
    features: ["Fresado CNC", "Torneado", "Corte láser"],
    status: "Próximamente",
    color: "orange"
  },
  {
    icon: Microscope,
    title: "Análisis de Materiales",
    description: "Caracterización y testing de propiedades mecánicas de materiales impresos.",
    features: ["Ensayos mecánicos", "Microscopía", "Análisis térmico"],
    status: "Disponible",
    color: "cyan"
  },
  {
    icon: Palette,
    title: "Diseño Digital",
    description: "Herramientas de diseño gráfico, UX/UI y visualización 3D para proyectos.",
    features: ["Adobe Creative", "Blender", "Figma"],
    status: "Disponible",
    color: "pink"
  }
];

const statusColors = {
  "Disponible": "bg-green-500",
  "En desarrollo": "bg-yellow-500",
  "Próximamente": "bg-blue-500"
};

export function TechnologiesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <Cog className="w-4 h-4 mr-2" />
            Tecnologías Disponibles
          </Badge>
          
          <SectionTitle gradient>
            Equipamiento de Vanguardia
          </SectionTitle>
          
          <Subtitle className="max-w-3xl mx-auto">
            Descubre las tecnologías que impulsan la innovación en nuestro laboratorio 
            de fabricación digital
          </Subtitle>
        </div>

        {/* Technologies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {technologies.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${tech.color}-400 to-${tech.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge 
                      className={`${statusColors[tech.status as keyof typeof statusColors]} text-white text-xs`}
                    >
                      {tech.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {tech.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {tech.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {tech.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <ArrowRight className="w-3 h-3 mr-2 text-blue-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Equipment */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <Badge className="mb-4">Equipo Destacado</Badge>
              <SectionTitle size="md" className="mb-4">
                Impresoras 3D de Última Generación
              </SectionTitle>
              <BodyText size="lg" className="mb-6">
                Nuestro laboratorio cuenta con una flota de impresoras 3D que incluye 
                tecnologías FDM, SLA y SLS, permitiendo trabajar con una amplia gama 
                de materiales desde plásticos básicos hasta metales y cerámicas avanzadas.
              </BodyText>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">8</div>
                <div className="text-sm text-muted-foreground">Impresoras 3D</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">25+</div>
                <div className="text-sm text-muted-foreground">Materiales</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">0.1mm</div>
                <div className="text-sm text-muted-foreground">Precisión</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-orange-600">24/7</div>
                <div className="text-sm text-muted-foreground">Operación</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <PlaceholderImage
              width={600}
              height={400}
              text="Impresoras 3D"
              className="w-full h-auto shadow-lg"
              rounded="xl"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
