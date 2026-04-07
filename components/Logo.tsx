import Link from "next/link";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const text = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-2xl";
  const dot = size === "lg" ? "w-4 h-4" : size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3";
  return (
    <Link href="/" className="inline-flex items-center gap-2 group">
      <span className={`${dot} rounded-full bg-pink border-2 border-ink shadow-[2px_2px_0_0_#241638] group-hover:animate-pulseDot`} />
      <span className={`font-display font-extrabold tracking-tight ${text} text-ink`}>
        Lead<span className="text-pink">Loop</span>
      </span>
    </Link>
  );
}
