"use client";

import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, Download, Bell, DollarSign, FileText } from "lucide-react";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CountUp from "react-countup";

interface CostControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MonthlyData {
  month: string;
  spent: number;
}

interface CategoryData {
  name: string;
  value: number;
}

const monthlyData: MonthlyData[] = [
  { month: "Dec", spent: 28000 },
  { month: "Jan", spent: 32000 },
  { month: "Feb", spent: 45000 },
  { month: "Mar", spent: 38000 },
  { month: "Apr", spent: 52000 },
  { month: "May", spent: 48000 },
];

const categoryData: CategoryData[] = [
  { name: "Engine Parts", value: 35 },
  { name: "Brakes", value: 20 },
  { name: "Electrical", value: 18 },
  { name: "Suspension", value: 15 },
  { name: "Others", value: 12 },
];

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function CostControlModal({ isOpen, onClose }: CostControlModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "budget" | "invoices">("overview");
  const [monthlyBudget, setMonthlyBudget] = useState(50000);
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [isSaving, setIsSaving] = useState(false);

  const totalSpent = monthlyData.reduce((sum, item) => sum + item.spent, 0);
  const averageSpent = Math.round(totalSpent / monthlyData.length);
  const currentMonthSpent = monthlyData[monthlyData.length - 1].spent;
  const budgetRemaining = Math.max(0, monthlyBudget - currentMonthSpent);
  const budgetPercentage = Math.min(100, (currentMonthSpent / monthlyBudget) * 100);

  const handleSaveBudget = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Budget alert saved successfully!");
    } catch (error) {
      toast.error("Failed to save budget alert");
    } finally {
      setIsSaving(false);
    }
  };

  const downloadReport = (format: "csv" | "pdf") => {
    toast.success(`Download ${format.toUpperCase()} report initiated!`);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6 z-20">
                  <Dialog.Title className="text-2xl font-bold text-neutral-900">
                    Cost Control Dashboard
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200 px-6 pt-6">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === "overview"
                          ? "text-primary border-b-2 border-primary"
                          : "text-neutral-600 hover:text-primary"
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab("budget")}
                      className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === "budget"
                          ? "text-primary border-b-2 border-primary"
                          : "text-neutral-600 hover:text-primary"
                      }`}
                    >
                      Budget Alerts
                    </button>
                    <button
                      onClick={() => setActiveTab("invoices")}
                      className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === "invoices"
                          ? "text-primary border-b-2 border-primary"
                          : "text-neutral-600 hover:text-primary"
                      }`}
                    >
                      Invoices
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      {/* Key Metrics */}
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                          <p className="text-sm font-medium text-blue-900 mb-2">
                            Average Monthly Spend
                          </p>
                          <p className="text-3xl font-bold text-blue-600">
                            ₹<CountUp end={averageSpent} duration={2} separator="," />
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200">
                          <p className="text-sm font-medium text-emerald-900 mb-2">
                            This Month Spent
                          </p>
                          <p className="text-3xl font-bold text-emerald-600">
                            ₹<CountUp end={currentMonthSpent} duration={2} separator="," />
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                          <p className="text-sm font-medium text-purple-900 mb-2">
                            Budget Remaining
                          </p>
                          <p className="text-3xl font-bold text-purple-600">
                            ₹<CountUp end={budgetRemaining} duration={2} separator="," />
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                          <p className="text-sm font-medium text-orange-900 mb-2">
                            Budget Utilization
                          </p>
                          <p className="text-3xl font-bold text-orange-600">
                            <CountUp end={Math.round(budgetPercentage)} duration={2} />%
                          </p>
                        </div>
                      </div>

                      {/* Charts */}
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Monthly Spend Chart */}
                        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                          <h3 className="font-bold text-neutral-900 mb-4">
                            Monthly Spending (Last 6 Months)
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip
                                formatter={(value) => `₹${value.toLocaleString()}`}
                              />
                              <Bar dataKey="spent" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Category Breakdown */}
                        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                          <h3 className="font-bold text-neutral-900 mb-4">
                            Spending by Category
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name} (${value}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {categoryData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => `${value}%`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Download Report */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                          <Download size={20} />
                          Download Spend Report
                        </h3>
                        <div className="flex gap-4">
                          <button
                            onClick={() => downloadReport("csv")}
                            className="px-6 py-2 bg-white border border-slate-300 text-neutral-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                          >
                            <FileText size={18} />
                            Download as CSV
                          </button>
                          <button
                            onClick={() => downloadReport("pdf")}
                            className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-2"
                          >
                            <FileText size={18} />
                            Download as PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Budget Alerts Tab */}
                  {activeTab === "budget" && (
                    <div className="space-y-6 max-w-2xl">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                        <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                          <Bell size={20} className="text-emerald-600" />
                          Set Monthly Spending Limit
                        </h3>

                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Monthly Budget Limit
                            </label>
                            <div className="flex items-center gap-4">
                              <span className="text-2xl font-bold text-primary">₹</span>
                              <input
                                type="number"
                                value={monthlyBudget}
                                onChange={(e) =>
                                  setMonthlyBudget(Math.max(0, Number(e.target.value)))
                                }
                                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg font-semibold"
                              />
                            </div>
                            <p className="text-xs text-neutral-600 mt-2">
                              Set the maximum amount you want to spend per month
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-4">
                              Alert Threshold: {alertThreshold}%
                            </label>
                            <input
                              type="range"
                              min="50"
                              max="100"
                              step="5"
                              value={alertThreshold}
                              onChange={(e) => setAlertThreshold(Number(e.target.value))}
                              className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <p className="text-xs text-neutral-600 mt-2">
                              You'll receive alerts via SMS and email when spending reaches{" "}
                              {alertThreshold}% of your budget limit
                            </p>
                          </div>

                          {/* Alert Methods */}
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-3">
                              Alert Methods
                            </label>
                            <div className="space-y-2">
                              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                                <input
                                  type="checkbox"
                                  defaultChecked
                                  className="w-4 h-4 rounded accent-primary"
                                />
                                <span className="font-medium text-neutral-700">SMS</span>
                              </label>
                              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                                <input
                                  type="checkbox"
                                  defaultChecked
                                  className="w-4 h-4 rounded accent-primary"
                                />
                                <span className="font-medium text-neutral-700">Email</span>
                              </label>
                            </div>
                          </div>

                          <button
                            onClick={handleSaveBudget}
                            disabled={isSaving}
                            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-900 disabled:opacity-50 transition-colors"
                          >
                            {isSaving ? "Saving..." : "Save Budget Alert"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Invoices Tab */}
                  {activeTab === "invoices" && (
                    <div className="space-y-6">
                      {/* Pending Invoices Summary */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                          <p className="text-sm font-medium text-red-900 mb-2">
                            Pending Invoices
                          </p>
                          <p className="text-4xl font-bold text-red-600 mb-1">3</p>
                          <p className="text-xs text-red-800">invoices awaiting payment</p>
                        </div>

                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                          <p className="text-sm font-medium text-orange-900 mb-2">
                            Total Outstanding Amount
                          </p>
                          <p className="text-4xl font-bold text-orange-600 mb-1">
                            ₹<CountUp end={125000} duration={2} separator="," />
                          </p>
                          <p className="text-xs text-orange-800">due for payment</p>
                        </div>
                      </div>

                      {/* Pending Invoices List */}
                      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                        <h3 className="font-bold text-neutral-900 mb-4">Invoice Details</h3>
                        <div className="space-y-3">
                          {[
                            {
                              id: "INV-2024-001",
                              amount: 45000,
                              dueDate: "Jun 15, 2024",
                              status: "Overdue",
                            },
                            {
                              id: "INV-2024-002",
                              amount: 38000,
                              dueDate: "Jun 20, 2024",
                              status: "Due Soon",
                            },
                            {
                              id: "INV-2024-003",
                              amount: 42000,
                              dueDate: "Jul 10, 2024",
                              status: "Pending",
                            },
                          ].map((invoice) => (
                            <div
                              key={invoice.id}
                              className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                            >
                              <div>
                                <p className="font-semibold text-neutral-900">
                                  {invoice.id}
                                </p>
                                <p className="text-sm text-neutral-600">
                                  Due: {invoice.dueDate}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-neutral-900">
                                  ₹{invoice.amount.toLocaleString()}
                                </p>
                                <p
                                  className={`text-xs font-semibold ${
                                    invoice.status === "Overdue"
                                      ? "text-red-600"
                                      : invoice.status === "Due Soon"
                                      ? "text-orange-600"
                                      : "text-blue-600"
                                  }`}
                                >
                                  {invoice.status}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
