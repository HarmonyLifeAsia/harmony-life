# PROMPT DO CLAUDE CODE — HARMONYLIFE.ASIA

Wklej poniższy tekst w Claude Code po uruchomieniu go w folderze projektu:

---

Build a premium, cinematic real estate investment website for Harmony Life — a luxury villa and apartment developer on Koh Samui, Thailand. The brand combines European construction standards with tropical Asian harmony philosophy. The founder Robert Jakub Szymański has 20+ years of experience and 150+ residential projects in Warsaw before bringing his expertise to Koh Samui.

## Brand Identity
- Brand name: Harmony Life
- Tagline: "Invest in harmony. Live in paradise."
- Color palette: deep charcoal/dark navy (#1a1a2e) as primary background, warm gold (#C9A876) as accent, soft whites and creams for text, subtle tropical greens for nature references
- Typography: elegant serif for headings (like Playfair Display), clean sans-serif for body (like Inter or Outfit)
- Mood: cinematic luxury, tropical serenity, trustworthy investment — NOT flashy Dubai-style, but refined European elegance meets tropical warmth
- Languages: build the structure for EN as default, with PL and DE language switches (just the switcher UI for now)

## Pages & Sections

### 1. HOME PAGE
- **Hero**: Full-screen cinematic hero with parallax effect, large headline "Luxury Living on Koh Samui", subtitle about European quality + tropical paradise. Animated text reveal on load. CTA buttons: "Explore Projects" and "Book a Consultation". Background: placeholder for a dramatic villa/ocean view image (use a gradient placeholder with text "HERO IMAGE" for now)
- **Brand Promise Bar**: 4 animated counters — "5 Projects", "20+ Years Experience", "150+ Projects in Europe", "European Build Standards"
- **Projects Showcase**: Horizontal scrolling cards or grid for 5 projects (use placeholder images with project names). Each card shows: project name, short description, starting price, number of units, status badge (Selling / Coming Soon / Under Construction). Cards animate on scroll. Projects:
  1. Harmony Life One — Boho-style villas, 2BR & 3BR, 3 min from beach, surrounded by nature
  2. Harmony Life Hill — 6 luxury hillside villas with sea views, 3BR, rooftop terraces, private pools
  3. Harmony Life Apartments — 71 premium apartments, 3 types (39-133 m²), in the heart of Koh Samui
  4. Harmony Life Beach Club — World-class beach club, exclusive social space (Coming Soon)
  5. Harmony Life [Project 5] — Placeholder for upcoming project (Coming Soon)
- **Why Invest Section**: 3 columns with icons — "Guaranteed ROI" (passive rental income), "European Build Quality" (insulation, ventilation, premium materials), "Full Property Management" (hassle-free ownership)
- **Lifestyle Section**: Split layout — left side text about island living (wellness, nature, balance), right side placeholder for lifestyle photo. Mention: private pools, wellness zones (sauna, ice bath, yoga space), tropical gardens
- **About the Founder**: Short section with placeholder for Robert's photo, brief bio about his background, quote from him about the vision
- **Testimonials**: Carousel with 3-4 placeholder testimonials from investors
- **CTA Section**: "Schedule a Private Consultation" with a contact form (name, email, phone, message, preferred language dropdown)
- **Footer**: Company info (Harmony Life Samui Co., Ltd., address in Bo Phut), social media links, quick navigation, newsletter signup

### 2. INDIVIDUAL PROJECT PAGE (template)
- Project hero with image gallery placeholder (large main image + thumbnails)
- Key specs bar (bedrooms, bathrooms, pool size, land area, interior area)
- Project description with features list
- Floor plan section (placeholder for floor plan images)
- 3D visualization section (large placeholder area marked "3D VISUALIZATION" — this is where you'll add 3D renders later)
- Payment schedule / pricing table
- Location map section (embed Google Maps placeholder for Koh Samui)
- Download brochure CTA
- Contact/inquiry form specific to this project

### 3. ABOUT PAGE
- Brand story — the journey from Warsaw to Koh Samui
- Founder section with full bio
- Company values (4 pillars: Quality, Harmony, Nature, Community)
- Team section (placeholder for team members)
- Company registration info

### 4. CONTACT PAGE
- Contact form
- Company details (address, email, phone)
- Google Maps embed placeholder
- WhatsApp direct link button
- "Book a Video Call" CTA

## Technical Requirements
- Next.js 15 with App Router and TypeScript
- Tailwind CSS for styling
- Framer Motion for ALL animations: scroll-triggered reveals, parallax hero, staggered card animations, smooth page transitions, hover effects on cards and buttons, counter animations, text reveal animations
- Fully responsive (mobile-first approach)
- SEO optimized: proper meta tags, Open Graph tags, structured data for real estate
- Fast loading: lazy load images, optimize for Core Web Vitals
- Smooth scroll behavior
- Dark elegant theme as default
- All placeholder images should be styled gradient boxes with labels so I know where to put real photos later
- Use shadcn/ui components where appropriate
- Add subtle micro-interactions: button hover effects, card lift on hover, smooth transitions between pages

## Component Architecture
- Reusable ProjectCard component
- Reusable SectionHeading component with animated underline
- Navigation with transparent-to-solid scroll effect
- Mobile hamburger menu with smooth slide-in animation
- Image gallery component ready for future 3D renders
- Contact form with validation
- Language switcher component (EN/PL/DE)
- Cookie consent banner (GDPR compliant)
- WhatsApp floating button

Build the entire site now. Start with the layout, navigation, and home page, then create the project template page, about page, and contact page. Make it look like a $15K agency build — cinematic, elegant, trustworthy.
