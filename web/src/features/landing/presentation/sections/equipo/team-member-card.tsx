"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin, Github, Mail, Twitter, Award, Calendar, ChevronRight } from "lucide-react";
import type { TeamMember } from "./types";

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
  onSelect: (member: TeamMember) => void;
}

export function TeamMemberCard({ member, index, onSelect }: TeamMemberCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => onSelect(member)}
      className="group cursor-pointer"
    >
      <div className="relative bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
        {member.esDirectivo && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold rounded-full">
              <Award className="w-3 h-3" />
              Directivo
            </span>
          </div>
        )}

        <div className="relative mb-6">
          <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden ring-4 ring-gray-100 group-hover:ring-orange-200 transition-all duration-500 relative">
            <Image
              src={member.imagen}
              alt={member.nombre}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
            {member.nombre}
          </h3>
          <p className="text-orange-600 font-medium text-sm mt-1">{member.cargo}</p>
          <p className="text-gray-500 text-xs mt-1 mb-3">{member.especialidad}</p>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">{member.bio}</p>

          <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mb-4">
            <Calendar className="w-3 h-3" />
            {member.experiencia} de experiencia
          </div>

          <div className="flex justify-center gap-2">
            {member.social.linkedin && (
              <a
                href={member.social.linkedin}
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-600 hover:text-white transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {member.social.github && (
              <a
                href={member.social.github}
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {member.social.twitter && (
              <a
                href={member.social.twitter}
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-sky-500 hover:text-white transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            <a
              href={`mailto:${member.social.email}`}
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-orange-500 hover:text-white transition-all"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-5 h-5 text-orange-500" />
        </div>
      </div>
    </motion.article>
  );
}
