import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Cover, PageIntro, Platforms, Sala } from "@/components/site/ui";
import { getRelease, kindLabel, releases } from "@/lib/catalog";

export const Route = createFileRoute("/musica/$slug")({
  loader: ({ params }) => {
    const release = getRelease(params.slug);
    if (!release) throw notFound();
    return release;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} · Musica` : "Musica — Mylène Farmer" },
      { name: "description", content: loaderData?.seo ?? "Scheda disco." },
    ],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": loaderData.kind === "album" ? "MusicAlbum" : "MusicRecording",
              name: loaderData.title,
              datePublished: loaderData.sort.slice(0, 10),
              byArtist: { "@type": "Person", name: "Mylène Farmer" },
            }),
          },
        ]
      : [],
  }),
  component: ReleasePage,
});

function ReleasePage() {
  const release = Route.useLoaderData();
  const more = releases.filter((item) => item.slug !== release.slug && item.kind === release.kind).slice(0, 3);
  return (
    <main className="frame">
      <PageIntro
        kicker={`${kindLabel[release.kind]} · ${release.dateLabel}`}
        title={release.title}
        lede={release.lede}
        crumbs={[
          { href: "/musica", label: "Musica" },
          { href: `/musica/${release.slug}`, label: release.title },
        ]}
      />
      <div className="release-layout">
        <div className="sticky">
          <Cover title={release.title} year={release.year} />
          <p className="meta" style={{ marginTop: 8 }}>
            Segno grafico dell'edizione, non la copertina ufficiale.
          </p>
        </div>
        <article>
          <p className="meta">
            {release.labelName} · {release.credit}
          </p>
          <div className="prose" style={{ marginTop: 20 }}>
            {release.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="measure">
                {paragraph}
              </p>
            ))}
          </div>
          {release.tracks.length ? (
            <ol className="tracklist">
              {release.tracks.map((track, index) => (
                <li key={track.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    {track.title}
                    {track.note ? <span className="meta" style={{ display: "block" }}>{track.note}</span> : null}
                  </span>
                  <span className="dur">{track.duration ?? ""}</span>
                </li>
              ))}
            </ol>
          ) : null}
          <p className="meta" style={{ marginTop: 12 }}>
            {release.tracksNote}
          </p>
          <details className="disclosure">
            <summary>Testi</summary>
            <p>I testi non sono riprodotti. Restano agli aventi diritto e si ascoltano sulle piattaforme, non in copia su questa pagina.</p>
          </details>
          <Sala slug={release.slug} />
          <div style={{ marginTop: 8 }}>
            <Platforms release={release} />
          </div>
          {more.length ? (
            <div style={{ marginTop: 40 }}>
              <p className="meta">Nello stesso gruppo</p>
              <ul className="tracklist">
                {more.map((item) => (
                  <li key={item.slug}>
                    <span>{item.year}</span>
                    <Link to="/musica/$slug" params={{ slug: item.slug }}>
                      {item.title}
                    </Link>
                    <span className="dur">{kindLabel[item.kind]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>
      </div>
    </main>
  );
}
