import React, { useState } from "react";
import { store } from "../../lib/store";
import { VehicleEvent } from "../../types/mergesafe";
import { Activity, Search, Filter, Plane, AlertTriangle, Eye, ShieldAlert } from "lucide-react";

interface TrafficViewProps {
  state: ReturnType<typeof store.getState>;
}

export const TrafficView: React.FC<TrafficViewProps> = ({ state }) => {
  const { events, activeHighwayId } = state;

  const [modeFilter, setModeFilter] = useState<"ALL" | "air" | "ground">("ALL");
  const [airFlyCarOnly, setAirFlyCarOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<VehicleEvent | null>(null);

  let filtered = activeHighwayId === "ALL" ? events : events.filter((e) => e.highwayId === activeHighwayId);

  if (modeFilter !== "ALL") {
    filtered = filtered.filter((e) => e.vehicleMode === modeFilter);
  }

  if (airFlyCarOnly) {
    filtered = filtered.filter((e) => e.isAirFlyCar === "Y");
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.vehicleId.toLowerCase().includes(q) ||
        e.zoneId.toLowerCase().includes(q) ||
        e.eventType.toLowerCase().includes(q) ||
        e.vehicleCategory.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Header Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-600" />
              Live Vehicle Telemetry Stream
            </h2>
            <p className="text-xs text-slate-500">Real-time incoming vehicle telemetry events, conflict alerts, and AirFlyCar corridor passes</p>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Vehicle or Zone ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-48 sm:w-64"
              />
            </div>

            {/* Mode Filter */}
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value as any)}
              className="p-1.5 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-700"
            >
              <option value="ALL">All Modes (Air & Ground)</option>
              <option value="air">Air Vehicles (High Altitude)</option>
              <option value="ground">Ground Vehicles (Roadway)</option>
            </select>

            {/* AirFlyCar Checkbox */}
            <label className="flex items-center gap-1.5 bg-purple-50 text-purple-800 px-3 py-1.5 rounded-xl border border-purple-200 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={airFlyCarOnly}
                onChange={(e) => setAirFlyCarOnly(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span>AirFlyCar Flagged Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Stream Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Vehicle ID</th>
                <th className="p-3">Mode / Category</th>
                <th className="p-3">AirFlyCar</th>
                <th className="p-3">Speed</th>
                <th className="p-3">Altitude</th>
                <th className="p-3">Coordinates</th>
                <th className="p-3">Zone ID</th>
                <th className="p-3">Event Type</th>
                <th className="p-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono text-slate-500">{new Date(ev.createdDate).toLocaleTimeString()}</td>
                  <td className="p-3 font-mono font-bold text-slate-900">{ev.vehicleId}</td>
                  <td className="p-3 font-medium capitalize text-slate-700">
                    {ev.vehicleMode} • {ev.vehicleCategory}
                  </td>
                  <td className="p-3">
                    {ev.isAirFlyCar === "Y" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                        Yes
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">No</span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-slate-900 font-semibold">{ev.speedMph} MPH</td>
                  <td className="p-3 font-mono text-purple-700 font-bold">
                    {ev.altitudeMeters > 0 ? `${ev.altitudeMeters}m` : "Ground (0m)"}
                  </td>
                  <td className="p-3 font-mono text-slate-500">{ev.latitude}, {ev.longitude}</td>
                  <td className="p-3 font-mono text-cyan-700 font-bold">{ev.zoneId}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ev.eventType === "conflict"
                          ? "bg-rose-100 text-rose-700"
                          : ev.eventType === "speeding"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {ev.eventType}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedEvent(ev)}
                      className="p-1.5 text-slate-400 hover:text-cyan-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payload Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-cyan-400 flex items-center gap-2">
                Telemetry Payload Inspector ({selectedEvent.vehicleId})
              </h3>
              <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-slate-300 overflow-x-auto">
                <pre>{JSON.stringify(JSON.parse(selectedEvent.payload || "{}"), null, 2)}</pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
