import Link from "next/link";

export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="var(--color-ink)" />
      {/* a "V" cut by a single sharp diagonal */}
      <path d="M7 8h5.2L16 19.4 19.8 8H25l-6.6 17h-4.8L7 8z" fill="#fff" />
      <path d="M17.5 8 25 8 22.6 14.2z" fill="var(--color-signal)" />
    </svg>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5">
      <Mark />
      <span className="font-display text-[19px] font-semibold tracking-tight text-ink">
        Venture Predator
      </span>
    </Link>
  );
}
