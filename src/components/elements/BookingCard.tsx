"use client";

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Calendar } from "lucide-react";
import Link from "next/link";

const advantages = [
  "Disponibilidade em tempo real, sem conflitos.",
  "Confirmação instantânea do seu agendamento.",
  "Flexibilidade para agendar e reagendar quando quiser.",
  "Interface simples, rápida e intuitiva.",
];

export const BookingCard = () => {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="flex flex-col gap-4">
        <ul className="flex flex-col gap-3">
          {advantages.map((advantage, index) => (
            <li key={index} className="flex items-center gap-3">
              <Check size={16} className="text-accent" />
              <span className="text-sm text-background">
                {advantage}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link href={`${process.env.NEXT_PUBLIC_SCHEDULY_APP_URL}/book/rita-portella-mknch93b?ref=ritha_website`} target="_blank" className="w-full">
          <Button className="w-full bg-accent text-card hover:bg-background hover:text-accent cursor-pointer">
            <Calendar size={16} />
            Agende sua sessão
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
