"use client";

import { useEffect, useRef } from "react";

export function Modal({
  title,
  onClose,
  children,
  side = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  /** Render as a right-hand drawer instead of a centred dialog. */
  side?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex bg-ink/45 ${side ? "justify-end" : "items-center justify-center p-4"}`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={
          side
            ? "drawer-in h-full w-full max-w-xl overflow-y-auto bg-surface shadow-2xl outline-none"
            : "w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl outline-none"
        }
      >
        {children}
      </div>
    </div>
  );
}
