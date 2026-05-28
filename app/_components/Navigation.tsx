'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { useDict, useLocale } from './LangProvider'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const dict = useDict()
  const lang = useLocale()

  const navLinks = [
    { label: dict.nav.projects, href: `/${lang}/#projects` },
    { label: dict.nav.about, href: `/${lang}/about` },
    { label: dict.nav.contact, href: `/${lang}/contact` },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-primary/95 backdrop-blur-md shadow-lg shadow-black/20 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href={`/${lang}`} className="flex flex-col leading-none cursor-pointer">
            <span className="font-serif text-cream text-xl tracking-wide">Harmony Life</span>
            <span className="text-gold text-[10px] tracking-[0.25em] uppercase font-sans">Koh Samui</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-cream/80 hover:text-gold text-sm tracking-wide transition-colors duration-200 cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${lang}/contact`}
              className="border border-gold/60 text-gold hover:bg-gold hover:text-primary text-sm px-5 py-2 rounded-sm transition-all duration-300 tracking-wider cursor-pointer"
            >
              {dict.nav.bookConsultation}
            </Link>
            <ThemeToggle />
            <LanguageSwitcher />
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] cursor-pointer z-50"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <motion.span animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} className="block w-6 h-px bg-cream" />
            <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }} className="block w-6 h-px bg-cream" />
            <motion.span animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} className="block w-6 h-px bg-cream" />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-primary flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.div key={link.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}>
                <Link href={link.href} onClick={() => setMenuOpen(false)} className="font-serif text-3xl text-cream hover:text-gold transition-colors duration-200 cursor-pointer">
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Link href={`/${lang}/contact`} onClick={() => setMenuOpen(false)} className="border border-gold text-gold px-8 py-3 text-sm tracking-widest uppercase cursor-pointer">
                {dict.nav.bookConsultation}
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="flex items-center gap-4">
              <ThemeToggle />
              <LanguageSwitcher />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
