'use client'

import { motion } from 'framer-motion'
import type { Project } from '../../_data/projects'

interface ProjectHeroProps {
  project: Project
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const heroBg = project.thumbnail || project.images[0]

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[420px]">
      {/* Background image */}
      {heroBg ? (
        <>
          <div className="absolute inset-0">
            <img src={heroBg} alt={project.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-scrim/90 via-scrim/70 to-scrim/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-scrim via-transparent to-scrim/60" />
        </>
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${project.gradientFrom}, #1a1a2e)` }} />
      )}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-primary" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-onscrim-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">{project.type} — {project.location}</p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-onscrim leading-tight mb-4">
            {project.name}
          </h1>
          <p className="text-onscrim-gold text-lg mb-4">{project.tagline}</p>
          <p className="text-onscrim/60 max-w-2xl text-base leading-relaxed">{project.description}</p>
        </motion.div>
      </div>
    </section>
  )
}
