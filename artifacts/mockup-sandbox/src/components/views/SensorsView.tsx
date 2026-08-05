import React, { useState } from "react";
import { store } from "../../lib/store";
import { SensorDevice } from "../../types/mergesafe";
import { Radio, Plus, Edit2, Trash2 } from "lucide-react";

interface SensorsViewProps {
  state: ReturnType<typeof store.getState>;
}

export const SensorsView: React.FC<SensorsViewProps> = ({ state }) => {
  const { sensors, mergeZones, activeHighwayId } = state;
  const [editingSensor, setEditingSensor] = useState<Partial<SensorDevice> | null>(null);

  const filteredSensors = activeHighwayId === "ALL" ? sensors : sensors.filter((s) => s.highwayId === activeHighwayId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSensor) {
      store.saveSensor(editingSensor);
      setEditingSensor(null);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this sensor device?")) {
      store.deleteSensor(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Radio className="w-5 h-5 text-indigo-600" />
            Sensor Devices Registry
          </h2>
          <p className="text-xs text-slate-500">LiDAR, Radar, Cameras, Vehicle Tag Readers, and Acoustic Sensors monitoring highway lanes and air corridors</p>
        </div>

        <button
          onClick={() =>
            setEditingSensor({
              deviceName: "",
              deviceId: `DEV-${Math.floor(Math.random() * 8999 + 1000)}`,
              deviceType: "radar",
              zoneId: mergeZones[0]?.zoneId || "I20-Z001",
              highwayId: activeHighwayId === "ALL" ? "I20-TX" : activeHighwayId,
              mileMarker: 458.2,
              latitude: 32.722,
              longitude: -96.987,
              status: "online",
              firmwareVersion: "fw-2.14",
              altitudeMeters: 25
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Sensor Device</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                <th className="p-3">Device ID</th>
                <th className="p-3">Device Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Zone ID</th>
                <th className="p-3">Mile Marker</th>
                <th className="p-3">Altitude</th>
                <th className="p-3">Firmware</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSensors.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900">{s.deviceId}</td>
                  <td className="p-3 font-semibold text-slate-800">{s.deviceName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {s.deviceType}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-cyan-700 font-semibold">{s.zoneId}</td>
                  <td className="p-3 font-mono text-slate-600">MM {s.mileMarker}</td>
                  <td className="p-3 font-mono text-purple-700 font-bold">{s.altitudeMeters}m</td>
                  <td className="p-3 font-mono text-slate-500">{s.firmwareVersion}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        s.status === "online"
                          ? "bg-emerald-100 text-emerald-700"
                          : s.status === "warning"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => setEditingSensor(s)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
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

      {editingSensor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b pb-3">
              {editingSensor.id ? "Edit Sensor Device" : "Add New Sensor Device"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Device ID</label>
                  <input
                    type="text"
                    required
                    value={editingSensor.deviceId || ""}
                    onChange={(e) => setEditingSensor({ ...editingSensor, deviceId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Device Type</label>
                  <select
                    value={editingSensor.deviceType || "radar"}
                    onChange={(e) => setEditingSensor({ ...editingSensor, deviceType: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg capitalize"
                  >
                    <option value="radar">Radar</option>
                    <option value="lidar">LiDAR</option>
                    <option value="camera">Camera</option>
                    <option value="vehicle tag reader">Vehicle Tag Reader</option>
                    <option value="acoustic">Acoustic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Device Name</label>
                <input
                  type="text"
                  required
                  value={editingSensor.deviceName || ""}
                  onChange={(e) => setEditingSensor({ ...editingSensor, deviceName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Zone ID</label>
                  <select
                    value={editingSensor.zoneId || ""}
                    onChange={(e) => setEditingSensor({ ...editingSensor, zoneId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  >
                    {mergeZones.map((z) => (
                      <option key={z.id} value={z.zoneId}>
                        {z.zoneId}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Mile Marker</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingSensor.mileMarker || 458.2}
                    onChange={(e) => setEditingSensor({ ...editingSensor, mileMarker: parseFloat(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Altitude (m)</label>
                  <input
                    type="number"
                    value={editingSensor.altitudeMeters || 25}
                    onChange={(e) => setEditingSensor({ ...editingSensor, altitudeMeters: parseFloat(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Firmware</label>
                  <input
                    type="text"
                    value={editingSensor.firmwareVersion || "fw-2.14"}
                    onChange={(e) => setEditingSensor({ ...editingSensor, firmwareVersion: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Status</label>
                  <select
                    value={editingSensor.status || "online"}
                    onChange={(e) => setEditingSensor({ ...editingSensor, status: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="online">Online</option>
                    <option value="warning">Warning</option>
                    <option value="offline">Offline</option>
                    <option value="fault">Fault</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingSensor(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 border hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Save Sensor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
