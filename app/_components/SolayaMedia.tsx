import MediaGallery from './MediaGallery'
import SolayaUnits from './SolayaUnits'
import { SOLAYA_EXTERIOR, SOLAYA_INTERIOR, SOLAYA_YOUTUBE_ID } from '../_data/solaya'
import { SOLAYA_OVERVIEW, SOLAYA_BUILDINGS } from '../_data/solaya-units'

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

      {SOLAYA_BUILDINGS.length > 0 && (
        <div>
          <p className="font-serif text-2xl text-cream mb-6">{s.unitTypesTitle}</p>
          {/* Estate overview with building numbers */}
          <div className="mb-8">
            <MediaGallery images={[SOLAYA_OVERVIEW]} alt={s.unitTypesTitle} placeholderLabel={s.imageComing} cols="grid-cols-1" aspect="aspect-video" />
          </div>
          <SolayaUnits labels={{ building: s.buildingLabel, floor: s.floorLabel, imageComing: s.imageComing }} />
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
