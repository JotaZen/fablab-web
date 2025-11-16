import {
  Hero3DSection,
  TechnologiesSection,
  ProjectsSection
} from "@/features/landing";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero3DSection />
      <TechnologiesSection />
      <ProjectsSection />
    </div>
  );
}
