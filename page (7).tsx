import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Interrogation } from "@/components/Interrogation";
import { requireRole } from "@/lib/auth";
import type { Deal } from "@/lib/types";

export const metadata: Metadata = { title: "Interrogation" };

export default async function SessionPage({ params }: PageProps<"/founder/session/[id]">) {
  const { id } = await params;
  const { supabase } = await requireRole("founder");

  const { data } = await supabase
    .from("interrogations")
    .select("*, startups(*)")
    .eq("id", id)
    .maybeSingle<Deal>();
  if (!data) notFound();

  return <Interrogation initial={data} startupName={data.startups.name} />;
}
