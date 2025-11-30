"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin, Github, Mail } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  social?: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: "Carlos Mendoza",
    role: "Director FabLab",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    bio: "Ingeniero con más de 10 años de experiencia en fabricación digital y gestión de laboratorios.",
    social: {
      linkedin: "#",
      github: "#",
      email: "carlos@fablab.cl",
    },
  },
  {
    name: "María González",
    role: "Líder de Innovación",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    bio: "Especialista en diseño de productos y metodologías de innovación centradas en el usuario.",
    social: {
      linkedin: "#",
      github: "#",
      email: "maria@fablab.cl",
    },
  },
  {
    name: "Diego Fuentes",
    role: "Ingeniero de Hardware",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    bio: "Experto en electrónica, IoT y prototipado rápido con impresión 3D y CNC.",
    social: {
      linkedin: "#",
      github: "#",
      email: "diego@fablab.cl",
    },
  },
  {
    name: "Valentina Ríos",
    role: "Desarrolladora Full Stack",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    bio: "Desarrolladora apasionada por crear aplicaciones web y móviles con tecnologías modernas.",
    social: {
      linkedin: "#",
      github: "#",
      email: "valentina@fablab.cl",
    },
  },
  {
    name: "Andrés Silva",
    role: "Especialista en Robótica",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    bio: "Ingeniero mecatrónico con experiencia en automatización y sistemas robóticos industriales.",
    social: {
      linkedin: "#",
      github: "#",
      email: "andres@fablab.cl",
    },
  },
  {
    name: "Camila Torres",
    role: "Diseñadora UX/UI",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    bio: "Diseñadora creativa enfocada en experiencias digitales intuitivas y accesibles.",
    social: {
      linkedin: "#",
      github: "#",
      email: "camila@fablab.cl",
    },
  },
];

export function TeamSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decoración de líneas naranjas */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4"
          >
            Nuestro Equipo
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Las mentes detrás de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              FabLab
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Un equipo multidisciplinario comprometido con la innovación, 
            la educación y el desarrollo tecnológico de nuestra comunidad.
          </motion.p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative bg-gray-50 rounded-3xl p-6 transition-all duration-500 hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100 hover:shadow-2xl hover:shadow-orange-200/50 hover:-translate-y-2">
                {/* Decoración de esquina */}
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden rounded-tr-3xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-400/20 to-transparent transform rotate-45 translate-x-16 -translate-y-16 group-hover:from-orange-400/40 transition-colors duration-500" />
                </div>

                {/* Imagen del miembro */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden ring-4 ring-white shadow-lg group-hover:ring-orange-200 transition-all duration-500 relative">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  {/* Badge de rol */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                    <span className="inline-block px-4 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold rounded-full shadow-lg">
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Información */}
                <div className="text-center pt-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>

                  {/* Social Links */}
                  <div className="flex justify-center gap-3">
                    {member.social?.linkedin && (
                      <a
                        href={member.social.linkedin}
                        className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                        aria-label={`LinkedIn de ${member.name}`}
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.social?.github && (
                      <a
                        href={member.social.github}
                        className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:scale-110"
                        aria-label={`GitHub de ${member.name}`}
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {member.social?.email && (
                      <a
                        href={`mailto:${member.social.email}`}
                        className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                        aria-label={`Email de ${member.name}`}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 mb-6">
            ¿Quieres ser parte de nuestro equipo?
          </p>
          <a
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-orange-300/50 hover:scale-105 transition-all duration-300"
          >
            Únete a FabLab
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
