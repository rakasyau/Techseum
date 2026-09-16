import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, Sparkle } from "@/components/motion-primitives";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-[1320px] px-5 pb-20 lg:px-8 lg:pb-28">
      <Reveal className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-paper lg:px-16 lg:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(ellipse 80% 90% at 85% 20%, black, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 90% at 85% 20%, black, transparent 70%)",
          }}
        />
        <Sparkle
          size={26}
          tone="accent"
          className="absolute right-[8%] top-[16%] animate-float"
        />
        <Sparkle
          size={16}
          tone="signal"
          className="absolute bottom-[22%] right-[24%] animate-float [animation-delay:1.4s]"
        />

        <div className="relative max-w-[62ch]">
          <h2 className="font-display text-[clamp(1.9rem,5vw,3.1rem)] font-bold leading-[1.04] tracking-[-0.04em] text-balance">
            What do you want to understand today?
          </h2>
          <p className="mt-5 max-w-[50ch] text-[15px] leading-relaxed text-paper/65">
            Twelve exhibits, four levels each, and a lab bench for every idea
            that is easier to feel than to read.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-paper text-ink hover:bg-paper-alt"
            >
              <Link href="/explore">
                Start exploring
                <ArrowRight size={17} />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-paper/25 bg-transparent text-paper hover:border-paper hover:bg-paper/10"
            >
              <Link href="/lab">Try a lab bench</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
