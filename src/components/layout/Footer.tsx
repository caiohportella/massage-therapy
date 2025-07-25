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
    </footer>
  );
}
