"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HeroEquipo } from "./hero-equipo";
import { TeamMemberCard } from "./team-member-card";
import { TeamMemberModal } from "./team-member-modal";
import { MiembroDestacadoCard } from "./miembro-destacado-card";
import { ValoresSection } from "./valores-section";
import { MembresiaSection } from "./membresia-section";
import { equipoCentral, miembrosDestacados } from "./data";
import type { TeamMember } from "./types";

export function EquipoPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const directivos = equipoCentral.filter((m) => m.esDirectivo);
  const staff = equipoCentral.filter((m) => !m.esDirectivo);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroEquipo />

      {/* Directivos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4">
              Liderazgo
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Equipo Directivo
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Los líderes que guían la visión y estrategia de FabLab INACAP.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {directivos.map((member, index) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                index={index}
                onSelect={setSelectedMember}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Staff */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              Expertos
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nuestros Especialistas
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Profesionales apasionados que hacen posible cada proyecto.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staff.map((member, index) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                index={index}
                onSelect={setSelectedMember}
              />
            ))}
          </div>
        </div>
      </section>

      <ValoresSection />

      {/* Miembros Destacados */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4">
              Comunidad
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Miembros Destacados
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Historias de éxito de nuestra comunidad de makers e innovadores.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {miembrosDestacados.map((miembro, index) => (
              <MiembroDestacadoCard key={miembro.id} miembro={miembro} index={index} />
            ))}
          </div>
        </div>
      </section>

      <MembresiaSection />

      <TeamMemberModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}
