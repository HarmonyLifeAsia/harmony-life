import MediaGallery from './MediaGallery'
import { SOLAYA_EXTERIOR, SOLAYA_INTERIOR, SOLAYA_CARDS, SOLAYA_YOUTUBE_ID } from '../_data/solaya'

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

      {SOLAYA_CARDS.length > 0 && (
        <div>
          <p className="font-serif text-2xl text-cream mb-6">{s.unitTypesTitle}</p>
          <MediaGallery images={SOLAYA_CARDS} alt={s.unitTypesTitle} placeholderLabel={s.imageComing} cols="grid-cols-1 sm:grid-cols-2" aspect="aspect-[4/3]" />
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
