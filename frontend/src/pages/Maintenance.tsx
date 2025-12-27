import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  Save,
  Download,
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

// Local storage keys
const LOCAL_STORAGE_KEYS = {
  WORKSHEET_COMMENTS: 'maintenance-worksheet-comments',
  REQUESTS_BACKUP: 'maintenance-requests-backup',
  MAINTENANCE_REQUESTS: 'maintenance-requests-data'
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
  const [comments, setComments] = useState<WorksheetComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Load comments from localStorage when sheet opens
  useEffect(() => {
    if (open && request?.id) {
      loadComments(request.id);
    }
  }, [open, request?.id]);

  // Scroll to bottom when new comments are added
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  // Load comments from localStorage
  const loadComments = (requestId: string) => {
    try {
      const savedComments = localStorage.getItem(LOCAL_STORAGE_KEYS.WORKSHEET_COMMENTS);
      if (savedComments) {
        const allComments: WorksheetComment[] = JSON.parse(savedComments);
        const requestComments = allComments.filter(comment => comment.requestId === requestId);
        setComments(requestComments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
      setComments([]);
    }
  };

  // Save comments to localStorage
  const saveCommentsToStorage = (commentsToSave: WorksheetComment[]) => {
    try {
      const savedComments = localStorage.getItem(LOCAL_STORAGE_KEYS.WORKSHEET_COMMENTS);
      let allComments: WorksheetComment[] = [];
      
      if (savedComments) {
        allComments = JSON.parse(savedComments);
        // Remove existing comments for this request
        allComments = allComments.filter(comment => comment.requestId !== request.id);
      }
      
      // Add new comments
      allComments = [...allComments, ...commentsToSave];
      localStorage.setItem(LOCAL_STORAGE_KEYS.WORKSHEET_COMMENTS, JSON.stringify(allComments));
    } catch (error) {
      console.error("Error saving comments:", error);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !request?.id) return;
    
    const comment: WorksheetComment = {
      id: Date.now().toString(),
      text: newComment,
      author: "Current User", // In real app, get from auth context
      timestamp: new Date().toLocaleString(),
      requestId: request.id,
    };
    
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    saveCommentsToStorage(updatedComments);
    setNewComment("");
  };

  // Generate PDF for this specific worksheet
  const handleGenerateWorksheetPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text(`Maintenance Worksheet - ${request.subject}`, 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);
    
    // Request Details
    doc.setFontSize(12);
    doc.text("Request Details:", 14, 45);
    
    const requestDetails = [
      ["Equipment:", request.equipment],
      ["Priority:", request.priority],
      ["Technician:", request.technician],
      ["Status:", request.stage],
      ["Duration:", request.duration],
      ["Created:", new Date(request.createdAt).toLocaleDateString()],
    ];
    
    autoTable(doc, {
      startY: 50,
      head: [['Field', 'Value']],
      body: requestDetails,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });
    
    // Comments Section
    let finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.text("Work Comments:", 14, finalY);
    finalY += 10;
    
    if (comments.length > 0) {
      const commentRows = comments.map(comment => [
        comment.timestamp,
        comment.author,
        comment.text
      ]);
      
      autoTable(doc, {
        startY: finalY,
        head: [['Timestamp', 'Author', 'Comment']],
        body: commentRows,
        theme: 'grid',
        headStyles: { fillColor: [39, 174, 96] },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 40 },
          2: { cellWidth: 110 }
        },
      });
    } else {
      doc.text("No comments added yet.", 14, finalY);
    }
    
    doc.save(`worksheet-${request.id}-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Worksheet - {request.subject}</span>
            <Button 
              onClick={handleGenerateWorksheetPDF} 
              size="sm" 
              variant="outline"
              className="h-8"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </SheetTitle>
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
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <p className="font-medium">{request.duration}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Created:</span>
                <p className="font-medium">{new Date(request.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          {/* Comments Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Work Comments ({comments.length})
              </h3>
              <Badge variant="outline">
                {comments.length} comment{comments.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
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
              
              {comments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No comments yet. Add the first comment below.
                </div>
              )}
              <div ref={commentsEndRef} />
            </div>

            {/* Add Comment */}
            <div className="space-y-2">
              <Textarea
                placeholder="Add a comment about the work..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleAddComment();
                  }
                }}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Press Ctrl+Enter to submit
                </span>
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
  const { requests, updateRequest, addRequest, setRequests } = useMaintenanceRequests();
  const { equipment, updateEquipment } = useEquipment();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEquipment, setFilterEquipment] = useState<string | null>(null);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);
  const [worksheetRequest, setWorksheetRequest] =
    useState<MaintenanceRequest | null>(null);

  const [showForm, setShowForm] = useState(false);

  // Initialize data from localStorage on mount
  useEffect(() => {
    loadDataFromStorage();
  }, []);

  // Get equipment filter from URL on mount
  useEffect(() => {
    const equipmentParam = searchParams.get("equipment");
    if (equipmentParam) {
      setFilterEquipment(decodeURIComponent(equipmentParam));
    }
  }, [searchParams]);

  // Load data from localStorage
  const loadDataFromStorage = () => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEYS.MAINTENANCE_REQUESTS);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setRequests(parsedData);
      }
    } catch (error) {
      console.error("Error loading data from storage:", error);
    }
  };

  // Save data to localStorage whenever requests change
  useEffect(() => {
    if (requests.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.MAINTENANCE_REQUESTS, JSON.stringify(requests));
    }
  }, [requests]);

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

  // Generate PDF report for all data
  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text("Maintenance Requests Report", 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);
    doc.text(`Total Requests: ${requests.length}`, 14, 42);
    
    // Summary by Stage
    doc.setFontSize(12);
    doc.text("Summary by Stage:", 14, 55);
    
    const stageSummary = stages.map(stage => {
      const count = requests.filter(r => r.stage === stage.id).length;
      return [stage.label, count.toString()];
    });
    
    autoTable(doc, {
      startY: 60,
      head: [['Stage', 'Count']],
      body: stageSummary,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });
    
    // All Requests Table
    let finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.text("All Maintenance Requests:", 14, finalY);
    finalY += 10;
    
    const requestRows = requests.map(request => [
      request.id,
      request.subject,
      request.equipment,
      request.priority,
      request.stage,
      request.technician,
      request.duration,
      new Date(request.createdAt).toLocaleDateString()
    ]);
    
    autoTable(doc, {
      startY: finalY,
      head: [['ID', 'Subject', 'Equipment', 'Priority', 'Stage', 'Technician', 'Duration', 'Created']],
      body: requestRows,
      theme: 'grid',
      headStyles: { fillColor: [39, 174, 96] },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20 },
        4: { cellWidth: 25 },
        5: { cellWidth: 30 },
        6: { cellWidth: 20 },
        7: { cellWidth: 25 }
      },
      styles: { fontSize: 8 },
      pageBreak: 'auto',
      margin: { top: 20 }
    });
    
    doc.save(`maintenance-report-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  // Save all data to localStorage backup
  const handleSaveAllData = () => {
    try {
      const dataToSave = {
        requests,
        equipment,
        comments: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.WORKSHEET_COMMENTS) || '[]'),
        savedAt: new Date().toISOString(),
      };
      
      localStorage.setItem(LOCAL_STORAGE_KEYS.REQUESTS_BACKUP, JSON.stringify(dataToSave));
      alert("All data backed up successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data!");
    }
  };

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

  // Handle new request creation - will be persisted automatically via useEffect
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

      {/* Header with Worksheet and Save buttons */}
      <div className="flex items-center justify-between py-2">
        <h1 className="text-2xl font-bold">Maintenance Teams</h1>

        <div className="flex gap-2">
          {/* Worksheet Button - opens worksheet sheet when clicked */}
          <Button 
            onClick={() => {
              // If you want a global worksheet, show a different view
              // For now, we'll show the first request's worksheet or open a global view
              if (requests.length > 0) {
                setWorksheetRequest(requests[0]);
              } else {
                alert("No requests available to open worksheet");
              }
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Open Worksheet
          </Button>
          
          {/* Save All Data as PDF */}
          <Button 
            onClick={handleGeneratePDF}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          
          <Button onClick={() => setShowForm(true)} variant="hero">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
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
        
        {/* Data Info */}
        <div className="text-sm text-muted-foreground">
          {requests.length} request{requests.length !== 1 ? 's' : ''} • Auto-saved
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