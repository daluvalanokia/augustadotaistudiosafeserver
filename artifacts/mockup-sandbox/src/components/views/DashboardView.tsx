import React from "react";
import { store } from "../../lib/store";
import { Activity, Plane, Server, Radio, AlertTriangle, ShieldCheck, MapPin, Gauge } from "lucide-react";
import { TabKey } from "../Navigation";

interface DashboardViewProps {
  onTabChange: (tab: TabKey) => void;
  state: ReturnType<typeof store.getState>;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onTabChange, state }) => {
  const { highways, mergeZones, switchServers, sensors, events, activeHighwayId, simulation } = state;

  const filteredZones = activeHighwayId === "ALL" ? mergeZones : mergeZones.filter((z) => z.highwayId === activeHighwayId);
  const filteredServers = activeHighwayId === "ALL" ? switchServers : switchServers.filter((s) => s.highwayId === activeHighwayId);
  const filteredSensors = activeHighwayId === "ALL" ? sensors : sensors.filter((s) => s.highwayId === activeHighwayId);
  const filteredEvents = activeHighwayId === "ALL" ? events : events.filter((e) => e.highwayId === activeHighwayId);

  const onlineServers = filteredServers.filter((s) => s.status === "online").length;
  const onlineSensors = filteredSensors.filter((s) => s.status === "online").length;

  const airEvents = filteredEvents.filter((e) => e.vehicleMode === "air");
  const groundEvents = filteredEvents.filter((e) => e.vehicleMode === "ground");
  const airFlyCarEvents = filteredEvents.filter((e) => e.isAirFlyCar === "Y");
  const conflicts = filteredEvents.filter((e) => e.eventType === "conflict" || e.eventType === "altitude_deviation");

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Merge Zones</span>
            <MapPin className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{filteredZones.length}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            {filteredZones.filter((z) => z.status === "active").length} Active
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Edge Switches</span>
            <Server className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{filteredServers.length}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            <span className="text-emerald-600 font-bold">{onlineServers}</span> / {filteredServers.length} Online
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sensor Devices</span>
            <Radio className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{filteredSensors.length}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            <span className="text-emerald-600 font-bold">{onlineSensors}</span> / {filteredSensors.length} Online
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Air Vehicles</span>
            <Plane className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900">{airEvents.length}</div>
          <div className="text-[11px] text-purple-600 mt-1 font-medium">
            {airFlyCarEvents.length} AirFlyCars
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ground Cars</span>
            <Gauge className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{groundEvents.length}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Highways Telemetry</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Conflicts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600">{conflicts.length}</div>
          <div className="text-[11px] text-rose-600 mt-1 font-medium">Proximity Warnings</div>
        </div>
      </div>

      {/* Traffic Distribution & System Health Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ground vs Air Telemetry Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Corridor Mode Ratio</h3>
            <span className="text-xs text-slate-400 font-mono">Live Sync</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-purple-700">High Altitude Air (150m–500m)</span>
                <span className="font-mono text-slate-600">{airEvents.length} events ({Math.round((airEvents.length / Math.max(1, filteredEvents.length)) * 100)}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
                  style={{ width: `${Math.round((airEvents.length / Math.max(1, filteredEvents.length)) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Ground Highway Lanes (0m)</span>
                <span className="font-mono text-slate-600">{groundEvents.length} events ({Math.round((groundEvents.length / Math.max(1, filteredEvents.length)) * 100)}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                  style={{ width: `${Math.round((groundEvents.length / Math.max(1, filteredEvents.length)) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>AirFlyCar Stream Flagged:</span>
              <span className="font-semibold text-slate-800">{airFlyCarEvents.length} vehicles</span>
            </div>
            <div className="flex justify-between">
              <span>Average Air Speed:</span>
              <span className="font-semibold text-slate-800">118 MPH</span>
            </div>
          </div>
        </div>

        {/* Edge Switch Health Matrix */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Edge Switch Server Cluster</h3>
            <button
              onClick={() => onTabChange("switchservers")}
              className="text-xs text-cyan-600 font-semibold hover:underline"
            >
              Manage Switches →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredServers.slice(0, 6).map((srv) => (
              <div key={srv.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{srv.serverName}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      srv.status === "online"
                        ? "bg-emerald-500"
                        : srv.status === "degraded"
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                  />
                </div>
                <div className="text-[11px] text-slate-500 font-mono">{srv.ipAddress}:{srv.port}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                  <span>CPU: <strong className="text-slate-800">{srv.cpuPercent}%</strong></span>
                  <span>Mem: <strong className="text-slate-800">{srv.memoryPercent}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Telemetry Stream Ticker */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-600" />
            <h3 className="font-bold text-slate-900 text-sm">Recent Vehicle Telemetry & Conflicts</h3>
          </div>
          <button onClick={() => onTabChange("traffic")} className="text-xs text-cyan-600 font-semibold hover:underline">
            View Live Stream →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                <th className="p-2.5 rounded-l-lg">Time</th>
                <th className="p-2.5">Vehicle ID</th>
                <th className="p-2.5">Mode / Category</th>
                <th className="p-2.5">Speed</th>
                <th className="p-2.5">Altitude</th>
                <th className="p-2.5">Zone</th>
                <th className="p-2.5 rounded-r-lg">Event Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.slice(0, 7).map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-2.5 font-mono text-slate-500">
                    {new Date(ev.createdDate).toLocaleTimeString()}
                  </td>
                  <td className="p-2.5 font-bold text-slate-900 flex items-center gap-1.5">
                    {ev.vehicleId}
                    {ev.isAirFlyCar === "Y" && (
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded">
                        AirFlyCar
                      </span>
                    )}
                  </td>
                  <td className="p-2.5 capitalize text-slate-700">
                    {ev.vehicleMode} • {ev.vehicleCategory}
                  </td>
                  <td className="p-2.5 font-mono text-slate-900">{ev.speedMph} MPH</td>
                  <td className="p-2.5 font-mono text-slate-700">
                    {ev.altitudeMeters > 0 ? `${ev.altitudeMeters}m` : "Ground (0m)"}
                  </td>
                  <td className="p-2.5 font-mono text-slate-600">{ev.zoneId}</td>
                  <td className="p-2.5">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
