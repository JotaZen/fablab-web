import {
  Hero3DSection,
  TechnologiesSection,
  ProjectsSection
} from "@/components";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero3DSection />
      <TechnologiesSection />
      <ProjectsSection />
    </div>
  );
}
