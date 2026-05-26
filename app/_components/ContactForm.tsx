'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface ContactFormProps {
  projectName?: string
  compact?: boolean
}

export default function ContactForm({ projectName, compact = false }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    language: 'EN',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1200))
    setStatus('success')
  }

  const inputClass = 'w-full bg-white/5 border border-gold/20 text-cream text-sm px-4 py-3 rounded-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors'
  const labelClass = 'block text-cream/50 text-xs tracking-wide uppercase mb-1.5'

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl text-cream mb-2">Thank you</h3>
        <p className="text-cream/60 text-sm">We&apos;ll be in touch within 24 hours.</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {projectName && (
        <div className="bg-gold/10 border border-gold/20 rounded-sm px-4 py-3">
          <p className="text-gold/80 text-xs tracking-wide">Enquiry about: <span className="font-medium">{projectName}</span></p>
        </div>
      )}

      <div className={compact ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'grid grid-cols-1 md:grid-cols-2 gap-5'}>
        <div>
          <label htmlFor="name" className={labelClass}>Full Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className={labelClass}>Phone / WhatsApp</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+1 234 567 890"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="language" className={labelClass}>Preferred Language</label>
          <select
            id="language"
            name="language"
            value={form.language}
            onChange={handleChange}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="EN">English</option>
            <option value="PL">Polski</option>
            <option value="DE">Deutsch</option>
            <option value="TH">Thai</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>Message</label>
        <textarea
          id="message"
          name="message"
          rows={compact ? 3 : 5}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us about your investment goals or lifestyle vision…"
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-gold text-primary font-medium py-4 text-sm tracking-wider hover:bg-gold-light transition-colors duration-300 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sending…
          </span>
        ) : 'Send Enquiry'}
      </button>

      <p className="text-cream/25 text-xs text-center">
        By submitting, you agree to our Privacy Policy. We never share your data.
      </p>
    </form>
  )
}
