'use client'

interface ImagePlaceholderProps {
  label: string
  aspectRatio?: string
  gradientFrom?: string
  gradientTo?: string
  className?: string
}

export default function ImagePlaceholder({
  label,
  aspectRatio = 'aspect-video',
  gradientFrom = '#2D4A3E',
  gradientTo = '#1a1a2e',
  className = '',
}: ImagePlaceholderProps) {
  return (
    <div
      className={`relative ${aspectRatio} w-full overflow-hidden rounded-lg flex items-center justify-center ${className}`}
      style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
    >
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(201,168,118,0.3) 0%, transparent 60%)',
        }}
      />
      <div className="text-center px-6 z-10">
        <div className="w-12 h-12 mx-auto mb-3 border border-gold/40 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gold/70 text-xs font-sans tracking-widest uppercase">{label}</p>
      </div>
    </div>
  )
}
