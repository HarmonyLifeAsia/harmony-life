import type { Metadata } from 'next'
import ContactContent from './ContactContent'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the Harmony Life team. Book a private consultation, request project details, or chat on WhatsApp. Available in EN, PL, DE & Thai.',
}

export default function ContactPage() {
  return <ContactContent />
}
