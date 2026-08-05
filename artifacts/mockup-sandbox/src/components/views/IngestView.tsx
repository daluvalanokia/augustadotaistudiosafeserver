import React, { useState } from "react";
import { store } from "../../lib/store";
import { FileCode2, Send, CheckCircle2, AlertCircle, Play, Code } from "lucide-react";

interface IngestViewProps {
  state: ReturnType<typeof store.getState>;
}

export const IngestView: React.FC<IngestViewProps> = ({ state }) => {
  const { inputFormats, samplePayloads } = state;

  const [rawJson, setRawJson] = useState<string>(
    JSON.stringify(
      {
        vehicle_id: "AFC-9901",
        vehicle_type: "air_express",
        is_air_fly_car: "Y",
        speed_mph: 135,
        altitude_m: 210,
        latitude: 32.722,
        longitude: -96.987,
        event_type: "detection",
        zone_id: "I20-Z001"
      },
      null,
      2
    )
  );

  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleIngest = (e: React.FormEvent) => {
    e.preventDefault();
    const res = store.ingestEventPayload(rawJson);
    setResult(res);
  };

  const loadSample = (payloadStr: string) => {
    try {
      setRawJson(JSON.stringify(JSON.parse(payloadStr), null, 2));
      setResult(null);
    } catch {
      setRawJson(payloadStr);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          <FileCode2 className="w-5 h-5 text-cyan-600" />
          Ingest API & Formats Sandbox
        </h2>
        <p className="text-xs text-slate-500">
          Simulate incoming API streams from physical loop detectors, satellite telemetry, 5G V2X telecom feeds, and TomTom integrations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Format Configs List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b pb-3">Configured Input Feeds</h3>

          <div className="space-y-3">
            {inputFormats.map((fmt) => (
              <div key={fmt.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{fmt.formatName}</span>
                  <span className="text-[10px] font-mono bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded font-bold uppercase">
                    {fmt.sourceType}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{fmt.description}</p>
                <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-200/60 truncate">
                  {fmt.inputSource}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payload Test Sandbox */}
        <div className="lg:col-span-2 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
              <Code className="w-4 h-4" /> Live Ingest Payload Simulator
            </h3>
            <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              POST /api/Events
            </span>
          </div>

          {/* Sample Load Buttons */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-medium">Load Template:</span>
            {samplePayloads.map((samp) => (
              <button
                key={samp.id}
                onClick={() => loadSample(samp.payload)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono text-[11px]"
              >
                {samp.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleIngest} className="space-y-3">
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1">Raw JSON Telemetry Payload</label>
              <textarea
                rows={10}
                value={rawJson}
                onChange={(e) => setRawJson(e.target.value)}
                className="w-full p-3 bg-slate-950 text-cyan-300 font-mono text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-cyan-600/30 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Ingest Event to System Stream</span>
              </button>
            </div>
          </form>

          {/* Ingest Result Banner */}
          {result && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
                result.success
                  ? "bg-emerald-950/80 border-emerald-700 text-emerald-200"
                  : "bg-rose-950/80 border-rose-700 text-rose-200"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <div>
                <span className="font-bold block">{result.success ? "Ingest Successful" : "Ingest Failed"}</span>
                <p className="mt-0.5">{result.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
