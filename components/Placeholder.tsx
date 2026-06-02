import { LotusIcon } from './Icons';

/**
 * Elegancki placeholder w miejsce docelowego zdjęcia.
 * TODO: podmień na realne pliki w /public/images i zamień <Placeholder/> na <Image/>.
 */
export default function Placeholder({
  label,
  className = '',
  ratio = 'aspect-[4/3]',
}: {
  label?: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div className={`ph ${ratio} w-full ${className}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-cream/40">
        <LotusIcon className="h-8 w-8 text-gold/50" />
        {label && (
          <span className="px-4 text-center text-[11px] font-medium uppercase tracking-[0.2em]">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
