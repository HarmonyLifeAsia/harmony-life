import Reveal from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "mx-auto max-w-3xl text-center items-center" : "max-w-2xl text-left items-start";

  return (
    <Reveal className={`flex flex-col ${alignment} ${className}`}>
      {eyebrow ? (
        <span className="eyebrow mb-4 flex items-center gap-3">
          <span className="h-px w-6 bg-champagne/60" aria-hidden="true" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="headline text-3xl sm:text-4xl lg:text-[2.9rem] text-balance">
        {title}
      </h2>
      {intro ? (
        <p className="lead mt-6 text-base sm:text-lg text-pretty">{intro}</p>
      ) : null}
    </Reveal>
  );
}
