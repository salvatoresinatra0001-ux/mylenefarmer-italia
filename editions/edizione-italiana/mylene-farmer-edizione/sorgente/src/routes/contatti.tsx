import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Ext, PageIntro } from "@/components/site/ui";
import { OFFICIAL } from "@/lib/catalog";

export const Route = createFileRoute("/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti — Mylène Farmer" },
      {
        name: "description",
        content:
          "Booking e stampa passano da Hashtag NP. Il modulo di questa edizione non invia nulla: prepara il testo sulla pagina.",
      },
    ],
  }),
  component: Contatti,
});

type Subject = "Booking" | "Stampa" | "Altro";

function Contatti() {
  const [subject, setSubject] = useState<Subject>("Altro");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Manca il nome.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("L'email non è leggibile.");
      return;
    }
    if (message.trim().length < 12) {
      setError("Il messaggio è troppo corto per essere utile.");
      return;
    }
    if (!consent) {
      setError("Serve il consenso per tenere il testo su questa pagina.");
      return;
    }
    setError("");
    setReady(`${subject}\n${name.trim()} · ${email.trim()}\n\n${message.trim()}`);
  }

  return (
    <main className="frame" style={{ paddingBottom: 80 }}>
      <PageIntro
        kicker="Tre indirizzi, un modulo"
        title="contatti"
        lede="Questa edizione non prende date e non ha una casella. Il booking e la stampa vanno al management. Il modulo prepara un testo: non lo spedisce."
      />
      <div className="split-3">
        <section className="card-block">
          <h2>Booking</h2>
          <p>Non prendiamo concerti, festival o apparizioni.</p>
          <p>La società di management è Hashtag NP, fondata da Pascal Nègre con Live Nation.</p>
          <p>
            <Ext href={OFFICIAL.management}>hashtagnp.com</Ext>
          </p>
        </section>
        <section className="card-block">
          <h2>Stampa</h2>
          <p>Foto di scena, copertine e interviste ufficiali non si scaricano da qui.</p>
          <p>Per gli originali, la richiesta va al management. In Media ci sono solo anteprime d'atelier.</p>
          <p>
            <Ext href={OFFICIAL.management}>Contatto stampa</Ext>
          </p>
        </section>
        <section className="card-block">
          <h2>Ascoltatori</h2>
          <p>Per un disco, una data, una correzione su questa edizione.</p>
          <p>Non c'è un indirizzo email attivo su questo sito. Il testo resta sulla pagina, da copiare.</p>
          <p>
            <Ext href={OFFICIAL.preorder}>Pagina ufficiale del disco</Ext>
          </p>
        </section>
      </div>

      <section style={{ marginTop: 64, maxWidth: 720 }}>
        <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", marginBottom: 16 }}>Scrivi</h2>
        {ready ? (
          <div className="ok" role="status">
            <p>Il messaggio è pronto su questa pagina. Non è stato inviato.</p>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", marginTop: 16 }}>{ready}</pre>
            <button
              type="button"
              className="btn text"
              style={{ marginTop: 12 }}
              onClick={() => {
                void navigator.clipboard?.writeText(ready);
              }}
            >
              Copia
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="stack">
            <div className="field">
              <label htmlFor="oggetto">Oggetto</label>
              <select id="oggetto" value={subject} onChange={(event) => setSubject(event.target.value as Subject)}>
                <option>Booking</option>
                <option>Stampa</option>
                <option>Altro</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="nome">
                Nome <span className="req">*</span>
              </label>
              <input id="nome" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
            </div>
            <div className="field">
              <label htmlFor="mail">
                Email <span className="req">*</span>
              </label>
              <input id="mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            </div>
            <div className="field full">
              <label htmlFor="msg">
                Messaggio <span className="req">*</span>
              </label>
              <textarea id="msg" value={message} onChange={(event) => setMessage(event.target.value)} required />
            </div>
            <label className="check">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
              <span>Accetto che il testo resti visibile solo in questa pagina, senza essere trasmesso.</span>
            </label>
            {subject === "Booking" ? (
              <p className="meta">Il booking non viene inoltrato. Hashtag NP è l'indirizzo giusto.</p>
            ) : null}
            {error ? (
              <p className="form-error" role="alert">
                {error}
              </p>
            ) : null}
            <button className="btn fill" type="submit" style={{ justifySelf: "start" }}>
              Prepara
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
