'use client'

import { useEffect, useRef } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  videoId: string
  start?: number // seconds to start from (skip intro)
  endTrim?: number // loop back this many seconds before the end (hide end cards / credits)
}

// Muted, looping YouTube background that fills its parent container in "cover"
// mode and plays only the segment [start, duration - endTrim] via the IFrame
// Player API — no title, no end cards, no clickable YouTube chrome.
// Skips on phones (the parent's poster image shows instead).
export default function LoopingVideo({ videoId, start = 0, endTrim = 0 }: Props) {
  const holderRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false
    let interval: ReturnType<typeof setInterval> | undefined

    if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 768px)').matches) return

    function createPlayer() {
      const w = window as any
      if (cancelled || !holderRef.current || !w.YT?.Player) return
      playerRef.current = new w.YT.Player(holderRef.current, {
        videoId,
        playerVars: {
          autoplay: 1, mute: 1, controls: 0, modestbranding: 1,
          playsinline: 1, rel: 0, disablekb: 1, fs: 0, iv_load_policy: 3,
          start,
        },
        events: {
          onReady: (e: any) => {
            const f = e.target.getIframe?.()
            if (f) {
              // Cover the container regardless of its aspect ratio, using
              // container-query units resolved against the .cqsize wrapper.
              Object.assign(f.style, {
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'max(100cqw, 177.78cqh)',
                height: 'max(100cqh, 56.25cqw)',
                border: '0', pointerEvents: 'none',
              })
            }
            e.target.mute()
            e.target.seekTo(start, true)
            e.target.playVideo()
            interval = setInterval(() => {
              const p = playerRef.current
              if (!p?.getDuration) return
              const dur = p.getDuration()
              const cur = p.getCurrentTime ? p.getCurrentTime() : 0
              if (dur && cur >= dur - endTrim) p.seekTo(start, true)
            }, 500)
          },
          onStateChange: (e: any) => {
            if (e.data === (window as any).YT?.PlayerState?.ENDED) {
              e.target.seekTo(start, true)
              e.target.playVideo()
            }
          },
        },
      })
    }

    const w = window as any
    if (w.YT?.Player) {
      createPlayer()
    } else {
      const prev = w.onYouTubeIframeAPIReady
      w.onYouTubeIframeAPIReady = () => { prev?.(); createPlayer() }
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
  }, [videoId, start, endTrim])

  return (
    <div className="absolute inset-0 overflow-hidden hidden md:block" style={{ containerType: 'size' }}>
      <div ref={holderRef} aria-hidden="true" />
    </div>
  )
}
