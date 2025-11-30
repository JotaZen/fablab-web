import {
  Hero3DSection,
  TechnologiesSection,
  ProjectsSection
} from "@/features/landing";
import { BlogSection } from "@/features/blog/presentation/sections/blog-section";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero3DSection />
      <BlogSection />
      <TechnologiesSection />
      <ProjectsSection />
    </div>
  );
}
