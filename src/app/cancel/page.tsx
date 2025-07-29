// app/cancel/page.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CancelPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <Ban className="w-16 h-16 text-destructive mb-6" />
      <h1 className="text-3xl font-bold text-foreground">
        Pagamento cancelado
      </h1>
      <p className="text-muted-foreground mt-2">
        Você cancelou o processo de pagamento. Se quiser tentar novamente,
        clique abaixo.
      </p>
      <Button className="mt-6" onClick={() => router.push("/")}>
        Voltar para a página inicial
      </Button>
      <p className="text-xs text-muted-foreground mt-4">
        Redirecionando em 5 segundos...
      </p>
    </div>
  );
}
