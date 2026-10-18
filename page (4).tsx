import type { Metadata } from "next";
import { DealRadar } from "@/components/DealRadar";
import { requireRole } from "@/lib/auth";
import type { Deal } from "@/lib/types";

export const metadata: Metadata = { title: "Deal radar" };

export default async function InvestorHome() {
  const { supabase, user } = await requireRole("investor");

  const [deals, terms, intros] = await Promise.all([
    supabase
      .from("interrogations")
      .select("*, startups(*)")
      .eq("verified", true)
      .order("completed_at", { ascending: false })
      .limit(200)
      .returns<Deal[]>(),
    supabase.from("term_sheets").select("interrogation_id"),
    supabase.from("intro_requests").select("interrogation_id"),
  ]);

  return (
    <DealRadar
      initialDeals={deals.data ?? []}
      userId={user.id}
      sentTerms={(terms.data ?? []).map((t) => t.interrogation_id)}
      sentIntros={(intros.data ?? []).map((t) => t.interrogation_id)}
    />
  );
}
