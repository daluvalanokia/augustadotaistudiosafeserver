import React from "react";
import { store } from "../../lib/store";
import { TabKey } from "../Navigation";
import { Compass, ShieldCheck, Activity, Plane, Server, Radio, Lock, UserCheck } from "lucide-react";

interface PortalViewProps {
  onTabChange: (tab: TabKey) => void;
  state: ReturnType<typeof store.getState>;
}

export const PortalView: React.FC<PortalViewProps> = ({ onTabChange, state }) => {
  const { highways, mergeZones, switchServers, sensors, userProfiles, currentUser, activeHighwayId } = state;

  const currentHighway = highways.find((h) => h.highwayId === activeHighwayId) || highways[0];

  const handleSelectUser = (userId: string) => {
    const user = userProfiles.find((u) => u.userId === userId);
    if (user) {
      store.setCurrentUser(user);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner / Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-400 to-transparent pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Airways MergeSafe Central Operations Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Ground & Sky Traffic Synchronization
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Augusta Airways MergeSafe coordinates edge switch servers, multi-sensor triangulation arrays (LiDAR, Radar, Acoustic),
            and high-altitude AirFlyCar/eVTOL corridors across major highway networks. Select your operator persona below to manage merge zones.
          </p>
        </div>
      </div>

      {/* Active Session & Persona Switcher */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-600" />
              Active User Session
            </h3>
            <p className="text-xs text-slate-500">Switch user profile to test permission levels (Admin, Operator, Supervisor, Technician, Viewer)</p>
          </div>
          <span className="text-xs font-medium text-slate-400">System Auth: Session Cookie + Token Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {userProfiles.map((user) => {
            const isCurrent = currentUser?.userId === user.userId;
            return (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user.userId)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                  isCurrent
                    ? "bg-cyan-50 border-cyan-300 ring-2 ring-cyan-500/20 shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                    {user.fullName}
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-cyan-600" />}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{user.userId}</div>
                  <div className="text-[11px] text-slate-400 mt-1 capitalize font-medium">{user.userType} • {user.highwayName.split("—")[0]}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  user.userType === "admin" ? "bg-purple-100 text-purple-700" :
                  user.userType === "operator" ? "bg-blue-100 text-blue-700" :
                  user.userType === "technician" ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-700"
                }`}>
                  {user.userType}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Access Portal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onTabChange("dashboard")}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Operational Dashboard</h3>
          <p className="text-xs text-slate-500 mb-3">Live telemetry graphs, device connectivity counts, conflict warnings.</p>
          <span className="text-xs font-semibold text-cyan-600 group-hover:underline">Open Dashboard →</span>
        </div>

        <div
          onClick={() => onTabChange("airscene")}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Plane className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">3D AirScene Canvas</h3>
          <p className="text-xs text-slate-500 mb-3">Spatial visualization of AirFlyCar corridors (150-300m) and ground merge zones.</p>
          <span className="text-xs font-semibold text-blue-600 group-hover:underline">Launch 3D Visualizer →</span>
        </div>

        <div
          onClick={() => onTabChange("triangulation")}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Edge Switch Triangulation</h3>
          <p className="text-xs text-slate-500 mb-3">3-node node positioning matrix for precision sub-meter vehicle tracking.</p>
          <span className="text-xs font-semibold text-indigo-600 group-hover:underline">View Triangulation →</span>
        </div>
      </div>
    </div>
  );
};
