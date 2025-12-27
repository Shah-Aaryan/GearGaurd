import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, AlertCircle, Info, Calendar, Wrench, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
  type?: "info" | "warning" | "success" | "error";
}

interface EquipmentData {
  id: string;
  name: string;
  serialNumber: string;
  department: string;
  assignedTo: string;
  status: "operational" | "maintenance" | "scrapped";
  openRequests: number;
}

interface TeamData {
  id: string;
  name: string;
  members: number;
  openRequests: number;
}

interface RequestData {
  id: string;
  subject: string;
  equipment: string;
  type: "corrective" | "preventive";
  status: "new" | "in_progress" | "repaired" | "scrap";
  assignedTo: string;
  scheduledDate?: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content: "Hello! I'm your GearGuard assistant. I can help you with equipment tracking, maintenance requests, team management, and workflow guidance. Ask me anything about the maintenance tracker system!",
      timestamp: new Date(),
      type: "info"
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Mock data for dynamic responses
  const [equipmentData] = useState<EquipmentData[]>([
    { id: '1', name: 'CNC Machine A-100', serialNumber: 'CNC-2024-001', department: 'Production', assignedTo: 'John Smith', status: 'operational', openRequests: 2 },
    { id: '2', name: 'Industrial Printer 01', serialNumber: 'PRN-2024-002', department: 'Printing', assignedTo: 'Sarah Chen', status: 'maintenance', openRequests: 1 },
    { id: '3', name: 'Laptop Dell XPS', serialNumber: 'LT-2024-003', department: 'IT', assignedTo: 'Mike Johnson', status: 'operational', openRequests: 0 },
  ]);
  
  const [teamData] = useState<TeamData[]>([
    { id: '1', name: 'Mechanics Team', members: 4, openRequests: 3 },
    { id: '2', name: 'Electricians', members: 3, openRequests: 2 },
    { id: '3', name: 'IT Support', members: 5, openRequests: 1 },
  ]);
  
  const [requestData] = useState<RequestData[]>([
    { id: '1', subject: 'Leaking Oil', equipment: 'CNC Machine A-100', type: 'corrective', status: 'in_progress', assignedTo: 'Alex Brown', scheduledDate: '2024-12-15' },
    { id: '2', subject: 'Routine Checkup', equipment: 'Industrial Printer 01', type: 'preventive', status: 'new', assignedTo: 'Unassigned', scheduledDate: '2024-12-20' },
    { id: '3', subject: 'Keyboard Replacement', equipment: 'Laptop Dell XPS', type: 'corrective', status: 'repaired', assignedTo: 'Jane Wilson', scheduledDate: '2024-12-10' },
  ]);

