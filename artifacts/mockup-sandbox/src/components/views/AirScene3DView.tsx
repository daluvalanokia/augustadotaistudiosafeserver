import React, { useState, useEffect } from "react";
import { store } from "../../lib/store";
import { Plane, Layers, Eye, RefreshCw, Radio, Server, Shield, Sparkles } from "lucide-react";
import { VehicleEvent } from "../../types/mergesafe";

interface AirScene3DViewProps {
  state: ReturnType<typeof store.getState>;
}

export const AirScene3DView: React.FC<AirScene3DViewProps> = ({ state }) => {
  const { events, mergeZones, switchServers, activeHighwayId } = state;

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleEvent | null>(null);
  const [showAirCorridors, setShowAirCorridors] = useState<boolean>(true);
  const [showGroundLanes, setShowGroundLanes] = useState<boolean>(true);
  const [showGeofences, setShowGeofences] = useState<boolean>(true);
  const [showTowers, setShowTowers] = useState<boolean>(true);
  const [viewAngle, setViewAngle] = useState<number>(30); // pitch angle

  const filteredZones = activeHighwayId === "ALL" ? mergeZones : mergeZones.filter((z) => z.highwayId === activeHighwayId);
  const filteredServers = activeHighwayId === "ALL" ? switchServers : switchServers.filter((s) => s.highwayId === activeHighwayId);
  const filteredEvents = activeHighwayId === "ALL" ? events : events.filter((e) => e.highwayId === activeHighwayId);

  // Take recent vehicles for spatial placement
  const displayVehicles = filteredEvents.slice(0, 16);

  return (
    <div className="space-y-4">
      {/* View Header & Controls */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              3D AirScene Spatial Corridor Visualizer
              <span className="text-[10px] font-bold bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800">
                Live 2.5D Canvas
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Corridor Altitude Layers: High-Altitude eVTOL (300m–500m) • AirFlyCar (150m–300m) • Ground Highway (0m)
            </p>
          </div>
        </div>

        {/* View Options Toggles */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <button
            onClick={() => setShowAirCorridors(!showAirCorridors)}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              showAirCorridors
                ? "bg-purple-950/80 text-purple-300 border-purple-700"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            Air Corridors (150–500m)
          </button>

          <button
            onClick={() => setShowGroundLanes(!showGroundLanes)}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              showGroundLanes
                ? "bg-cyan-950/80 text-cyan-300 border-cyan-700"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            Ground Highway (0m)
          </button>

          <button
            onClick={() => setShowGeofences(!showGeofences)}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              showGeofences
                ? "bg-emerald-950/80 text-emerald-300 border-emerald-700"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            Geofences
          </button>

          <button
            onClick={() => setShowTowers(!showTowers)}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              showTowers
                ? "bg-blue-950/80 text-blue-300 border-blue-700"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            Switch Towers
          </button>

          <button
            onClick={() => setViewAngle((prev) => (prev === 30 ? 60 : prev === 60 ? 0 : 30))}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium"
          >
            Angle: {viewAngle}°
          </button>
        </div>
      </div>

      {/* Main 3D Perspective Visualizer Stage */}
      <div className="relative w-full h-[540px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
        {/* Sky Background Grid Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-90" />

        {/* Isometric Spatial Canvas Stage Container */}
        <div
          className="relative w-full max-w-4xl h-full flex items-center justify-center transition-transform duration-500 ease-out"
          style={{
            perspective: "1000px"
          }}
        >
          <div
            className="relative w-[700px] h-[420px] transition-all duration-700"
            style={{
              transform: `rotateX(${viewAngle}deg) rotateZ(-15deg)`,
              transformStyle: "preserve-3d"
            }}
          >
            {/* 1. HIGH-ALTITUDE eVTOL LAYER (300m - 500m) */}
            {showAirCorridors && (
              <div
                className="absolute inset-0 rounded-3xl border-2 border-dashed border-purple-500/40 bg-purple-950/10 backdrop-blur-[1px] transition-all"
                style={{
                  transform: "translateZ(180px)",
                  transformStyle: "preserve-3d"
                }}
              >
                <div className="absolute left-3 top-3 text-[10px] font-bold text-purple-400 tracking-wider bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                  eVTOL HIGH-ALTITUDE CORRIDOR (300m – 500m)
                </div>

                {/* Air Flight Path Lines */}
                <div className="absolute inset-x-8 top-1/3 h-[1px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
                <div className="absolute inset-x-8 top-2/3 h-[1px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
              </div>
            )}

            {/* 2. AIRFLYCAR CORRIDOR LAYER (150m - 300m) */}
            {showAirCorridors && (
              <div
                className="absolute inset-0 rounded-3xl border border-blue-400/30 bg-blue-950/10 backdrop-blur-[1px] transition-all"
                style={{
                  transform: "translateZ(100px)",
                  transformStyle: "preserve-3d"
                }}
              >
                <div className="absolute left-3 top-3 text-[10px] font-bold text-blue-400 tracking-wider bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                  AIRFLYCAR EXPRESS LANE (150m – 300m)
                </div>

                <div className="absolute inset-x-12 top-1/2 h-[2px] bg-gradient-to-r from-blue-500/20 via-cyan-400/60 to-blue-500/20 animate-pulse" />
              </div>
            )}

            {/* 3. GROUND HIGHWAY LAYER (0m) */}
            {showGroundLanes && (
              <div
                className="absolute inset-0 rounded-3xl border border-cyan-500/40 bg-slate-900/90 shadow-2xl transition-all"
                style={{
                  transform: "translateZ(0px)",
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Highway Grid & Lanes */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:28px_28px] opacity-40 rounded-3xl" />

                <div className="absolute left-3 top-3 text-[10px] font-bold text-cyan-400 tracking-wider bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                  GROUND HIGHWAY SURFACE (I20 / I35 / I10 LANES)
                </div>

                {/* Main Highway Ribbon */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-20 bg-slate-800/80 border-y-2 border-slate-600 flex items-center justify-around px-10">
                  <div className="w-full h-[1px] border-b border-dashed border-yellow-400/60" />
                </div>
              </div>
            )}

            {/* 4. SWITCH SERVER TOWERS */}
            {showTowers &&
              filteredServers.slice(0, 4).map((srv, idx) => {
                const posX = 15 + idx * 25;
                const posY = 20 + (idx % 2) * 50;
                return (
                  <div
                    key={srv.id}
                    className="absolute transition-all"
                    style={{
                      left: `${posX}%`,
                      top: `${posY}%`,
                      transform: "translateZ(0px)",
                      transformStyle: "preserve-3d"
                    }}
                  >
                    {/* Tower Pillar */}
                    <div className="w-2 h-24 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm shadow-lg shadow-cyan-500/50" />
                    {/* Tower Beacon */}
                    <div className="absolute -top-3 -left-2.5 w-7 h-7 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 text-[9px] font-bold shadow-md shadow-cyan-500/80 animate-bounce">
                      <Server className="w-3 h-3" />
                    </div>
                  </div>
                );
              })}

            {/* 5. GEOFENCE ZONES */}
            {showGeofences &&
              filteredZones.slice(0, 3).map((zone, idx) => {
                const posX = 20 + idx * 30;
                return (
                  <div
                    key={zone.id}
                    className="absolute w-40 h-40 rounded-full border-2 border-cyan-400/40 bg-cyan-500/5 animate-pulse"
                    style={{
                      left: `${posX}%`,
                      top: "25%",
                      transform: "translateZ(0px)"
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] font-mono text-cyan-300 font-bold bg-slate-950/80 px-1.5 py-0.5 rounded border border-cyan-800">
                        {zone.zoneId}
                      </span>
                    </div>
                  </div>
                );
              })}

            {/* 6. SPATIAL VEHICLE NODES */}
            {displayVehicles.map((v, i) => {
              const isAir = v.vehicleMode === "air";
              const zHeight = isAir ? (v.altitudeMeters > 300 ? 180 : 100) : 10;
              const posX = 10 + (i * 18) % 80;
              const posY = 15 + ((i * 23) % 70);

              const isSelected = selectedVehicle?.id === v.id;

              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className="absolute cursor-pointer group transition-all duration-300"
                  style={{
                    left: `${posX}%`,
                    top: `${posY}%`,
                    transform: `translateZ(${zHeight}px)`,
                    transformStyle: "preserve-3d"
                  }}
                >
                  {/* Vertical Elevation Line to Ground */}
                  {isAir && (
                    <div
                      className="absolute left-1/2 -bottom-20 w-[1px] h-20 bg-gradient-to-b from-purple-400/60 to-transparent pointer-events-none"
                    />
                  )}

                  {/* Vehicle Icon Badge */}
                  <div
                    className={`p-2 rounded-xl flex items-center gap-1.5 shadow-xl transition-all ${
                      isSelected
                        ? "bg-amber-400 text-slate-900 ring-4 ring-amber-400/30 font-bold scale-110"
                        : v.isAirFlyCar === "Y"
                        ? "bg-purple-600 text-white border border-purple-400 shadow-purple-500/50"
                        : isAir
                        ? "bg-indigo-600 text-white border border-indigo-400"
                        : "bg-cyan-600 text-white border border-cyan-400"
                    }`}
                  >
                    <Plane className={`w-3.5 h-3.5 ${!isAir ? "rotate-90" : ""}`} />
                    <span className="text-[10px] font-mono font-bold">{v.vehicleId}</span>
                  </div>

                  {/* Vehicle Altitude Tag */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-0 bg-slate-900 text-slate-200 text-[9px] font-mono px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap">
                    {v.speedMph}MPH • {v.altitudeMeters}m
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Vehicle Detail Card */}
        {selectedVehicle && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-700 text-white shadow-2xl space-y-2 z-20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="font-bold text-sm">{selectedVehicle.vehicleId}</span>
                {selectedVehicle.isAirFlyCar === "Y" && (
                  <span className="text-[9px] font-bold bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800">
                    AirFlyCar
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Mode / Type:</span>
                <span className="font-medium capitalize">{selectedVehicle.vehicleMode} • {selectedVehicle.vehicleCategory}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Altitude:</span>
                <span className="font-medium font-mono text-cyan-300">{selectedVehicle.altitudeMeters} meters</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Ground Speed:</span>
                <span className="font-medium font-mono text-emerald-400">{selectedVehicle.speedMph} MPH</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Merge Zone:</span>
                <span className="font-medium font-mono">{selectedVehicle.zoneId}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
