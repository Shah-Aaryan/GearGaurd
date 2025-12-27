// Mock data for GearGuard Maintenance Management System

export interface Equipment {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  company: string;
  employee: string;
  technician: string;
  maintenanceTeam: string;
  assignedDate: string;
  description: string;
  health: number;
  status: 'operational' | 'maintenance' | 'critical' | 'scrapped';
  openRequests: number;
  isScrapped?: boolean;
  scrapDate?: string;
  scrapReason?: string;
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  type: 'corrective' | 'preventive';
  equipment?: string;
  workCenter?: string;
  category: string;
  maintenanceTeam: string;
  technician: string;
  technicianAvatar: string;
  scheduledDate: string;
  duration: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  stage: 'new' | 'in-progress' | 'repaired' | 'scrap';
  employee: string;
  company: string;
  notes: string;
  instructions: string;
  isOverdue: boolean;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  company: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  utilization: number;
}

export interface WorkCenter {
  id: string;
  name: string;
  code: string;
  tag: string;
  alternativeWorkCenters: string[];
  costPerHour: number;
  capacityTimeEfficiency: number;
  oeeTarget: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'preventive' | 'corrective';
  equipment: string;
  technician: string;
}

// Mock Equipment Data
export const mockEquipment: Equipment[] = [
  {
    id: 'eq-001',
    name: 'CNC Milling Machine A1',
    category: 'Machine Tools',
    serialNumber: 'CNC-2024-001',
    company: 'GearGuard Industries',
    employee: 'John Smith',
    technician: 'Mike Johnson',
    maintenanceTeam: 'Machine Shop Team',
    assignedDate: '2024-01-15',
    description: 'High-precision 5-axis CNC milling machine for complex parts manufacturing.',
    health: 85,
    status: 'operational',
    openRequests: 2,
  },
  {
    id: 'eq-002',
    name: 'Industrial Robot Arm R2',
    category: 'Robotics',
    serialNumber: 'ROB-2024-002',
    company: 'GearGuard Industries',
    employee: 'Sarah Williams',
    technician: 'Alex Chen',
    maintenanceTeam: 'Automation Team',
    assignedDate: '2024-02-20',
    description: '6-axis industrial robot for assembly line operations.',
    health: 92,
    status: 'operational',
    openRequests: 0,
  },
  {
    id: 'eq-003',
    name: 'Hydraulic Press HP-500',
    category: 'Press Equipment',
    serialNumber: 'HYD-2024-003',
    company: 'GearGuard Industries',
    employee: 'Tom Brown',
    technician: 'Mike Johnson',
    maintenanceTeam: 'Heavy Equipment Team',
    assignedDate: '2024-03-10',
    description: '500-ton hydraulic press for metal forming operations.',
    health: 25,
    status: 'critical',
    openRequests: 3,
  },
  {
    id: 'eq-004',
    name: 'Laser Cutting System LC-1',
    category: 'Cutting Equipment',
    serialNumber: 'LAS-2024-004',
    company: 'GearGuard Industries',
    employee: 'Emily Davis',
    technician: 'Alex Chen',
    maintenanceTeam: 'Machine Shop Team',
    assignedDate: '2024-04-05',
    description: 'High-power fiber laser cutting system for sheet metal.',
    health: 78,
    status: 'operational',
    openRequests: 1,
  },
  {
    id: 'eq-005',
    name: 'Assembly Conveyor Belt C3',
    category: 'Conveyors',
    serialNumber: 'CON-2024-005',
    company: 'GearGuard Industries',
    employee: 'James Wilson',
    technician: 'Lisa Park',
    maintenanceTeam: 'Automation Team',
    assignedDate: '2024-05-12',
    description: 'Modular conveyor system for product assembly line.',
    health: 45,
    status: 'maintenance',
    openRequests: 2,
  },
  {
    id: 'eq-006',
    name: 'Air Compressor AC-200',
    category: 'Utilities',
    serialNumber: 'AIR-2024-006',
    company: 'GearGuard Industries',
    employee: 'Michael Lee',
    technician: 'Lisa Park',
    maintenanceTeam: 'Facilities Team',
    assignedDate: '2024-06-18',
    description: 'Industrial air compressor for pneumatic tools and systems.',
    health: 88,
    status: 'operational',
    openRequests: 0,
  },
];

