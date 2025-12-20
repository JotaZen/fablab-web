import { getPayload } from 'payload';
import config from "@payload-config";
import { ProyectosPublicPage } from "@/features/projects/presentation/pages/proyectos-public";
import type { ProjectPublic } from "@/features/projects/presentation/pages/proyectos-public";

export default async function ProyectosPageRoute() {
  const payload = await getPayload({ config });

  // Fetch published projects
  const { docs } = await payload.find({
    collection: 'projects',
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-featured,order,-createdAt',
    limit: 100,
  });

  // Transform to component types
  const projects: ProjectPublic[] = docs.map((doc: any) => ({
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    category: doc.category,
    description: doc.description,
    featuredImage: typeof doc.featuredImage === 'object' ? doc.featuredImage?.url : null,
    technologies: doc.technologies?.map((t: any) => t.name) || [],
    creators: doc.creators?.map((c: any) => ({
      name: c.teamMember?.name || c.externalName || 'Anónimo',
      role: c.role || '',
      avatar: typeof c.teamMember?.image === 'object' ? c.teamMember.image?.url : undefined,
    })) || [],
    year: doc.year || new Date().getFullYear(),
    featured: doc.featured || false,
    objective: doc.objective || '',
    problemSolved: doc.problemSolved || '',
    links: doc.links || {},
  }));

  // Separate featured projects
  const featuredProjects = projects.filter(p => p.featured);

  return (
    <ProyectosPublicPage
      projects={projects}
      featuredProjects={featuredProjects}
    />
  );
}
