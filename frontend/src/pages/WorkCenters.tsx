import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Factory, Search, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { mockWorkCenters } from "@/data/mockData";

const STORAGE_KEY = "gearguard_workcenters";

export default function WorkCenters() {

  const [workCenters, setWorkCenters] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    name: "",
    code: "",
    tag: "",
    costPerHour: "",
    capacityTimeEfficiency: "",
    oeeTarget: ""
  });

  // Load from LocalStorage + merge with mock data (no duplicates)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    const merged = [
      ...mockWorkCenters,
      ...saved.filter((s: any) =>
        !mockWorkCenters.some(m => m.id === s.id)
      )
    ];

    setWorkCenters(merged);
  }, []);

  // Filter work centers based on search query
  const filteredWorkCenters = workCenters.filter(wc =>
    wc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wc.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Save user-created work centers only
  const persist = (list: any[]) => {
    const userCreated = list.filter(w => w.isCustom);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userCreated));
  };

  const handleAdd = () => {
    const newWC = {
      id: Date.now().toString(),
      ...form,
      costPerHour: Number(form.costPerHour),
      capacityTimeEfficiency: Number(form.capacityTimeEfficiency),
      oeeTarget: Number(form.oeeTarget),
      isCustom: true
    };

    const updated = [...workCenters, newWC];
    setWorkCenters(updated);
    persist(updated);

    setForm({
      name: "",
      code: "",
      tag: "",
      costPerHour: "",
      capacityTimeEfficiency: "",
      oeeTarget: ""
    });

    setShowForm(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Work Centers</h1>
          <p className="text-muted-foreground">Manage production work centers</p>
        </div>

        <Button variant="hero" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Work Center
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search work centers..."
          className="pl-10 pr-10 rounded-full shadow-inner"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Work Center</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Cost/Hour</TableHead>
                <TableHead>Efficiency</TableHead>
                <TableHead>OEE Target</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredWorkCenters.map((wc, i) => (
                <motion.tr
                  key={wc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-muted/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg gradient-secondary flex items-center justify-center">
                        <Factory className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <span className="font-medium">{wc.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono">{wc.code}</TableCell>
                  <TableCell><Badge variant="secondary">{wc.tag}</Badge></TableCell>
                  <TableCell>${wc.costPerHour}/hr</TableCell>
                  <TableCell>{wc.capacityTimeEfficiency}%</TableCell>
                  <TableCell>{wc.oeeTarget}%</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>


      {/* ➕ ADD WORK CENTER FORM */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Work Center</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3">

            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            <div>
              <Label>Code</Label>
              <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
            </div>

            <div>
              <Label>Tag</Label>
              <Input value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} />
            </div>

            <div>
              <Label>Cost Per Hour</Label>
              <Input type="number" value={form.costPerHour} onChange={e => setForm({ ...form, costPerHour: e.target.value })} />
            </div>

            <div>
              <Label>Efficiency (%)</Label>
              <Input type="number" value={form.capacityTimeEfficiency} onChange={e => setForm({ ...form, capacityTimeEfficiency: e.target.value })} />
            </div>

            <div>
              <Label>OEE Target (%)</Label>
              <Input type="number" value={form.oeeTarget} onChange={e => setForm({ ...form, oeeTarget: e.target.value })} />
            </div>

            <Button onClick={handleAdd} className="mt-2">
              Save Work Center
            </Button>

          </div>
        </DialogContent>
      </Dialog>

    </motion.div>
  );
}