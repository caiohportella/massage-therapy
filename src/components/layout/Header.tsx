"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassBackground } from "@/components/layout/GlassBackground";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

const links = [
  { href: "#about", label: "Sobre" },
  { href: "#services", label: "Serviços" },
  { href: "#testimonials", label: "Depoimentos" },
  { href: "#vouchers", label: "Vouchers" },
  { href: "#booking", label: "Booking" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasVouchers, setHasVouchers] = useState(false);
  const [loadingVouchers, setLoadingVouchers] = useState(true);

  useEffect(() => {
    // Directly fetch vouchers without using the calendar store cache
    fetch("/api/vouchers")
      .then((res) => res.json())
      .then((data) => {
        setHasVouchers(data.vouchers.length > 0);
      })
      .catch(() => { // Removed 'error' parameter as it's not used
        // console.error("Failed to fetch voucher status for header:", error);
        setHasVouchers(false);
      })
      .finally(() => {
        setLoadingVouchers(false);
      });
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isOpen]);

  const filteredLinks = loadingVouchers
    ? [] // Show no links while loading
    : links.filter((link) => link.href !== "#vouchers" || hasVouchers);

  return (
    <>
      <header
        className="
          w-full 
          fixed top-0 left-0 
          z-50 
          bg-background/80 
          backdrop-blur-lg 
          border-b border-border
        "
      >
        <div className="container mx-auto flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center px-6">
            <Image
              src="/logo_alt.png"
              alt="Logo"
              width={256}
              height={256}
              className="w-32 h-24 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          {!loadingVouchers && (
            <motion.nav
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="hidden md:flex items-center gap-8"
            >
              {filteredLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="
                    text-sm
                    font-medium
                    text-foreground
                    hover:text-accent
                    transition-colors
                  "
                >
                  {link.label}
                </Link>
              ))}
            </motion.nav>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(true)}
              className="z-50 w-20 h-20 hover:bg-transparent"
            >
              <Image src="/bamboo.png" alt="Bamboo" width={1920} height={1080} className="w-20 h-20 object-contain" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="
              fixed inset-0 
              w-full 
              z-[100] 
              flex flex-col 
              p-6 
            "
          >
            {/* Glassmorphism no fundo */}
            <GlassBackground className="z-[-1]" />

            {/* Close Button */}
            <button onClick={() => setIsOpen(false)} className="self-end mb-8">
              <X className="w-6 h-6 text-foreground" />
            </button>

            {/* Mobile Navigation */}
            {!loadingVouchers && (
              <motion.nav
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }} // Slightly delayed from desktop
                className="flex flex-col flex-1 gap-6 items-center justify-center mb-36"
              >
                {filteredLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="
                      text-2xl
                      font-semibold
                      text-muted-foreground
                      hover:text-accent
                      transition-colors
                    "
                  >
                    {link.label}
                  </Link>
                ))}

              </motion.nav>
            )}
            <div className="flex items-center justify-center gap-6">
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
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
