import React, { useState } from "react";
import { store } from "../../lib/store";
import { MergeZone } from "../../types/mergesafe";
import { MapPin, Plus, Edit2, Trash2, ShieldCheck, AlertTriangle } from "lucide-react";

interface MergeZonesViewProps {
  state: ReturnType<typeof store.getState>;
}

export const MergeZonesView: React.FC<MergeZonesViewProps> = ({ state }) => {
  const { mergeZones, highways, activeHighwayId } = state;
  const [editingZone, setEditingZone] = useState<Partial<MergeZone> | null>(null);

  const filteredZones = activeHighwayId === "ALL" ? mergeZones : mergeZones.filter((z) => z.highwayId === activeHighwayId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingZone) {
      store.saveMergeZone(editingZone);
      setEditingZone(null);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this Merge Zone?")) {
      store.deleteMergeZone(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-600" />
            Merge Zones Registry
          </h2>
          <p className="text-xs text-slate-500">Configured geofences, altitude thresholds, and mile markers for air & ground traffic synchronization</p>
        </div>

        <button
          onClick={() =>
            setEditingZone({
              zoneName: "",
              zoneId: `MZ-${Math.floor(Math.random() * 899 + 100)}`,
              highwayId: activeHighwayId === "ALL" ? "I20-TX" : activeHighwayId,
              mileMarker: 100.0,
              latitude: 32.722,
              longitude: -96.987,
              geofenceRadius: 500,
              status: "active",
              altitudeMeters: 150
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Merge Zone</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                <th className="p-3">Zone ID</th>
                <th className="p-3">Zone Name</th>
                <th className="p-3">Highway ID</th>
                <th className="p-3">Mile Marker</th>
                <th className="p-3">Coordinates (Lat / Lon)</th>
                <th className="p-3">Geofence Radius</th>
                <th className="p-3">Air Altitude Ceiling</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredZones.map((z) => (
                <tr key={z.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900">{z.zoneId}</td>
                  <td className="p-3 font-semibold text-slate-800">{z.zoneName}</td>
                  <td className="p-3 font-mono text-cyan-700 font-semibold">{z.highwayId}</td>
                  <td className="p-3 font-mono text-slate-600">MM {z.mileMarker}</td>
                  <td className="p-3 font-mono text-slate-500">{z.latitude}, {z.longitude}</td>
                  <td className="p-3 font-mono text-slate-700">{z.geofenceRadius} meters</td>
                  <td className="p-3 font-mono text-purple-700 font-bold">{z.altitudeMeters || 150}m</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        z.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : z.status === "fault"
                          ? "bg-rose-100 text-rose-700"
                          : z.status === "maintenance"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {z.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => setEditingZone(z)}
                      className="p-1.5 text-slate-400 hover:text-cyan-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(z.id)}
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

      {/* Edit Modal */}
      {editingZone && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b pb-3">
              {editingZone.id ? "Edit Merge Zone" : "Create New Merge Zone"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Zone ID</label>
                  <input
                    type="text"
                    required
                    value={editingZone.zoneId || ""}
                    onChange={(e) => setEditingZone({ ...editingZone, zoneId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Highway ID</label>
                  <select
                    value={editingZone.highwayId || "I20-TX"}
                    onChange={(e) => setEditingZone({ ...editingZone, highwayId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  >
                    {highways.map((h) => (
                      <option key={h.id} value={h.highwayId}>
                        {h.highwayId}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Zone Name</label>
                <input
                  type="text"
                  required
                  value={editingZone.zoneName || ""}
                  onChange={(e) => setEditingZone({ ...editingZone, zoneName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Mile Marker</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingZone.mileMarker || 100}
                    onChange={(e) => setEditingZone({ ...editingZone, mileMarker: parseFloat(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editingZone.latitude || 32.722}
                    onChange={(e) => setEditingZone({ ...editingZone, latitude: parseFloat(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editingZone.longitude || -96.987}
                    onChange={(e) => setEditingZone({ ...editingZone, longitude: parseFloat(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Geofence Radius (m)</label>
                  <input
                    type="number"
                    value={editingZone.geofenceRadius || 500}
                    onChange={(e) => setEditingZone({ ...editingZone, geofenceRadius: parseInt(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Status</label>
                  <select
                    value={editingZone.status || "active"}
                    onChange={(e) => setEditingZone({ ...editingZone, status: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="active">Active</option>
                    <option value="fault">Fault</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingZone(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 border hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
                >
                  Save Merge Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
