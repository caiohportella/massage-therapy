"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimePicker } from "@/components/ui/time-picker";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, setHours, setMinutes } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { WorkingHoursTable } from "@/components/elements/WorkingHoursTable";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Add missing Form components
import { DayOfWeek, WorkingHour } from "@/lib/types";

const formSchema = z.object({
  dayOfWeek: z.string().min(1, "Dia da semana é obrigatório"),
  startTime: z.date(),
  endTime: z.date(),
});

export default function AdminWorkingHoursPage() {
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dayOfWeek: "1", // Default to Monday
      startTime: setMinutes(setHours(new Date(), 9), 0), // Default to 09:00
      endTime: setMinutes(setHours(new Date(), 17), 0), // Default to 17:00
    },
  });

  async function fetchWorkingHours() {
    setLoading(true);
    try {
      const res = await fetch("/api/working-hours");
      if (!res.ok) {
        throw new Error("Failed to fetch working hours");
      }
      const data = await res.json();
      setWorkingHours(data.workingHours);
    } catch (error) {
      toast.error("Erro ao carregar horários de funcionamento");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWorkingHours();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newWorkingHour = {
        dayOfWeek: parseInt(values.dayOfWeek, 10),
        startTime: values.startTime.getHours() * 60 + values.startTime.getMinutes(),
        endTime: values.endTime.getHours() * 60 + values.endTime.getMinutes(),
      };

      const res = await fetch("/api/working-hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWorkingHour),
      });

      if (!res.ok) {
        throw new Error("Failed to add working hour");
      }

      toast.success("Horário adicionado com sucesso!");
      form.reset(); // Reset form fields
      fetchWorkingHours(); // Refresh the list
    } catch (error) {
      toast.error("Erro ao adicionar horário");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Horários de Funcionamento</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia da Semana</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(DayOfWeek)
                        .filter((v) => typeof v === "number")
                        .map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {DayOfWeek[day as number]}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-left">Hora de Início</FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "HH:mm") : "Pick a time"}
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto p-0">
                      <TimePicker
                        setDate={field.onChange}
                        date={field.value}
                        minutesStep={15} // Adjust as needed
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-left">Hora de Término</FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "HH:mm") : "Pick a time"}
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto p-0">
                      <TimePicker
                        setDate={field.onChange}
                        date={field.value}
                        minutesStep={15} // Adjust as needed
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Adicionar Horário</Button>
        </form>
      </Form>

      <h2 className="text-2xl font-bold mb-4">Horários Atuais</h2>
      {loading ? (
        <p>Carregando horários...</p>
      ) : (
        <WorkingHoursTable 
          workingHours={workingHours} 
          onRefresh={fetchWorkingHours}
          onEdit={() => {}} // TODO: Implement edit functionality
          onDelete={() => {}} // TODO: Implement delete functionality  
          onReset={() => {}} // TODO: Implement reset functionality
        />
      )}
    </div>
  );
}
