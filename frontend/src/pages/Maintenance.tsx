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

import {
  Plus,
  Filter,
  Search,
  GripVertical,
  Clock,
  AlertTriangle,
  FileText,
  MessageSquare,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

import { useMaintenanceRequests } from "@/context/MaintenanceContext";
import { useEquipment } from "@/context/EquipmentContext";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { MaintenanceForm } from "@/components/maintenance/MaintenanceForm";


/* ────────────────────────────────────────────── */
/* TYPES & STAGES */
/* ────────────────────────────────────────────── */

type Stage = "new" | "in-progress" | "repaired" | "scrap";

const stages = [
  { id: "new" as Stage, label: "New", color: "border-l-info" },
  { id: "in-progress" as Stage, label: "In Progress", color: "border-l-warning" },
  { id: "repaired" as Stage, label: "Repaired", color: "border-l-success" },
  { id: "scrap" as Stage, label: "Scrap", color: "border-l-muted-foreground" },
];

// Types for worksheet comments
type WorksheetComment = {
  id: string;
  text: string;
  author: string;
  authorAvatar?: string;
  timestamp: string;
  requestId: string;
};

/* ────────────────────────────────────────────── */
/* WORKSHEET COMPONENT */
/* ────────────────────────────────────────────── */

function WorksheetSheet({
  request,
  open,
  onOpenChange,
}: {
  request: MaintenanceRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [comments, setComments] = useState<WorksheetComment[]>([
    {
      id: "1",
      text: "Initial diagnosis complete. Need replacement parts.",
      author: "John Technician",
      timestamp: "2024-01-15 10:30",
      requestId: request.id,
    },
    {
      id: "2",
      text: "Parts ordered. Expected delivery in 2 days.",
      author: "Sarah Manager",
      timestamp: "2024-01-15 14:45",
      requestId: request.id,
    },
  ]);
  
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: WorksheetComment = {
      id: Date.now().toString(),
      text: newComment,
      author: "Current User", // In real app, get from auth context
      timestamp: new Date().toLocaleString(),
      requestId: request.id,
    };
    
    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Worksheet - {request.subject}</SheetTitle>
          <SheetDescription>
            Maintenance request details and work comments
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Request Summary */}
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Request Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Equipment:</span>
                <p className="font-medium">{request.equipment}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Priority:</span>
                <Badge className={getPriorityColor(request.priority)}>
                  {request.priority}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Technician:</span>
                <p className="font-medium">{request.technician}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <p className="font-medium capitalize">{request.stage}</p>
              </div>
            </div>
          </Card>

          {/* Comments Section */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Work Comments
            </h3>
            
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {comments.map((comment) => (
                <Card key={comment.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {comment.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="mt-2 text-sm">{comment.text}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Add Comment */}
            <div className="space-y-2">
              <Textarea
                placeholder="Add a comment about the work..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button onClick={handleAddComment} size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Add Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Helper function for priority colors
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


/* ────────────────────────────────────────────── */
/* KANBAN CARD */
/* ────────────────────────────────────────────── */

function KanbanCard({
  request,
  onClick,
  onWorksheetClick,
}: {
  request: MaintenanceRequest;
  onClick: () => void;
  onWorksheetClick: (request: MaintenanceRequest) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: request.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
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
            <div className="flex items-start justify-between">
              <h4 className="font-medium truncate">{request.subject}</h4>

              {request.isOverdue && (
                <AlertTriangle className="h-4 w-4 text-destructive" />
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
              <Badge className={getPriorityColor(request.priority)}>
                {request.priority}
              </Badge>

              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {request.duration}
              </span>
            </div>
          </div>

          {/* Worksheet Button */}
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
            onClick={(e) => {
              e.stopPropagation();
              onWorksheetClick(request);
            }}
            title="Open Worksheet"
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}


/* ────────────────────────────────────────────── */
/* COLUMN */
/* ────────────────────────────────────────────── */

function KanbanColumn({
  stage,
  requests,
  onCardClick,
  onWorksheetClick,
}: {
  stage: { id: Stage; label: string; color: string };
  requests: MaintenanceRequest[];
  onCardClick: (r: MaintenanceRequest) => void;
  onWorksheetClick: (r: MaintenanceRequest) => void;
}) {
  return (
    <div className="flex flex-col min-w-[300px] max-w-[350px] flex-1">

      <div
        className={`flex items-center justify-between p-4 bg-card rounded-t-xl border border-b-0 ${stage.color} border-l-4`}
      >
        <h3 className="font-semibold">{stage.label}</h3>

        <Badge variant="secondary" className="rounded-full">
          {requests.length}
        </Badge>
      </div>

      <div className="flex-1 bg-muted/30 border rounded-b-xl border-t-0 p-3 space-y-3 min-h-[400px]">

        <SortableContext
          items={requests.map(r => r.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            {requests.map(r => (
              <KanbanCard 
                key={r.id} 
                request={r} 
                onClick={() => onCardClick(r)}
                onWorksheetClick={onWorksheetClick}
              />
            ))}
          </AnimatePresence>
        </SortableContext>

        {requests.length === 0 && (
          <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
            No requests
          </div>
        )}
      </div>
    </div>
  );
}


/* ────────────────────────────────────────────── */
/* PAGE */
/* ────────────────────────────────────────────── */

export default function Maintenance() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { requests, updateRequest, addRequest } = useMaintenanceRequests();
  const { equipment, updateEquipment } = useEquipment();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEquipment, setFilterEquipment] = useState<string | null>(null);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);
  const [worksheetRequest, setWorksheetRequest] =
    useState<MaintenanceRequest | null>(null);

  const [showForm, setShowForm] = useState(false);

  // Get equipment filter from URL on mount
  useEffect(() => {
    const equipmentParam = searchParams.get("equipment");
    if (equipmentParam) {
      setFilterEquipment(decodeURIComponent(equipmentParam));
    }
  }, [searchParams]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  /* FILTER ONLY IN KANBAN SEARCH BAR */
  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.technician.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.equipment?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesEquipment = !filterEquipment || r.equipment === filterEquipment;
    
    return matchesSearch && matchesEquipment;
  });

  const getRequestsByStage = (stage: Stage) =>
    filteredRequests.filter(r => r.stage === stage);


  /* DRAG HANDLERS */

  const handleDragStart = (e: DragStartEvent) =>
    setActiveId(e.active.id as string);

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;

    const activeReq = requests.find(r => r.id === active.id);
    const overReq = requests.find(r => r.id === over.id);

    if (!activeReq || !overReq || activeReq.stage === overReq.stage) return;

    const newStage = overReq.stage;
    
    // Update request stage using context
    updateRequest(active.id as string, { stage: newStage });

    // SCRAP LOGIC: Check if ALL requests for this equipment should be scrapped
    if (activeReq.equipment) {
      // Get all requests for this equipment (after the update)
      const updatedRequests = requests.map((r) =>
        r.id === active.id ? { ...r, stage: newStage } : r
      );
      const equipmentRequests = updatedRequests.filter(
        (r) => r.equipment === activeReq.equipment
      );
      
      // Equipment is scrapped only if ALL its requests are in scrap stage
      const allInScrap = equipmentRequests.length > 0 && 
        equipmentRequests.every((r) => r.stage === "scrap");

      const equipmentToUpdate = equipment.find(
        (eq) => eq.name === activeReq.equipment
      );
      
      if (equipmentToUpdate && equipmentToUpdate.id) {
        if (allInScrap) {
          // Mark as scrapped only if all requests are in scrap
          updateEquipment(equipmentToUpdate.id, {
            status: "scrapped" as const,
            isScrapped: true,
            scrapDate: new Date().toISOString().split("T")[0],
            scrapReason: `Equipment scrapped due to maintenance request: ${activeReq.subject}`,
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
  };

  const activeRequest = activeId
    ? requests.find(r => r.id === activeId)
    : null;

  // Handle new request creation
  const handleNewRequest = (formData: Partial<MaintenanceRequest>) => {
    // Create a complete new request from form data
    const newRequest: MaintenanceRequest = {
      id: `req-${Date.now()}`,
      subject: formData.subject || "New Maintenance Request",
      equipment: formData.equipment || "Unspecified",
      workCenter: formData.workCenter || "Main Workshop",
      priority: formData.priority || "medium",
      technician: formData.technician || "Unassigned",
      technicianAvatar: formData.technicianAvatar || "",
      duration: formData.duration || "1h",
      stage: "new" as Stage,
      createdAt: new Date().toISOString(),
      isOverdue: formData.isOverdue || false,
      description: formData.description || "",
      location: formData.location || "Main Workshop",
      estimatedCost: formData.estimatedCost || 0,
      actualCost: formData.actualCost || 0,
      completionDate: formData.completionDate,
      notes: formData.notes || "",
      attachments: formData.attachments || [],
      // Add any other required fields from your MaintenanceRequest type
    };
    
    console.log("Adding new request:", newRequest);
    
    // Add the new request using context
    addRequest(newRequest);
    setShowForm(false);
  };

  // Handle update of existing request
  const handleUpdateRequest = (id: string, updates: Partial<MaintenanceRequest>) => {
    console.log("Updating request:", id, updates);
    updateRequest(id, updates);
    setSelectedRequest(null);
  };


  /* UI */

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <h1 className="text-2xl font-bold">Maintenance Teams</h1>

        <Button onClick={() => setShowForm(true)} variant="hero">
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>


      {/* Search Bar */}
      <div className="flex gap-2 items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search maintenance requests..."
            className="pl-10 pr-10 rounded-full shadow-inner"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>


      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map(stage => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              requests={getRequestsByStage(stage.id)}
              onCardClick={setSelectedRequest}
              onWorksheetClick={setWorksheetRequest}
            />
          ))}
        </div>

        <DragOverlay>
          {activeRequest && (
            <Card className="p-4 shadow-2xl rotate-3 scale-105">
              <h4 className="font-medium">{activeRequest.subject}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {activeRequest.equipment}
              </p>
            </Card>
          )}
        </DragOverlay>
      </DndContext>


      {/* Request Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Request: {selectedRequest?.subject}</DialogTitle>
            <DialogDescription>
              Update the maintenance request details
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="mt-4">
              <MaintenanceForm
                request={selectedRequest}
                onClose={() => setSelectedRequest(null)}
                onSubmit={(data) => handleUpdateRequest(selectedRequest.id, data)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>


      {/* New Request Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Maintenance Request</DialogTitle>
            <DialogDescription>
              Fill in the details for the new maintenance request
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <MaintenanceForm 
              onClose={() => setShowForm(false)}
              onSubmit={handleNewRequest}
            />
          </div>
        </DialogContent>
      </Dialog>


      {/* Worksheet Sheet */}
      {worksheetRequest && (
        <WorksheetSheet
          request={worksheetRequest}
          open={!!worksheetRequest}
          onOpenChange={(open) => !open && setWorksheetRequest(null)}
        />
      )}

    </motion.div>
  );
}