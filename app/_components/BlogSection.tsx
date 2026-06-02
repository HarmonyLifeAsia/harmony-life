'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { useDict } from './LangProvider'

interface Post {
  category: string
  date: string
  readTime: string
  title: string
  excerpt: string
}

export default function BlogSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const dict = useDict()
  const t = dict.blog
  const posts = t.posts as Post[]

  return (
    <section id="blog" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-4">
              {t.eyebrow}
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream leading-tight mb-3">
              {t.title}
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="text-cream/65 text-base max-w-xl">
              {t.subtitle}
            </motion.p>
          </div>
          <a href="#blog" className="self-start sm:self-auto border border-gold/30 text-gold hover:bg-gold hover:text-primary text-sm px-5 py-2.5 rounded-sm transition-all duration-300 tracking-wider whitespace-nowrap cursor-pointer">
            {t.allArticles}
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + (i % 3) * 0.08 }}
              className="group flex flex-col bg-charcoal/30 border border-gold/10 rounded-xl overflow-hidden hover:border-gold/30 transition-colors duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={`/images/lifestyle-${i + 1}.webp`}
                  alt={post.title}
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 bg-primary/85 backdrop-blur text-cream text-[11px] font-medium px-3 py-1 rounded-full">
                  {post.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-cream/40 text-[11px] mb-3">
                  <span>{post.date}</span>
                  <span className="opacity-50">·</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-serif text-lg text-cream leading-snug mb-3">{post.title}</h3>
                <p className="text-cream/60 text-sm leading-relaxed flex-1">{post.excerpt}</p>
                <a href="#blog" className="mt-5 inline-flex items-center gap-2 text-gold hover:text-gold-light text-sm font-medium transition-colors cursor-pointer">
                  {t.readMore}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
