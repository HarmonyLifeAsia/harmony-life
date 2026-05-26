'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Project } from '../_data/projects'

interface ProjectCardProps {
  project: Project
  index: number
}

const statusColors = {
  'Selling': 'bg-jungle/20 text-jungle-light border-jungle/30',
  'Coming Soon': 'bg-gold/10 text-gold border-gold/30',
  'Under Construction': 'bg-blue-500/10 text-blue-300 border-blue-400/30',
  'Sold Out': 'bg-cream/10 text-cream/60 border-cream/20',
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <Link href={`/projects/${project.slug}`} className="block cursor-pointer">
        <div className="relative bg-charcoal/40 border border-gold/10 rounded-lg overflow-hidden hover:border-gold/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
          {/* Image */}
          <div className="relative h-56 overflow-hidden">
            <img
              src={project.thumbnail}
              alt={project.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Status badge */}
            <div className="absolute top-3 left-3">
              <span className={`inline-flex text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border font-medium backdrop-blur-sm ${statusColors[project.status]}`}>
                {project.status}
              </span>
            </div>

            {/* Type badge */}
            <div className="absolute top-3 right-3">
              <span className="text-[10px] text-cream/80 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-sm tracking-wide">
                {project.type}
              </span>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-colors duration-500" />
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-serif text-xl text-cream mb-1 group-hover:text-gold transition-colors duration-300">
              {project.name}
            </h3>
            <p className="text-gold text-xs tracking-wider mb-3">{project.tagline}</p>
            <p className="text-cream/50 text-sm leading-relaxed mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Key specs */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gold/10">
              <div>
                <p className="text-cream/30 text-[10px] uppercase tracking-wide mb-0.5">Beds</p>
                <p className="text-cream/80 text-xs font-medium">{project.bedrooms}</p>
              </div>
              <div>
                <p className="text-cream/30 text-[10px] uppercase tracking-wide mb-0.5">From</p>
                <p className="text-gold text-xs font-medium">{project.priceFrom}</p>
              </div>
              <div>
                <p className="text-cream/30 text-[10px] uppercase tracking-wide mb-0.5">Units</p>
                <p className="text-cream/80 text-xs font-medium">
                  {project.units > 0 ? project.units : 'TBA'}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gold/60 group-hover:text-gold transition-colors duration-200 flex items-center gap-1.5">
                View Details
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <span className="text-[10px] text-cream/30">{project.location}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
