import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { MaintenanceRequest, mockEquipment, mockTeams, mockWorkCenters } from "@/data/mockData";
import { Check, ChevronRight } from "lucide-react";
import { useMaintenanceRequests } from "@/context/MaintenanceContext";

interface MaintenanceFormProps {
  request?: MaintenanceRequest;
  onClose: () => void;
  selectedDate?: Date;
}

const stages = ["new", "in-progress", "repaired", "scrap"];

export function MaintenanceForm({ request, onClose, selectedDate }: MaintenanceFormProps) {
  const { addRequest } = useMaintenanceRequests();
  const [formData, setFormData] = useState({
    subject: request?.subject || "",
    type: request?.type || "corrective",
    equipment: request?.equipment || "",
    workCenter: request?.workCenter || "",
    category: request?.category || "",
    maintenanceTeam: request?.maintenanceTeam || "",
    technician: request?.technician || "",
    scheduledDate: request?.scheduledDate || (selectedDate ? selectedDate.toISOString().split('T')[0] : ""),
    duration: request?.duration || "",
    priority: request?.priority || "medium",
    notes: request?.notes || "",
    instructions: request?.instructions || "",
  });
  
  const [currentStage, setCurrentStage] = useState(request?.stage || "new");
  const [useWorkCenter, setUseWorkCenter] = useState(!!request?.workCenter);

  const getStageIndex = (stage: string) => stages.indexOf(stage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!request) {
      // Create new request
      const newRequest: MaintenanceRequest = {
        id: `REQ-${Date.now()}`,
        subject: formData.subject,
        type: formData.type as any,
        equipment: formData.equipment,
        category: formData.category,
        maintenanceTeam: formData.maintenanceTeam,
        technician: formData.technician,
        technicianAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + formData.technician,
        scheduledDate: formData.scheduledDate,
        duration: formData.duration,
        priority: formData.priority as any,
        stage: "new" as const,
        employee: "",
        company: "",
        notes: formData.notes,
        instructions: formData.instructions,
        isOverdue: false,
        workCenter: formData.workCenter,
      };
      
      addRequest(newRequest);
    }
    
    onClose();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Stage Indicator */}
      {request && (
        <div className="relative">
          <div className="flex items-center justify-between">
            {stages.map((stage, index) => {
              const isCompleted = getStageIndex(currentStage) > index;
              const isCurrent = currentStage === stage;
              
              return (
                <div key={stage} className="flex items-center flex-1">
                  <motion.button
                    type="button"
                    onClick={() => setCurrentStage(stage as typeof currentStage)}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                      isCompleted
                        ? "border-success bg-success text-success-foreground"
                        : isCurrent
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-background text-muted-foreground"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </motion.button>
                  {index < stages.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2">
                      <div
                        className={`h-full transition-colors ${
                          getStageIndex(currentStage) > index
                            ? "bg-success"
                            : "bg-muted"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            {stages.map((stage) => (
              <span
                key={stage}
                className={`text-xs capitalize ${
                  currentStage === stage
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {stage.replace("-", " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Request Type */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant={formData.type === "corrective" ? "default" : "outline"}
          onClick={() => setFormData({ ...formData, type: "corrective" })}
          className="flex-1"
        >
          Corrective
        </Button>
        <Button
          type="button"
          variant={formData.type === "preventive" ? "default" : "outline"}
          onClick={() => setFormData({ ...formData, type: "preventive" })}
          className="flex-1"
        >
          Preventive
        </Button>
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Enter request subject"
        />
      </div>

      {/* Equipment or Work Center Toggle */}
      <div className="space-y-2">
        <div className="flex gap-2 mb-2">
          <Button
            type="button"
            size="sm"
            variant={!useWorkCenter ? "default" : "outline"}
            onClick={() => setUseWorkCenter(false)}
          >
            Equipment
          </Button>
          <Button
            type="button"
            size="sm"
            variant={useWorkCenter ? "default" : "outline"}
            onClick={() => setUseWorkCenter(true)}
          >
            Work Center
          </Button>
        </div>
        
        {!useWorkCenter ? (
          <Select
            value={formData.equipment}
            onValueChange={(value) => {
              const eq = mockEquipment.find((e) => e.name === value);
              setFormData({
                ...formData,
                equipment: value,
                workCenter: "",
                category: eq?.category || "",
                maintenanceTeam: eq?.maintenanceTeam || "",
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select equipment" />
            </SelectTrigger>
            <SelectContent>
              {mockEquipment.map((eq) => (
                <SelectItem key={eq.id} value={eq.name}>
                  {eq.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Select
            value={formData.workCenter}
            onValueChange={(value) => {
              setFormData({
                ...formData,
                workCenter: value,
                equipment: "",
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select work center" />
            </SelectTrigger>
            <SelectContent>
              {mockWorkCenters.map((wc) => (
                <SelectItem key={wc.id} value={wc.name}>
                  {wc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Auto-filled fields */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Category</Label>
          <Input value={formData.category} disabled className="bg-muted" />
        </div>
        <div className="space-y-2">
          <Label>Maintenance Team</Label>
          <Input value={formData.maintenanceTeam} disabled className="bg-muted" />
        </div>
      </div>

      {/* Technician */}
      <div className="space-y-2">
        <Label>Technician</Label>
        <Select
          value={formData.technician}
          onValueChange={(value) => setFormData({ ...formData, technician: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Assign technician" />
          </SelectTrigger>
          <SelectContent>
            {mockTeams.flatMap((team) =>
              team.members.map((member) => (
                <SelectItem key={member.id} value={member.name}>
                  {member.name} - {team.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Schedule */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="scheduledDate">Scheduled Date</Label>
          <Input
            id="scheduledDate"
            type="date"
            value={formData.scheduledDate}
            onChange={(e) =>
              setFormData({ ...formData, scheduledDate: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g., 4 hours"
          />
        </div>
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Label>Priority</Label>
        <div className="flex gap-2">
          {["low", "medium", "high", "urgent"].map((priority) => (
            <Button
              key={priority}
              type="button"
              size="sm"
              variant={formData.priority === priority ? "default" : "outline"}
              onClick={() =>
                setFormData({ ...formData, priority: priority as any })
              }
              className="capitalize"
            >
              {priority}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs for Notes & Instructions */}
      <Tabs defaultValue="notes">
        <TabsList>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
        </TabsList>
        <TabsContent value="notes">
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add notes about the request..."
            rows={4}
          />
        </TabsContent>
        <TabsContent value="instructions">
          <Textarea
            value={formData.instructions}
            onChange={(e) =>
              setFormData({ ...formData, instructions: e.target.value })
            }
            placeholder="Add maintenance instructions..."
            rows={4}
          />
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="hero">
          {request ? "Save Changes" : "Create Request"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </motion.form>
  );
}