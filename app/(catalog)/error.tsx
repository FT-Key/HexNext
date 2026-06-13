"use client";

import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function CatalogError({ error, reset }: ErrorProps) {
  return (
    <div className="container mx-auto flex flex-1 items-center justify-center px-4 py-20">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-4xl text-muted-foreground/30">
          <svg
            className="size-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold">
          Algo salió mal
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {error.message ?? "Ocurrió un error inesperado al cargar el catálogo."}
        </p>
        <Button onClick={reset} variant="default">
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
}
