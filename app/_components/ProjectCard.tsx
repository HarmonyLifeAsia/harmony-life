'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '../_data/projects'
import { localizeProject, statusLabel } from '../_data/localizeProject'
import { useDict } from './LangProvider'

interface ProjectCardProps {
  project: Project
  index: number
  lang: string
}

const statusColors = {
  'Selling': 'bg-jungle/20 text-jungle-light border-jungle/30',
  'Coming Soon': 'bg-gold/10 text-gold border-gold/30',
  'Under Construction': 'bg-blue-500/10 text-blue-300 border-blue-400/30',
  'Sold Out': 'bg-cream/10 text-cream/60 border-cream/20',
}

export default function ProjectCard({ project: rawProject, index, lang }: ProjectCardProps) {
  const dict = useDict()
  const t = dict.projects
  const project = localizeProject(rawProject, dict)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <Link href={`/${lang}/projects/${project.slug}`} className="block cursor-pointer">
        <div className="relative bg-charcoal/40 border border-gold/10 rounded-lg overflow-hidden hover:border-gold/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
          <div className="relative h-56 overflow-hidden">
            <Image
              src={project.thumbnail}
              alt={project.name}
              fill
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-0"
            />
            {project.images[3] && (
              <Image
                src={project.images[3]}
                alt={`${project.name} — interior`}
                fill
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                className="object-cover opacity-0 scale-105 transition-all duration-700 group-hover:opacity-100 group-hover:scale-100"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

            <div className="absolute top-3 left-3 z-20">
              <span className={`inline-flex text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border font-medium backdrop-blur-sm ${statusColors[project.status]}`}>
                {statusLabel(project.status, dict)}
              </span>
            </div>

            <div className="absolute top-3 right-3 z-20">
              <span className="text-[10px] text-onscrim/80 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-sm tracking-wide">
                {project.type}
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-[10px] text-onscrim-gold tracking-[0.3em] uppercase font-sans">{t.insideView}</span>
            </div>
          </div>

          <div className="p-5">
            <h3 className="font-serif text-xl text-cream mb-1 group-hover:text-gold transition-colors duration-300">{project.name}</h3>
            <p className="text-gold text-xs tracking-wider mb-3">{project.tagline}</p>
            <p className="text-cream/50 text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gold/10">
              <div>
                <p className="text-cream/30 text-[10px] uppercase tracking-wide mb-0.5">{t.beds}</p>
                <p className="text-cream/80 text-xs font-medium">{project.bedrooms}</p>
              </div>
              <div>
                <p className="text-cream/30 text-[10px] uppercase tracking-wide mb-0.5">{t.from}</p>
                <p className="text-gold text-xs font-medium">{project.priceFrom}</p>
              </div>
              <div>
                <p className="text-cream/30 text-[10px] uppercase tracking-wide mb-0.5">{t.units}</p>
                <p className="text-cream/80 text-xs font-medium">{project.units > 0 ? project.units : 'TBA'}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gold/60 group-hover:text-gold transition-colors duration-200 flex items-center gap-1.5">
                {t.viewDetails}
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
