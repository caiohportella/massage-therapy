"use client";

import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background text-center px-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        ✅ Pagamento confirmado!
      </h1>
      <p className="max-w-md p-2">
        Obrigado pelo agendamento. Em breve você receberá uma confirmação por
        e-mail ou WhatsApp. <br /> <br />
        Um email com o recibo da sua compra também foi enviado para você.
      </p>
      <button
        className="px-6 py-2 rounded-lg bg-accent text-background font-semibold shadow hover:bg-accent/80 transition"
        onClick={() => router.push("/")}
      >
        Voltar para a tela inicial
      </button>
    </div>
  );
}
