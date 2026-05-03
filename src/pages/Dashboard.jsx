import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ComposedChart, Line
} from "recharts";

const stockOverviewData = [
  { month: "Jan", inStock: 820, lowStock: 180 },
  { month: "Feb", inStock: 750, lowStock: 200 },
  { month: "Mar", inStock: 900, lowStock: 150 },
  { month: "Apr", inStock: 680, lowStock: 220 },
  { month: "May", inStock: 940, lowStock: 130 },
  { month: "Jun", inStock: 968, lowStock: 213 },
];

const revenueCostData = [
  { month: "Jan", revenue: 3000, costPct: 20 },
  { month: "Mar", revenue: 2200, costPct: 40 },
  { month: "May", revenue: 1200, costPct: 60 },
  { month: "Jul", revenue: 4100, costPct: 100 },
];

const orderSummaryData = [
  { month: "Jan", sales: 72, cost: 55 },
  { month: "Feb", sales: 80, cost: 62 },
  { month: "Mar", sales: 65, cost: 50 },
  { month: "Apr", sales: 88, cost: 70 },
  { month: "May", sales: 95, cost: 78 },
  { month: "Jun", sales: 70, cost: 55 },
  { month: "Jul", sales: 85, cost: 68 },
  { month: "Aug", sales: 60, cost: 48 },
  { month: "Sep", sales: 78, cost: 62 },
  { month: "Oct", sales: 92, cost: 75 },
  { month: "Nov", sales: 88, cost: 70 },
  { month: "Dec", sales: 55, cost: 44 },
];

const StatusBadge = ({ status }) => {
  const map = {
    ok:  { label: "In Stock", bg: "#dcfce7", color: "#166534" },
    low: { label: "Low Stock", bg: "#fef3c7", color: "#92400e" },
    out: { label: "Out of Stock", bg: "#fee2e2", color: "#991b1b" },
  };
  const s = map[status];
  return (
    <span style={{
      background: s.bg, color: s.color, fontSize: 11, fontWeight: 600,
      padding: "3px 10px", borderRadius: 10, whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  );
};

const StatCard = ({ icon, label, value, sub }) => (
  <div style={{
    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
    padding: "16px 18px", display: "flex", alignItems: "center", gap: 14,
  }}>
    <div style={{
      width: 46, height: 46, borderRadius: 12, background: icon.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {icon.el}
    </div>
    <div>
      <div style={{ fontSize: 12, color: "#555555" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#000000" }}>{value}</div>
      <div style={{ fontSize: 11, color: "#666666" }}>{sub}</div>
    </div>
  </div>
);

const Card = ({ title, children }) => (
  <div style={{
    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
    padding: 18,
  }}>
    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "#000000" }}>{title}</div>
    {children}
  </div>
);

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#000000" }}>Good Morning</h2>
        <p style={{ fontSize: 13, color: "#555555", marginTop: 4 }}>Your inventory dashboard gives you a complete overview of stock and sales performance.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        <StatCard icon={{ bg: "#eff6ff", el: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> }} label="Total Products" value="1,284" sub="+12 this week" />
        <StatCard icon={{ bg: "#f0fdf4", el: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M12 22V12"/><path d="m17 7-5-5-5 5"/><path d="M4 17h16"/></svg> }} label="In Stock" value="968" sub="75.4%" />
        <StatCard icon={{ bg: "#fffbeb", el: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="m10.29 3.86-8.14 14.14a1 1 0 0 0 .86 1.5h16.28a1 1 0 0 0 .86-1.5L11.71 3.86a1 1 0 0 0-1.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg> }} label="Low Stock" value="213" sub="Needs reorder" />
        <StatCard icon={{ bg: "#fef2f2", el: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/></svg> }} label="Out of Stock" value="103" sub="Urgent" />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card title="Stock Overview">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stockOverviewData} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#333333" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#333333" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ color: "#000000" }} />
              <Bar dataKey="inStock" fill="#3b82f6" radius={[4, 4, 0, 0]} name="In Stock" />
              <Bar dataKey="lowStock" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Low Stock" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Revenue vs Cost">
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={revenueCostData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#333333" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#333333" }} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12, fill: "#333333" }} />
              <Tooltip contentStyle={{ color: "#000000" }} />
              <Bar yAxisId="left" dataKey="revenue" fill="#93c5fd" name="Revenue" barSize={28} />
              <Line yAxisId="right" dataKey="costPct" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Cost %" />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Order Summary */}
      <Card title="Order Summary">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={orderSummaryData} barSize={14}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#333333" }} />
            <YAxis tick={{ fontSize: 11, fill: "#333333" }} />
            <Tooltip contentStyle={{ color: "#000000" }} />
            <Bar dataKey="sales" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Total Sales" />
            <Bar dataKey="cost" fill="#f97316" radius={[3, 3, 0, 0]} name="Total Cost" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Dashboard;