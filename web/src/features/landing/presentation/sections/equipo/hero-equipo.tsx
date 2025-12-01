"use client";

import { motion } from "framer-motion";
import { Users, Award, Sparkles } from "lucide-react";

export function HeroEquipo() {
  return (
    <section className="relative min-h-[60vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-sm font-medium mb-6"
          >
            <Users className="w-4 h-4" />
            Conoce a nuestro equipo
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">
            Las personas detrás de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              FabLab
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Un equipo multidisciplinario de apasionados por la tecnología, 
            la innovación y la educación. Juntos, hacemos posible que las ideas se conviertan en realidad.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-500" />
              <span>8 Expertos</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              <span>500+ Miembros</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span>1000+ Proyectos</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
