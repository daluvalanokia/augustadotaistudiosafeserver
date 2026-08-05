import React, { useState } from "react";
import { store } from "../../lib/store";
import { ShieldCheck, Search, Database, Download, Upload, CheckCircle, RefreshCw } from "lucide-react";

interface AuditLogsViewProps {
  state: ReturnType<typeof store.getState>;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ state }) => {
  const { auditLogs, dalStatus, highways, mergeZones, switchServers, sensors, events } = state;
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [backupNotice, setBackupNotice] = useState<string | null>(null);

  const filtered = auditLogs.filter(
    (a) =>
      a.fullName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      a.controller.toLowerCase().includes(filterQuery.toLowerCase()) ||
      a.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleExportBackup = () => {
    const json = store.getDAL().exportDatabaseBackup();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mergesafe_dll_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupNotice("DLL Database Backup exported successfully.");
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = store.getDAL().importDatabaseBackup(content);
      if (res.success) {
        store.resetToSeed(); // Trigger sync
        setBackupNotice("DLL Database imported and synchronized successfully.");
      } else {
        setBackupNotice(`Import Error: ${res.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-600" />
            System Audit Trail & DLL Data Layer Maintenance
          </h2>
          <p className="text-xs text-slate-500">
            Separated Data Access Layer (DLL) managing schema persistence, transactions, and audit logs
          </p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 w-64"
          />
        </div>
      </div>

      {/* DLL Architecture Panel */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
                DLL Architecture Status: Integrated & Synchronized
              </h3>
              <p className="text-xs text-slate-400">
                Data Access Layer Library ({dalStatus?.version || "v1.2.0-DLL"}) • Isolated storage engine decoupling data management from UI views
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleExportBackup}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl font-mono text-[11px] transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Export DLL Backup
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-mono text-[11px] cursor-pointer transition-all shadow-md">
              <Upload className="w-3.5 h-3.5" />
              <span>Import Backup</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>
          </div>
        </div>

        {backupNotice && (
          <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-200 p-3 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{backupNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="block text-slate-500 text-[10px]">Highways:</span>
            <span className="font-bold text-cyan-400 text-sm">{highways.length}</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="block text-slate-500 text-[10px]">Merge Zones:</span>
            <span className="font-bold text-emerald-400 text-sm">{mergeZones.length}</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="block text-slate-500 text-[10px]">Switch Servers:</span>
            <span className="font-bold text-indigo-400 text-sm">{switchServers.length}</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="block text-slate-500 text-[10px]">Sensors:</span>
            <span className="font-bold text-purple-400 text-sm">{sensors.length}</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
            <span className="block text-slate-500 text-[10px]">Telemetry Events:</span>
            <span className="font-bold text-amber-400 text-sm">{events.length}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                <th className="p-3">Timestamp</th>
                <th className="p-3">User</th>
                <th className="p-3">Controller</th>
                <th className="p-3">Action</th>
                <th className="p-3">Summary Description</th>
                <th className="p-3">IP Endpoint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 text-slate-500">{new Date(log.createdDate).toLocaleString()}</td>
                  <td className="p-3 text-slate-900 font-bold font-sans">
                    {log.fullName} ({log.userId})
                  </td>
                  <td className="p-3 text-cyan-700 font-bold">{log.controller}</td>
                  <td className="p-3 text-slate-800 font-semibold">{log.action}</td>
                  <td className="p-3 text-slate-600 font-sans">{log.summary}</td>
                  <td className="p-3 text-slate-400">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
