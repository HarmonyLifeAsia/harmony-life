import MediaGallery from './MediaGallery'
import { SOLAYA_EXTERIOR, SOLAYA_INTERIOR, SOLAYA_UNIT_GROUPS, SOLAYA_YOUTUBE_ID } from '../_data/solaya'

// Solaya-only media: Exterior + Interior galleries, optional unit-type cards, and a film.
// `s` is dict.solaya.
export default function SolayaMedia({ s }: { s: Record<string, string> }) {
  return (
    <>
      <div>
        <p className="font-serif text-2xl text-cream mb-6">{s.exteriorTitle}</p>
        <MediaGallery images={SOLAYA_EXTERIOR} alt="Solaya Residence — exterior" placeholderLabel={s.imageComing} />
      </div>

      <div>
        <p className="font-serif text-2xl text-cream mb-6">{s.interiorTitle}</p>
        <MediaGallery images={SOLAYA_INTERIOR} alt="Solaya Residence — interior" placeholderLabel={s.imageComing} />
      </div>

      {SOLAYA_UNIT_GROUPS.length > 0 && (
        <div>
          <p className="font-serif text-2xl text-cream mb-8">{s.unitTypesTitle}</p>
          <div className="space-y-10">
            {SOLAYA_UNIT_GROUPS.map((g) => (
              <div key={g.building}>
                <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">{s.buildingLabel} {g.building}</p>
                <MediaGallery images={g.images} alt={`Solaya — ${g.building}`} placeholderLabel={s.imageComing} cols="grid-cols-2 md:grid-cols-4" aspect="aspect-[7/5]" />
              </div>
            ))}
          </div>
        </div>
      )}

      {SOLAYA_YOUTUBE_ID && (
        <div>
          <p className="font-serif text-2xl text-cream mb-6">{s.videoTitle}</p>
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-gold/20">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${SOLAYA_YOUTUBE_ID}`}
              title={s.videoTitle}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  )
}
