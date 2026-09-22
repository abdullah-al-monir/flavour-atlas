interface ProgressRailProps {
  current: number;
  total: number;
}

/**
 * Live chapter counter for the Scroll Journey's pinned category
 * sections. Uses the monospace face for a film-timecode feel, per the
 * brief — this is one of the few places numbering is appropriate,
 * since the categories genuinely are a sequence the user scrolls
 * through.
 */
export function ProgressRail({ current, total }: ProgressRailProps) {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="fixed bottom-8 right-6 z-40 flex items-center gap-2 font-mono text-xs text-foreground-muted md:right-10">
      <span className="text-foreground">{pad(current)}</span>
      <span aria-hidden="true">/</span>
      <span>{pad(total)}</span>
    </div>
  );
}
