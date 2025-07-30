"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Booking } from "@/lib/types";

export function AdminBookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((res) => res.json())
      .then(setBookings);
  }, []);

  return (
    <ScrollArea className="h-[80vh] w-full">
      <Card className="p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Data</th>
              <th>Cliente</th>
              <th>Serviços</th>
              <th>Status</th>
              <th>Valor</th>
              <th>Lembretes</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b hover:bg-muted">
                <td className="py-2">
                  {format(new Date(b.date), "dd/MM/yyyy")} às {b.time}
                </td>
                <td>{b.user.name}</td>
                <td>{b.services.map((s) => s.service.name).join(", ")}</td>
                <td>
                  <Badge>{b.paymentStatus}</Badge>
                </td>
                <td>R${(b.totalAmount / 100).toFixed(2)}</td>
                <td className="text-sm text-muted-foreground">
                  {b.reminderLogs?.length > 0 ? (
                    b.reminderLogs.map((log) => (
                      <div key={log.id}>
                        {log.type} —{" "}
                        {new Date(log.sentAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    ))
                  ) : (
                    <span className="italic text-muted-foreground">Nenhum</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </ScrollArea>
  );
}
