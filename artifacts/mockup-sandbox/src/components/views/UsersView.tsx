import React, { useState } from "react";
import { store } from "../../lib/store";
import { UserProfile } from "../../types/mergesafe";
import { Users, Plus, Edit2, Trash2, Lock, Unlock, Shield } from "lucide-react";

interface UsersViewProps {
  state: ReturnType<typeof store.getState>;
}

export const UsersView: React.FC<UsersViewProps> = ({ state }) => {
  const { userProfiles, highways } = state;
  const [editingUser, setEditingUser] = useState<Partial<UserProfile> | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      store.saveUserProfile(editingUser);
      setEditingUser(null);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete user profile?")) {
      store.deleteUserProfile(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-600" />
            User Profiles & Access Management
          </h2>
          <p className="text-xs text-slate-500">System administrators, operators, technicians, supervisors, and viewers</p>
        </div>

        <button
          onClick={() =>
            setEditingUser({
              userId: `op${Math.floor(Math.random() * 899 + 100)}`,
              fullName: "",
              userType: "operator",
              phone: "555-0100",
              highwayId: "I20-TX",
              highwayName: "Interstate 20 — Texas",
              notes: "",
              isActive: true
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add User Profile</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                <th className="p-3">User ID</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Assigned Highway</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userProfiles.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900">{u.userId}</td>
                  <td className="p-3 font-semibold text-slate-800">{u.fullName}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.userType === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : u.userType === "operator"
                          ? "bg-blue-100 text-blue-700"
                          : u.userType === "technician"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {u.userType}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-600">{u.phone}</td>
                  <td className="p-3 font-medium text-slate-700">{u.highwayName}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {u.isActive ? "Active" : "Locked / Inactive"}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => setEditingUser(u)}
                      className="p-1.5 text-slate-400 hover:text-cyan-600 rounded-lg hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
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

      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b pb-3">
              {editingUser.id ? "Edit User Profile" : "Create User Profile"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">User ID</label>
                  <input
                    type="text"
                    required
                    value={editingUser.userId || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, userId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Role</label>
                  <select
                    value={editingUser.userType || "operator"}
                    onChange={(e) => setEditingUser({ ...editingUser, userType: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg capitalize"
                  >
                    <option value="admin">Admin</option>
                    <option value="operator">Operator</option>
                    <option value="technician">Technician</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.fullName || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingUser.phone || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Assigned Highway</label>
                  <select
                    value={editingUser.highwayId || "I20-TX"}
                    onChange={(e) => {
                      const selH = highways.find((h) => h.highwayId === e.target.value);
                      setEditingUser({
                        ...editingUser,
                        highwayId: e.target.value,
                        highwayName: selH ? selH.name : e.target.value
                      });
                    }}
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

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 border hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
