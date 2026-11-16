export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 48 40"
        className="h-9 w-11"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 34 L24 6 L42 34 Z" />
        <path d="M30 28 H46 M41 23 L46 28 L41 33" />
      </svg>
      <span className="text-3xl font-semibold tracking-tight">ArchFlow</span>
    </div>
  );
}