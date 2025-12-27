import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  Users, 
  ClipboardList, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { dashboardStats, mockMaintenanceRequests } from "@/data/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const requestsByMonth = [
  { month: "Jul", requests: 24 },
  { month: "Aug", requests: 32 },
  { month: "Sep", requests: 28 },
  { month: "Oct", requests: 35 },
  { month: "Nov", requests: 42 },
  { month: "Dec", requests: 38 },
];

const pieData = [
  { name: "New", value: dashboardStats.requestsByStage.new, color: "hsl(var(--info))" },
  { name: "In Progress", value: dashboardStats.requestsByStage.inProgress, color: "hsl(var(--warning))" },
  { name: "Repaired", value: dashboardStats.requestsByStage.repaired, color: "hsl(var(--success))" },
  { name: "Scrap", value: dashboardStats.requestsByStage.scrap, color: "hsl(var(--muted-foreground))" },
];

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
}

function AnimatedCounter({ value, suffix = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

function getStageBadgeVariant(stage: string) {
  switch (stage) {
    case "new":
      return "default";
    case "in-progress":
      return "secondary";
    case "repaired":
      return "outline";
    case "scrap":
      return "destructive";
    default:
      return "default";
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "urgent":
      return "text-destructive";
    case "high":
      return "text-warning";
    case "medium":
      return "text-info";
    default:
      return "text-muted-foreground";
  }
}

export default function Dashboard() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your maintenance operations
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={containerVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Critical Equipment */}
        <motion.div variants={itemVariants}>
          <Card variant="stat" className="border-l-4 border-l-destructive">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Critical Equipment</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">
                <AnimatedCounter value={dashboardStats.criticalEquipment.count} />
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>Health &lt; 30%</span>
                <ArrowUpRight className="h-4 w-4 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Technician Load */}
        <motion.div variants={itemVariants}>
          <Card variant="stat" className="border-l-4 border-l-info">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Technician Load</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-info" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-info">
                <AnimatedCounter value={dashboardStats.technicianLoad.average} suffix="%" />
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dashboardStats.technicianLoad.average}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full rounded-full bg-info"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Open Requests */}
        <motion.div variants={itemVariants}>
          <Card variant="stat" className="border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                <AnimatedCounter value={dashboardStats.openRequests.total} />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  {dashboardStats.openRequests.pending} pending
                </span>
                <span className="text-destructive">
                  {dashboardStats.openRequests.overdue} overdue
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trend */}
        <motion.div variants={itemVariants}>
          <Card variant="stat" className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <AnimatedCounter value={38} />
              </div>
              <div className="flex items-center gap-1 text-sm text-success">
                <ArrowDownRight className="h-4 w-4" />
                <span>12% vs last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts Row */}
      <motion.div
        variants={containerVariants}
        className="grid gap-6 lg:grid-cols-3"
      >
        {/* Line Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Requests Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={requestsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="requests"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Requests by Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 justify-center">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.name} ({item.value})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Maintenance Requests Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Maintenance Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Stage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMaintenanceRequests.slice(0, 5).map((request, index) => (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {request.isOverdue && (
                          <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                        )}
                        {request.subject}
                      </div>
                    </TableCell>
                    <TableCell>{request.employee}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={request.technicianAvatar}
                          alt={request.technician}
                          className="h-6 w-6 rounded-full"
                        />
                        {request.technician}
                      </div>
                    </TableCell>
                    <TableCell>{request.category}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStageBadgeVariant(request.stage)}>
                        {request.stage.replace("-", " ")}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
