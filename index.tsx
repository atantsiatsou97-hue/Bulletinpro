import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { SchoolApp } from "@/components/school/SchoolApp";
import { registerOfflineWorker } from "@/lib/school/register-sw";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bulletins — Moyennes et bulletins trimestriels du collège" },
      {
        name: "description",
        content:
          "Logiciel hors ligne pour calculer les moyennes, rangs, appréciations et décisions, et imprimer les bulletins trimestriels du collège.",
      },
      { property: "og:title", content: "Bulletins — Moyennes et bulletins du collège" },
      {
        property: "og:description",
        content: "Calcul des moyennes, rangs, distinctions et décisions ; impression des bulletins trimestriels.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    void registerOfflineWorker();
  }, []);
  return (
    <ClientOnly
      fallback={
        <div className="flex min-h-screen items-center justify-center font-serif text-lg text-muted-foreground">
          Chargement…
        </div>
      }
    >
      <SchoolApp />
    </ClientOnly>
  );
}
