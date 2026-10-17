/** Marca vectorial local inspirada en la referencia del prototipo. */
export default function MassMark() {
  return (
    <svg
      className="mass-mark"
      viewBox="0 0 220 80"
      role="img"
      aria-label="Mass más"
    >
      <rect width="220" height="80" rx="14" fill="currentColor" />
      <text
        x="24"
        y="58"
        textLength="150"
        lengthAdjust="spacingAndGlyphs"
        fill="var(--primary)"
        stroke="var(--primary)"
        strokeWidth="1.2"
        fontFamily="Arial Black, Arial, sans-serif"
        fontSize="64"
        fontWeight="900"
        letterSpacing="-5"
      >
        mass
      </text>
      <path
        d="M191 22v12m-6-6h12"
        stroke="var(--primary)"
        strokeWidth="4.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
