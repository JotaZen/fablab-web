"use server";

import { getPayload } from "payload";
import config from "@/../payload.config";

interface ContactMessage {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
  estado: "nuevo" | "leido" | "progreso" | "resuelto";
  respuesta?: string;
  fechaRespuesta?: string;
  createdAt: string;
}

export async function getContactMessages() {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "contact-messages",
      limit: 100,
      sort: "-createdAt",
    });

    return result.docs as unknown as ContactMessage[];
  } catch (error) {
    console.error("Error cargando mensajes:", error);
    return [];
  }
}

export async function updateContactMessageStatus(id: string, estado: string) {
  try {
    const payload = await getPayload({ config });
    const result = await payload.update({
      collection: "contact-messages",
      id,
      data: { estado },
    });
    return result as ContactMessage;
  } catch (error) {
    console.error("Error actualizando estado:", error);
    throw error;
  }
}

export async function deleteContactMessage(id: string) {
  try {
    const payload = await getPayload({ config });
    await payload.delete({
      collection: "contact-messages",
      id,
    });
    return true;
  } catch (error) {
    console.error("Error eliminando mensaje:", error);
    throw error;
  }
}
