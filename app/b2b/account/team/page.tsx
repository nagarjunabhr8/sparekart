"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Plus, Shield, Settings2 } from "lucide-react";

const teamMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["Owner", "Manager", "Purchaser"]),
});

type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

interface TeamMember extends TeamMemberFormData {
  id: string;
  name: string;
  status: "active" | "pending";
  joinedDate?: string;
}

export default function TeamMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Rajesh Kumar",
      email: "rajesh@techauto.com",
      role: "Owner",
      status: "active",
      joinedDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Priya Sharma",
      email: "priya@techauto.com",
      role: "Manager",
      status: "active",
      joinedDate: "2024-02-20",
    },
    {
      id: "3",
      name: "Amit Patel",
      email: "amit@techauto.com",
      role: "Purchaser",
      status: "pending",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
  });

  const onSubmit = async (data: TeamMemberFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newMember: TeamMember = {
        ...data,
        id: Date.now().toString(),
        name: data.email.split("@")[0],
        status: "pending",
      };
      setMembers([...members, newMember]);
      toast.success("Invitation sent successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
    toast.success("Team member removed");
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    setMembers(
      members.map((m) =>
        m.id === id ? { ...m, role: newRole as TeamMember["role"] } : m
      )
    );
    toast.success("Role updated");
  };

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
                  <option value="Purchaser">Purchaser (Can create orders)</option>
                  <option value="Manager">Manager (Can manage orders and team)</option>
                  <option value="Owner">Owner (Full access)</option>
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

          {members.map((member) => (
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
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {member.status === "active" ? "Active" : "Pending"}
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
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      className="px-3 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Purchaser">Purchaser</option>
                      <option value="Manager">Manager</option>
                    </select>
                  )}
                  <button
                    onClick={() => handleRemove(member.id)}
                    className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
