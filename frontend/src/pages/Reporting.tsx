import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { mockMaintenanceRequests, mockTeams, mockEquipment } from "@/data/mockData";
import { Filter } from "lucide-react";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--destructive))",
  "hsl(var(--muted-foreground))",
  "hsl(var(--info))",
];

function parseDate(str) {
  // Accepts YYYY-MM-DD or YYYY-MM
  if (!str) return null;
  const parts = str.split("-");
  if (parts.length === 2) return new Date(parts[0], parts[1] - 1, 1);
  if (parts.length === 3) return new Date(parts[0], parts[1] - 1, parts[2]);
  return null;
}

function getRandomRequest() {
  // Simulate a new random maintenance request
  const technicians = ["Mike Johnson", "Alex Chen", "Lisa Park"];
  const equipment = ["CNC Milling Machine A1", "Industrial Robot Arm R2", "Hydraulic Press HP-500", "Laser Cutting System LC-1", "Assembly Conveyor Belt C3", "Air Compressor AC-200"];
  const types = ["corrective", "preventive"];
  const priorities = ["low", "medium", "high", "urgent"];
  const stages = ["new", "in-progress", "repaired", "scrap"];
  const now = new Date();
  const scheduledDate = now.toISOString().slice(0, 10);
  const tech = technicians[Math.floor(Math.random() * technicians.length)];
  return {
    id: `ws-${Date.now()}`,
    subject: `Auto ${Math.random() > 0.5 ? "Checkup" : "Repair"} #${Math.floor(Math.random() * 1000)}`,
    type: types[Math.floor(Math.random() * types.length)],
    equipment: equipment[Math.floor(Math.random() * equipment.length)],
    category: "AutoGen",
    maintenanceTeam: "Automation Team",
    technician: tech,
    technicianAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${tech.split(" ")[0]}`,
    scheduledDate,
    duration: `${Math.floor(Math.random() * 8) + 1} hours`,
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    stage: stages[Math.floor(Math.random() * stages.length)],
    employee: "AutoBot",
    company: "GearGuard Industries",
    notes: "Auto-generated via WebSocket",
    instructions: "N/A",
    isOverdue: Math.random() > 0.8,
  };
}

// 1️⃣ Workload Distribution — Requests by Technician
const technicianWorkload = (() => {
  const map = new Map();
  for (const req of mockMaintenanceRequests) {
    if (!map.has(req.technician)) {
      map.set(req.technician, { name: req.technician, count: 0, overdue: 0, avatar: req.technicianAvatar });
    }
    map.get(req.technician).count++;
    if (req.isOverdue) map.get(req.technician).overdue++;
  }
  return Array.from(map.values());
})();

// 2️⃣ Request Volume Trend — Requests Over Time (Monthly)
const requestVolumeTrend = (() => {
  const months = {};
  for (const req of mockMaintenanceRequests) {
    const month = req.scheduledDate.slice(0, 7); // YYYY-MM
    if (!months[month]) months[month] = { month, Corrective: 0, Preventive: 0 };
    if (req.type === "corrective") months[month].Corrective++;
    else months[month].Preventive++;
  }
  return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
})();

// 3️⃣ Equipment Reliability — Top Failing Equipment
const equipmentBreakdowns = (() => {
  const map = new Map();
  for (const req of mockMaintenanceRequests) {
    if (req.type === "corrective" && req.equipment) {
      if (!map.has(req.equipment)) map.set(req.equipment, { name: req.equipment, count: 0 });
      map.get(req.equipment).count++;
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 5);
})();

// 4️⃣ Maintenance Type Impact — Corrective vs Preventive Success Rate
const totalPreventive = mockMaintenanceRequests.filter(r => r.type === "preventive").length;
const totalCorrective = mockMaintenanceRequests.filter(r => r.type === "corrective").length;
const preventiveImpact = [
  { name: "Preventive", value: totalPreventive, color: "hsl(var(--success))" },
  { name: "Corrective", value: totalCorrective, color: "hsl(var(--warning))" },
];

// 5️⃣ Request Aging — Overdue & Pending Status Breakdown
const requestAging = (() => {
  const stages = ["new", "in-progress", "repaired", "scrap"];
  const data = stages.map(stage => ({
    stage,
    count: mockMaintenanceRequests.filter(r => r.stage === stage).length,
    overdue: mockMaintenanceRequests.filter(r => r.stage === stage && r.isOverdue).length,
  }));
  return data;
})();

export default function Reporting() {

  // Filters (future: implement real filter logic)
  const [filter, setFilter] = useState({ team: "", equipment: "", type: "", status: "", dateFrom: "", dateTo: "" });
  const [liveRequests, setLiveRequests] = useState(() => [...mockMaintenanceRequests]);
  const wsRef = useRef(null);

  // WebSocket simulation: push new data every 2-3 seconds
  useEffect(() => {
    wsRef.current = setInterval(() => {
      setLiveRequests(prev => [getRandomRequest(), ...prev.slice(0, 99)]); // keep max 100
    }, 2000 + Math.random() * 1000);
    return () => clearInterval(wsRef.current);
  }, []);

  // Date range filter logic
  const filteredRequests = liveRequests.filter(r => {
    const d = parseDate(r.scheduledDate);
    const from = filter.dateFrom ? parseDate(filter.dateFrom) : null;
    const to = filter.dateTo ? parseDate(filter.dateTo) : null;
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  });

  // All chart data generators now use filteredRequests instead of mockMaintenanceRequests
  const technicianWorkload = (() => {
    const map = new Map();
    for (const req of filteredRequests) {
      if (!map.has(req.technician)) {
        map.set(req.technician, { name: req.technician, count: 0, overdue: 0, avatar: req.technicianAvatar });
      }
      map.get(req.technician).count++;
      if (req.isOverdue) map.get(req.technician).overdue++;
    }
    return Array.from(map.values());
  })();

  const requestVolumeTrend = (() => {
    const months = {};
    for (const req of filteredRequests) {
      const month = req.scheduledDate.slice(0, 7); // YYYY-MM
      if (!months[month]) months[month] = { month, Corrective: 0, Preventive: 0 };
      if (req.type === "corrective") months[month].Corrective++;
      else months[month].Preventive++;
    }
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  })();

  const equipmentBreakdowns = (() => {
    const map = new Map();
    for (const req of filteredRequests) {
      if (req.type === "corrective" && req.equipment) {
        if (!map.has(req.equipment)) map.set(req.equipment, { name: req.equipment, count: 0 });
        map.get(req.equipment).count++;
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 5);
  })();

  const totalPreventive = filteredRequests.filter(r => r.type === "preventive").length;
  const totalCorrective = filteredRequests.filter(r => r.type === "corrective").length;
  const preventiveImpact = [
    { name: "Preventive", value: totalPreventive, color: "hsl(var(--success))" },
    { name: "Corrective", value: totalCorrective, color: "hsl(var(--warning))" },
  ];

  const requestAging = (() => {
    const stages = ["new", "in-progress", "repaired", "scrap"];
    const data = stages.map(stage => ({
      stage,
      count: filteredRequests.filter(r => r.stage === stage).length,
      overdue: filteredRequests.filter(r => r.stage === stage && r.isOverdue).length,
    }));
    return data;
  })();

  const teamProductivity = (() => {
    const map = new Map();
    for (const req of filteredRequests) {
      if (!map.has(req.maintenanceTeam)) map.set(req.maintenanceTeam, { name: req.maintenanceTeam, total: 0, count: 0 });
      const hours = parseFloat(req.duration);
      if (!isNaN(hours)) {
        map.get(req.maintenanceTeam).total += hours;
        map.get(req.maintenanceTeam).count++;
      }
    }
    return Array.from(map.values()).map(t => ({
      name: t.name,
      avg: t.count ? (t.total / t.count) : 0,
    }));
  })();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reporting & Analytics</h1>
        <p className="text-muted-foreground">Insight-driven maintenance intelligence</p>
      </div>
      <div className="flex flex-wrap gap-2 justify-end items-center">
        <label className="text-sm font-medium">From:</label>
        <input type="date" className="rounded border px-2 py-1 text-sm" value={filter.dateFrom} onChange={e => setFilter(f => ({ ...f, dateFrom: e.target.value }))} />
        <label className="text-sm font-medium">To:</label>
        <input type="date" className="rounded border px-2 py-1 text-sm" value={filter.dateTo} onChange={e => setFilter(f => ({ ...f, dateTo: e.target.value }))} />
        <button className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 bg-background text-sm font-medium shadow-sm hover:bg-muted/50 transition">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* 1️⃣ Workload Distribution — Requests by Technician */}
        <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <CardHeader><CardTitle>Workload Distribution <span className="text-xs text-muted-foreground">(Requests by Technician)</span></CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={technicianWorkload} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={120} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="count" radius={[8, 8, 8, 8]} fill="hsl(var(--primary))">
                    {technicianWorkload.map((entry, idx) => (
                      <Cell key={entry.name} fill={entry.count > 3 ? "hsl(var(--destructive))" : COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2">
                {technicianWorkload.map(t => t.overdue > 0 && (
                  <Badge key={t.name} variant="destructive">{t.name}: {t.overdue} Overdue</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* 2️⃣ Request Volume Trend — Requests Over Time */}
        <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <CardHeader><CardTitle>Request Volume Trend <span className="text-xs text-muted-foreground">(Corrective vs Preventive)</span></CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={requestVolumeTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCorrective" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPreventive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <Tooltip />
                  <Area type="monotone" dataKey="Corrective" stroke="hsl(var(--warning))" fillOpacity={1} fill="url(#colorCorrective)" />
                  <Area type="monotone" dataKey="Preventive" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#colorPreventive)" />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        {/* 3️⃣ Equipment Reliability — Top Failing Equipment */}
        <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <CardHeader><CardTitle>Equipment Reliability <span className="text-xs text-muted-foreground">(Top Failing Equipment)</span></CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={equipmentBreakdowns} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={120} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 8, 8]} fill="hsl(var(--destructive))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        {/* 4️⃣ Maintenance Type Impact — Corrective vs Preventive Success Rate */}
        <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between">
          <CardHeader><CardTitle>Maintenance Type Impact <span className="text-xs text-muted-foreground">(Success Rate)</span></CardTitle></CardHeader>
          <CardContent>
            <div className="relative h-[300px] flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={preventiveImpact} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {preventiveImpact.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none select-none absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 text-center z-10">
                <div className="text-3xl font-bold text-success drop-shadow-sm bg-background/80 px-2 rounded-full inline-block">
                  {Math.round((totalPreventive / (totalPreventive + totalCorrective)) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Preventive Success</div>
              </div>
              <div className="flex justify-center gap-6 mt-4 w-full">
                {preventiveImpact.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* 5️⃣ Request Aging — Overdue & Pending Status Breakdown */}
        <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <CardHeader><CardTitle>Request Aging <span className="text-xs text-muted-foreground">(Status Breakdown)</span></CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={requestAging} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                  <YAxis dataKey="stage" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 8, 8]} />
                  <Bar dataKey="overdue" fill="hsl(var(--destructive))" radius={[8, 8, 8, 8]} />
                  <ReferenceLine x={0} stroke="hsl(var(--border))" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        {/* 6️⃣ Team Productivity — Average Repair Duration per Team */}
        <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <CardHeader><CardTitle>Team Productivity <span className="text-xs text-muted-foreground">(Avg. Repair Duration)</span></CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamProductivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Bar dataKey="avg" fill="hsl(var(--info))" radius={[8, 8, 8, 8]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
