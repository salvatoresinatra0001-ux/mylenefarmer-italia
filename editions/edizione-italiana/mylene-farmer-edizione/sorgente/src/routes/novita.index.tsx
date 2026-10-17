import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/ui";
import { news } from "@/lib/catalog";

export const Route = createFileRoute("/novita/")({
  head: () => ({
    meta: [
      { title: "Novità — Mylène Farmer" },
      {
        name: "description",
        content:
          "Cronaca essenziale verso Égrégore: singoli, data del disco, film in sala, collaborazione annunciata da DJ Snake.",
      },
    ],
  }),
  component: NewsIndex,
});

function NewsIndex() {
  const items = news.slice().sort((a, b) => (a.sort < b.sort ? 1 : -1));
  return (
    <main className="frame" style={{ paddingBottom: 80 }}>
      <PageIntro
        kicker="Cronaca"
        title="novità"
        lede="Dal maggio 2025 al 14 ottobre 2026. Solo fatti con una data. Niente anteprime inventate."
      />
      <div className="news-list">
        {items.map((item) => (
          <Link key={item.slug} to="/novita/$slug" params={{ slug: item.slug }} className="news-item">
            <p className="meta">{item.dateLabel}</p>
            <div>
              <h2>{item.title}</h2>
              <p className="measure" style={{ marginTop: 8 }}>
                {item.lede}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
