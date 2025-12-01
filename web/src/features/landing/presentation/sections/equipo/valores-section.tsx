"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/utils";
import { valoresLab } from "./data";

export function ValoresSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold mb-4">
            Nuestra Filosofía
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Valores que nos{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              definen
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Estos principios guían cada decisión que tomamos y cada proyecto que apoyamos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valoresLab.map((valor, index) => {
            const IconComponent = valor.icono;
            return (
              <motion.div
                key={valor.titulo}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-orange-500/50 transition-colors group"
              >
                <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", valor.color)}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{valor.titulo}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{valor.descripcion}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
