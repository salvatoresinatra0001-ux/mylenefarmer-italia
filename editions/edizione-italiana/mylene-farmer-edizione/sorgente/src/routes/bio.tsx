import { createFileRoute, Link } from "@tanstack/react-router";
import { Figure, PageIntro } from "@/components/site/ui";
import { bio, identityShot, shots } from "@/lib/catalog";

export const Route = createFileRoute("/bio")({
  head: () => ({
    meta: [
      { title: "Bio — Mylène Farmer" },
      { name: "description", content: bio.seo },
    ],
  }),
  component: BioPage,
});

function BioPage() {
  const [first, second, third, fourth, fifth, sixth] = bio.paragraphs;
  const stair = shots[1];
  const desk = shots[4];
  return (
    <main className="frame">
      <PageIntro kicker="Biografia" title="i testi li firma lei" lede="Dal Québec al tredicesimo disco. Tre tempi, non un elenco di premi." />
      <article className="bio-layout">
        <p className="measure">{first}</p>
        <Figure shot={identityShot} />
        <p className="measure">{second}</p>
        <p className="measure">{third}</p>
        <Figure shot={stair} />
        <p className="measure">{fourth}</p>
        <p className="measure">{fifth}</p>
        <Figure shot={desk} />
        <p className="measure">{sixth}</p>
        <p>
          <Link to="/musica/$slug" params={{ slug: "egregore" }} className="btn text">
            Il disco
          </Link>
        </p>
      </article>
    </main>
  );
}
