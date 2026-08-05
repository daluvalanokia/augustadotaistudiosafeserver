import React, { useState } from "react";
import { store } from "../../lib/store";
import { SwitchServer } from "../../types/mergesafe";
import { Server, Plus, Edit2, Trash2, Cpu, HardDrive } from "lucide-react";

interface SwitchServersViewProps {
  state: ReturnType<typeof store.getState>;
}

export const SwitchServersView: React.FC<SwitchServersViewProps> = ({ state }) => {
  const { switchServers, mergeZones, activeHighwayId } = state;
  const [editingServer, setEditingServer] = useState<Partial<SwitchServer> | null>(null);

  const filteredServers = activeHighwayId === "ALL" ? switchServers : switchServers.filter((s) => s.highwayId === activeHighwayId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingServer) {
      store.saveSwitchServer(editingServer);
      setEditingServer(null);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this edge switch server?")) {
      store.deleteSwitchServer(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            Edge Switch Servers Registry
          </h2>
          <p className="text-xs text-slate-500">Low-latency localized node servers processing LiDAR/Radar telemetry and AirFlyCar triangulation</p>
        </div>

        <button
          onClick={() =>
            setEditingServer({
              serverName: "",
              serverId: `SRV-${Math.floor(Math.random() * 8999 + 1000)}`,
              zoneId: mergeZones[0]?.zoneId || "I20-Z001",
              highwayId: activeHighwayId === "ALL" ? "I20-TX" : activeHighwayId,
              ipAddress: "10.2.14.150",
              port: 8081,
              status: "online",
              firmwareVersion: "v3.3.0",
              altitudeMinMeters: 50,
              altitudeMaxMeters: 250,
              altitudeWidthMeters: 30
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Switch Server</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                <th className="p-3">Server ID</th>
                <th className="p-3">Server Name</th>
                <th className="p-3">Zone ID</th>
                <th className="p-3">IP Endpoint</th>
                <th className="p-3">Firmware</th>
                <th className="p-3">Altitude Range (Min–Max / Width)</th>
                <th className="p-3">CPU / Memory</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredServers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900">{s.serverId}</td>
                  <td className="p-3 font-semibold text-slate-800">{s.serverName}</td>
                  <td className="p-3 font-mono text-cyan-700 font-semibold">{s.zoneId}</td>
                  <td className="p-3 font-mono text-slate-600">{s.ipAddress}:{s.port}</td>
                  <td className="p-3 font-mono text-slate-500">{s.firmwareVersion}</td>
                  <td className="p-3 font-mono text-purple-700">
                    {s.altitudeMinMeters}m – {s.altitudeMaxMeters}m (w: {s.altitudeWidthMeters}m)
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-mono text-slate-700">
                        <Cpu className="w-3 h-3 text-slate-400" /> {s.cpuPercent}%
                      </span>
                      <span className="flex items-center gap-1 font-mono text-slate-700">
                        <HardDrive className="w-3 h-3 text-slate-400" /> {s.memoryPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        s.status === "online"
                          ? "bg-emerald-100 text-emerald-700"
                          : s.status === "degraded"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => setEditingServer(s)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingServer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b pb-3">
              {editingServer.id ? "Edit Switch Server" : "Add New Switch Server"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Server ID</label>
                  <input
                    type="text"
                    required
                    value={editingServer.serverId || ""}
                    onChange={(e) => setEditingServer({ ...editingServer, serverId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Zone ID</label>
                  <select
                    value={editingServer.zoneId || ""}
                    onChange={(e) => setEditingServer({ ...editingServer, zoneId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  >
                    {mergeZones.map((z) => (
                      <option key={z.id} value={z.zoneId}>
                        {z.zoneId} ({z.zoneName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Server Name</label>
                <input
                  type="text"
                  required
                  value={editingServer.serverName || ""}
                  onChange={(e) => setEditingServer({ ...editingServer, serverName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">IP Address</label>
                  <input
                    type="text"
                    required
                    value={editingServer.ipAddress || "10.0.1.1"}
                    onChange={(e) => setEditingServer({ ...editingServer, ipAddress: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Port</label>
                  <input
                    type="number"
                    value={editingServer.port || 8081}
                    onChange={(e) => setEditingServer({ ...editingServer, port: parseInt(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Status</label>
                  <select
                    value={editingServer.status || "online"}
                    onChange={(e) => setEditingServer({ ...editingServer, status: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="online">Online</option>
                    <option value="degraded">Degraded</option>
                    <option value="offline">Offline</option>
                    <option value="fault">Fault</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Altitude Min (m)</label>
                  <input
                    type="number"
                    value={editingServer.altitudeMinMeters || 50}
                    onChange={(e) => setEditingServer({ ...editingServer, altitudeMinMeters: parseFloat(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Altitude Max (m)</label>
                  <input
                    type="number"
                    value={editingServer.altitudeMaxMeters || 250}
                    onChange={(e) => setEditingServer({ ...editingServer, altitudeMaxMeters: parseFloat(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Width (m)</label>
                  <input
                    type="number"
                    value={editingServer.altitudeWidthMeters || 30}
                    onChange={(e) => setEditingServer({ ...editingServer, altitudeWidthMeters: parseFloat(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingServer(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 border hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Save Switch Server
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
