import { motion } from "framer-motion";
import { useState } from "react";

export default function WorkCenters() {
  const [searchQuery, setSearchQuery] = useState("");
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Work Centers</h1>
            <p className="text-muted-foreground">Manage production work centers</p>
          </div>
          <Button variant="hero"><Plus className="h-4 w-4 mr-2" />Add Work Center</Button>
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
              {mockWorkCenters.map((wc, i) => (
                <motion.tr key={wc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-muted/50">
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

    </motion.div>
  );
}
