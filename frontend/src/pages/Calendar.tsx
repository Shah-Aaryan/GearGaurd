import { useState } from "react";
import { motion } from "framer-motion";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockMaintenanceRequests, MaintenanceRequest } from "@/data/mockData";
import { useMaintenanceRequests } from "@/context/MaintenanceContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MaintenanceForm } from "@/components/maintenance/MaintenanceForm";
import { ScrollArea } from "@/components/ui/scroll-area";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export default function Calendar() {
  const { requests } = useMaintenanceRequests();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  // Get maintenance requests for a specific date
  const getRequestsForDate = (date: Date): MaintenanceRequest[] => {
    const dateStr = format(date, "yyyy-MM-dd");
    return requests.filter(
      (req) => {
        try {
          // Use scheduledDate field from the MaintenanceRequest
          const reqDate = parseISO(req.scheduledDate);
          return format(reqDate, "yyyy-MM-dd") === dateStr && 
                 (req.stage === "new" || req.stage === "in-progress");
        } catch {
          return false;
        }
      }
    );
  };

  const handleDateClick = (date: Date) => {
    const reqs = getRequestsForDate(date);
    if (reqs.length > 0) {
      setSelectedDate(date);
      setShowDetails(true);
    } else {
      setSelectedDate(date);
      setShowForm(true);
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "new":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-info" />;
      default:
        return <CheckCircle className="h-4 w-4 text-success" />;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "new":
        return "bg-warning/20 text-warning";
      case "in-progress":
        return "bg-info/20 text-info";
      default:
        return "bg-success/20 text-success";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Calendar</h1>
          <p className="text-muted-foreground">
            Schedule and view preventive maintenance tasks
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} variant="hero">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Maintenance
        </Button>
      </div>

      {/* Calendar */}
      <Card className="p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
            <div
              key={dayName}
              className="p-2 text-center text-sm font-medium text-muted-foreground"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-7 gap-1"
        >
          {days.map((dayDate, index) => {
            const dayRequests = getRequestsForDate(dayDate);
            const isCurrentMonth = isSameMonth(dayDate, currentDate);
            const isToday = isSameDay(dayDate, new Date());

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`min-h-[120px] rounded-lg border p-2 transition-colors cursor-pointer hover:bg-accent ${
                  isCurrentMonth ? "bg-card" : "bg-muted/30"
                } ${isToday ? "ring-2 ring-primary" : ""} ${dayRequests.length > 0 ? "border-primary/50" : ""}`}
                onClick={() => handleDateClick(dayDate)}
              >
                <div
                  className={`text-sm font-medium mb-2 ${
                    isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                  } ${isToday ? "text-primary" : ""}`}
                >
                  {format(dayDate, "d")}
                </div>
                <div className="space-y-1">
                  {dayRequests.slice(0, 3).map((req) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-xs p-1 rounded truncate flex items-center gap-1 ${getStageColor(req.stage)}`}
                    >
                      {getStageIcon(req.stage)}
                      <span className="truncate">{req.subject}</span>
                    </motion.div>
                  ))}
                  {dayRequests.length > 3 && (
                    <div className="text-xs text-muted-foreground pl-1">
                      +{dayRequests.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Legend */}
        <div className="mt-6 flex gap-6 justify-center">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-sm text-muted-foreground">New Request</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-info" />
            <span className="text-sm text-muted-foreground">In Progress</span>
          </div>
        </div>
      </Card>

      {/* Upcoming Events */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Maintenance Requests</h3>
        <div className="space-y-3">
          {requests
            .filter((req) => req.stage === "new" || req.stage === "in-progress")
            .sort((a, b) => {
              try {
                const dateA = parseISO(a.scheduledDate).getTime();
                const dateB = parseISO(b.scheduledDate).getTime();
                return dateA - dateB;
              } catch {
                return 0;
              }
            })
            .slice(0, 5)
            .map((req, index) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              onClick={() => {
                setSelectedDate(new Date());
                setShowDetails(true);
              }}
            >
              <div className={`p-2 rounded ${getStageColor(req.stage)}`}>
                {getStageIcon(req.stage)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{req.subject}</h4>
                <p className="text-sm text-muted-foreground">
                  {req.equipment} ΓÇó {req.technician}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Scheduled: {format(parseISO(req.scheduledDate), "MMM d, yyyy")}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={getStageColor(req.stage)}
              >
                {req.stage}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Details Dialog - Show all requests for selected date */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedDate
                ? `Maintenance Requests for ${format(selectedDate, "MMMM d, yyyy")}`
                : "Maintenance Requests"}
            </DialogTitle>
            <DialogDescription>
              Click on a request to view full details
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {selectedDate && getRequestsForDate(selectedDate).length > 0 ? (
                getRequestsForDate(selectedDate).map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">{req.subject}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Equipment: <span className="font-medium">{req.equipment}</span>
                        </p>
                      </div>
                      <Badge className={getStageColor(req.stage)}>
                        {req.stage}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Technician</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={req.technicianAvatar} />
                            <AvatarFallback>
                              {req.technician.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{req.technician}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Priority</p>
                        <Badge variant="secondary" className="mt-1 capitalize">
                          {req.priority}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-medium mt-1">{req.duration}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Work Center</p>
                        <p className="font-medium mt-1">{req.workCenter}</p>
                      </div>
                    </div>

                    {req.isOverdue && (
                      <div className="p-2 rounded bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        This request is overdue
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No maintenance requests scheduled for this date
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* New Maintenance Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDate
                ? `Schedule Maintenance for ${format(selectedDate, "MMMM d, yyyy")}`
                : "Schedule Maintenance"}
            </DialogTitle>
          </DialogHeader>
          <MaintenanceForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
