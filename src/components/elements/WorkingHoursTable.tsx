"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash, Plus } from "lucide-react";
import { formatMinutes } from "@/lib/utils";
import { DayOfWeek, WorkingHour } from "@/lib/types";

type WorkingHoursTable = {
  workingHours: WorkingHour[];
  // Removed weekdays: string[];
  onEdit: (hour: WorkingHour) => void;
  onDelete: (id: string) => void;
  onReset: () => void;
  onRefresh: () => Promise<void>; // Add onRefresh prop
};

export function WorkingHoursTable({
  workingHours,
  // Removed weekdays,
  onEdit,
  onDelete,
  onReset,
}: WorkingHoursTable) {
  const groupedByDay = workingHours
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime - b.startTime)
    .reduce((acc: Record<number, WorkingHour[]>, h) => {
      acc[h.dayOfWeek] = acc[h.dayOfWeek] || [];
      acc[h.dayOfWeek].push(h);
      return acc;
    }, {});

  return (
    <Card className="p-4 relative">
      <h2 className="text-lg font-semibold mb-4">Horários Cadastrados</h2>

      <Table>
        <TableHeader className="bg-accent">
          <TableRow>
            <TableHead>Dia</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Fim</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Object.entries(groupedByDay).map(([_, blocks]) =>
            blocks.map((h, i) => (
              <TableRow key={h.id}>
                <TableCell className="font-medium">
                  {i === 0 ? DayOfWeek[h.dayOfWeek] : ""}
                </TableCell>
                <TableCell>{formatMinutes(h.startTime)}</TableCell>
                <TableCell>{formatMinutes(h.endTime)}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(h)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(h.id)}
                  >
                    <Trash className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Botão flutuante */}
      <Button
        onClick={onReset}
        className="fixed bottom-8 right-8 rounded-full shadow-lg"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </Card>
  );
}
