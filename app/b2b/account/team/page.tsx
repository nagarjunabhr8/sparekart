"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Plus, Shield, Settings2 } from "lucide-react";

const teamMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["Owner", "Manager", "Purchaser", "Viewer"]),
});

type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

interface TeamMember extends TeamMemberFormData {
  id: string;
  name: string;
  status: "active" | "pending" | "suspended";
  joinedDate?: string;
  lastActive?: string;
}

export default function TeamMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
  });

  // Fetch team members on mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/b2b/team/members");
        const data = await response.json();
        if (data.success) {
          setMembers(data.members);
        }
      } catch (error) {
        console.error("Failed to fetch team members:", error);
        toast.error("Failed to load team members");
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const onSubmit = async (data: TeamMemberFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/b2b/team/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to send invitation");
        return;
      }

      setMembers([...members, result.member]);
      toast.success("Invitation sent successfully!");
      reset();
    } catch (error) {
      console.error("Invitation error:", error);
      toast.error("Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(`/api/b2b/team/members/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to remove member");
        return;
      }

      setMembers(members.filter((m) => m.id !== id));
      toast.success("Team member removed");
    } catch (error) {
      console.error("Remove member error:", error);
      toast.error("Failed to remove member");
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const response = await fetch(`/api/b2b/team/members/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to update role");
        return;
      }

      setMembers(
        members.map((m) =>
          m.id === id ? { ...m, role: newRole as TeamMember["role"] } : m
        )
      );
      toast.success("Role updated");
    } catch (error) {
      console.error("Role update error:", error);
      toast.error("Failed to update role");
    }
  };

  if (isPageLoading) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 h-48 animate-pulse" />
          <div className="space-y-3">
            <div className="h-8 bg-slate-200 rounded animate-pulse w-1/4" />
            <div className="bg-white rounded-lg border border-slate-200 p-4 h-24 animate-pulse" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        {/* Invite Form */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Invite Team Member</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="member@example.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Role
                </label>
                <select
                  {...register("role")}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a role</option>
                  <option value="Purchaser">Purchaser (Can create orders)</option>
                  <option value="Manager">Manager (Can manage orders and team)</option>
                  <option value="Viewer">Viewer (Read-only access)</option>
                </select>
                {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 disabled:opacity-50"
            >
              <Plus size={18} />
              {isLoading ? "Sending..." : "Send Invitation"}
            </button>
          </form>
        </div>

        {/* Team Members List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-neutral-900">Team Members ({members.length})</h3>

          {members.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
              <p className="text-neutral-600">No team members yet. Invite someone to get started!</p>
            </div>
          ) : (
            members.map((member) => (
            <div key={member.id} className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-neutral-900">{member.name}</h4>
                    {member.role === "Owner" && (
                      <Shield size={16} className="text-primary" />
                    )}
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        member.status === "active"
                          ? "bg-green-100 text-green-800"
                          : member.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.status === "active"
                        ? "Active"
                        : member.status === "pending"
                        ? "Pending"
                        : "Suspended"}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">{member.email}</p>
                  {member.joinedDate && (
                    <p className="text-xs text-neutral-500">
                      Joined {new Date(member.joinedDate).toLocaleDateString("en-IN")}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 ml-4 items-center">
                  {member.role !== "Owner" && (
                    <>
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className="px-3 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Purchaser">Purchaser</option>
                        <option value="Manager">Manager</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                      <button
                        onClick={() => handleRemove(member.id)}
                        className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
          )}
        </div>

        {/* Role Information */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Settings2 size={18} />
            Role Permissions
          </h4>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Purchaser:</strong> Can create orders, view order history, and manage delivery addresses
            </p>
            <p>
              <strong>Manager:</strong> All Purchaser permissions + can manage team members and payment methods
            </p>
            <p>
              <strong>Owner:</strong> Full access to all features and account settings
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
