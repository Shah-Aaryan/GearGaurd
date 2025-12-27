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
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCalendarEvents, CalendarEvent } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MaintenanceForm } from "@/components/maintenance/MaintenanceForm";

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);

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

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return mockCalendarEvents.filter(
      (event) => event.date === format(date, "yyyy-MM-dd")
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

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
            const events = getEventsForDate(dayDate);
            const isCurrentMonth = isSameMonth(dayDate, currentDate);
            const isToday = isSameDay(dayDate, new Date());

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`min-h-[100px] rounded-lg border p-2 transition-colors cursor-pointer hover:bg-accent ${
                  isCurrentMonth ? "bg-card" : "bg-muted/30"
                } ${isToday ? "ring-2 ring-primary" : ""}`}
                onClick={() => handleDateClick(dayDate)}
              >
                <div
                  className={`text-sm font-medium mb-1 ${
                    isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                  } ${isToday ? "text-primary" : ""}`}
                >
                  {format(dayDate, "d")}
                </div>
                <div className="space-y-1">
                  {events.slice(0, 2).map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-xs p-1 rounded truncate ${
                        event.type === "preventive"
                          ? "bg-success/20 text-success"
                          : "bg-warning/20 text-warning"
                      }`}
                    >
                      {event.title}
                    </motion.div>
                  ))}
                  {events.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{events.length - 2} more
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
            <div className="h-3 w-3 rounded bg-success/20" />
            <span className="text-sm text-muted-foreground">Preventive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-warning/20" />
            <span className="text-sm text-muted-foreground">Corrective</span>
          </div>
        </div>
      </Card>

      {/* Upcoming Events */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Maintenance</h3>
        <div className="space-y-3">
          {mockCalendarEvents.slice(0, 4).map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {format(new Date(event.date), "d")}
                </div>
                <div className="text-xs text-muted-foreground uppercase">
                  {format(new Date(event.date), "MMM")}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {event.equipment} • {event.technician}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={
                  event.type === "preventive"
                    ? "bg-success/20 text-success"
                    : "bg-warning/20 text-warning"
                }
              >
                {event.type}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>

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
