import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  DndContext,
  DragOverlay,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
  mockMaintenanceRequests,
  MaintenanceRequest,
} from "@/data/mockData";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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


/* ────────────────────────────────────────────── */
/* KANBAN CARD */
/* ────────────────────────────────────────────── */

function KanbanCard({
  request,
  onClick,
}: {
  request: MaintenanceRequest;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: request.id });

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
}: {
  stage: { id: Stage; label: string; color: string };
  requests: MaintenanceRequest[];
  onCardClick: (r: MaintenanceRequest) => void;
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
              <KanbanCard key={r.id} request={r} onClick={() => onCardClick(r)} />
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
  const [requests, setRequests] = useState(mockMaintenanceRequests);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);

  const [showForm, setShowForm] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  /* FILTER ONLY IN KANBAN SEARCH BAR */
  const filteredRequests = requests.filter(r =>
    r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.technician.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.equipment?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

    setRequests(prev =>
      prev.map(r =>
        r.id === active.id ? { ...r, stage: overReq.stage } : r
      )
    );
  };

  const activeRequest = activeId
    ? requests.find(r => r.id === activeId)
    : null;


  /* UI */

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

      {/* Header (No Global Search — Only Title + Button) */}
      <div className="flex items-center justify-between py-2">
        <h1 className="text-2xl font-bold">Maintenance Teams</h1>

        <Button onClick={() => setShowForm(true)} variant="hero">
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>


      {/* ✅ BELOW SEARCH BAR — THIS ONE STAYS */}
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
        collisionDetection={closestCorners}
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


      {/* New Request */}
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