  const generateResponse = (query: string): { text: string; type: Message['type'] } => {
    const lowerQuery = query.toLowerCase();
    
    // Equipment related queries
    if (lowerQuery.includes('equipment') || lowerQuery.includes('machine') || lowerQuery.includes('asset')) {
      if (lowerQuery.includes('list') || lowerQuery.includes('show') || lowerQuery.includes('all')) {
        const equipmentList = equipmentData.map(eq => 
          `${eq.name} (${eq.serialNumber}) - ${eq.department} - ${eq.openRequests} open requests`
        ).join('\n• ');
        return {
          text: `📋 **Current Equipment List:**\n\n• ${equipmentList}\n\nTotal: ${equipmentData.length} equipment items tracked.`,
          type: 'info'
        };
      }
      
      if (lowerQuery.includes('cnc') || lowerQuery.includes('a-100')) {
        const cnc = equipmentData.find(eq => eq.name.includes('CNC'));
        return {
          text: `🔧 **CNC Machine A-100 Status:**\n• Serial: ${cnc?.serialNumber}\n• Department: ${cnc?.department}\n• Assigned to: ${cnc?.assignedTo}\n• Status: ${cnc?.status}\n• Open Requests: ${cnc?.openRequests}\n\nTo track this equipment, use the search feature or group by department in the Equipment section.`,
          type: 'info'
        };
      }
      
      if (lowerQuery.includes('status') || lowerQuery.includes('operational')) {
        const operational = equipmentData.filter(eq => eq.status === 'operational').length;
        const maintenance = equipmentData.filter(eq => eq.status === 'maintenance').length;
        return {
          text: `📊 **Equipment Status Overview:**\n• Operational: ${operational} machines\n• Under Maintenance: ${maintenance} machines\n• Scrapped: ${equipmentData.filter(eq => eq.status === 'scrapped').length} machines\n\nGo to Equipment → Tracking to see detailed status by department or employee.`,
          type: 'info'
        };
      }
      
      return {
        text: "I can help you with equipment information! You can:\n• View all equipment\n• Check specific machine status (e.g., 'CNC Machine status')\n• Track equipment by department or employee\n• See warranty information\n\nWhat specific equipment information do you need?",
        type: 'info'
      };
    }

    // Maintenance team related queries
    if (lowerQuery.includes('team') || lowerQuery.includes('technician') || lowerQuery.includes('member')) {
      if (lowerQuery.includes('list') || lowerQuery.includes('all')) {
        const teamList = teamData.map(team => 
          `${team.name} - ${team.members} members - ${team.openRequests} open requests`
        ).join('\n• ');
        return {
          text: `👥 **Maintenance Teams:**\n\n• ${teamList}\n\nRemember: When a request is created for a specific team, only team members can pick it up.`,
          type: 'info'
        };
      }
      
      if (lowerQuery.includes('mechanic') || lowerQuery.includes('mechanics')) {
        const mechanics = teamData.find(t => t.name.includes('Mechanics'));
        return {
          text: `🔧 **Mechanics Team:**\n• Members: ${mechanics?.members}\n• Open Requests: ${mechanics?.openRequests}\n\nThis team handles mechanical repairs and maintenance. Team members are automatically assigned to mechanical equipment requests.`,
          type: 'info'
        };
      }
      
      return {
        text: "Teams manage maintenance work in GearGuard. Each equipment has a default assigned team. You can:\n• View all teams\n• Check team workload\n• Assign technicians to teams\n• Create specialized teams (Mechanics, Electricians, IT Support)\n\nNeed specific team information?",
        type: 'info'
      };
    }

    // Maintenance request related queries
    if (lowerQuery.includes('request') || lowerQuery.includes('maintenance') || lowerQuery.includes('ticket') || lowerQuery.includes('repair')) {
      if (lowerQuery.includes('create') || lowerQuery.includes('new') || lowerQuery.includes('make')) {
        return {
          text: "📝 **To create a maintenance request:**\n1. Go to Maintenance section\n2. Click 'New Request'\n3. Select Equipment → system auto-fills team\n4. Choose type: Corrective (breakdown) or Preventive (routine)\n5. Set scheduled date for preventive requests\n\nThe request starts in 'New' stage and moves through workflow stages.",
          type: 'info'
        };
      }
      
      if (lowerQuery.includes('kanban') || lowerQuery.includes('board') || lowerQuery.includes('stage')) {
        const stages = {
          new: requestData.filter(r => r.status === 'new').length,
          in_progress: requestData.filter(r => r.status === 'in_progress').length,
          repaired: requestData.filter(r => r.status === 'repaired').length,
          scrap: requestData.filter(r => r.status === 'scrap').length
        };
        return {
          text: `📋 **Kanban Board Status:**\n• New: ${stages.new} requests\n• In Progress: ${stages.in_progress} requests\n• Repaired: ${stages.repaired} requests\n• Scrap: ${stages.scrap} requests\n\nDrag & drop cards between stages. Red indicators show overdue requests.`,
          type: 'info'
        };
      }
      
      if (lowerQuery.includes('corrective') || lowerQuery.includes('breakdown')) {
        const corrective = requestData.filter(r => r.type === 'corrective');
        return {
          text: `⚠️ **Corrective (Breakdown) Requests:** ${corrective.length} active\n• These are unplanned repairs\n• Example: ${corrective[0]?.subject || 'Leaking Oil'}\n• Workflow: New → In Progress → Repaired\n\nAuto-fill: Selecting equipment auto-fetches maintenance team.`,
          type: 'warning'
        };
      }
      
      if (lowerQuery.includes('preventive') || lowerQuery.includes('routine') || lowerQuery.includes('calendar')) {
        const preventive = requestData.filter(r => r.type === 'preventive');
        return {
          text: `📅 **Preventive (Routine) Requests:** ${preventive.length} scheduled\n• Planned maintenance checkups\n• Appear in Calendar View\n• Scheduled date required\n\nCheck Calendar View to see all preventive maintenance scheduled dates.`,
          type: 'info'
        };
      }
      
      return {
        text: `🛠️ **Maintenance Requests Overview:**\n• Total Requests: ${requestData.length}\n• Types: Corrective (breakdown) & Preventive (routine)\n• Stages: New → In Progress → Repaired/Scrap\n\nSmart Features:\n• Equipment form has 'Maintenance' button showing open request count\n• Calendar view for preventive maintenance\n• Auto-team assignment from equipment`,
        type: 'info'
      };
    }

    // Workflow related queries
    if (lowerQuery.includes('workflow') || lowerQuery.includes('process') || lowerQuery.includes('flow')) {
      if (lowerQuery.includes('breakdown') || lowerQuery.includes('corrective flow')) {
        return {
          text: "🔄 **Breakdown Workflow:**\n1. User creates Corrective request\n2. Select Equipment → auto-fills team\n3. Request starts in 'New' stage\n4. Technician assigns themselves\n5. Move to 'In Progress'\n6. Record hours spent (Duration)\n7. Move to 'Repaired' when done\n\nDuration field tracks repair time.",
          type: 'info'
        };
      }
      
      if (lowerQuery.includes('preventive flow') || lowerQuery.includes('routine flow')) {
        return {
          text: "📅 **Preventive Workflow:**\n1. Create Preventive request\n2. Set Scheduled Date (required)\n3. Request appears in Calendar View\n4. Technician sees scheduled job\n5. Execute on scheduled date\n6. Record completion\n\nUse Calendar View to manage preventive schedules.",
          type: 'info'
        };
      }
      
      return {
        text: "⚙️ **GearGuard Workflows:**\n\n1. **Breakdown (Corrective):** Emergency repairs\n2. **Routine (Preventive):** Scheduled maintenance\n\nKey Features:\n• Auto-team assignment from equipment\n• Kanban board with drag & drop\n• Calendar view for preventive\n• Smart buttons with request counts\n\nWhich workflow interests you?",
        type: 'info'
      };
    }

    // Greetings and general help
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
      return {
        text: "Hello! I'm your GearGuard Assistant. I can help you with:\n\n🔧 Equipment tracking & status\n👥 Team management\n📝 Maintenance requests\n🔄 Workflow guidance\n📊 System overview\n\nWhat would you like to know about?",
        type: 'info'
      };
    }

