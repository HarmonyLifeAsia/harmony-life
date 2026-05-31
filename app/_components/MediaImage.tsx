'use client'

import { useState } from 'react'

interface Props {
  src: string
  alt: string
  label?: string
  imgClassName?: string
  fit?: 'cover' | 'contain'
}

// Renders an <img>, but falls back to a styled placeholder when the file is
// missing (not uploaded yet) or fails to load. Drop a file at `src` and it
// appears automatically — no code change needed.
export default function MediaImage({ src, alt, label = 'Image coming soon', imgClassName, fit = 'cover' }: Props) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #252542, #1a1a2e)' }}
      >
        <div className="text-center px-4">
          <div className="w-10 h-10 mx-auto mb-2 border border-gold/30 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gold/50 text-[10px] tracking-widest uppercase">{label}</p>
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={imgClassName || `w-full h-full object-${fit}`}
    />
  )
}
