import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { AppTopBar } from "@/components/AppTopBar";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Trail Atlas" },
      {
        name: "description",
        content: "About Trail Atlas — a personal guide to hiking the Pacific coast.",
      },
      { property: "og:title", content: "About — Trail Atlas" },
      {
        property: "og:description",
        content: "The story behind Trail Atlas.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="pb-16">
      <AppTopBar />
      <div className="px-4">
        <Link
          to="/menu"
          className="inline-flex items-center gap-1 text-xs font-medium text-white/60 hover:text-white"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to menu
        </Link>

        <div className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-primary">
          About
        </div>
        <h1 className="mt-1 text-3xl font-semibold text-white">
          Trail Atlas
        </h1>

        {/* ============================================================
            FILL IN THE COPY BELOW.
            Each <Section> block is a placeholder — replace the text
            with your own story, mission, credits, etc.
            ============================================================ */}

        <div className="mt-8 space-y-8">
          <Section title="The story">
            <p>
              Add your intro here — how Trail Atlas started, who it's for,
              and why you built it.
            </p>
          </Section>

          <Section title="How the guide works">
            <p>
              Explain what a "spot" means, how difficulty is rated, and any
              conventions readers should know about.
            </p>
          </Section>

          <Section title="About me">
            <p>
              A short bio — where you hike, what you shoot with, and where
              readers can follow along.
            </p>
          </Section>

          <Section title="Get in touch">
            <p>
              Email, Instagram, or any other way people can reach out.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
        {title}
      </h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-white/70">
        {children}
      </div>
    </section>
  );
}
