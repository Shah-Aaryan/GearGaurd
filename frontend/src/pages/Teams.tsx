import { motion } from "framer-motion";
import { Plus, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockTeams } from "@/data/mockData";

export default function Teams() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">Manage maintenance teams and members</p>
        </div>
        <Button variant="hero"><Plus className="h-4 w-4 mr-2" />Add Team</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mockTeams.map((team, i) => (
          <motion.div key={team.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card variant="elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center">
                    <UsersIcon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>{team.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{team.company}</p>
                  </div>
                </div>
                <Badge variant="secondary">{team.members.length} members</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {team.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Avatar><AvatarImage src={member.avatar} /><AvatarFallback>{member.name.charAt(0)}</AvatarFallback></Avatar>
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
    </motion.div>
  );
}
