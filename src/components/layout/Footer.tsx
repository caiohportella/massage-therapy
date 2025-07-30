import Link from "next/link";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container mx-auto flex flex-col items-center justify-center gap-2 py-6 px-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Ritha Portella. All rights reserved.
        </p>
        <p>
          Feito com <span className="text-red-500">♥</span> por Caio Portella
        </p>
      </div>
      <div className="flex items-center justify-center gap-4 pb-4">
        <Link
          href="https://wa.me/5511946469989"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent/80 transition-colors"
        >
          <FaWhatsapp className="w-6 h-6" />
        </Link>
        <Link
          href="https://www.instagram.com/rithaportellamassoterapeuta"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent/80 transition-colors"
        >
          <FaInstagram className="w-6 h-6" />
        </Link>
      </div>
    </footer>
  );
}
