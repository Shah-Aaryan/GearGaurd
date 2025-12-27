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
import { Wrench, ChevronRight, AlertTriangle, CheckCircle, Send, Loader2, Mail } from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
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
    // Add email field for Formspree verification
    email: "shah123aarav@gmail.com",
  });

  // Formspree endpoint
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdaoewdp";

  // Get open requests for this equipment from context
  const getOpenRequestsForEquipment = () => {
    if (!equipment?.name) return [];
    return requests.filter(
      (req) => req.equipment === equipment.name && req.stage !== "repaired" && req.stage !== "scrap"
    );
  };

  const openRequests = getOpenRequestsForEquipment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Prepare data for Formspree - include email field
      const formspreeData = {
        _subject: equipment ? `Equipment Update: ${formData.name}` : `New Equipment: ${formData.name}`,
        email: formData.email, // REQUIRED for Formspree verification
        name: formData.name,
        category: formData.category,
        serialNumber: formData.serialNumber,
        company: formData.company,
        employee: formData.employee,
        technician: formData.technician,
        maintenanceTeam: formData.maintenanceTeam,
        assignedDate: formData.assignedDate,
        description: formData.description,
        formType: equipment ? "Equipment Update" : "New Equipment",
        timestamp: new Date().toISOString(),
        equipmentId: equipment?.id || `new-${Date.now()}`,
        openRequests: openRequests.length,
        equipmentStatus: equipment?.status || "new",
        equipmentHealth: equipment?.health || 100,
        // Add a message field as shown in Formspree example
        message: equipment 
          ? `Equipment update for: ${formData.name}\n\nCategory: ${formData.category}\nSerial: ${formData.serialNumber}\nAssigned to: ${formData.employee}`
          : `New equipment added: ${formData.name}\n\nCategory: ${formData.category}\nSerial: ${formData.serialNumber}\nAssigned to: ${formData.employee}`
      };

      console.log("Submitting to Formspree:", formspreeData);

      // Submit to Formspree using POST method
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formspreeData),
      });

      console.log("Formspree response:", response);

      if (response.ok) {
        setSubmitSuccess(true);
        
        // Add equipment to local context after successful Formspree submission
        if (!equipment) {
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
        
        // Show success message for 3 seconds before closing
        setTimeout(() => {
          setSubmitSuccess(false);
          onClose();
        }, 3000);
      } else {
        const errorText = await response.text();
        console.error("Formspree error response:", errorText);
        throw new Error(`Form submission failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to submit form. Please try again.");
      
      // Still add to local context even if Formspree fails
      if (!equipment) {
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
        
        // Don't close immediately on error, let user see the error message
        // onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
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
      {/* Success Message */}
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-success/20 border border-success/30 p-4"
        >
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Success!</span>
          </div>
          <p className="text-sm text-success-foreground mt-1">
            {equipment 
              ? "Equipment update submitted successfully! Check shah123aarav@gmail.com for confirmation."
              : "New equipment added and submitted successfully! Check shah123aarav@gmail.com for confirmation."
            }
          </p>
        </motion.div>
      )}

      {/* Error Message */}
      {submitError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-destructive/20 border border-destructive/30 p-4"
        >
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Submission Error</span>
          </div>
          <p className="text-sm text-destructive-foreground mt-1">
            {submitError}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Note: Formspree requires email verification. Check your email shah123aarav@gmail.com for a confirmation link.
          </p>
        </motion.div>
      )}

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

      {/* Email Field (Hidden since we're using your email) */}
      <div className="hidden">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Your email"
          required
        />
      </div>

      {/* Email Info Box */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
        <div className="flex items-center gap-2 text-blue-700 mb-2">
          <Mail className="h-5 w-5" />
          <span className="font-medium">Form Submission Info</span>
        </div>
        <p className="text-sm text-blue-600">
          Submissions will be sent to: <strong>shah123aarav@gmail.com</strong>
        </p>
        <p className="text-xs text-blue-500 mt-1">
          Check your email for Formspree verification link if you haven't confirmed yet.
        </p>
      </div>

      {/* Basic Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Equipment Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter equipment name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
            required
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

      {/* Submission Info */}
      <div className="rounded-lg bg-muted/30 p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Send className="h-4 w-4" />
          <span>
            {equipment 
              ? "This equipment update will be submitted to your Formspree endpoint (shah123aarav@gmail.com)."
              : "This new equipment will be submitted to your Formspree endpoint (shah123aarav@gmail.com)."
            }
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="hero"
          disabled={isSubmitting || submitSuccess}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : submitSuccess ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Submitted!
            </>
          ) : (
            <>
              {equipment ? "Save Changes" : "Add Equipment"}
              <Send className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
}