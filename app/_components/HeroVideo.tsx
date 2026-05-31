'use client'

import { useEffect, useRef } from 'react'

const VIDEO_ID = '55VtihTuPpQ'
const START = 5 // start 5s in (skip the intro title)
const END_TRIM = 15 // loop back this many seconds before the end (hide YouTube end cards)

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    YT?: any
    onYouTubeIframeAPIReady?: () => void
  }
}

// Muted, looping YouTube background that plays only the segment [START, duration - END_TRIM]
// via the IFrame Player API, so neither the intro title nor the end cards are visible.
export default function HeroVideo() {
  const holderRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false
    let interval: ReturnType<typeof setInterval> | undefined

    function createPlayer() {
      if (cancelled || !holderRef.current || !window.YT?.Player) return
      playerRef.current = new window.YT.Player(holderRef.current, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1, mute: 1, controls: 0, modestbranding: 1,
          playsinline: 1, rel: 0, disablekb: 1, fs: 0, iv_load_policy: 3,
          start: START,
        },
        events: {
          onReady: (e: any) => {
            const f = e.target.getIframe?.()
            if (f) {
              Object.assign(f.style, {
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100vw', height: '56.25vw',
                minWidth: '177.78vh', minHeight: '100vh',
                border: '0', pointerEvents: 'none',
              })
            }
            e.target.mute()
            e.target.seekTo(START, true)
            e.target.playVideo()
            interval = setInterval(() => {
              const p = playerRef.current
              if (!p?.getDuration) return
              const dur = p.getDuration()
              const cur = p.getCurrentTime ? p.getCurrentTime() : 0
              if (dur && cur >= dur - END_TRIM) p.seekTo(START, true)
            }, 500)
          },
          onStateChange: (e: any) => {
            if (e.data === window.YT?.PlayerState?.ENDED) {
              e.target.seekTo(START, true)
              e.target.playVideo()
            }
          },
        },
      })
    }

    if (window.YT?.Player) {
      createPlayer()
    } else {
      const prev = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => { prev?.(); createPlayer() }
      if (!document.getElementById('yt-iframe-api')) {
        const s = document.createElement('script')
        s.id = 'yt-iframe-api'
        s.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(s)
      }
    }

    return () => {
      cancelled = true
      if (interval) clearInterval(interval)
      try { playerRef.current?.destroy?.() } catch { /* noop */ }
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden hero-yt">
      <div ref={holderRef} aria-hidden="true" />
    </div>
  )
}
