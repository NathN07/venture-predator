import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { Profile } from "@/lib/types";

export function AppHeader({
  profile,
  email,
}: {
  profile: Profile | null;
  email: string | undefined;
}) {
  const role = profile?.role;
  const name = profile?.full_name ?? email ?? "Account";
  const initial = name.trim().charAt(0).toUpperCase();

  const links =
    role === "investor"
      ? [{ href: "/investor", label: "Deal radar" }]
      : [
          { href: "/founder", label: "My pitches" },
          { href: "/founder/new", label: "New pitch" },
        ];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-8">
          <Logo href={role ? `/${role}` : "/"} />
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-1.5 text-sm text-muted transition hover:bg-paper hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <details className="group relative">
          <summary className="flex cursor-pointer list-none items-center gap-2.5 rounded-full py-1 pr-3 pl-1 transition hover:bg-paper [&::-webkit-details-marker]:hidden">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt=""
                width={32}
                height={32}
                referrerPolicy="no-referrer"
                className="size-8 rounded-full"
              />
            ) : (
              <span className="flex size-8 items-center justify-center rounded-full bg-ink text-sm font-medium text-white">
                {initial}
              </span>
            )}
            <span className="hidden max-w-[140px] truncate text-sm sm:block">{name}</span>
          </summary>
          <div className="absolute right-0 mt-2 w-60 rounded-xl border border-line bg-surface p-1.5 shadow-lg">
            <div className="px-3 py-2">
              <div className="truncate text-sm font-medium">{name}</div>
              <div className="truncate text-xs text-muted">{email}</div>
              {role && (
                <div className="mt-1.5 inline-block rounded bg-paper-2 px-1.5 py-0.5 text-[11px] text-muted">
                  {role === "investor" ? "Investor" : "Founder"}
                  {profile?.firm ? ` · ${profile.firm}` : ""}
                </div>
              )}
            </div>
            <Link
              href="/onboarding"
              className="block rounded-md px-3 py-2 text-sm hover:bg-paper"
            >
              Switch role
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-paper"
              >
                Sign out
              </button>
            </form>
          </div>
        </details>
      </div>
    </header>
  );
}
