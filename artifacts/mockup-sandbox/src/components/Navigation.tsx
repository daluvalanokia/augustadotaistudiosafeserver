import React from "react";
import {
  Activity,
  Plane,
  Server,
  Radio,
  Triangle,
  FileCode2,
  Users,
  ShieldCheck,
  MapPin,
  Compass,
  LayoutDashboard,
  Layers,
  RotateCcw,
  Play,
  Pause,
  LogOut,
  UserCheck
} from "lucide-react";
import { store } from "../lib/store";
import { UserProfile } from "../types/mergesafe";

export type TabKey =
  | "portal"
  | "dashboard"
  | "airscene"
  | "mergezones"
  | "switchservers"
  | "sensors"
  | "triangulation"
  | "traffic"
  | "ingest"
  | "highways"
  | "users"
  | "auditlogs";

interface NavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  state: ReturnType<typeof store.getState>;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, state }) => {
  const { highways, activeHighwayId, simulation, currentUser } = state;

  const handleHighwayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    store.setActiveHighway(e.target.value);
  };

  const toggleSim = () => {
    store.toggleSimulation();
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the database to initial seed data?")) {
      store.resetToSeed();
    }
  };

  const navItems: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "portal", label: "Portal", icon: <Compass className="w-4 h-4" /> },
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: "airscene", label: "3D AirScene", icon: <Plane className="w-4 h-4" /> },
    { key: "mergezones", label: "Merge Zones", icon: <MapPin className="w-4 h-4" /> },
    { key: "switchservers", label: "Switch Servers", icon: <Server className="w-4 h-4" /> },
    { key: "sensors", label: "Sensors", icon: <Radio className="w-4 h-4" /> },
    { key: "triangulation", label: "Triangulation", icon: <Triangle className="w-4 h-4" /> },
    { key: "traffic", label: "Traffic Stream", icon: <Activity className="w-4 h-4" /> },
    { key: "ingest", label: "Ingest Sandbox", icon: <FileCode2 className="w-4 h-4" /> },
    { key: "highways", label: "Highways", icon: <Layers className="w-4 h-4" /> },
    { key: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { key: "auditlogs", label: "Audit Logs", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-xl sticky top-0 z-50">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Plane className="w-6 h-6 text-white transform -rotate-12" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                AIRWAYS <span className="text-cyan-400">MERGESAFE</span>
              </h1>
              <span className="bg-cyan-950 text-cyan-400 text-xs font-semibold px-2 py-0.5 rounded border border-cyan-800">
                v3.2 Operations
              </span>
              <span className="bg-emerald-950 text-emerald-400 text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                DLL: {state.dalStatus?.version || "DataLayer 1.2.0"}
              </span>
            </div>
            <p className="text-xs text-slate-400">Augusta Air & Ground Traffic Synchronization Engine</p>
          </div>
        </div>

        {/* Global Controls & Status */}
        <div className="flex items-center flex-wrap gap-3 text-xs">
          {/* Active Highway Filter */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 font-medium">Highway Context:</span>
            <select
              value={activeHighwayId}
              onChange={handleHighwayChange}
              className="bg-slate-900 text-cyan-300 font-semibold rounded px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="ALL">All Highways / Airways</option>
              {highways.map((h) => (
                <option key={h.id} value={h.highwayId}>
                  {h.highwayId} ({h.name})
                </option>
              ))}
            </select>
          </div>

          {/* Simulation Toggle Button */}
          <button
            onClick={toggleSim}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all shadow-sm ${
              simulation.isRunning
                ? "bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900"
                : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
            }`}
          >
            {simulation.isRunning ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Pause className="w-3.5 h-3.5" />
                <span>Sim Streaming</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Start Telemetry Stream</span>
              </>
            )}
          </button>

          {/* Reset DB */}
          <button
            onClick={handleReset}
            title="Reset to initial seed database"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* User Status Chip */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <div className="leading-none">
                <span className="block font-semibold text-slate-200">{currentUser.fullName}</span>
                <span className="block text-[10px] text-cyan-400 capitalize">{currentUser.userType}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 min-w-max">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onTabChange(item.key)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all ${
                  isActive
                    ? "border-cyan-400 text-cyan-300 bg-slate-900/90"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
