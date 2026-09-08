import { activeProfile } from "@/lib/config/client-profile";
import Chat from "@/components/Chat";

export default function Home() {
  const { brand, greeting, suggestions, escalation, clientName } = activeProfile;
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-4 py-6">
      <Chat brand={brand} greeting={greeting} suggestions={suggestions} escalation={escalation} />
      <p className="mt-4 text-center text-xs text-neutral-400">
        {clientName} support assistant · answers from public information · for general guidance only
      </p>
    </main>
  );
}
