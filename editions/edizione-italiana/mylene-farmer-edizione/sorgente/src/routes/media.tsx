import { createFileRoute } from "@tanstack/react-router";
import { Ext, Gallery, PageIntro, VideoFace } from "@/components/site/ui";
import { OFFICIAL, heroShot, identityShot, quotes, shots } from "@/lib/catalog";

export const Route = createFileRoute("/media")({
  head: () => ({
    meta: [
      { title: "Media — Mylène Farmer" },
      {
        name: "description",
        content:
          "Il clip di «Des lols et des quoi», quadri d'atelier e due citazioni con la fonte. Nessuna foto d'archivio dell'artista.",
      },
    ],
  }),
  component: MediaPage,
});

const videos = [
  {
    title: "Des lols et des quoi",
    note: "Clip ufficiale, Thierry e Didier Poiraud, 11 set 2026.",
    href: OFFICIAL.youtubeClip,
  },
  {
    title: "C'est à qui le tour",
    note: "Singolo, 29 mag 2026. Il video si cerca sul canale ufficiale.",
    href: OFFICIAL.youtube,
  },
  {
    title: "Égrégore, l'avant-première",
    note: "Film in sala il 27 ott 2026. Il trailer sta sul canale, non lo incorporiamo senza un identificativo verificato.",
    href: OFFICIAL.youtube,
  },
  {
    title: "Confession",
    note: "Esecuzione a Cannes, mag 2025. Si cerca sul canale ufficiale.",
    href: OFFICIAL.youtube,
  },
];

function MediaPage() {
  return (
    <main className="frame" style={{ paddingBottom: 80 }}>
      <PageIntro
        kicker="Video, immagini, stampa"
        title="media"
        lede="Un clip ufficiale, incorporato solo dopo un clic. Le fotografie di questa edizione non ritraggono Mylène Farmer: sono quadri d'atelier. Le citazioni hanno una fonte."
      />

      <section aria-labelledby="video">
        <h2 id="video" className="meta section-label">
          Video
        </h2>
        <VideoFace youtubeId={OFFICIAL.youtubeId} title="Clip ufficiale Des lols et des quoi" poster="/images/cinema.jpg" />
        <ul className="tracklist">
          {videos.map((video, index) => (
            <li key={video.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>
                {video.title}
                <span className="meta" style={{ display: "block" }}>
                  {video.note}
                </span>
              </span>
              <Ext href={video.href}>Apri</Ext>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="immagini" style={{ marginTop: 64 }}>
        <h2 id="immagini" className="meta section-label">
          Immagini
        </h2>
        <p className="measure" style={{ marginBottom: 24 }}>
          Non è un archivio fotografico. Ogni quadro è stato fatto per questa edizione: stoffa, sala, vetro, scala. Nessun volto.
        </p>
        <Gallery items={shots} />
      </section>

      <section aria-labelledby="stampa" style={{ marginTop: 64 }}>
        <h2 id="stampa" className="meta section-label">
          Stampa
        </h2>
        <div className="quotes">
          {quotes.map((quote) => (
            <blockquote key={quote.source}>
              <p>«{quote.text}»</p>
              <footer className="meta">
                {quote.source}, {quote.year}. {quote.note}{" "}
                <Ext href={quote.href}>Leggi</Ext>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section aria-labelledby="kit" style={{ marginTop: 64 }}>
        <h2 id="kit" className="meta section-label">
          Press kit
        </h2>
        <p className="measure">
          Si scaricano tre anteprime, in bassa. Non sono fotografie di Mylène Farmer e non sostituiscono il press kit del management. Gli originali di scena e di copertina si chiedono a Hashtag NP. Non c'è uno zip: gli originali non sono qui.
        </p>
        <div className="kit" style={{ marginTop: 24 }}>
          {[identityShot, heroShot, shots[0]].map((shot) => (
            <figure key={shot.src} className="fig">
              <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} />
              <figcaption className="meta" style={{ marginTop: 8 }}>
                {shot.caption}{" "}
                <a href={shot.src} download>
                  Scarica l'anteprima
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
        <p style={{ marginTop: 16 }}>
          <Ext href={OFFICIAL.management}>Scrivi al management</Ext>
        </p>
      </section>
    </main>
  );
}