    if (lowerQuery.includes('help') || lowerQuery.includes('what can you do')) {
      return {
        text: "🛠️ **I can assist with:**\n\n**Equipment:**\n• Track machines by department/employee\n• Check warranty & purchase info\n• View equipment status\n\n**Teams:**\n• Team member assignments\n• Workload distribution\n• Specialized team setup\n\n**Requests:**\n• Create corrective/preventive requests\n• Track request stages\n• Calendar scheduling\n• Scrap management\n\n**Workflow:**\n• Breakdown repair process\n• Routine maintenance flow\n• Kanban board guidance\n\nJust ask about any of these!",
        type: 'info'
      };
    }

    // Out of context queries
    const unrelatedKeywords = [
      'weather', 'sports', 'news', 'movie', 'music', 'joke', 'funny',
      'politics', 'entertainment', 'gossip', 'random', 'tell me about',
      'who is', 'what is', 'how to cook', 'recipe', 'game', 'sport'
    ];

    if (unrelatedKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return {
        text: "⚠️ **Out of Context Warning:**\nI'm specifically designed to help with GearGuard Maintenance Tracker system. I can only assist with:\n• Equipment & asset management\n• Maintenance teams & workflows\n• Request tracking & scheduling\n• System features & guidance\n\nPlease ask questions related to maintenance tracking, equipment, or system workflows.",
        type: 'warning'
      };
    }

    // Default response for related but unclear queries
    return {
      text: "I'm here to help with GearGuard Maintenance Tracker! You can ask about:\n• Specific equipment status\n• Creating maintenance requests\n• Team assignments and workload\n• Workflow processes (breakdown/routine)\n• System features and smart buttons\n• Calendar view and scheduling\n\nCould you be more specific about what you need help with?",
      type: 'info'
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Generate dynamic response based on query
    setTimeout(() => {
      const response = generateResponse(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: response.text,
        timestamp: new Date(),
        type: response.type
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getIcon = (type?: Message['type']) => {
    switch (type) {
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'success': return <Info className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getMessageColor = (type?: Message['type']) => {
    switch (type) {
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700';
      case 'error': return 'bg-red-500/10 border-red-500/20 text-red-700';
      case 'success': return 'bg-green-500/10 border-green-500/20 text-green-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const quickQuestions = [
    "Show equipment list",
    "How to create a request?",
    "Team workload status",
    "Kanban board overview"
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full gradient-primary shadow-lg hover:shadow-xl"
          size="icon"
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MessageCircle className="h-6 w-6" />
            )}
          </motion.div>
        </Button>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b gradient-primary p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-foreground">GearGuard Assistant</h3>
                <p className="text-xs text-primary-foreground/80">Maintenance Tracker AI</p>
              </div>
            </div>

            {/* Quick Questions */}
            <div className="px-4 py-2 border-b bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInput(question);
                      setTimeout(() => handleSend(), 100);
                    }}
                    className="text-xs h-auto px-3 py-1"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="h-80 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        message.role === "user"
                          ? "gradient-secondary"
                          : message.type === 'warning' ? 'bg-yellow-500/20' :
                            message.type === 'error' ? 'bg-red-500/20' :
                            message.type === 'success' ? 'bg-green-500/20' :
                            'bg-muted'
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-4 w-4 text-secondary-foreground" />
                      ) : (
                        getIcon(message.type)
                      )}
                    </div>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 border ${
                        message.role === "user"
                          ? "gradient-secondary text-secondary-foreground"
                          : `${getMessageColor(message.type)}`
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="rounded-2xl bg-muted px-4 py-3">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                          className="h-2 w-2 rounded-full bg-muted-foreground/50"
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                          className="h-2 w-2 rounded-full bg-muted-foreground/50"
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                          className="h-2 w-2 rounded-full bg-muted-foreground/50"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about equipment, requests, teams, or workflows..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Ask about: <Wrench className="w-3 h-3 inline mx-1" /> Equipment • 
                <Users className="w-3 h-3 inline mx-1" /> Teams • 
                <Calendar className="w-3 h-3 inline mx-1" /> Requests
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}