import type { Metadata } from 'next'
import AboutContent from './AboutContent'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'The story of Harmony Life — from Warsaw to Koh Samui. Founded by Robert Jakub Szymański with 20+ years of premium residential development experience.',
}

export default function AboutPage() {
  return <AboutContent />
}
