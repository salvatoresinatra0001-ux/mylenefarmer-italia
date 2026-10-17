import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/ui";

export const Route = createFileRoute("/note-legali")({
  head: () => ({
    meta: [
      { title: "Note legali — Mylène Farmer" },
      {
        name: "description",
        content:
          "Edizione non ufficiale. Marchi, registrazioni e copertine restano ai titolari. I quadri del sito non sono fotografie dell'artista.",
      },
    ],
  }),
  component: Legal,
});

function Legal() {
  return (
    <main className="frame">
      <PageIntro kicker="Edizione italiana" title="note legali" lede="Una pagina sobria, per dire di chi è che cosa." />
      <div className="note-list">
        <section>
          <h2>Natura del sito</h2>
          <p>
            Sito editoriale indipendente, in italiano, dedicato all'ascolto e alla cronaca pubblica di Mylène Farmer. Non è un sito ufficiale e non è affiliato all'artista o ai suoi aventi diritto.
          </p>
        </section>
        <section>
          <h2>Musica e testi</h2>
          <p>
            I brani non sono ospitati qui. L'ascolto passa da Spotify, Apple Music, Deezer o YouTube, con un gesto esplicito. I testi non sono riprodotti.
          </p>
        </section>
        <section>
          <h2>Immagini</h2>
          <p>
            Le fotografie del sito sono quadri d'atmosfera commissionati per l'edizione: sale, stoffa, oggetti. Non ritraggono Mylène Farmer e non vanno scambiati per scatti di scena o di copertina. I quadrati dei dischi sono segni tipografici, non le artwork ufficiali.
          </p>
        </section>
        <section>
          <h2>Marchi</h2>
          <p>
            Nomi di dischi, brani, etichette e società appartengono ai rispettivi titolari. Li usiamo per identificare le opere, non per suggerire una licenza.
          </p>
        </section>
        <section>
          <h2>Date e fatti</h2>
          <p>
            Le informazioni sono ferme al 14 ottobre 2026. Una data di concerto non presente in calendario non è «in arrivo»: non c'è. Se un fatto cambia, questa pagina non si aggiorna da sola.
          </p>
        </section>
      </div>
    </main>
  );
}
