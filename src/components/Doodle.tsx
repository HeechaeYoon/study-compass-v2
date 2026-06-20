type DoodleKind =
  | "underline-yellow"
  | "underline-blue"
  | "underline-mint"
  | "star"
  | "curved-arrow"
  | "study-spark"
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

  if (kind === "study-spark") {
    return (
      <svg className={className} viewBox="0 0 150 72" aria-hidden={ariaHidden} role={role}>
        {title ? <title>{title}</title> : null}
        <path
          d="M34 39c19-13 41-13 61-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.72"
        />
        <path
          d="M26 17l3 11 11-4-8 8 7 9-11-5-6 10 2-12-12-2 12-4 2-11z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
        <path
          d="M112 16c3 9 7 14 16 17-9 3-14 8-17 17-3-9-8-14-17-17 9-3 14-8 18-17z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.62"
        />
        <circle cx="76" cy="24" r="3.5" fill="currentColor" opacity="0.28" />
        <circle cx="101" cy="53" r="2.5" fill="currentColor" opacity="0.32" />
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
      <svg className={className} viewBox="0 0 620 390" aria-hidden={ariaHidden} role={role}>
        {title ? <title>{title}</title> : null}
        <path d="M104 84c63-23 146-24 211-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M306 71l21 13-23 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M370 90c72 8 126 45 154 99" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M512 177l18 19-25 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M518 243c-32 58-92 83-176 83" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M357 314l-21 12 20 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M287 326c-78 2-145-23-183-77" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M112 266l-14-22 25 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M74 209c-22-44-14-86 24-116" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 7" />
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
