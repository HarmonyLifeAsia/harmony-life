export interface Project {
  slug: string
  name: string
  tagline: string
  description: string
  longDescription: string
  type: string
  bedrooms: string
  bathrooms: string
  priceFrom: string
  units: number
  area: string
  landArea: string
  poolSize: string
  status: 'Selling' | 'Coming Soon' | 'Under Construction'
  location: string
  features: string[]
  accentColor: string
  gradientFrom: string
  gradientTo: string
}

export const projects: Project[] = [
  {
    slug: 'harmony-life-one',
    name: 'Harmony Life One',
    tagline: 'Boho-Chic Villas in Nature',
    description: 'Organic architecture meets tropical luxury. Private villas surrounded by lush gardens, just 3 minutes from the beach.',
    longDescription: 'Harmony Life One is where bohemian design philosophy meets tropical luxury living. Each villa is crafted to blend seamlessly with the surrounding natural landscape, featuring organic materials, open-air living spaces, and private tropical gardens. Located just 3 minutes from the beach, these villas offer the perfect balance of privacy and accessibility.',
    type: 'Villa',
    bedrooms: '2BR & 3BR',
    bathrooms: '2–3',
    priceFrom: '฿8,500,000',
    units: 12,
    area: '180–280 m²',
    landArea: '400–600 m²',
    poolSize: '4×8 m',
    status: 'Selling',
    location: 'Bophut, Koh Samui',
    features: [
      'Private infinity pool',
      'Tropical garden',
      'Outdoor sala / lounge',
      'Western-standard kitchen',
      'Smart home system',
      'European insulation & ventilation',
      '3 min walk to beach',
      'Full property management available',
    ],
    accentColor: '#C9A876',
    gradientFrom: '#2D4A3E',
    gradientTo: '#1a2e24',
  },
  {
    slug: 'harmony-life-hill',
    name: 'Harmony Life Hill',
    tagline: 'Hillside Villas with Panoramic Sea Views',
    description: '6 exclusive hillside villas with breathtaking sea views, rooftop terraces, and private infinity pools.',
    longDescription: 'Perched on a private hillside with commanding views of the Gulf of Thailand, Harmony Life Hill represents the pinnacle of luxury living on Koh Samui. Each of the six exclusive villas features expansive rooftop terraces, private infinity pools that seem to merge with the horizon, and interiors finished to the highest European standards.',
    type: 'Luxury Villa',
    bedrooms: '3BR',
    bathrooms: '3',
    priceFrom: '฿18,500,000',
    units: 6,
    area: '320–420 m²',
    landArea: '800–1,200 m²',
    poolSize: '5×10 m',
    status: 'Selling',
    location: 'Hillside, Koh Samui',
    features: [
      'Panoramic sea view',
      'Private rooftop terrace',
      'Infinity edge pool',
      'Home cinema room',
      'Wine cellar',
      'European kitchen & appliances',
      'Wellness zone (sauna, ice bath)',
      'Concierge service',
    ],
    accentColor: '#C9A876',
    gradientFrom: '#1a2e3e',
    gradientTo: '#0d1a2e',
  },
  {
    slug: 'harmony-life-apartments',
    name: 'Harmony Life Apartments',
    tagline: '71 Premium Apartments in the Heart of Koh Samui',
    description: 'Contemporary luxury apartments in 3 configurations (39–133 m²), centrally located with resort-style amenities.',
    longDescription: 'Harmony Life Apartments brings European condominium standards to the heart of Koh Samui. With 71 thoughtfully designed units across three configurations, from intimate studios to expansive penthouses, this development caters to investors and lifestyle buyers alike. The building features a rooftop infinity pool, co-working lounge, fitness center, and a ground-floor café.',
    type: 'Apartment',
    bedrooms: 'Studio, 1BR & 2BR',
    bathrooms: '1–2',
    priceFrom: '฿3,200,000',
    units: 71,
    area: '39–133 m²',
    landArea: 'N/A',
    poolSize: 'Rooftop 6×20 m',
    status: 'Under Construction',
    location: 'Central Koh Samui',
    features: [
      'Rooftop infinity pool',
      'Fitness & wellness center',
      'Co-working lounge',
      'Ground-floor café & restaurant',
      'Underground parking',
      'Smart lock & security',
      '3 unit configurations',
      'Guaranteed rental program',
    ],
    accentColor: '#C9A876',
    gradientFrom: '#2e1a2e',
    gradientTo: '#1a0d2e',
  },
  {
    slug: 'harmony-life-beach-club',
    name: 'Harmony Life Beach Club',
    tagline: 'World-Class Beach Club Experience',
    description: 'An exclusive beach club and social destination — the crown jewel of the Harmony Life community.',
    longDescription: 'Harmony Life Beach Club will redefine leisure on Koh Samui. Designed as the social heart of the Harmony Life community, this world-class facility will feature beachfront dining, curated cocktail bars, an event stage, and exclusive access for Harmony Life property owners. More details coming soon.',
    type: 'Beach Club',
    bedrooms: 'N/A',
    bathrooms: 'N/A',
    priceFrom: 'Membership TBA',
    units: 0,
    area: '2,000 m²',
    landArea: 'Beachfront',
    poolSize: 'Beach access',
    status: 'Coming Soon',
    location: 'Beachfront, Koh Samui',
    features: [
      'Beachfront dining',
      'Cocktail & champagne bar',
      'Event stage & private parties',
      'Exclusive owner access',
      'DJ & live music',
      'Water sports center',
      'Kids zone',
      'VIP cabanas',
    ],
    accentColor: '#C9A876',
    gradientFrom: '#1a2e3a',
    gradientTo: '#0d1e2e',
  },
  {
    slug: 'harmony-life-five',
    name: 'Harmony Life [V]',
    tagline: 'A New Chapter — Coming Soon',
    description: 'The next landmark project by Harmony Life. Details to be revealed. Register your interest for priority access.',
    longDescription: 'The fifth chapter in the Harmony Life story is being crafted with the same obsessive attention to detail and commitment to European quality that defines all our developments. Register your interest today for priority access to floor plans, pricing, and launch events.',
    type: 'TBA',
    bedrooms: 'TBA',
    bathrooms: 'TBA',
    priceFrom: 'TBA',
    units: 0,
    area: 'TBA',
    landArea: 'TBA',
    poolSize: 'TBA',
    status: 'Coming Soon',
    location: 'Koh Samui',
    features: [
      'Details coming soon',
      'Register interest for priority access',
    ],
    accentColor: '#C9A876',
    gradientFrom: '#2e2a1a',
    gradientTo: '#1a160d',
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
