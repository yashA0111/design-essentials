import type { Metadata } from "next";
import { aboutContent, milestones, teamMembers } from "@/lib/data/siteContent";
import { SectionLabel } from "@/components/common/SectionLabel";
import { SplitTitle } from "@/components/common/AnimatedTitle";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { ContactCTASection } from "@/components/sections/ContactCTASection";
import { TimelineSection } from "@/components/sections/TimelineSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Design Essentials — our story, team, philosophy, and commitment to sustainable architectural design across India.",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative flex min-h-[60vh] items-end section-padding">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={aboutContent.heroImage}
            alt="Design Essentials studio and architectural workspace"
            fill
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-(--void) via-(--void)/60 to-transparent" />
        </div>
        <div className="container relative z-10">
          <SectionLabel className="mb-4">{aboutContent.heroEyebrow}</SectionLabel>
          <h1 className="text-hero text-(--text-primary)">
            {aboutContent.heroTitle}
          </h1>
          <p className="text-body mt-4 text-lg">{aboutContent.heroSubtitle}</p>
        </div>
      </section>

      <section data-theme="light" className="section-padding bg-[var(--void)]">
        <div className="container max-w-4xl">
          <p className="font-(family-name:--font-display) text-2xl leading-relaxed text-(--text-primary) md:text-3xl">
            {aboutContent.mission}
          </p>
        </div>
      </section>

      <section data-theme="light" className="section-padding bg-(--surface)">
        <div className="container">
          <SectionLabel className="mb-6">{aboutContent.storyLabel}</SectionLabel>
          <p className="text-body mb-16 max-w-3xl text-lg">{aboutContent.storyIntro}</p>
          <TimelineSection milestones={milestones} />
        </div>
      </section>

      <section data-theme="light" className="section-padding bg-[var(--void)]">
        <div className="container">
          <SectionLabel className="mb-6">{aboutContent.teamLabel}</SectionLabel>
          <SplitTitle rest="The People Behind" italicWord="the Vision" className="mb-16" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <article
                key={member.id}
                className="border border-border bg-(--surface)"
              >
                <div className="relative aspect-4/5">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-card-title text-(--text-primary)">
                    {member.name}
                  </h3>
                  <p className="text-nav mt-1 text-(--gold)">{member.title}</p>
                  <p className="text-body mt-4 text-sm">{member.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-theme="light" className="section-padding bg-(--surface)">
        <div className="container">
          <SectionLabel className="mb-6">{aboutContent.philosophyLabel}</SectionLabel>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {aboutContent.philosophyPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="border border-border p-8"
              >
                <h3 className="text-card-title mb-4 text-(--gold)">
                  {pillar.title}
                </h3>
                <p className="text-body">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="eco" className="section-padding">
        <div className="container max-w-3xl">
          <SectionLabel className="mb-6 sage-text">ECO DESIGN</SectionLabel>
          <h2 className="text-section mb-8 text-(--text-primary)">
            <em className="font-light italic text-(--sage)">
              {aboutContent.ecoHeading.split(" ")[0]}
            </em>{" "}
            {aboutContent.ecoHeading.split(" ").slice(1).join(" ")}
          </h2>
          <p className="text-body text-lg">{aboutContent.ecoBody}</p>
        </div>
      </section>

      <ContactCTASection />
    </>
  );
}
