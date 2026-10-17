import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/ui";
import { getNews } from "@/lib/catalog";

export const Route = createFileRoute("/novita/$slug")({
  loader: ({ params }) => {
    const article = getNews(params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} · Novità` : "Novità — Mylène Farmer" },
      { name: "description", content: loaderData?.seo ?? "Nota dell'edizione." },
    ],
  }),
  component: Article,
});

function Article() {
  const article = Route.useLoaderData();
  return (
    <main className="frame">
      <article className="article">
        <PageIntro
          kicker={article.dateLabel}
          title={article.title}
          lede={article.lede}
          crumbs={[
            { href: "/novita", label: "Novità" },
            { href: `/novita/${article.slug}`, label: article.title },
          ]}
        />
        <div className="body measure">
          {article.body.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          {article.release ? (
            <p>
              <Link to="/musica/$slug" params={{ slug: article.release }} className="btn text">
                Scheda
              </Link>
            </p>
          ) : null}
        </div>
      </article>
    </main>
  );
}
