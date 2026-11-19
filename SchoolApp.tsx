import {
  BookOpen,
  Download,
  Upload,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  PenLine,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

import { useEffect, useRef, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { exportBackup, importBackupFile } from "@/lib/school/backup";
import { listenForInstall } from "@/lib/school/install";
import { cn } from "@/lib/utils";
import { useSchool, useUi, type View } from "@/lib/school/store";

import { BulletinsView } from "./BulletinsView";
import { ClassesView } from "./ClassesView";
import { CouncilView } from "./CouncilView";
import { Dashboard } from "./Dashboard";
import { GradesView } from "./GradesView";
import { SettingsView } from "./SettingsView";
import { SubjectsView } from "./SubjectsView";

const NAV: { view: View; label: string; icon: LucideIcon }[] = [
  { view: "accueil", label: "Accueil", icon: LayoutDashboard },
  { view: "classes", label: "Classes & élèves", icon: Users },
  { view: "matieres", label: "Matières", icon: BookOpen },
  { view: "notes", label: "Saisie des notes", icon: PenLine },
  { view: "conseil", label: "Conseil de classe", icon: ClipboardCheck },
  { view: "bulletins", label: "Bulletins", icon: FileText },
  { view: "parametres", label: "Paramètres", icon: Settings },
];

const VIEWS: Record<View, () => React.JSX.Element> = {
  accueil: Dashboard,
  classes: ClassesView,
  matieres: SubjectsView,
  notes: GradesView,
  conseil: CouncilView,
  bulletins: BulletinsView,
  parametres: SettingsView,
};

export function SchoolApp() {
  const view = useUi((s) => s.view);
  const setView = useUi((s) => s.setView);
  const school = useSchool((s) => s.school);
  const Current = VIEWS[view] ?? Dashboard;
  const importRef = useRef<HTMLInputElement>(null);
  const hydrated = useSyncExternalStore(
    (cb) => useSchool.persist.onFinishHydration(cb),
    () => useSchool.persist.hasHydrated(),
    () => false,
  );
  useEffect(() => listenForInstall(), []);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center font-serif text-lg text-muted-foreground">
        Chargement des données…
      </div>
    );
  }

  return (
    <>
      <div className="app-shell flex min-h-screen flex-col md:flex-row">
        <aside className="flex shrink-0 flex-col bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:h-screen md:w-60">
          <div className="flex items-center gap-3 px-5 py-5">
            <div className="flex size-10 items-center justify-center rounded-md bg-sidebar-primary font-serif text-lg font-bold text-sidebar-primary-foreground">
              {school.logo ? <img src={school.logo} alt="" className="size-full rounded-md object-contain" /> : "B"}
            </div>
            <div className="min-w-0">
              <div className="font-serif text-lg leading-tight font-semibold">Bulletins</div>
              <div className="truncate text-xs opacity-70">{school.anneeScolaire}</div>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible">
            {NAV.map((item) => (
              <button
                key={item.view}
                type="button"
                onClick={() => setView(item.view)}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  view === item.view
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="hidden border-t border-sidebar-border px-5 py-4 text-xs opacity-60 md:block">
            Fonctionne hors ligne · données sur cet ordinateur
          </div>
        </aside>
        <main className="min-w-0 flex-1 px-5 py-6 md:px-10 md:py-8">
          <div className="mb-6 flex flex-wrap gap-3">
            <Button size="lg" className="font-bold" onClick={exportBackup}>
              <Download /> EXPORTER MES DONNÉES (.json)
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-primary font-bold" onClick={() => importRef.current?.click()}>
              <Upload /> IMPORTER MES DONNÉES (.json)
            </Button>
            <input
              ref={importRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              aria-label="Fichier de sauvegarde"
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) void importBackupFile(f);
              }}
            />
          </div>
          <Current />
        </main>
      </div>
      <Toaster position="bottom-right" richColors />
    </>
  );
}
