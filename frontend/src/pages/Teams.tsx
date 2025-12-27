import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Users as UsersIcon, 
  Grid, 
  List, 
  X,
  Mail,
  Phone,
  Trash2,
  Edit,
  Search,
  Filter
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockTeams, Team, TeamMember } from "@/data/mockData";

interface ExtendedTeamMember extends TeamMember {}

export default function Teams() {
  const [teams, setTeams] = useState(mockTeams);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<(typeof mockTeams)[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter teams based on search query
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.members.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // New team form state
  const [newTeam, setNewTeam] = useState({
    name: "",
    company: "",
  });
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "1", name: "", role: "", avatar: "", utilization: 0 }
  ]);

  const handleAddTeam = () => {
    if (!newTeam.name.trim() || !newTeam.company.trim()) return;
    
    const team: Team = {
      id: String(Date.now()),
      name: newTeam.name,
      company: newTeam.company,
      members: teamMembers.filter(m => m.name.trim() !== ""),
    };
    
    if (editingTeam) {
      // Update existing team
      setTeams(teams.map(t => t.id === editingTeam.id ? team : t));
    } else {
      // Add new team
      setTeams([...teams, team]);
    }
    
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTeam(null);
    setNewTeam({
      name: "",
      company: "",
    });
    setTeamMembers([{ id: "1", name: "", role: "", avatar: "", utilization: 0 }]);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setNewTeam({
      name: team.name,
      company: team.company,
    });
    setTeamMembers(team.members.length > 0 ? team.members : 
      [{ id: "1", name: "", role: "", avatar: "", utilization: 0 }]);
    setIsDialogOpen(true);
  };

  const handleDeleteTeam = (teamId: string) => {
    if (confirm("Are you sure you want to delete this team?")) {
      setTeams(teams.filter(team => team.id !== teamId));
    }
  };

  const addTeamMember = () => {
    setTeamMembers([
      ...teamMembers,
      { id: String(teamMembers.length + 1), name: "", role: "", avatar: "", utilization: 0 }
    ]);
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > 1) {
      const newMembers = teamMembers.filter((_, i) => i !== index);
      setTeamMembers(newMembers);
    }
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string | number) => {
    const newMembers = [...teamMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setTeamMembers(newMembers);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">Manage maintenance teams and members</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "cards" | "table")}>
            <TabsList>
              <TabsTrigger value="cards" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                Cards
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Table
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Add Team Button with Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {editingTeam ? "Edit Team" : "Add Team"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>
                  {editingTeam ? "Edit Team" : "Create New Team"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="overflow-y-auto flex-1 px-6">
                <div className="grid gap-6 py-4">
                  {/* Basic Information */}
                  <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="team-name">Team Name *</Label>
                      <Input
                        id="team-name"
                        placeholder="Enter team name"
                        value={newTeam.name}
                        onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        placeholder="Enter company name"
                        value={newTeam.company}
                        onChange={(e) => setNewTeam({...newTeam, company: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Team Members</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addTeamMember}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  </div>
                  
                  {teamMembers.map((member, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Member {index + 1}</h4>
                        {teamMembers.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTeamMember(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name *</Label>
                          <Input
                            placeholder="Full name"
                            value={member.name}
                            onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Role *</Label>
                          <Select
                            value={member.role}
                            onValueChange={(value) => updateTeamMember(index, 'role', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Technician">Technician</SelectItem>
                              <SelectItem value="Engineer">Engineer</SelectItem>
                              <SelectItem value="Supervisor">Supervisor</SelectItem>
                              <SelectItem value="Manager">Manager</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Utilization (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0-100"
                            value={member.utilization}
                            onChange={(e) => updateTeamMember(index, 'utilization', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button onClick={handleAddTeam} disabled={!newTeam.name.trim() || !newTeam.company.trim()}>
                  {editingTeam ? "Update Team" : "Create Team"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search teams or members..."
          className="pl-10 pr-10 rounded-full shadow-inner"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      {/* Cards View */}
      {viewMode === "cards" && (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredTeams.map((team, i) => (
            <motion.div 
              key={team.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
            >
              <Card variant="elevated" className="relative">
                {/* Action Buttons */}
                <div className="absolute right-4 top-4 flex gap-2 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditTeam(team)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTeam(team.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center">
                      <UsersIcon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {team.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{team.company}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{team.members.length} members</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {team.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{member.utilization}%</div>
                        <Progress value={member.utilization} className="w-16 h-1.5" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell>
                      <div className="font-medium">{team.name}</div>
                    </TableCell>
                    <TableCell>{team.company}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {team.members.map((member) => (
                          <div key={member.id} className="flex items-center gap-2 text-sm">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{member.name}</span>
                            <Badge variant="outline" className="text-xs">{member.role}</Badge>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTeam(team)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTeam(team.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {teams.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <UsersIcon className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">No teams yet</h3>
                <p className="text-muted-foreground">Create your first team to get started</p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}