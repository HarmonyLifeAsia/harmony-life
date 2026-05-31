import MediaImage from './MediaImage'
import MediaGallery from './MediaGallery'
import VillaQuickContact from './VillaQuickContact'
import SentBanner from './SentBanner'
import {
  OASIS_MAIN_GALLERY,
  OASIS_CONSTRUCTION,
  OASIS_CONSTRUCTION_DATE,
  OASIS_YOUTUBE_ID,
  OASIS_VILLAS,
} from '../_data/oasis'

// Oasis-only media sections: development gallery, villa types (floor plan +
// visualisations + CTAs), construction progress, and a video.
// `o` is dict.oasis, `cf` is dict.contactForm.
export default function OasisMedia({ o, cf }: { o: Record<string, string>; cf: Record<string, string> }) {
  return (
    <>
      <SentBanner title={cf.successTitle} text={cf.successText} />

      {/* Development gallery */}
      <div>
        <p className="font-serif text-2xl text-cream mb-6">{o.mainGalleryTitle}</p>
        <MediaGallery images={OASIS_MAIN_GALLERY} alt="Harmony Life Oasis" placeholderLabel={o.imageComing} />
      </div>

      {/* Villa types */}
      <div>
        <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-3">{o.villaTypesSubtitle}</p>
        <p className="font-serif text-2xl text-cream mb-8">{o.villaTypesTitle}</p>
        <div className="space-y-14">
          {OASIS_VILLAS.map((v) => (
            <div key={v.id} className="border-t border-gold/10 pt-8 first:border-0 first:pt-0">
              <h3 className="font-serif text-xl text-cream mb-5">{o[v.nameKey]}</h3>

              <p className="text-cream/40 text-[10px] tracking-widest uppercase mb-2">{o.floorPlanLabel}</p>
              <div className="aspect-[16/10] w-full overflow-hidden rounded-sm border border-gold/15 mb-6">
                <MediaImage src={v.floorPlan} alt={`${o[v.nameKey]} — ${o.floorPlanLabel}`} label={o.imageComing} fit="contain" />
              </div>

              <p className="text-cream/40 text-[10px] tracking-widest uppercase mb-2">{o.visualsLabel}</p>
              <MediaGallery images={v.images} alt={o[v.nameKey]} placeholderLabel={o.imageComing} cols="grid-cols-2 md:grid-cols-4" />

              <VillaQuickContact
                villaName={o[v.nameKey]}
                offerUrl={v.offer}
                labels={{
                  downloadOffer: o.downloadOffer,
                  quickContact: o.quickContact,
                  quickContactDesc: o.quickContactDesc,
                  name: cf.name,
                  email: cf.email,
                  phone: cf.phone,
                  submit: cf.submit,
                  privacy: cf.privacy,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Construction progress */}
      <div>
        <p className="font-serif text-2xl text-cream mb-1">{o.constructionTitle}</p>
        <p className="text-cream/40 text-sm mb-6">{o.constructionAsOf} {OASIS_CONSTRUCTION_DATE}</p>
        <MediaGallery images={OASIS_CONSTRUCTION} alt={o.constructionTitle} placeholderLabel={o.imageComing} />
      </div>

      {/* Video */}
      <div>
        <p className="font-serif text-2xl text-cream mb-6">{o.videoTitle}</p>
        {OASIS_YOUTUBE_ID ? (
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-gold/20">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${OASIS_YOUTUBE_ID}`}
              title={o.videoTitle}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div
            className="aspect-video w-full rounded-xl border border-gold/20 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1a1a2e, #252542)' }}
          >
            <div className="text-center">
              <div className="w-16 h-16 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-gold/50 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-gold/50 text-xs tracking-widest uppercase">{o.videoComing}</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
