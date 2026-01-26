import { NextResponse } from "next/server";
import { teamRepository } from "@/features/landing/infrastructure/team.repository";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const members = await teamRepository.getAll();

    return NextResponse.json({
      data: members,
      meta: { pagination: { total: members.length } }
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching team members", error);
    return NextResponse.json(
      {
        data: [],
        meta: { pagination: { total: 0 } },
        warning: {
          source: "server_error",
          message: "Error cargando miembros del equipo",
          error: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 }
    );
  }
}
