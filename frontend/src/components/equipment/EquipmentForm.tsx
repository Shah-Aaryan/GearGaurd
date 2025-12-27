import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Equipment, mockTeams } from "@/data/mockData";
import { useEquipment } from "@/context/EquipmentContext";
import { useMaintenanceRequests } from "@/context/MaintenanceContext";
import { Wrench, ChevronRight, AlertTriangle, CheckCircle } from "lucide-react";

interface EquipmentFormProps {
  equipment?: Equipment;
  onClose: () => void;
}

const categories = [
  "Machine Tools",
  "Robotics",
  "Press Equipment",
  "Cutting Equipment",
  "Conveyors",
  "Utilities",
];

export function EquipmentForm({ equipment, onClose }: EquipmentFormProps) {
  const navigate = useNavigate();
  const { requests } = useMaintenanceRequests();
  const { addEquipment } = useEquipment();
  const [formData, setFormData] = useState({
    name: equipment?.name || "",
    category: equipment?.category || "",
    serialNumber: equipment?.serialNumber || "",
    company: equipment?.company || "GearGuard Industries",
    employee: equipment?.employee || "",
    technician: equipment?.technician || "",
    maintenanceTeam: equipment?.maintenanceTeam || "",
    assignedDate: equipment?.assignedDate || "",
    description: equipment?.description || "",
  });

  // Get open requests for this equipment from context
  const getOpenRequestsForEquipment = () => {
    if (!equipment?.name) return [];
    return requests.filter(
      (req) => req.equipment === equipment.name && req.stage !== "repaired" && req.stage !== "scrap"
    );
  };

  const openRequests = getOpenRequestsForEquipment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipment) {
      // Add new equipment
      const newEquipment: Equipment = {
        id: `eq-${Date.now()}`,
        name: formData.name,
        category: formData.category,
        serialNumber: formData.serialNumber,
        company: formData.company,
        employee: formData.employee,
        technician: formData.technician,
        maintenanceTeam: formData.maintenanceTeam,
        assignedDate: formData.assignedDate,
        description: formData.description,
        health: 100,
        status: 'operational',
        openRequests: 0
      };
      addEquipment(newEquipment);
    }
    onClose();
  };

  const handleViewMaintenance = () => {
    if (equipment?.name) {
      onClose();
      // Navigate to maintenance page with equipment filter
      navigate(`/app/maintenance?equipment=${encodeURIComponent(equipment.name)}`);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Equipment Health (View Mode) */}
      {equipment && (
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Equipment Health</span>
            <span
              className={`text-lg font-bold ${
                equipment.health >= 70
                  ? "text-success"
                  : equipment.health >= 40
                  ? "text-warning"
                  : "text-destructive"
              }`}
            >
              {equipment.health}%
            </span>
          </div>
          <Progress value={equipment.health} className="h-3" />
          <div className="flex items-center gap-2">
            {equipment.status === "operational" && (
              <Badge className="bg-success/20 text-success">
                <CheckCircle className="h-3 w-3 mr-1" />
                Operational
              </Badge>
            )}
            {equipment.status === "maintenance" && (
              <Badge className="bg-warning/20 text-warning">
                <Wrench className="h-3 w-3 mr-1" />
                In Maintenance
              </Badge>
            )}
            {equipment.status === "critical" && (
              <Badge className="bg-destructive/20 text-destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Critical
              </Badge>
            )}
            {equipment.status === "scrapped" && (
              <Badge className="bg-muted-foreground/20 text-muted-foreground">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Scrapped
              </Badge>
            )}
          </div>
          
          {/* Scrap Info */}
          {equipment.isScrapped && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
            >
              <div className="text-sm font-medium text-destructive mb-1">Equipment Scrapped</div>
              {equipment.scrapDate && (
                <div className="text-xs text-muted-foreground mb-1">
                  Date: {new Date(equipment.scrapDate).toLocaleDateString()}
                </div>
              )}
              {equipment.scrapReason && (
                <div className="text-xs text-muted-foreground">
                  Reason: {equipment.scrapReason}
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* Smart Button - Maintenance Requests */}
      {equipment && openRequests.length > 0 && (
        <motion.button
          type="button"
          onClick={handleViewMaintenance}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium">Maintenance Requests</div>
              <div className="text-sm text-muted-foreground">
                {openRequests.length} open request{openRequests.length !== 1 ? "s" : ""} for this equipment
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {openRequests.length}
          </Badge>
        </motion.button>
      )}

      {/* Basic Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Equipment Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter equipment name"
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="serialNumber">Serial Number</Label>
          <Input
            id="serialNumber"
            value={formData.serialNumber}
            onChange={(e) =>
              setFormData({ ...formData, serialNumber: e.target.value })
            }
            placeholder="Enter serial number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
          />
        </div>
      </div>

      {/* Assignment */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="employee">Employee</Label>
          <Input
            id="employee"
            value={formData.employee}
            onChange={(e) =>
              setFormData({ ...formData, employee: e.target.value })
            }
            placeholder="Assigned employee"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="assignedDate">Assigned Date</Label>
          <Input
            id="assignedDate"
            type="date"
            value={formData.assignedDate}
            onChange={(e) =>
              setFormData({ ...formData, assignedDate: e.target.value })
            }
          />
        </div>
      </div>

      {/* Maintenance Assignment */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Maintenance Team</Label>
          <Select
            value={formData.maintenanceTeam}
            onValueChange={(value) =>
              setFormData({ ...formData, maintenanceTeam: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              {mockTeams.map((team) => (
                <SelectItem key={team.id} value={team.name}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Technician</Label>
          <Select
            value={formData.technician}
            onValueChange={(value) =>
              setFormData({ ...formData, technician: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Assign technician" />
            </SelectTrigger>
            <SelectContent>
              {mockTeams.flatMap((team) =>
                team.members.map((member) => (
                  <SelectItem key={member.id} value={member.name}>
                    {member.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter equipment description..."
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="hero">
          {equipment ? "Save Changes" : "Add Equipment"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </motion.form>
  );
}
