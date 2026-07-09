export function AppTopBar({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 pb-3 pt-[max(env(safe-area-inset-top),12px)]">
      <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70">
        trailatlas.app
      </div>
      {subtitle && (
        <div className="text-[11px] uppercase tracking-widest text-white/40">
          {subtitle}
        </div>
      )}
    </div>
  );
}
