import React, { useState } from "react";
import { store } from "../../lib/store";
import { Highway } from "../../types/mergesafe";
import { Layers, Plus, Edit2, Trash2 } from "lucide-react";

interface HighwaysViewProps {
  state: ReturnType<typeof store.getState>;
}

export const HighwaysView: React.FC<HighwaysViewProps> = ({ state }) => {
  const { highways } = state;
  const [editingHighway, setEditingHighway] = useState<Partial<Highway> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHighway) {
      store.saveHighway(editingHighway);
      setEditingHighway(null);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete highway corridor?")) {
      store.deleteHighway(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-600" />
            Highways & Airway Corridors Registry
          </h2>
          <p className="text-xs text-slate-500">Major interstate highway networks integrated into Augusta Airways MergeSafe system</p>
        </div>

        <button
          onClick={() =>
            setEditingHighway({
              name: "",
              highwayId: `I${Math.floor(Math.random() * 80 + 10)}-TX`,
              state: "Texas",
              description: "",
              isActive: true
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Highway Corridor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {highways.map((h) => (
          <div key={h.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                  {h.highwayId}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">{h.name}</h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  h.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                }`}
              >
                {h.isActive ? "Active Corridor" : "Inactive"}
              </span>
            </div>

            <p className="text-xs text-slate-600">{h.description}</p>

            <div className="flex items-center justify-between pt-3 border-t text-xs text-slate-400">
              <span>State: {h.state}</span>
              <div className="space-x-2">
                <button
                  onClick={() => setEditingHighway(h)}
                  className="p-1.5 text-slate-400 hover:text-cyan-600 rounded-lg hover:bg-slate-100"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(h.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingHighway && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b pb-3">
              {editingHighway.id ? "Edit Highway Corridor" : "Add Highway Corridor"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Highway ID</label>
                <input
                  type="text"
                  required
                  value={editingHighway.highwayId || ""}
                  onChange={(e) => setEditingHighway({ ...editingHighway, highwayId: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={editingHighway.name || ""}
                  onChange={(e) => setEditingHighway({ ...editingHighway, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingHighway.description || ""}
                  onChange={(e) => setEditingHighway({ ...editingHighway, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingHighway(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 border hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
                >
                  Save Highway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
