import { createFileRoute, Link } from "@tanstack/react-router";
import { shows, secondary, quotes, SITE, heroShot, OFFICIAL } from "@/lib/catalog";
import { Cover, Figure, ListenLink, ReleaseRows, VideoFace, homeIdentity, identityShot } from "@/components/site/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mylène Farmer — edizione italiana" },
      {
        name: "description",
        content:
          "Égrégore esce il 30 ottobre 2026. Ascolta i brani già pubblici, leggi la bio e l'unica data in sala. Edizione italiana indipendente.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Mylène Farmer",
          birthDate: "1961-09-12",
          jobTitle: "cantante",
          url: OFFICIAL.preorder,
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const show = shows[0];
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="meta hero-kicker">pop francese · parigi · dal 1984</p>
          <h1 className="hero-title">
            Mylène
            <br />
            Farmer
          </h1>
          <p className="hero-promise">{SITE.promise}</p>
          <div className="hero-actions">
            <ListenLink slug="des-lols-et-des-quoi" fill sala>
              Ascolta
            </ListenLink>
            <Link to="/musica/$slug" params={{ slug: "egregore" }} className="btn text">
              Il disco
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <img src={heroShot.src} alt={heroShot.alt} width={heroShot.width} height={heroShot.height} />
          <p className="hero-cap meta">{heroShot.caption}</p>
        </div>
      </section>

      <section className="frame" aria-label="In uscita">
        <div className="news">
          <p className="meta">In uscita</p>
          <Link to="/musica/$slug" params={{ slug: "egregore" }} className="news-title">
            Égrégore
          </Link>
          <div className="news-end">
            <span className="meta">30 ott 2026</span>
            <ListenLink slug="des-lols-et-des-quoi" sala>
              Ascolta
            </ListenLink>
          </div>
        </div>
      </section>

      <section className="band frame" aria-labelledby="ascolto">
        <p className="meta section-label" id="ascolto">
          01 — Ascolto
        </p>
        <div className="listen-feature">
          <div>
            <Cover title="Égrégore" year={2026} />
            <p className="meta" style={{ marginTop: 8 }}>
              Segno grafico, non la copertina ufficiale.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 56px)" }}>Égrégore</h2>
            <p className="meta" style={{ margin: "12px 0" }}>
              2026 · album · Stuffed Monkey / Sony
            </p>
            <p className="measure">
              Esce il 30 ottobre. Tre brani sono già in piattaforma: non è la scaletta del disco, è quello che si può sentire oggi. Il 27 ottobre c'è una proiezione in sala, non un concerto.
            </p>
            <ol className="tracklist">
              <li>
                <span>01</span>
                <span>C'est à qui le tour</span>
                <span className="dur">2:49</span>
              </li>
              <li>
                <span>02</span>
                <span>Des lols et des quoi</span>
                <span className="dur">3:38</span>
              </li>
              <li>
                <span>03</span>
                <span>Confession</span>
                <span className="dur">2:46</span>
              </li>
            </ol>
            <div className="platforms">
              <ListenLink slug="egregore" sala>
                Scheda
              </ListenLink>
              <a href={OFFICIAL.spotifyArtist} target="_blank" rel="noreferrer">
                Spotify
              </a>
              <a href={OFFICIAL.youtubeClip} target="_blank" rel="noreferrer">
                YouTube
              </a>
              <a href={OFFICIAL.preorder} target="_blank" rel="noreferrer">
                Prenota il disco
              </a>
            </div>
          </div>
        </div>
        <div className="release-list">
          <ReleaseRows items={secondary} />
        </div>
      </section>

      <section className="band frame" aria-labelledby="date">
        <p className="meta section-label" id="date">
          02 — Date
        </p>
        <table className="dates">
          <thead>
            <tr>
              <th>Data</th>
              <th>Città</th>
              <th>Luogo</th>
              <th>Stato</th>
              <th>Azione</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <time dateTime={show.iso}>
                  <span className="day">{show.day}</span>
                  <span className="mon">
                    {show.month} {show.year}
                  </span>
                </time>
              </td>
              <td>{show.city}</td>
              <td>{show.venue}</td>
              <td>
                <span className="status status-sala">In sala</span>
              </td>
              <td>
                <a className="btn text" href={show.action?.href} target="_blank" rel="noreferrer">
                  Info
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="measure" style={{ marginTop: 20 }}>
          Nessun concerto in calendario. La riga sopra è il film «Égrégore», una sera, non un biglietto di tour.
        </p>
        <p style={{ marginTop: 12 }}>
          <Link to="/date" className="btn text">
            Tutte le date
          </Link>
        </p>
      </section>

      <section className="band frame">
        <div className="identity">
          <div className="identity-copy">
            <p className="meta section-label">03 — Identità</p>
            <h2>{homeIdentity.title}</h2>
            <p className="measure">{homeIdentity.body}</p>
            <p style={{ marginTop: 20 }}>
              <Link to="/bio" className="btn text">
                Leggi la bio
              </Link>
            </p>
          </div>
          <Figure shot={identityShot} />
        </div>
      </section>

      <section className="band frame" aria-labelledby="media">
        <p className="meta section-label" id="media">
          04 — Media
        </p>
        <VideoFace
          youtubeId={OFFICIAL.youtubeId}
          title="Clip ufficiale di Des lols et des quoi, canale Mylène Farmer"
          poster="/images/cinema.jpg"
        />
        <p className="meta" style={{ marginTop: 8 }}>
          «Des lols et des quoi», clip di Thierry e Didier Poiraud, 11 set 2026. Il fermo è un quadro d'atelier, non un fotogramma.
        </p>
        <div className="quotes">
          {quotes.map((quote) => (
            <blockquote key={quote.source}>
              <p>«{quote.text}»</p>
              <footer className="meta">
                {quote.source}, {quote.year}.{" "}
                <a href={quote.href} target="_blank" rel="noreferrer">
                  Leggi
                </a>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="close frame">
        <p>{SITE.promiseClose}</p>
        <ListenLink slug="des-lols-et-des-quoi" fill sala>
          Ascolta
        </ListenLink>
      </section>
    </main>
  );
}
