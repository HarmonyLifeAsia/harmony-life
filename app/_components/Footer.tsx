'use client'

import Link from 'next/link'
import Image from 'next/image'
import NewsletterForm from './NewsletterForm'
import { useDict, useLocale } from './LangProvider'
import { CONTACT_EMAIL, CALENDLY_URL } from '../_data/site'

const socialIcons = [
  { label: 'Instagram', href: '#', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { label: 'Facebook', href: '#', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  { label: 'LinkedIn', href: '#', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
]

export default function Footer() {
  const dict = useDict()
  const lang = useLocale()
  const t = dict.footer
  const nav = dict.nav

  return (
    <footer className="bg-primary border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Image
                src="/images/logo/logo-full-light.webp"
                alt="Harmony Life"
                width={208}
                height={160}
                unoptimized
                className="h-20 w-auto mb-3"
              />
              <p className="text-gold text-xs tracking-[0.25em] uppercase font-sans">Koh Samui, Thailand</p>
            </div>
            <p className="text-cream/60 text-sm leading-relaxed max-w-xs mb-6">{t.tagline}</p>
            <div className="flex gap-4">
              {socialIcons.map(({ label, href, icon }) => (
                <a key={label} href={href} aria-label={label} className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center text-gold/60 hover:text-gold hover:border-gold transition-all duration-200 cursor-pointer">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={icon} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-cream text-xs tracking-[0.2em] uppercase font-sans mb-5">{t.quickLinks}</p>
            <ul className="space-y-3">
              {[
                { label: nav.projects, href: `/${lang}/#projects` },
                { label: nav.about, href: `/${lang}/about` },
                { label: nav.contact, href: `/${lang}/contact` },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-cream/50 hover:text-gold text-sm transition-colors duration-200 cursor-pointer">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-gold text-sm transition-colors duration-200 cursor-pointer">
                  {nav.bookConsultation}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <p className="text-cream text-xs tracking-[0.2em] uppercase font-sans mb-5">{t.contact}</p>
            <ul className="space-y-3">
              <li className="text-cream/50 text-sm">Harmony Life Samui Co., Ltd.</li>
              <li className="text-cream/50 text-sm">Bo Phut, Koh Samui<br />Surat Thani 84320, Thailand</li>
              <li><a href={`mailto:${CONTACT_EMAIL}`} className="text-cream/50 hover:text-gold text-sm transition-colors cursor-pointer">{CONTACT_EMAIL}</a></li>
            </ul>
            <div className="mt-8">
              <p className="text-cream/40 text-xs mb-3 tracking-wide">{t.newsletter}</p>
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="border-t border-gold/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/30 text-xs">© {new Date().getFullYear()} Harmony Life Samui Co., Ltd. {t.rights}</p>
          <div className="flex gap-6">
            <Link href={`/${lang}/privacy`} className="text-cream/30 hover:text-cream/60 text-xs transition-colors cursor-pointer">{t.privacy}</Link>
            <a href="#" className="text-cream/30 hover:text-cream/60 text-xs transition-colors cursor-pointer">{t.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
