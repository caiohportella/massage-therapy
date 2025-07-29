"use client";

import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { GeneralConsiderationsSchema } from "@/lib/validators";

interface GeneralConsiderationsFormProps {
  form: UseFormReturn<GeneralConsiderationsSchema>;
}

export function GeneralConsiderationsForm({
  form,
}: GeneralConsiderationsFormProps) {
  return (
    <Form {...form}>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Acompanhamento médico */}
          <FormField
            control={form.control}
            name="underMedicalCare"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Faz acompanhamento médico? *</FormLabel>
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
            name="medicalCareDescription"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Se sim, qual?</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Descreva o acompanhamento médico"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Problema circulatório */}
          <FormField
            control={form.control}
            name="hasCirculatoryProblem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Possui problema circulatório? *</FormLabel>
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
            name="circulatoryProblemDescription"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Se sim, qual?</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Descreva o problema circulatório"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pressão */}
          <FormField
            control={form.control}
            name="hasPressureProblem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Possui pressão alta ou baixa? *</FormLabel>
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
            name="pressureProblemDescription"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Se sim, qual?</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Descreva o problema de pressão"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Respiratório */}
          <FormField
            control={form.control}
            name="hasRespiratoryProblem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Possui problema respiratório? *</FormLabel>
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
            name="respiratoryProblemDescription"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Se sim, qual?</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Descreva o problema respiratório"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Varizes */}
          <FormField
            control={form.control}
            name="hasVaricoseVeins"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Possui varizes? *</FormLabel>
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

          {/* Histórico de trombose */}
          <FormField
            control={form.control}
            name="hasThrombosisHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Possui histórico de trombose? *</FormLabel>
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

          {/* Coluna */}
          <FormField
            control={form.control}
            name="hasSpineProblem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Possui problema na coluna? *</FormLabel>
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
            name="spineProblemDescription"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Se sim, qual?</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Descreva o problema na coluna"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Informações adicionais */}
          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Informações adicionais</FormLabel>
                <FormControl>
                  <Input placeholder="Se houver, descreva aqui" {...field} />
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
