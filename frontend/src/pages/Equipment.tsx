import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Settings2,
  AlertTriangle,
  CheckCircle,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Equipment } from "@/data/mockData";
import { useEquipment } from "@/context/EquipmentContext";
import { EquipmentForm } from "@/components/equipment/EquipmentForm";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function getHealthColor(health: number) {
  if (health >= 70) return "text-success";
  if (health >= 40) return "text-warning";
  return "text-destructive";
}

function getHealthBgColor(health: number) {
  if (health >= 70) return "bg-success";
  if (health >= 40) return "bg-warning";
  return "bg-destructive";
}

function getStatusIcon(status: string) {
  switch (status) {
    case "operational":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "maintenance":
      return <Wrench className="h-4 w-4 text-warning" />;
    case "critical":
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    case "scrapped":
      return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    default:
      return null;
  }
}

export default function EquipmentPage() {
  const { equipment } = useEquipment();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEquipment = equipment.filter(
    (eq) =>
      eq.name.toLowerCase().includes("") ||
      eq.category.toLowerCase().includes("") ||
      eq.serialNumber.toLowerCase().includes("")
  );

  const stats = {
    total: equipment.length,
    operational: equipment.filter((e) => e.status === "operational").length,
    maintenance: equipment.filter((e) => e.status === "maintenance").length,
    critical: equipment.filter((e) => e.status === "critical").length,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Equipment</h1>
          <p className="text-muted-foreground">
            Manage and monitor your equipment assets
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} variant="hero">
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-4"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Equipment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="border-l-4 border-l-success">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Operational
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {stats.operational}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="border-l-4 border-l-warning">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">
                {stats.maintenance}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="border-l-4 border-l-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Critical
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">
                {stats.critical}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Equipment Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead className="text-right">Requests</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredEquipment.map((eq, index) => (
                  <motion.tr
                    key={eq.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedEquipment(eq)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                          <Settings2 className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{eq.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {eq.company}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{eq.category}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {eq.serialNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={eq.health}
                          className="w-20 h-2"
                        />
                        <span className={`font-medium ${getHealthColor(eq.health)}`}>
                          {eq.health}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(eq.status)}
                        <span className="capitalize">{eq.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>{eq.technician}</TableCell>
                    <TableCell className="text-right">
                      {eq.openRequests > 0 ? (
                        <Badge variant="secondary">{eq.openRequests}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Equipment Detail Dialog */}
      <Dialog
        open={!!selectedEquipment}
        onOpenChange={() => setSelectedEquipment(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Equipment Details</DialogTitle>
          </DialogHeader>
          {selectedEquipment && (
            <EquipmentForm
              equipment={selectedEquipment}
              onClose={() => setSelectedEquipment(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* New Equipment Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Equipment</DialogTitle>
          </DialogHeader>
          <EquipmentForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
