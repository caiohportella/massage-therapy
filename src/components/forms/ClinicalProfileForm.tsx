"use client";

import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface ClinicalProfileFormProps {
  form: UseFormReturn<any>;
}

export function ClinicalProfileForm({ form }: ClinicalProfileFormProps) {
  return (
    <Form {...form}>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doença Crônica */}
          <FormField
            control={form.control}
            name="hasChronicDisease"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Possui doença crônica? *</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent align="start">
                      <SelectItem value="Sim">Sim</SelectItem>
                      <SelectItem value="Não">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="chronicDiseaseDescription"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Se sim, qual?</FormLabel>
                <FormControl>
                  <Input placeholder="Descrição da doença crônica" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Medicamento */}
          <FormField
            control={form.control}
            name="usesMedication"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usa medicamento contínuo? *</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent align="start">
                      <SelectItem value="Sim">Sim</SelectItem>
                      <SelectItem value="Não">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="medicationDescription"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Se sim, qual?</FormLabel>
                <FormControl>
                  <Input placeholder="Descrição do medicamento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alergias */}
          <FormField
            control={form.control}
            name="hasAllergies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Possui alergias? *</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent align="start">
                      <SelectItem value="Sim">Sim</SelectItem>
                      <SelectItem value="Não">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allergiesDescription"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Se sim, quais?</FormLabel>
                <FormControl>
                  <Input placeholder="Descrição das alergias" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cirurgia */}
          <FormField
            control={form.control}
            name="hadSurgery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Já realizou alguma cirurgia? *</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent align="start">
                      <SelectItem value="Sim">Sim</SelectItem>
                      <SelectItem value="Não">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="surgeryDescription"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Se sim, qual?</FormLabel>
                <FormControl>
                  <Input placeholder="Descrição da cirurgia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dor */}
          <FormField
            control={form.control}
            name="hasPain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Possui dor ou desconforto? *</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent align="start">
                      <SelectItem value="Sim">Sim</SelectItem>
                      <SelectItem value="Não">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="painDescription"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Se sim, onde?</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Descrição da dor ou desconforto"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gestante */}
          <FormField
            control={form.control}
            name="isPregnant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Está gestante?</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent align="start">
                      <SelectItem value="Sim">Sim</SelectItem>
                      <SelectItem value="Não">Não</SelectItem>
                      <SelectItem value="Não se aplica">
                        Não se aplica
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  );
}
