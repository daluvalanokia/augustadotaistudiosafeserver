import React, { useState } from "react";
import { store } from "../../lib/store";
import { TriangulationConfig } from "../../types/mergesafe";
import { Triangle, Server, MapPin, CheckCircle2, Sliders } from "lucide-react";

interface TriangulationViewProps {
  state: ReturnType<typeof store.getState>;
}

export const TriangulationView: React.FC<TriangulationViewProps> = ({ state }) => {
  const { triangulationConfigs, mergeZones, switchServers, activeHighwayId } = state;
  const [selectedZoneId, setSelectedZoneId] = useState<string>(
    triangulationConfigs[0]?.zoneId || mergeZones[0]?.zoneId || "I20-Z001"
  );

  const activeConfig = triangulationConfigs.find((t) => t.zoneId === selectedZoneId) || triangulationConfigs[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeConfig) {
      store.saveTriangulation(activeConfig);
      alert("Triangulation matrix saved successfully.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Zone Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Triangle className="w-5 h-5 text-indigo-600" />
            Edge Switch Triangulation Matrix
          </h2>
          <p className="text-xs text-slate-500">
            3-node time-difference-of-arrival (TDoA) positioning for precision sub-meter AirFlyCar tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Select Zone:</span>
          <select
            value={selectedZoneId}
            onChange={(e) => setSelectedZoneId(e.target.value)}
            className="p-2 border border-slate-300 rounded-xl text-xs font-mono font-bold text-indigo-700 bg-slate-50"
          >
            {mergeZones.map((z) => (
              <option key={z.id} value={z.zoneId}>
                {z.zoneId} ({z.zoneName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeConfig ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interactive Triangulation Visualizer */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm flex items-center gap-2 text-cyan-400">
                <Triangle className="w-4 h-4" /> 3-Node Overlap Geometry ({activeConfig.zoneId})
              </span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
                Precision: ±0.35m
              </span>
            </div>

            {/* Visual Canvas Diagram */}
            <div className="relative w-full h-80 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
              {/* Overlapping Signal Radius Circles */}
              <div className="absolute w-52 h-52 rounded-full border border-cyan-500/40 bg-cyan-500/5 -translate-x-12 -translate-y-10 animate-pulse" />
              <div className="absolute w-52 h-52 rounded-full border border-purple-500/40 bg-purple-500/5 translate-x-12 -translate-y-10 animate-pulse" />
              <div className="absolute w-52 h-52 rounded-full border border-indigo-500/40 bg-indigo-500/5 translate-y-12 animate-pulse" />

              {/* Node 1 */}
              <div className="absolute top-12 left-20 text-center">
                <div className="w-8 h-8 rounded-full bg-cyan-600 border-2 border-cyan-300 text-white flex items-center justify-center font-mono font-bold text-xs shadow-lg shadow-cyan-500/50">
                  S1
                </div>
                <span className="text-[10px] font-mono text-cyan-300 mt-1 block font-semibold">
                  {activeConfig.switch1Label || "Node A"}
                </span>
              </div>

              {/* Node 2 */}
              <div className="absolute top-12 right-20 text-center">
                <div className="w-8 h-8 rounded-full bg-purple-600 border-2 border-purple-300 text-white flex items-center justify-center font-mono font-bold text-xs shadow-lg shadow-purple-500/50">
                  S2
                </div>
                <span className="text-[10px] font-mono text-purple-300 mt-1 block font-semibold">
                  {activeConfig.switch2Label || "Node B"}
                </span>
              </div>

              {/* Node 3 */}
              <div className="absolute bottom-10 text-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-indigo-300 text-white flex items-center justify-center font-mono font-bold text-xs shadow-lg shadow-indigo-500/50">
                  S3
                </div>
                <span className="text-[10px] font-mono text-indigo-300 mt-1 block font-semibold">
                  {activeConfig.switch3Label || "Node C"}
                </span>
              </div>

              {/* Calculated Converged Target Point */}
              <div className="absolute w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-xl shadow-amber-400/80 animate-ping" />
              <div className="absolute w-4 h-4 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300">
              <div>
                <span className="block text-slate-500 text-[9px]">S1 Server:</span>
                <span className="font-bold text-cyan-400">{activeConfig.switch1ServerId}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[9px]">S2 Server:</span>
                <span className="font-bold text-purple-400">{activeConfig.switch2ServerId}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[9px]">S3 Server:</span>
                <span className="font-bold text-indigo-400">{activeConfig.switch3ServerId}</span>
              </div>
            </div>
          </div>

          {/* Triangulation Settings Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-3">
              <Sliders className="w-4 h-4 text-cyan-600" /> Node Coordinates & Labels Configuration
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Node 1 */}
              <div className="p-3 bg-cyan-50/50 border border-cyan-200 rounded-xl space-y-2">
                <span className="font-bold text-cyan-800 block text-xs">Switch Node 1 (S1)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={activeConfig.switch1Label || ""}
                    onChange={(e) => (activeConfig.switch1Label = e.target.value)}
                    placeholder="Label e.g. North Tower"
                    className="p-2 border rounded bg-white"
                  />
                  <input
                    type="text"
                    value={activeConfig.switch1ServerId || ""}
                    onChange={(e) => (activeConfig.switch1ServerId = e.target.value)}
                    placeholder="Server ID"
                    className="p-2 border rounded bg-white font-mono"
                  />
                </div>
              </div>

              {/* Node 2 */}
              <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl space-y-2">
                <span className="font-bold text-purple-800 block text-xs">Switch Node 2 (S2)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={activeConfig.switch2Label || ""}
                    onChange={(e) => (activeConfig.switch2Label = e.target.value)}
                    placeholder="Label e.g. East Tower"
                    className="p-2 border rounded bg-white"
                  />
                  <input
                    type="text"
                    value={activeConfig.switch2ServerId || ""}
                    onChange={(e) => (activeConfig.switch2ServerId = e.target.value)}
                    placeholder="Server ID"
                    className="p-2 border rounded bg-white font-mono"
                  />
                </div>
              </div>

              {/* Node 3 */}
              <div className="p-3 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-2">
                <span className="font-bold text-indigo-800 block text-xs">Switch Node 3 (S3)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={activeConfig.switch3Label || ""}
                    onChange={(e) => (activeConfig.switch3Label = e.target.value)}
                    placeholder="Label e.g. West Tower"
                    className="p-2 border rounded bg-white"
                  />
                  <input
                    type="text"
                    value={activeConfig.switch3ServerId || ""}
                    onChange={(e) => (activeConfig.switch3ServerId = e.target.value)}
                    placeholder="Server ID"
                    className="p-2 border rounded bg-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm transition-all"
                >
                  Save Triangulation Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-xs">No triangulation matrix configured for zone {selectedZoneId}.</p>
        </div>
      )}
    </div>
  );
};
