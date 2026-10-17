import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, NoticeForm } from "@/components/site/ui";
import { shows } from "@/lib/catalog";

export const Route = createFileRoute("/date")({
  head: () => ({
    meta: [
      { title: "Date — Mylène Farmer" },
      {
        name: "description",
        content:
          "Nessun concerto annunciato al 14 ottobre 2026. Il 27 ottobre, proiezione in sala di Égrégore, non una data di tour.",
      },
    ],
  }),
  component: DatePage,
});

const statusLabel = {
  sala: "In sala",
  disponibile: "Disponibile",
  pochi: "Pochi posti",
  soldout: "Sold out",
} as const;

function DatePage() {
  return (
    <main className="frame" style={{ paddingBottom: 80 }}>
      <PageIntro
        kicker="Calendario · aggiornato al 14 ott 2026"
        title="date"
        lede="Nessun concerto in calendario. C'è una proiezione, il 27 ottobre 2026: il film «Égrégore», una sera, in più paesi. Il disco esce il 30 ottobre e non è una data di palco."
      />
      <table className="dates">
        <caption className="sr">Date pubbliche</caption>
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
          {shows.map((show) => (
            <tr key={show.iso}>
              <td>
                <time dateTime={show.iso}>
                  <span className="day">{show.day}</span>
                  <span className="mon">
                    {show.month} {show.year}
                  </span>
                </time>
              </td>
              <td>{show.city}</td>
              <td>
                {show.venue}
                <span className="meta" style={{ display: "block" }}>
                  {show.note}
                </span>
              </td>
              <td>
                <span className={`status status-${show.status}`}>{statusLabel[show.status]}</span>
              </td>
              <td>
                {show.action ? (
                  <a className="btn text" href={show.action.href} target="_blank" rel="noreferrer">
                    {show.action.label}
                  </a>
                ) : (
                  <button type="button" className="btn text" disabled>
                    Biglietti
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", marginBottom: 12 }}>Nessun concerto in calendario.</h2>
        <p className="measure">
          Lascia l'email su questo dispositivo: ti resta un promemoria. Da qui non parte alcun messaggio, e non è l'avviso ufficiale del tour.
        </p>
        <NoticeForm id="date-email" />
      </section>
    </main>
  );
}