// Mock Maintenance Requests
export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'mr-001',
    subject: 'Spindle bearing replacement',
    type: 'corrective',
    equipment: 'CNC Milling Machine A1',
    category: 'Mechanical',
    maintenanceTeam: 'Machine Shop Team',
    technician: 'Mike Johnson',
    technicianAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    scheduledDate: '2025-12-28',
    duration: '4 hours',
    priority: 'high',
    stage: 'in-progress',
    employee: 'John Smith',
    company: 'GearGuard Industries',
    notes: 'Unusual noise detected during operation. Bearing shows signs of wear.',
    instructions: '1. Lock out machine\n2. Remove spindle assembly\n3. Replace bearing\n4. Realign and test',
    isOverdue: false,
  },
  {
    id: 'mr-002',
    subject: 'Preventive lubrication service',
    type: 'preventive',
    equipment: 'Industrial Robot Arm R2',
    category: 'Lubrication',
    maintenanceTeam: 'Automation Team',
    technician: 'Alex Chen',
    technicianAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    scheduledDate: '2025-12-30',
    duration: '2 hours',
    priority: 'medium',
    stage: 'new',
    employee: 'Sarah Williams',
    company: 'GearGuard Industries',
    notes: 'Scheduled quarterly lubrication service.',
    instructions: 'Apply specified lubricant to all joint points according to manual.',
    isOverdue: false,
  },
  {
    id: 'mr-003',
    subject: 'Hydraulic system failure',
    type: 'corrective',
    equipment: 'Hydraulic Press HP-500',
    category: 'Hydraulics',
    maintenanceTeam: 'Heavy Equipment Team',
    technician: 'Mike Johnson',
    technicianAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    scheduledDate: '2025-12-25',
    duration: '8 hours',
    priority: 'urgent',
    stage: 'in-progress',
    employee: 'Tom Brown',
    company: 'GearGuard Industries',
    notes: 'Complete hydraulic system overhaul required. Multiple seal failures detected.',
    instructions: '1. Drain hydraulic fluid\n2. Replace all seals\n3. Check pump\n4. Refill and test',
    isOverdue: true,
  },
  {
    id: 'mr-004',
    subject: 'Laser alignment calibration',
    type: 'preventive',
    equipment: 'Laser Cutting System LC-1',
    category: 'Calibration',
    maintenanceTeam: 'Machine Shop Team',
    technician: 'Alex Chen',
    technicianAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    scheduledDate: '2026-01-05',
    duration: '3 hours',
    priority: 'medium',
    stage: 'new',
    employee: 'Emily Davis',
    company: 'GearGuard Industries',
    notes: 'Monthly calibration check scheduled.',
    instructions: 'Perform full optical alignment and power calibration.',
    isOverdue: false,
  },
  {
    id: 'mr-005',
    subject: 'Belt tension adjustment',
    type: 'corrective',
    equipment: 'Assembly Conveyor Belt C3',
    category: 'Mechanical',
    maintenanceTeam: 'Automation Team',
    technician: 'Lisa Park',
    technicianAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    scheduledDate: '2025-12-26',
    duration: '1 hour',
    priority: 'low',
    stage: 'repaired',
    employee: 'James Wilson',
    company: 'GearGuard Industries',
    notes: 'Belt slippage reported. Tension adjustment completed.',
    instructions: 'Adjust belt tensioner to specified torque.',
    isOverdue: false,
  },
  {
    id: 'mr-006',
    subject: 'Motor replacement',
    type: 'corrective',
    equipment: 'Assembly Conveyor Belt C3',
    category: 'Electrical',
    maintenanceTeam: 'Automation Team',
    technician: 'Lisa Park',
    technicianAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    scheduledDate: '2025-12-29',
    duration: '5 hours',
    priority: 'high',
    stage: 'new',
    employee: 'James Wilson',
    company: 'GearGuard Industries',
    notes: 'Drive motor showing signs of failure. Replacement ordered.',
    instructions: '1. Disconnect power\n2. Remove old motor\n3. Install new motor\n4. Test operation',
    isOverdue: false,
  },
  {
    id: 'mr-007',
    subject: 'Pressure valve inspection',
    type: 'preventive',
    equipment: 'Hydraulic Press HP-500',
    category: 'Safety',
    maintenanceTeam: 'Heavy Equipment Team',
    technician: 'Mike Johnson',
    technicianAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    scheduledDate: '2026-01-10',
    duration: '2 hours',
    priority: 'medium',
    stage: 'new',
    employee: 'Tom Brown',
    company: 'GearGuard Industries',
    notes: 'Annual safety valve inspection.',
    instructions: 'Test all pressure relief valves and document readings.',
    isOverdue: false,
  },
  {
    id: 'mr-008',
    subject: 'Scrap - Obsolete controller',
    type: 'corrective',
    equipment: 'CNC Milling Machine A1',
    category: 'Electrical',
    maintenanceTeam: 'Machine Shop Team',
    technician: 'Alex Chen',
    technicianAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    scheduledDate: '2025-12-20',
    duration: '0 hours',
    priority: 'low',
    stage: 'scrap',
    employee: 'John Smith',
    company: 'GearGuard Industries',
    notes: 'Old controller unit marked for disposal.',
    instructions: 'Follow e-waste disposal procedures.',
    isOverdue: false,
  },
];

