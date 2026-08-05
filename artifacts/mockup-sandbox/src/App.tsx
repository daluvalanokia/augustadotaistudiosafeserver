import { useEffect, useState, type ComponentType } from "react";

import { modules as discoveredModules } from "./.generated/mockup-components";

type ModuleMap = Record<string, () => Promise<Record<string, unknown>>>;

function _resolveComponent(
  mod: Record<string, unknown>,
  name: string,
): ComponentType | undefined {
  const fns = Object.values(mod).filter(
    (v) => typeof v === "function",
  ) as ComponentType[];
  return (
    (mod.default as ComponentType) ||
    (mod.Preview as ComponentType) ||
    (mod[name] as ComponentType) ||
    fns[fns.length - 1]
  );
}

function PreviewRenderer({
  componentPath,
  modules,
}: {
  componentPath: string;
  modules: ModuleMap;
}) {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setComponent(null);
    setError(null);

    async function loadComponent(): Promise<void> {
      const key = `./components/mockups/${componentPath}.tsx`;
      const loader = modules[key];
      if (!loader) {
        setError(`No component found at ${componentPath}.tsx`);
        return;
      }

      try {
        const mod = await loader();
        if (cancelled) {
          return;
        }
        const name = componentPath.split("/").pop()!;
        const comp = _resolveComponent(mod, name);
        if (!comp) {
          setError(
            `No exported React component found in ${componentPath}.tsx\n\nMake sure the file has at least one exported function component.`,
          );
          return;
        }
        setComponent(() => comp);
      } catch (e) {
        if (cancelled) {
          return;
        }

        const message = e instanceof Error ? e.message : String(e);
        setError(`Failed to load preview.\n${message}`);
      }
    }

    void loadComponent();

    return () => {
      cancelled = true;
    };
  }, [componentPath, modules]);

  if (error) {
    return (
      <pre style={{ color: "red", padding: "2rem", fontFamily: "system-ui" }}>
        {error}
      </pre>
    );
  }

  if (!Component) return null;

  return <Component />;
}

function getBasePath(): string {
  return import.meta.env.BASE_URL.replace(/\/$/, "");
}

function getPreviewExamplePath(): string {
  const basePath = getBasePath();
  return `${basePath}/preview/ComponentName`;
}

function getPreviewPath(): string | null {
  const basePath = getBasePath();
  const { pathname } = window.location;
  const local =
    basePath && pathname.startsWith(basePath)
      ? pathname.slice(basePath.length) || "/"
      : pathname;
  const match = local.match(/^\/preview\/(.+)$/);
  return match ? match[1] : null;
}

import { Navigation, TabKey } from "./components/Navigation";
import { PortalView } from "./components/views/PortalView";
import { DashboardView } from "./components/views/DashboardView";
import { AirScene3DView } from "./components/views/AirScene3DView";
import { MergeZonesView } from "./components/views/MergeZonesView";
import { SwitchServersView } from "./components/views/SwitchServersView";
import { SensorsView } from "./components/views/SensorsView";
import { TriangulationView } from "./components/views/TriangulationView";
import { TrafficView } from "./components/views/TrafficView";
import { IngestView } from "./components/views/IngestView";
import { HighwaysView } from "./components/views/HighwaysView";
import { UsersView } from "./components/views/UsersView";
import { AuditLogsView } from "./components/views/AuditLogsView";
import { store } from "./lib/store";

function MergeSafeMainApp() {
  const [activeTab, setActiveTab] = useState<TabKey>("portal");
  const [appState, setAppState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setAppState({ ...store.getState() });
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased selection:bg-cyan-500 selection:text-white">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} state={appState} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "portal" && <PortalView onTabChange={setActiveTab} state={appState} />}
        {activeTab === "dashboard" && <DashboardView onTabChange={setActiveTab} state={appState} />}
        {activeTab === "airscene" && <AirScene3DView state={appState} />}
        {activeTab === "mergezones" && <MergeZonesView state={appState} />}
        {activeTab === "switchservers" && <SwitchServersView state={appState} />}
        {activeTab === "sensors" && <SensorsView state={appState} />}
        {activeTab === "triangulation" && <TriangulationView state={appState} />}
        {activeTab === "traffic" && <TrafficView state={appState} />}
        {activeTab === "ingest" && <IngestView state={appState} />}
        {activeTab === "highways" && <HighwaysView state={appState} />}
        {activeTab === "users" && <UsersView state={appState} />}
        {activeTab === "auditlogs" && <AuditLogsView state={appState} />}
      </main>

      <footer className="bg-slate-950 text-slate-500 text-xs border-t border-slate-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-300">Augusta Airways MergeSafe System</span> • Augusta, Georgia Air & Ground Traffic Management
          </div>
          <div className="font-mono text-[11px]">
            Server Node: <span className="text-cyan-400 font-bold">127.0.0.1:3000</span> | Status: <span className="text-emerald-400 font-bold">SYNCHRONIZED</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const previewPath = getPreviewPath();

  if (previewPath) {
    return (
      <PreviewRenderer
        componentPath={previewPath}
        modules={discoveredModules}
      />
    );
  }

  return <MergeSafeMainApp />;
}

export default App;
