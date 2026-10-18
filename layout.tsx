import { AppHeader } from "@/components/AppHeader";
import { requireUser } from "@/lib/auth";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const { user, profile } = await requireUser();
  return (
    <>
      <AppHeader profile={profile} email={user.email} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">{children}</main>
    </>
  );
}
