'use client'

import HarmonyVillaMap from './HarmonyVillaMap'
import { useLocale } from './LangProvider'

// Wraps the interactive villa map and routes its "Zapytaj o willę" CTA to the
// contact page in the active language. (Map labels/data still WIP.)
export default function OasisVillaMapSection() {
  const lang = useLocale()
  return (
    <div className="rounded-xl overflow-hidden border border-gold/15">
      <HarmonyVillaMap onInquire={() => { window.location.href = `/${lang}/contact` }} />
    </div>
  )
}
