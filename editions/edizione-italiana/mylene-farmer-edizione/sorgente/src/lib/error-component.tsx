import type { ErrorComponentProps } from "@tanstack/react-router";

const FALLBACK_MESSAGE = "Qualcosa si è interrotto. Ricarica la pagina.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="error-screen">
      <p className="meta">Errore</p>
      <h1>La pagina non regge</h1>
      <p>{errorMessage(error)}</p>
    </main>
  );
}