// Mock Teams
export const mockTeams: Team[] = [
  {
    id: 'team-001',
    name: 'Machine Shop Team',
    company: 'GearGuard Industries',
    members: [
      { id: 'mem-001', name: 'Mike Johnson', role: 'Lead Technician', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', utilization: 85 },
      { id: 'mem-002', name: 'Alex Chen', role: 'Senior Technician', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', utilization: 72 },
      { id: 'mem-003', name: 'David Kim', role: 'Technician', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', utilization: 65 },
    ],
  },
  {
    id: 'team-002',
    name: 'Automation Team',
    company: 'GearGuard Industries',
    members: [
      { id: 'mem-004', name: 'Lisa Park', role: 'Lead Technician', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', utilization: 78 },
      { id: 'mem-005', name: 'Ryan Taylor', role: 'Senior Technician', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan', utilization: 82 },
    ],
  },
  {
    id: 'team-003',
    name: 'Heavy Equipment Team',
    company: 'GearGuard Industries',
    members: [
      { id: 'mem-006', name: 'Carlos Rodriguez', role: 'Lead Technician', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', utilization: 90 },
      { id: 'mem-007', name: 'Steve Adams', role: 'Technician', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Steve', utilization: 68 },
    ],
  },
  {
    id: 'team-004',
    name: 'Facilities Team',
    company: 'GearGuard Industries',
    members: [
      { id: 'mem-008', name: 'Jennifer White', role: 'Facilities Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer', utilization: 55 },
      { id: 'mem-009', name: 'Mark Thompson', role: 'Technician', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark', utilization: 60 },
    ],
  },
];

// Mock Work Centers
export const mockWorkCenters: WorkCenter[] = [
  {
    id: 'wc-001',
    name: 'Machining Center 1',
    code: 'MC-001',
    tag: 'Primary',
    alternativeWorkCenters: ['Machining Center 2'],
    costPerHour: 150,
    capacityTimeEfficiency: 85,
    oeeTarget: 80,
  },
  {
    id: 'wc-002',
    name: 'Machining Center 2',
    code: 'MC-002',
    tag: 'Secondary',
    alternativeWorkCenters: ['Machining Center 1'],
    costPerHour: 140,
    capacityTimeEfficiency: 82,
    oeeTarget: 78,
  },
  {
    id: 'wc-003',
    name: 'Assembly Line A',
    code: 'AL-001',
    tag: 'Primary',
    alternativeWorkCenters: ['Assembly Line B'],
    costPerHour: 120,
    capacityTimeEfficiency: 90,
    oeeTarget: 85,
  },
  {
    id: 'wc-004',
    name: 'Assembly Line B',
    code: 'AL-002',
    tag: 'Secondary',
    alternativeWorkCenters: ['Assembly Line A'],
    costPerHour: 115,
    capacityTimeEfficiency: 88,
    oeeTarget: 82,
  },
  {
    id: 'wc-005',
    name: 'Paint Booth',
    code: 'PB-001',
    tag: 'Specialized',
    alternativeWorkCenters: [],
    costPerHour: 200,
    capacityTimeEfficiency: 75,
    oeeTarget: 70,
  },
];

// Mock Calendar Events
export const mockCalendarEvents: CalendarEvent[] = [
  { id: 'cal-001', title: 'Lubrication Service - Robot R2', date: '2024-12-30', type: 'preventive', equipment: 'Industrial Robot Arm R2', technician: 'Alex Chen' },
  { id: 'cal-002', title: 'Calibration - Laser LC-1', date: '2025-01-05', type: 'preventive', equipment: 'Laser Cutting System LC-1', technician: 'Alex Chen' },
  { id: 'cal-003', title: 'Safety Inspection - Press HP-500', date: '2025-01-10', type: 'preventive', equipment: 'Hydraulic Press HP-500', technician: 'Mike Johnson' },
  { id: 'cal-004', title: 'Monthly Check - CNC A1', date: '2025-01-15', type: 'preventive', equipment: 'CNC Milling Machine A1', technician: 'Mike Johnson' },
  { id: 'cal-005', title: 'Quarterly Maintenance - Conveyor C3', date: '2025-01-20', type: 'preventive', equipment: 'Assembly Conveyor Belt C3', technician: 'Lisa Park' },
  { id: 'cal-006', title: 'Air Filter Replacement - Compressor', date: '2025-01-25', type: 'preventive', equipment: 'Air Compressor AC-200', technician: 'Lisa Park' },
];

// Dashboard Statistics
export const dashboardStats = {
  criticalEquipment: {
    count: mockEquipment.filter(e => e.health < 30).length,
    percentage: Math.round((mockEquipment.filter(e => e.health < 30).length / mockEquipment.length) * 100),
  },
  technicianLoad: {
    average: Math.round(mockTeams.flatMap(t => t.members).reduce((acc, m) => acc + m.utilization, 0) / mockTeams.flatMap(t => t.members).length),
  },
  openRequests: {
    pending: mockMaintenanceRequests.filter(r => r.stage === 'new').length,
    overdue: mockMaintenanceRequests.filter(r => r.isOverdue).length,
    total: mockMaintenanceRequests.filter(r => r.stage !== 'repaired' && r.stage !== 'scrap').length,
  },
  requestsByStage: {
    new: mockMaintenanceRequests.filter(r => r.stage === 'new').length,
    inProgress: mockMaintenanceRequests.filter(r => r.stage === 'in-progress').length,
    repaired: mockMaintenanceRequests.filter(r => r.stage === 'repaired').length,
    scrap: mockMaintenanceRequests.filter(r => r.stage === 'scrap').length,
  },
};
