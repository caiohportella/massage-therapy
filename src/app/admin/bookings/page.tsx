import { AdminBookingsTable } from "@/components/elements/AdminBookingTable";

export default function AdminBookingsPage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Agendamentos</h1>
      <AdminBookingsTable />
    </main>
  );
}
