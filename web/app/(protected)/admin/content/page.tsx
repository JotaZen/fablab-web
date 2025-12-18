"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/misc/tabs";
import { useEffect, useMemo, useState } from "react";
import { createStrapiClient } from "@/features/blog/infrastructure/api/strapi-client";
import { TokenStorage } from "@/features/auth/infrastructure/storage/token-storage";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-700">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}

export default function ContentAdminPage() {
  const [teamOptions, setTeamOptions] = useState<
    Array<{ id: string; name: string; type?: string; bio?: string; carrera?: string; formacion?: string; foto?: any }>
  >([
    {
      id: "cesar-alfredo-salcedo-soto",
      name: "César Alfredo Salcedo Soto",
      type: "Estudiante",
      carrera: "Ingeniería en Informática",
      formacion: "En curso",
      bio: "",
    },
    {
      id: "christian-david-orellana-benner",
      name: "Christian David Orellana Benner",
      type: "Estudiante",
      carrera: "Ingeniería en Telecomunicaciones Conectividad y Redes",
      formacion: "En curso",
      bio: "",
    },
    {
      id: "juan-pablo-erices-fuentealba",
      name: "Juan Pablo Erices Fuentealba",
      type: "Estudiante",
      carrera: "Ingeniería en Informática",
      formacion: "En curso",
      bio: "",
    },
    {
      id: "maria-jose-valenzuela-ulloa",
      name: "María José Valenzuela Ulloa",
      type: "Estudiante",
      carrera: "Diseño Digital y Web",
      formacion: "En curso",
      bio: "",
    },
    {
      id: "matias-benjamin-labra-martinez",
      name: "Matías Benjamín Labra Martínez",
      type: "Estudiante",
      carrera: "Ingeniería en Automatización y Robótica",
      formacion: "En curso",
      bio: "",
    },
    {
      id: "kristobal-andres-jesus-sanchez-lizama",
      name: "Kristóbal Andrés Jesús Sánchez Lizama",
      type: "Estudiante",
      carrera: "Analista programador",
      formacion: "En curso",
      bio: "",
    },
    {
      id: "herno-cristobal-vargas-rios",
      name: "Herno Cristóbal Vargas Ríos",
      type: "Estudiante",
      carrera: "Igeniería en Automatización y Robótica",
      formacion: "En curso",
      bio: "",
    },
    {
      id: "jordy-brahian-zenteno-salazar",
      name: "Jordy Brahian Zenteno Salazar",
      type: "Estudiante",
      carrera: "Ingeniería en Informática",
      formacion: "En curso",
      bio: "",
    },
    {
      id: "dilan-sebastian-toledo-luengo",
      name: "Dilan Sebastián Toledo Luengo",
      type: "Estudiante",
      carrera: "Animación Digital y Videojuegos",
      formacion: "En curso",
      bio: "",
    },
    {
      id: "hector-egidio-patricio-sanhueza-valdivia",
      name: "Héctor Egidio Patricio Sanhueza Valdivia",
      type: "Estudiante",
      carrera: "Ingeniería en Automatización y Robótica",
      formacion: "En curso",
      bio: "",
    },
    {
      id: "benjamin-eduardo-coronado-sanzana",
      name: "Benjamín Eduardo Coronado Sanzana",
      type: "Estudiante",
      carrera: "Ingeniería en Automatización y Robótica",
      formacion: "En curso",
      bio: "",
    },
    {
      id: "allan-rodrigo-henriquez-ponce",
      name: "Allan Rodrigo Henriquez Ponce",
      type: "Estudiante",
      carrera: "Ingeniería en Automatización y Robótica",
      formacion: "En curso",
      bio: "",
    },
  ]);

  const [techOptions, setTechOptions] = useState<
    Array<{ id: string; name: string; category?: string; detalle?: string; materiales?: string[]; caracteristicas?: string }>
  >([
    {
      id: "arduino-nano",
      name: "Arduino Nano",
      category: "IoT",
      detalle: "Microcontrolador compacto para prototipos de sensores y actuadores.",
    },
    {
      id: "esp32",
      name: "ESP32",
      category: "IoT",
      detalle: "MCU WiFi/Bluetooth para proyectos conectados.",
    },
    {
      id: "react-native",
      name: "React Native",
      category: "Mobile",
      detalle: "Apps móviles multiplataforma.",
    },
    {
      id: "nodejs",
      name: "Node.js",
      category: "Backend",
      detalle: "APIs y servicios en JS.",
    },
    {
      id: "mqtt",
      name: "MQTT",
      category: "IoT",
      detalle: "Mensajería ligera para telemetría.",
    },
    {
      id: "ros",
      name: "ROS",
      category: "Robótica",
      detalle: "Framework para robots.",
    },
    {
      id: "python",
      name: "Python",
      category: "Software",
      detalle: "Scripts y lógica de control.",
    },
    {
      id: "impresion-3d-fdm",
      name: "Impresión 3D FDM",
      category: "Fabricación",
      detalle: "Prototipado rápido en termoplástico.",
    },
    {
      id: "servomotor-mg996r",
      name: "Servomotor MG996R",
      category: "Robótica",
      detalle: "Servo de torque medio para articulaciones.",
    },
    {
      id: "arduino-mega",
      name: "Arduino Mega",
      category: "IoT",
      detalle: "MCU con más IO para proyectos grandes.",
    },
    {
      id: "raspberry-pi-4",
      name: "Raspberry Pi 4",
      category: "Computo",
      detalle: "SBC para procesamiento y gateways.",
    },
    {
      id: "nextjs-14",
      name: "Next.js 14",
      category: "Frontend",
      detalle: "Web app con SSR/ISR.",
    },
    {
      id: "typescript",
      name: "TypeScript",
      category: "Software",
      detalle: "Tipado estático en JS.",
    },
    {
      id: "postgresql",
      name: "PostgreSQL",
      category: "Base de Datos",
      detalle: "Base de datos relacional.",
    },
    {
      id: "prisma-orm",
      name: "Prisma ORM",
      category: "Backend",
      detalle: "ORM para Node/Postgres.",
    },
    {
      id: "tailwindcss",
      name: "TailwindCSS",
      category: "Frontend",
      detalle: "Estilos utilitarios.",
    },
    {
      id: "strapi-cms",
      name: "Strapi CMS",
      category: "CMS",
      detalle: "Headless CMS usado en el proyecto.",
    },
  ]);

  const [project, setProject] = useState({
    titulo: "",
    subtitulo: "",
    anio: "",
    equipoIds: [] as string[],
    objetivo: "",
    problema: "",
    tecnologias: [] as string[],
    proceso: "",
    portada: [] as File[],
  });
  const [tech, setTech] = useState({
    titulo: "",
    subtitulo: "",
    descripcion: "",
    areaTrabajo: "",
    nivelCertificacion: "",
    materiales: [] as string[],
    caracteristicas: "",
  });
  const [materialInput, setMaterialInput] = useState("");
  const [techImages, setTechImages] = useState<File[]>([]);
  const [member, setMember] = useState({
    nombreCompleto: "",
    bio: "",
    tipo: "",
    carrera: "",
    formacion: "",
    foto: null as File | null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const strapi = useMemo(
    () =>
      createStrapiClient({
        token: TokenStorage.getToken() || process.env.NEXT_PUBLIC_STRAPI_TOKEN || process.env.STRAPI_API_TOKEN,
      }),
    []
  );

  const uploadMany = async (files: File[]) => {
    if (!files.length) return [] as number[];
    const uploaded = await Promise.all(files.map((file) => strapi.files.upload(file)));
    return uploaded.flat().map((f: any) => f.id).filter(Boolean) as number[];
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoadingData(true);
        const [teamRes, techRes, projRes] = await Promise.all([
          strapi.teamMembers.findAll().catch(() => null),
          strapi.technologies.findAll().catch(() => null),
          strapi.project.findOne().catch(() => null),
        ]);

        if (!active) return;

        if (teamRes?.data?.length) {
          setTeamOptions(
            teamRes.data.map((m: any) => ({
              id: String(m.id),
              name: m.nombre,
              type: m.tipo || m.cargo,
              bio: m.bio,
              carrera: m.carrera || m.especialidad,
              formacion: m.formacion || m.experiencia,
              foto: m.foto,
            }))
          );
        }

        if (techRes?.data?.length) {
          setTechOptions(
            techRes.data.map((t: any) => ({
              id: String(t.id),
              name: t.titulo || t.name,
              category: t.areaTrabajo,
              detalle: t.descripcion,
              materiales: t.materiales,
              caracteristicas: t.caracteristicas,
            }))
          );
        }

        if (projRes?.data) {
          const p = projRes.data as any;
          const equipoIds = Array.isArray(p.equipo)
            ? p.equipo.map((m: any) => String(m.id))
            : p.equipo?.data?.map((m: any) => String(m.id)) || [];
          const techIds = Array.isArray(p.tecnologias)
            ? p.tecnologias.map((t: any) => String(t.id))
            : p.tecnologias?.data?.map((t: any) => String(t.id)) || [];

          setProject((prev) => ({
            ...prev,
            titulo: p.titulo || "",
            subtitulo: p.subtitulo || "",
            anio: p.anio ? String(p.anio) : "",
            equipoIds,
            objetivo: p.objetivo || "",
            problema: p.problema || "",
            tecnologias: techIds,
            proceso: p.proceso || "",
          }));
        }
      } catch (err) {
        setError("No se pudieron cargar datos de Strapi");
      } finally {
        if (active) setLoadingData(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [strapi]);

  const addTeamMember = async () => {
    if (!member.nombreCompleto.trim()) {
      setError("Nombre completo es obligatorio");
      return;
    }
    setIsSaving(true);
    setError(null);
    setMessage(null);
    try {
      let fotoId: number | undefined;
      if (member.foto) {
        const uploaded = await strapi.files.upload(member.foto);
        fotoId = uploaded?.[0]?.id;
      }

      const res = await strapi.teamMembers.create({
        nombre: member.nombreCompleto.trim(),
        bio: member.bio.trim() || undefined,
        tipo: member.tipo || undefined,
        cargo: member.tipo || undefined,
        especialidad: member.carrera || undefined,
        carrera: member.carrera || undefined,
        formacion: member.formacion || undefined,
        experiencia: member.formacion || undefined,
        fotoId,
      });

      const saved = (res as any)?.data;
      const normalized = saved?.attributes ? { id: String(saved.id), ...(saved.attributes || {}) } : saved;

      setTeamOptions((prev) => [
        ...prev,
        {
          id: normalized?.id || `${Date.now()}`,
          name: normalized?.nombre || member.nombreCompleto.trim(),
          type: normalized?.tipo || member.tipo,
          bio: normalized?.bio || member.bio,
          carrera: normalized?.carrera || member.carrera,
          formacion: normalized?.formacion || member.formacion,
          foto: normalized?.foto || null,
        },
      ]);
      setMember({ nombreCompleto: "", bio: "", tipo: "", carrera: "", formacion: "", foto: null });
      setMessage("Integrante guardado en Strapi");
    } catch (err) {
      setError("No se pudo guardar el integrante en Strapi");
    } finally {
      setIsSaving(false);
    }
  };

  const removeTeamMember = async (id: string) => {
    setError(null);
    try {
      await strapi.teamMembers.delete(id);
    } catch (err) {
      // si falla el delete, continuamos removiendo local para no bloquear UI
    }
    setTeamOptions((prev) => prev.filter((m) => m.id !== id));
    setProject((prev) => ({ ...prev, equipoIds: prev.equipoIds.filter((v) => v !== id) }));
  };

  const addTech = async () => {
    if (!tech.titulo.trim() || !tech.descripcion.trim()) {
      setError("Título y descripción son obligatorios");
      return;
    }
    setIsSaving(true);
    setError(null);
    setMessage(null);
    try {
      let imagenIds: number[] | undefined;
      if (techImages.length > 0) {
        const uploaded = await Promise.all(techImages.map((file) => strapi.files.upload(file)));
        imagenIds = uploaded.flat().map((f: any) => f.id).filter(Boolean);
      }

      const res = await strapi.technologies.create({
        titulo: tech.titulo.trim(),
        subtitulo: tech.subtitulo.trim() || undefined,
        descripcion: tech.descripcion.trim() || undefined,
        areaTrabajo: tech.areaTrabajo.trim() || undefined,
        nivelCertificacion: tech.nivelCertificacion ? Number(tech.nivelCertificacion) : null,
        materiales: tech.materiales,
        caracteristicas: tech.caracteristicas.trim() || undefined,
        imagenIds,
      });

      const saved = (res as any)?.data;
      const normalized = saved?.attributes ? { id: String(saved.id), ...(saved.attributes || {}) } : saved;

      setTechOptions((prev) => [
        ...prev,
        {
          id: normalized?.id || `${Date.now()}`,
          name: normalized?.titulo || tech.titulo.trim(),
          category: normalized?.areaTrabajo,
          detalle: normalized?.descripcion,
          materiales: normalized?.materiales,
          caracteristicas: normalized?.caracteristicas,
        },
      ]);

      setTech({
        titulo: "",
        subtitulo: "",
        descripcion: "",
        areaTrabajo: "",
        nivelCertificacion: "",
        materiales: [],
        caracteristicas: "",
      });
      setMaterialInput("");
      setTechImages([]);
      setMessage("Tecnología guardada en Strapi");
    } catch (err) {
      setError("No se pudo guardar la tecnología en Strapi");
    } finally {
      setIsSaving(false);
    }
  };

  const removeTech = async (id: string) => {
    setError(null);
    try {
      await strapi.technologies.delete(id);
    } catch (err) {
      // si falla el delete, continuamos para mantener UX
    }
    setTechOptions((prev) => prev.filter((t) => t.id !== id));
    setProject((prev) => ({ ...prev, tecnologias: prev.tecnologias.filter((v) => v !== id) }));
  };

  const addMaterial = () => {
    const value = materialInput.trim();
    if (!value) return;
    setTech((prev) => ({ ...prev, materiales: [...prev.materiales, value] }));
    setMaterialInput("");
  };

  const removeMaterial = (value: string) => {
    setTech((prev) => ({ ...prev, materiales: prev.materiales.filter((m) => m !== value) }));
  };

  const deselectTeamFromProject = (id: string) => {
    setProject((prev) => ({ ...prev, equipoIds: prev.equipoIds.filter((v) => v !== id) }));
  };

  const deselectTechFromProject = (id: string) => {
    setProject((prev) => ({ ...prev, tecnologias: prev.tecnologias.filter((v) => v !== id) }));
  };

  const toggleTeamSelection = (id: string) => {
    setProject((prev) =>
      prev.equipoIds.includes(id)
        ? { ...prev, equipoIds: prev.equipoIds.filter((v) => v !== id) }
        : { ...prev, equipoIds: [...prev.equipoIds, id] }
    );
  };

  const toggleTechSelection = (id: string) => {
    setProject((prev) =>
      prev.tecnologias.includes(id)
        ? { ...prev, tecnologias: prev.tecnologias.filter((v) => v !== id) }
        : { ...prev, tecnologias: [...prev.tecnologias, id] }
    );
  };

  const saveProject = async () => {
    if (!project.titulo.trim()) {
      setError("Título de proyecto es obligatorio");
      return;
    }
    setIsSaving(true);
    setError(null);
    setMessage(null);
    try {
      const portadaIds = await uploadMany(project.portada);
      await strapi.project.save({
        titulo: project.titulo.trim(),
        subtitulo: project.subtitulo.trim() || undefined,
        anio: project.anio ? Number(project.anio) : null,
        objetivo: project.objetivo.trim() || undefined,
        problema: project.problema.trim() || undefined,
        proceso: project.proceso.trim() || undefined,
        tecnologias: project.tecnologias.map((v) => Number(v)),
        equipo: project.equipoIds.map((v) => Number(v)),
        portada: portadaIds,
      });
      setMessage("Proyecto guardado en Strapi");
    } catch (err) {
      setError("No se pudo guardar el proyecto en Strapi");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="container mx-auto px-6 space-y-8">
        <header>
          <p className="text-sm uppercase tracking-widest text-blue-600 font-semibold">Panel FabLab</p>
          <h1 className="text-3xl font-bold text-slate-900">Editar contenido</h1>
          <p className="text-slate-600 mt-2">Selecciona qué sección deseas actualizar: proyecto, tecnología o equipo.</p>
        </header>

        {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}
        {message && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{message}</div>}
        {loadingData && <p className="text-xs text-slate-500">Cargando datos desde Strapi...</p>}

        <Tabs defaultValue="proyecto" className="w-full">
          <TabsList>
            <TabsTrigger value="proyecto">Proyecto</TabsTrigger>
            <TabsTrigger value="tecnologia">Tecnología</TabsTrigger>
            <TabsTrigger value="equipo">Equipo</TabsTrigger>
          </TabsList>

          <TabsContent value="proyecto" className="mt-6">
            <SectionCard title="Proyecto">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Título">
                  <input
                    className="rounded-md border border-slate-200 p-2 text-sm"
                    value={project.titulo}
                    onChange={(e) => setProject({ ...project, titulo: e.target.value })}
                    placeholder="Ej: Sistema IoT FabLab"
                  />
                </Field>
                <Field label="Subtítulo">
                  <input
                    className="rounded-md border border-slate-200 p-2 text-sm"
                    value={project.subtitulo}
                    onChange={(e) => setProject({ ...project, subtitulo: e.target.value })}
                    placeholder="Ej: Monitoreo en tiempo real"
                  />
                </Field>
                <Field label="Año">
                  <input
                    type="number"
                    className="rounded-md border border-slate-200 p-2 text-sm"
                    value={project.anio}
                    onChange={(e) => setProject({ ...project, anio: e.target.value })}
                    placeholder="2025"
                  />
                </Field>
                <Field label="Equipo (checkbox)">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-md border border-slate-200 p-2 max-h-44 overflow-auto">
                    {teamOptions.map((t) => (
                      <label key={t.id} className="flex items-start gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={project.equipoIds.includes(t.id)}
                          onChange={() => toggleTeamSelection(t.id)}
                        />
                        <span>
                          <span className="font-medium">{t.name}</span>
                          {t.type && <span className="text-xs text-slate-500"> – {t.type}</span>}
                          {t.carrera && <div className="text-xs text-slate-500">{t.carrera}</div>}
                        </span>
                      </label>
                    ))}
                  </div>
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Field label="Objetivo">
                  <textarea
                    className="rounded-md border border-slate-200 p-2 text-sm"
                    rows={3}
                    value={project.objetivo}
                    onChange={(e) => setProject({ ...project, objetivo: e.target.value })}
                    placeholder="Qué busca lograr el proyecto"
                  />
                </Field>
                <Field label="Problema resuelto">
                  <textarea
                    className="rounded-md border border-slate-200 p-2 text-sm"
                    rows={3}
                    value={project.problema}
                    onChange={(e) => setProject({ ...project, problema: e.target.value })}
                    placeholder="Qué problema aborda"
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Field label="Tecnologías usadas (checkbox)">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-md border border-slate-200 p-2 max-h-44 overflow-auto">
                    {techOptions.map((t) => (
                      <label key={t.id} className="flex items-start gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={project.tecnologias.includes(t.id)}
                          onChange={() => toggleTechSelection(t.id)}
                        />
                        <span>
                          <span className="font-medium">{t.name}</span>
                          {t.category && <span className="text-xs text-slate-500"> – {t.category}</span>}
                          {t.detalle && <div className="text-xs text-slate-500">{t.detalle}</div>}
                        </span>
                      </label>
                    ))}
                  </div>
                </Field>

                <Field label="Orden del proceso de fabricación">
                  <textarea
                    className="rounded-md border border-slate-200 p-2 text-sm"
                    rows={3}
                    value={project.proceso}
                    onChange={(e) => setProject({ ...project, proceso: e.target.value })}
                    placeholder="Lista los pasos (1. Diseño, 2. Prototipo, 3. Test, ... )"
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Imágenes de portada">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="text-sm"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setProject({ ...project, portada: files });
                    }}
                  />
                  <p className="text-xs text-slate-500 mt-1">Puedes subir una o varias; se usará la principal como portada.</p>
                </Field>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm disabled:opacity-70"
                    onClick={saveProject}
                    disabled={isSaving}
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="rounded-md border px-4 py-2 text-sm text-slate-700"
                    onClick={() =>
                      setProject({
                        titulo: "",
                        subtitulo: "",
                        anio: "",
                        equipoIds: [],
                        objetivo: "",
                        problema: "",
                        tecnologias: [],
                        proceso: "",
                        portada: [],
                      })
                    }
                  >
                    Cancelar
                  </button>
                </div>
                <div className="rounded-md border border-slate-200 p-3">
                  <p className="text-sm font-medium text-slate-700 mb-2">Equipo seleccionado</p>
                  {project.equipoIds.length === 0 ? (
                    <p className="text-sm text-slate-500">Aún no se agregan miembros.</p>
                  ) : (
                    <ul className="space-y-1 text-sm text-slate-700">
                      {project.equipoIds.map((id) => {
                        const memberSelected = teamOptions.find((m) => m.id === id);
                        return (
                          <li key={id} className="flex items-center justify-between gap-2 rounded border border-slate-100 px-2 py-1">
                            <span>
                              {memberSelected?.name || "Integrante"} {memberSelected?.type ? `- ${memberSelected.type}` : ""}
                            </span>
                            <button
                              type="button"
                              className="text-xs text-red-600"
                              onClick={() => deselectTeamFromProject(id)}
                            >
                              Quitar
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                <div className="rounded-md border border-slate-200 p-3">
                  <p className="text-sm font-medium text-slate-700 mb-2">Tecnologías seleccionadas</p>
                  {project.tecnologias.length === 0 ? (
                    <p className="text-sm text-slate-500">Aún no se agregan tecnologías.</p>
                  ) : (
                    <ul className="space-y-1 text-sm text-slate-700">
                      {project.tecnologias.map((id) => {
                        const techSelected = techOptions.find((t) => t.id === id);
                        return (
                          <li key={id} className="flex items-center justify-between gap-2 rounded border border-slate-100 px-2 py-1">
                            <span>
                              {techSelected?.name || "Tecnología"} {techSelected?.category ? `- ${techSelected.category}` : ""}
                            </span>
                            <button
                              type="button"
                              className="text-xs text-red-600"
                              onClick={() => deselectTechFromProject(id)}
                            >
                              Quitar
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="tecnologia" className="mt-6">
            <SectionCard title="Tecnología">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Título">
                  <input
                    className="rounded-md border border-slate-200 p-2 text-sm"
                    value={tech.titulo}
                    onChange={(e) => setTech({ ...tech, titulo: e.target.value })}
                    placeholder="Ej: Router CNC"
                  />
                </Field>
                <Field label="Subtítulo">
                  <input
                    className="rounded-md border border-slate-200 p-2 text-sm"
                    value={tech.subtitulo}
                    onChange={(e) => setTech({ ...tech, subtitulo: e.target.value })}
                    placeholder="Ej: Corte de precisión"
                  />
                </Field>
                <Field label="Descripción">
                  <textarea
                    className="rounded-md border border-slate-200 p-2 text-sm"
                    rows={3}
                    value={tech.descripcion}
                    onChange={(e) => setTech({ ...tech, descripcion: e.target.value })}
                    placeholder="Detalles de la tecnología"
                  />
                </Field>
                <Field label="Área de trabajo (opcional)">
                  <input
                    className="rounded-md border border-slate-200 p-2 text-sm"
                    value={tech.areaTrabajo}
                    onChange={(e) => setTech({ ...tech, areaTrabajo: e.target.value })}
                    placeholder="Ej: 600x400 mm"
                  />
                </Field>
                <Field label="Nivel de certificación (1-5, opcional)">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    className="rounded-md border border-slate-200 p-2 text-sm"
                    value={tech.nivelCertificacion}
                    onChange={(e) => setTech({ ...tech, nivelCertificacion: e.target.value })}
                    placeholder="Ej: 3"
                  />
                </Field>
                <Field label="Características clave">
                  <textarea
                    className="rounded-md border border-slate-200 p-2 text-sm"
                    rows={3}
                    value={tech.caracteristicas}
                    onChange={(e) => setTech({ ...tech, caracteristicas: e.target.value })}
                    placeholder="Puntos destacados, capacidades, etc."
                  />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Field label="Materiales compatibles (lista, opcional)">
                    <div className="flex gap-2">
                      <input
                        className="rounded-md border border-slate-200 p-2 text-sm flex-1"
                        value={materialInput}
                        onChange={(e) => setMaterialInput(e.target.value)}
                        placeholder="Ej: MDF, PLA, Acrílico"
                      />
                      <button
                        type="button"
                        className="rounded-md bg-blue-600 px-3 py-2 text-white text-sm"
                        onClick={addMaterial}
                      >
                        Añadir
                      </button>
                    </div>
                  </Field>
                  {tech.materiales.length > 0 && (
                    <ul className="space-y-1 text-sm text-slate-700 rounded-md border border-slate-200 p-2">
                      {tech.materiales.map((m) => (
                        <li key={m} className="flex items-center justify-between gap-2">
                          <span>{m}</span>
                          <button
                            type="button"
                            className="text-xs text-red-600"
                            onClick={() => removeMaterial(m)}
                          >
                            Quitar
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="space-y-2">
                  <Field label="Imágenes (opcional)">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="text-sm"
                      onChange={(e) => setTechImages(Array.from(e.target.files || []))}
                    />
                  </Field>
                  <p className="text-xs text-slate-500">Adjunta fotos o renders de referencia.</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm disabled:opacity-70"
                    onClick={addTech}
                    disabled={isSaving}
                  >
                    Agregar a la lista
                  </button>
                  <button
                    type="button"
                    className="rounded-md border px-4 py-2 text-sm text-slate-700"
                    onClick={() => {
                      setTech({
                        titulo: "",
                        subtitulo: "",
                        descripcion: "",
                        areaTrabajo: "",
                        nivelCertificacion: "",
                        materiales: [],
                        caracteristicas: "",
                      });
                      setMaterialInput("");
                      setTechImages([]);
                    }}
                  >
                    Limpiar
                  </button>
                </div>
                <div className="rounded-md border border-slate-200 p-3">
                  <p className="text-sm font-medium text-slate-700 mb-2">Tecnologías registradas</p>
                  {techOptions.length === 0 ? (
                    <p className="text-sm text-slate-500">Aún no hay tecnologías.</p>
                  ) : (
                    <ul className="space-y-1 text-sm text-slate-700">
                      {techOptions.map((t) => (
                        <li key={t.id} className="flex items-start justify-between gap-2 rounded border border-slate-100 px-2 py-2">
                          <span className="flex-1">
                            <div className="font-medium text-slate-800">{t.name}</div>
                            {t.category && <div className="text-xs text-slate-600">Área: {t.category}</div>}
                            {t.detalle && <div className="text-xs text-slate-600">{t.detalle}</div>}
                            {t.nivel && <div className="text-xs text-slate-600">Nivel: {t.nivel}</div>}
                            {t.materiales?.length ? (
                              <div className="text-xs text-slate-600">Materiales: {t.materiales.join(", ")}</div>
                            ) : null}
                            {t.caracteristicas && <div className="text-xs text-slate-600">Características: {t.caracteristicas}</div>}
                          </span>
                          <button
                            type="button"
                            className="text-xs text-red-600"
                            onClick={() => removeTech(t.id)}
                          >
                            Eliminar
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="equipo" className="mt-6">
            <SectionCard title="Equipo">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nombre completo">
                  <input
                    className="rounded-md border border-slate-200 p-2 text-sm"
                    value={member.nombreCompleto}
                    onChange={(e) => setMember({ ...member, nombreCompleto: e.target.value })}
                    placeholder="Ej: Ana Pérez"
                  />
                </Field>
                <Field label="Biografía">
                  <textarea
                    className="rounded-md border border-slate-200 p-2 text-sm"
                    rows={3}
                    value={member.bio}
                    onChange={(e) => setMember({ ...member, bio: e.target.value })}
                    placeholder="Resumen de experiencia y rol en FabLab"
                  />
                </Field>
                <Field label="Tipo (estudiante, profesor, participante, etc.)">
                  <select
                    className="rounded-md border border-slate-200 p-2 text-sm"
                    value={member.tipo}
                    onChange={(e) => setMember({ ...member, tipo: e.target.value })}
                  >
                    <option value="">Selecciona tipo</option>
                    <option value="Estudiante">Estudiante</option>
                    <option value="Profesor">Profesor</option>
                    <option value="Participante">Participante</option>
                    <option value="Otro">Otro</option>
                  </select>
                </Field>
                <Field label="Carrera (que estudia o estudió)">
                  <input
                    className="rounded-md border border-slate-200 p-2 text-sm"
                    value={member.carrera}
                    onChange={(e) => setMember({ ...member, carrera: e.target.value })}
                    placeholder="Ej: Ingeniería Mecatrónica"
                  />
                </Field>
                <Field label="Formación">
                  <input
                    className="rounded-md border border-slate-200 p-2 text-sm"
                    value={member.formacion}
                    onChange={(e) => setMember({ ...member, formacion: e.target.value })}
                    placeholder="Ej: Licenciatura, Maestría, Certificación"
                  />
                </Field>
                <Field label="Foto">
                  <input
                    type="file"
                    accept="image/*"
                    className="text-sm"
                    onChange={(e) => setMember({ ...member, foto: e.target.files?.[0] || null })}
                  />
                </Field>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm disabled:opacity-70"
                    onClick={addTeamMember}
                    disabled={isSaving}
                  >
                    Agregar a la lista
                  </button>
                  <button
                    type="button"
                    className="rounded-md border px-4 py-2 text-sm text-slate-700"
                    onClick={() => setMember({ nombre: "", rol: "" })}
                  >
                    Limpiar
                  </button>
                </div>
                <div className="rounded-md border border-slate-200 p-3">
                  <p className="text-sm font-medium text-slate-700 mb-2">Equipo registrado</p>
                  {teamOptions.length === 0 ? (
                    <p className="text-sm text-slate-500">Aún no hay miembros.</p>
                  ) : (
                    <ul className="space-y-1 text-sm text-slate-700">
                      {teamOptions.map((m) => (
                        <li key={m.id} className="flex items-start justify-between gap-2 rounded border border-slate-100 px-2 py-2">
                          <span className="flex-1">
                            <div className="font-medium text-slate-800">{m.name}</div>
                            {m.type && <div className="text-xs text-slate-600">Tipo: {m.type}</div>}
                            {m.bio && <div className="text-xs text-slate-600">Bio: {m.bio}</div>}
                            {m.carrera && <div className="text-xs text-slate-600">Carrera: {m.carrera}</div>}
                            {m.formacion && <div className="text-xs text-slate-600">Formación: {m.formacion}</div>}
                          </span>
                          <button
                            type="button"
                            className="text-xs text-red-600"
                            onClick={() => removeTeamMember(m.id)}
                          >
                            Eliminar
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </SectionCard>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
