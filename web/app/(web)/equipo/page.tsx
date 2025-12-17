import { EquipoPage } from "@/features/landing/presentation/sections/equipo-page";
import { Navbar } from "@/shared/layout/web/navbar";
import { Footer } from "@/shared/layout/web/footer";
import { getPayload } from 'payload';
import config from "@payload-config";

export default async function EquipoPageRoute() {
  const payload = await getPayload({ config });

  // Fetch Global Page Data
  const pageData = await payload.findGlobal({
    slug: 'equipo-page',
  });

  // Fetch Team Members
  const { docs: members } = await payload.find({
    collection: 'team-members',
    sort: 'order',
    where: {
      active: {
        equals: true,
      },
    },
  });

  // Transform payload data to component types
  const teamMembers = members.map((doc: any) => ({
    id: doc.id,
    nombre: doc.name,
    cargo: doc.role,
    especialidad: doc.specialty || '',
    imagen: doc.image?.url || '', // Handle image object or ID
    bio: doc.bio || '',
    experiencia: doc.experience || '',
    logros: doc.achievements?.map((a: any) => a.achievement) || [],
    social: {
      email: doc.social?.email || '',
      linkedin: doc.social?.linkedin,
      github: doc.social?.github,
      twitter: doc.social?.twitter,
    },
    esDirectivo: doc.category === 'leadership', // derived
    category: doc.category,
  }));

  const heroStats = pageData.heroStats?.map((s: any) => ({
    text: s.text,
    icon: s.icon,
  })) || undefined;

  return (
    <>
      <EquipoPage
        heroStats={heroStats}
        teamMembers={teamMembers}
      />
    </>
  );
}
