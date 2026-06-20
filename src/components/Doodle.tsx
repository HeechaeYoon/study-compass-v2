type DoodleKind =
  | "underline-yellow"
  | "underline-blue"
  | "underline-mint"
  | "star"
  | "curved-arrow"
  | "growth-arrow"
  | "flag"
  | "connector";

export type DoodleProps = {
  kind: DoodleKind;
  className?: string;
  title?: string;
};

export function Doodle({ kind, className, title }: DoodleProps) {
  const ariaHidden = title ? undefined : true;
  const role = title ? "img" : undefined;

  if (kind === "star") {
    return (
      <svg className={className} viewBox="0 0 42 42" aria-hidden={ariaHidden} role={role}>
        {title ? <title>{title}</title> : null}
        <path
          d="M20.4 3.8l4.4 13 13.1-4.1-10.9 8.4 8.3 11-12-6.8-7.6 11.8 2.2-13.8L4.6 20.6l13.7-2.8 2.1-14z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "curved-arrow") {
    return (
      <svg className={className} viewBox="0 0 190 60" aria-hidden={ariaHidden} role={role}>
        {title ? <title>{title}</title> : null}
        <path
          d="M8 38c44-31 94-34 142-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <path
          d="M142 19l18 17-23 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "growth-arrow") {
    return (
      <svg className={className} viewBox="0 0 96 64" aria-hidden={ariaHidden} role={role}>
        {title ? <title>{title}</title> : null}
        <path
          d="M8 50c17-14 22-23 33-20 9 2 11 12 21 9 9-3 13-19 23-27"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M76 12h13v13"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "flag") {
    return (
      <svg className={className} viewBox="0 0 56 86" aria-hidden={ariaHidden} role={role}>
        {title ? <title>{title}</title> : null}
        <path d="M15 80c1-20 0-42 3-73" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M19 9c13 4 19-1 29 7-9 7-19 5-31 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "connector") {
    return (
      <svg className={className} viewBox="0 0 620 280" aria-hidden={ariaHidden} role={role}>
        {title ? <title>{title}</title> : null}
        <path d="M112 91c44 10 52 50 98 55 34 4 44-15 70-3 18 8 19 28 44 31" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 7" />
        <path d="M294 64c58 5 77 55 129 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M431 108l-17 9 6-19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M450 115c42 14 43 61 25 91" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M160 152c13 38 49 44 80 57" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M241 199l3 18-19-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  const stroke =
    kind === "underline-yellow"
      ? "#F5BE2E"
      : kind === "underline-mint"
        ? "#43C99B"
        : "#4D68E6";

  return (
    <svg className={className} viewBox="0 0 330 24" aria-hidden={ariaHidden} role={role}>
      {title ? <title>{title}</title> : null}
      <path
        d="M8 14c57-5 107-9 161-8 49 1 98-2 153-6"
        fill="none"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.56"
      />
      <path
        d="M14 18c63-8 116-6 171-9 44-2 91-5 130-2"
        fill="none"
        stroke={stroke}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.62"
      />
    </svg>
  );
}
