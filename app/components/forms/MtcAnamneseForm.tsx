"use client";

import { UseFormReturn } from "react-hook-form";
import {
  Form,
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
import { MtcAnamneseSchema } from "@/lib/validators";

interface MtcAnamneseFormProps {
  form: UseFormReturn<MtcAnamneseSchema>;
}

export function MtcAnamneseForm({ form }: MtcAnamneseFormProps) {
  return (
    <Form {...form}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sono */}
        <FormField
          control={form.control}
          name="sleepQuality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qualidade do sono *</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bom">Bom</SelectItem>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Ruim">Ruim</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Apetite */}
        <FormField
          control={form.control}
          name="appetite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apetite *</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bom">Bom</SelectItem>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Ruim">Ruim</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Intestino */}
        <FormField
          control={form.control}
          name="bowelFunction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intestino *</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Prisão de ventre">
                      Prisão de ventre
                    </SelectItem>
                    <SelectItem value="Diarreia">Diarreia</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Urina */}
        <FormField
          control={form.control}
          name="hasUrinaryAlterations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Possui alterações urinárias? *</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
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
          name="urinaryAlterationsDescription"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Se sim, descreva</FormLabel>
              <FormControl>
                <Input
                  placeholder="Descreva as alterações urinárias"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ciclo menstrual */}
        <FormField
          control={form.control}
          name="hasMenstrualCycle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Possui ciclo menstrual? *</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sim">Sim</SelectItem>
                    <SelectItem value="Não">Não</SelectItem>
                    <SelectItem value="Menopausa">Menopausa</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Alterações no ciclo */}
        <FormField
          control={form.control}
          name="hasMenstrualAlterations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Possui alterações no ciclo?</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
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
          name="menstrualAlterationsDescription"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Se sim, descreva</FormLabel>
              <FormControl>
                <Input
                  placeholder="Descreva as alterações no ciclo"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Emoções */}
        <FormField
          control={form.control}
          name="predominantEmotion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Predominância emocional *</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ansiedade">Ansiedade</SelectItem>
                    <SelectItem value="Tristeza">Tristeza</SelectItem>
                    <SelectItem value="Raiva">Raiva</SelectItem>
                    <SelectItem value="Medo">Medo</SelectItem>
                    <SelectItem value="Preocupação">Preocupação</SelectItem>
                    <SelectItem value="Alegria">Alegria</SelectItem>
                    <SelectItem value="Outra">Outra</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dor */}
        <FormField
          control={form.control}
          name="hasPainOrDiscomfort"
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
                  <SelectContent>
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
          name="painOrDiscomfortDescription"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Se sim, descreva</FormLabel>
              <FormControl>
                <Input placeholder="Descreva a dor ou desconforto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Observações */}
        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Observações gerais</FormLabel>
              <FormControl>
                <Input placeholder="Se houver, descreva aqui" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}
