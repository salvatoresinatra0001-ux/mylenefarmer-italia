import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/ui";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — Mylène Farmer" },
      {
        name: "description",
        content: "Nessun account, nessun tracciamento nostro. L'email di promemoria resta nel browser. Spotify e YouTube hanno regole proprie.",
      },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <main className="frame">
      <PageIntro kicker="Edizione italiana" title="privacy" lede="Testo breve. Vale per questo sito, non per le piattaforme che apri da qui." />
      <div className="note-list">
        <section>
          <h2>Chi scrive</h2>
          <p>
            Questa è un'edizione italiana indipendente. Non è Mylène Farmer, non è Stuffed Monkey, non è Sony, non è Hashtag NP. Non raccogliamo dati per loro.
          </p>
        </section>
        <section>
          <h2>Cosa resta sul dispositivo</h2>
          <p>
            Se lasci un'email nel campo «Avvisi», l'indirizzo viene scritto nella memoria locale del browser. Non parte alcun messaggio. Non abbiamo un server di newsletter. Puoi cancellarlo svuotando i dati del sito.
          </p>
        </section>
        <section>
          <h2>Modulo contatti</h2>
          <p>
            Il modulo non invia. Prepara il testo sulla stessa pagina. Nome, email e messaggio non vengono trasmessi.
          </p>
        </section>
        <section>
          <h2>Terzi</h2>
          <p>
            Spotify e YouTube si caricano solo dopo un clic, sulla scheda disco o su «Guarda». Da quel momento valgono le loro informative, non questa. I link esterni si aprono in una nuova scheda.
          </p>
        </section>
        <section>
          <h2>Cookie</h2>
          <p>Questa edizione non imposta cookie di tracciamento e non mostra un banner per chiederli.</p>
        </section>
      </div>
    </main>
  );
}
