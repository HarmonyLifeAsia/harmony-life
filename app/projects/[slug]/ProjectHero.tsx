'use client'

import { motion } from 'framer-motion'
import type { Project } from '../../_data/projects'

interface ProjectHeroProps {
  project: Project
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <section
      className="relative pt-32 pb-20 px-6 overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${project.gradientFrom}, #1a1a2e)` }}
    >
      {/* Ambient overlay */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(201,168,118,0.07) 0%, transparent 60%)',
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-primary" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">{project.type} — {project.location}</p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream leading-tight mb-4">
            {project.name}
          </h1>
          <p className="text-gold text-lg mb-4">{project.tagline}</p>
          <p className="text-cream/60 max-w-2xl text-base leading-relaxed">{project.description}</p>
        </motion.div>
      </div>
    </section>
  )
}
