import {
  Hero3DSection,
  TechnologiesSection,
  ProjectsSection,
  FeaturedProjectsSection,
  AboutUsSection,
  TechCategoriesSection,
  TeamSection
} from "@/features/landing";
import { BlogSection } from "@/features/blog/presentation/sections/blog-section";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero3DSection />
      <AboutUsSection />
      <FeaturedProjectsSection />
      <TechCategoriesSection />
      <TeamSection />
      
    </div>
  );
}
