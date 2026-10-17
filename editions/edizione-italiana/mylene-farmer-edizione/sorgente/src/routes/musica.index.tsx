import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageIntro, Cover } from "@/components/site/ui";
import { kindLabel, releases, type Kind } from "@/lib/catalog";

export const Route = createFileRoute("/musica/")({
  head: () => ({
    meta: [
      { title: "Musica — Mylène Farmer" },
      {
        name: "description",
        content:
          "Discografia: tredici album in studio, i live e i singoli del 2025-2026. Égrégore esce il 30 ottobre 2026.",
      },
    ],
  }),
  component: Musica,
});

const filters: { id: "tutto" | Kind; label: string }[] = [
  { id: "tutto", label: "Tutto" },
  { id: "album", label: "Album" },
  { id: "single", label: "Singoli" },
  { id: "live", label: "Live" },
];

function Musica() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("tutto");
  const grouped = useMemo(() => {
    const list = releases
      .filter((item) => (filter === "tutto" ? true : item.kind === filter))
      .slice()
      .sort((a, b) => (a.sort < b.sort ? 1 : -1));
    const years = [...new Set(list.map((item) => item.year))];
    return years.map((year) => ({ year, items: list.filter((item) => item.year === year) }));
  }, [filter]);

  return (
    <main className="frame" style={{ paddingBottom: 80 }}>
      <PageIntro
        kicker="Discografia"
        title="musica"
        lede="Tredici album in studio, dal 1986 a «Égrégore». I live documentano le tournée già fatte. I singoli del 2025 e del 2026 sono ciò che si può ascoltare del disco nuovo."
      />
      <div className="filters" role="group" aria-label="Filtra i dischi">
        {filters.map((item) => (
          <button key={item.id} type="button" className="btn text" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      {grouped.map((group) => (
        <section key={group.year} className="year-block" aria-label={String(group.year)}>
          <h2>{group.year}</h2>
          {group.items.map((item) => (
            <Link key={item.slug} to="/musica/$slug" params={{ slug: item.slug }} className="catalog-row">
              <Cover title={item.title} year={item.year} size="sm" />
              <span className="ct">{item.title}</span>
              <span className="meta hide-sm">{kindLabel[item.kind]}</span>
              <span className="meta hide-sm">{item.dateLabel}</span>
            </Link>
          ))}
        </section>
      ))}
      <p className="meta measure">
        Le raccolte — tra cui «Les mots» (2001) e «Histoires de» (2020) — non hanno una scheda. I segni grafici non sono le copertine ufficiali.
      </p>
    </main>
  );
}
