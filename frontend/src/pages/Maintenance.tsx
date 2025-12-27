import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Filter, Search, GripVertical, Clock, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MaintenanceRequest, mockEquipment } from "@/data/mockData";
import { useMaintenanceRequests } from "@/context/MaintenanceContext";
import { useEquipment } from "@/context/EquipmentContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MaintenanceForm } from "@/components/maintenance/MaintenanceForm";

type Stage = "new" | "in-progress" | "repaired" | "scrap";

const stages: { id: Stage; label: string; color: string }[] = [
  { id: "new", label: "New", color: "border-l-info" },
  { id: "in-progress", label: "In Progress", color: "border-l-warning" },
  { id: "repaired", label: "Repaired", color: "border-l-success" },
  { id: "scrap", label: "Scrap", color: "border-l-muted-foreground" },
];

interface KanbanCardProps {
  request: MaintenanceRequest;
  onClick: () => void;
}

function KanbanCard({ request, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: request.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-warning text-warning-foreground";
      case "medium":
        return "bg-info text-info-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="touch-manipulation"
    >
      <Card
        variant="kanban"
        className={`p-4 cursor-pointer group ${
          request.isOverdue ? "border-l-destructive" : ""
        }`}
        onClick={onClick}
      >
        <div className="flex items-start gap-3">
          <div
            {...attributes}
            {...listeners}
            className="mt-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium truncate">{request.subject}</h4>
              {request.isOverdue && (
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mt-1">
              {request.equipment || request.workCenter}
            </p>
            
            <div className="flex items-center gap-2 mt-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src={request.technicianAvatar} />
                <AvatarFallback>
                  {request.technician.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {request.technician}
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <Badge
                className={getPriorityColor(request.priority)}
                variant="secondary"
              >
                {request.priority}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {request.duration}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function KanbanColumn({
  stage,
  requests,
  onCardClick,
}: {
  stage: { id: Stage; label: string; color: string };
  requests: MaintenanceRequest[];
  onCardClick: (request: MaintenanceRequest) => void;
}) {
  const { setNodeRef } = useSortable({ id: stage.id });

  return (
    <div ref={setNodeRef} className="flex flex-col min-w-[300px] max-w-[350px] flex-1 bg-card rounded-lg border">
      <div className={`flex items-center justify-between p-4 rounded-t-lg bg-muted ${stage.color} border-l-4`}>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{stage.label}</h3>
          <Badge variant="secondary" className="rounded-full h-6 w-6 flex items-center justify-center p-0">
            {requests.length}
          </Badge>
        </div>
      </div>
      
      <div className="flex-1 p-3 space-y-3 min-h-[500px] overflow-y-auto">
        <SortableContext
          items={requests.map((r) => r.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence mode="popLayout">
            {requests.map((request) => (
              <KanbanCard
                key={request.id}
                request={request}
                onClick={() => onCardClick(request)}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
        
        {requests.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-xs">
            No requests in {stage.label}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Maintenance() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { requests, updateRequest } = useMaintenanceRequests();
  const { equipment, updateEquipment } = useEquipment();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEquipment, setFilterEquipment] = useState<string | null>(null);

  // Get equipment filter from URL on mount
  useEffect(() => {
    const equipmentParam = searchParams.get("equipment");
    if (equipmentParam) {
      setFilterEquipment(decodeURIComponent(equipmentParam));
    }
  }, [searchParams]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.technician.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.equipment?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEquipment = !filterEquipment || r.equipment === filterEquipment;

    return matchesSearch && matchesEquipment;
  });

  const getRequestsByStage = (stage: Stage) =>
    filteredRequests.filter((r) => r.stage === stage);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeRequest = requests.find((r) => r.id === active.id);
    if (!activeRequest) return;

    // The over ID should be a stage ID
    const newStageId = over.id as string;
    const isValidStage = stages.some((s) => s.id === newStageId);
    
    if (!isValidStage) return;

    const newStage = newStageId as Stage;
    
    if (activeRequest.stage !== newStage) {
      // Update request stage using context
      updateRequest(active.id as string, { stage: newStage });

      // SCRAP LOGIC: Check if ALL requests for this equipment should be scrapped
      if (activeRequest.equipment) {
        // Get all requests for this equipment (after the update)
        const updatedRequests = requests.map((r) =>
          r.id === active.id ? { ...r, stage: newStage } : r
        );
        const equipmentRequests = updatedRequests.filter(
          (r) => r.equipment === activeRequest.equipment
        );
        
        // Equipment is scrapped only if ALL its requests are in scrap stage
        const allInScrap = equipmentRequests.length > 0 && 
          equipmentRequests.every((r) => r.stage === "scrap");

        const equipmentToUpdate = equipment.find(
          (eq) => eq.name === activeRequest.equipment
        );
        
        if (equipmentToUpdate && equipmentToUpdate.id) {
          if (allInScrap) {
            // Mark as scrapped only if all requests are in scrap
            updateEquipment(equipmentToUpdate.id, {
              status: "scrapped" as const,
              isScrapped: true,
              scrapDate: new Date().toISOString().split("T")[0],
              scrapReason: `Equipment scrapped due to maintenance request: ${activeRequest.subject}`,
            });
          } else if (equipmentToUpdate.isScrapped) {
            // Un-scrap if at least one request is moved out of scrap
            updateEquipment(equipmentToUpdate.id, {
              status: "operational" as const,
              isScrapped: false,
              scrapDate: undefined,
              scrapReason: undefined,
            });
          }
        }
      }
    }
  };

  const activeRequest = activeId
    ? requests.find((r) => r.id === activeId)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Requests</h1>
          <p className="text-muted-foreground">
            {filterEquipment ? `Requests for ${filterEquipment}` : "Drag and drop to update request status"}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} variant="hero">
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Active Equipment Filter Badge */}
      {filterEquipment && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20"
        >
          <Badge variant="secondary">Filtered by: {filterEquipment}</Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setFilterEquipment(null);
              setSearchParams({});
            }}
            className="h-6 px-2"
          >
            <X className="h-4 w-4" />
            Clear filter
          </Button>
        </motion.div>
      )}

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
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

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={[...stages.map((s) => s.id), ...filteredRequests.map((r) => r.id)]}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {stages.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                requests={getRequestsByStage(stage.id)}
                onCardClick={setSelectedRequest}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeRequest ? (
            <Card className="p-4 shadow-2xl rotate-3 scale-105">
              <h4 className="font-medium">{activeRequest.subject}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {activeRequest.equipment}
              </p>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Request Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedRequest?.subject}</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <MaintenanceForm
              request={selectedRequest}
              onClose={() => setSelectedRequest(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* New Request Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Maintenance Request</DialogTitle>
          </DialogHeader>
          <MaintenanceForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
