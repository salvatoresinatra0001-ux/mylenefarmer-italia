import { Link } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  SITE,
  featured,
  getRelease,
  identityShot,
  kindLabel,
  listenLinks,
  type Release,
  type Shot,
} from "@/lib/catalog";
import { saveNotice } from "@/lib/notice";
import { usePlayer } from "@/lib/player-store";

export function Ext({
  href,
  children,
  className,
}: {
  href: string;
  children: string;
  className?: string;
}) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
      <span className="sr"> (si apre in una nuova scheda)</span>
    </a>
  );
}

export function Cover({ title, year, size = "lg" }: { title: string; year: number; size?: "lg" | "sm" }) {
  return (
    <div className={`cover cover-${size}`} aria-hidden="true">
      <span className="cover-year meta">{String(year).slice(size === "sm" ? 2 : 0)}</span>
      {size === "lg" ? <span className="cover-name">{title}</span> : <span />}
      <span className="cover-rule" />
    </div>
  );
}

export function ListenLink({
  slug,
  children,
  fill = false,
  sala = false,
}: {
  slug: string;
  children: string;
  fill?: boolean;
  sala?: boolean;
}) {
  const open = usePlayer((state) => state.open);
  return (
    <Link
      to="/musica/$slug"
      params={{ slug }}
      hash={sala ? "sala" : undefined}
      className={fill ? "btn fill" : "btn text"}
      onClick={() => open(slug)}
    >
      {children}
    </Link>
  );
}

export function Platforms({ release }: { release: Release }) {
  const links = listenLinks(release.title, release.youtubeId);
  return (
    <div className="platforms">
      {links.map((link) => (
        <Ext key={link.name} href={link.href}>
          {link.name}
        </Ext>
      ))}
    </div>
  );
}

export function Sala({ slug }: { slug: string }) {
  const release = getRelease(slug);
  const [show, setShow] = useState(false);
  const open = usePlayer((state) => state.open);

  useEffect(() => {
    if (window.location.hash === "#sala") {
      setShow(true);
      open(slug);
    }
  }, [open, slug]);

  if (!release) return null;

  return (
    <div className="sala-box" id="sala">
      <p className="meta">Ascolto · nessun audio parte da solo</p>
      <div className="hero-actions">
        <button
          type="button"
          className="btn fill"
          onClick={() => {
            setShow(true);
            open(slug);
          }}
        >
          Apri il lettore
        </button>
        <Platforms release={release} />
      </div>
      <p className="meta">
        L'anteprima o il brano intero dipendono dal tuo account sulla piattaforma. Il riquadro, se lo apri, è di Spotify.
      </p>
      {show ? (
        <iframe
          className="video-frame"
          style={{ height: 352 }}
          title={`Lettore Spotify, catalogo di ${SITE.name}. L'audio non parte da solo.`}
          src="https://open.spotify.com/embed/artist/0e04xgVBPU6mE2QkSHlufD?utm_source=generator"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      ) : null}
    </div>
  );
}

export function NoticeForm({ id }: { id: string }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Serve un indirizzo email leggibile.");
      return;
    }
    if (!consent) {
      setError("Senza consenso il promemoria non si salva.");
      return;
    }
    saveNotice(email.trim());
    setSaved(email.trim());
    setError("");
  }

  if (saved) {
    return (
      <p className="ok" role="status">
        {saved} resta su questo dispositivo. Non parte nessuna email: è un promemoria locale, non un avviso della redazione.
      </p>
    );
  }

  return (
    <form className="notice" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor={id}>
          Email <span className="req">*</span>
        </label>
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <label className="check">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
        <span>Tengo l'indirizzo solo su questo dispositivo. Nessun invio.</span>
      </label>
      <button className="btn fill" type="submit">
        Tieni
      </button>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}

export function Figure({
  shot,
  ratio,
}: {
  shot: { src: string; alt: string; caption: string; width: number; height: number };
  ratio?: string;
}) {
  return (
    <figure className="fig">
      <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} style={ratio ? { aspectRatio: ratio, objectFit: "cover", width: "100%" } : undefined} />
      <figcaption className="meta">{shot.caption}</figcaption>
    </figure>
  );
}

export function Gallery({ items }: { items: Shot[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (index === null) return;
    const root = ref.current;
    const prev = document.activeElement as HTMLElement | null;
    const nodes = () =>
      Array.from(root?.querySelectorAll<HTMLButtonElement>("button") ?? []).filter((el) => !el.disabled);
    nodes()[0]?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setIndex(null);
      if (event.key === "ArrowRight") setIndex((current) => (current === null ? current : (current + 1) % items.length));
      if (event.key === "ArrowLeft")
        setIndex((current) => (current === null ? current : (current - 1 + items.length) % items.length));
      if (event.key !== "Tab" || !root) return;
      const list = nodes();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      prev?.focus();
    };
  }, [index, items.length]);

  return (
    <>
      <div className="gallery">
        {items.map((item, itemIndex) => (
          <figure key={item.src} className={item.wide ? "wide" : undefined} style={{ margin: 0 }}>
            <button type="button" className={`shot ${item.wide ? "wide" : ""}`} onClick={() => setIndex(itemIndex)}>
              <img src={item.src} alt={item.alt} width={item.width} height={item.height} />
            </button>
            <figcaption className="meta" style={{ marginTop: 8 }}>
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
      {index !== null ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={ref}>
          <header>
            <p id={titleId} className="meta">
              {index + 1} / {items.length}
            </p>
            <button type="button" className="btn text" onClick={() => setIndex(null)}>
              Chiudi
            </button>
          </header>
          <figure>
            <img src={items[index].src} alt={items[index].alt} width={items[index].width} height={items[index].height} />
          </figure>
          <footer>
            <button
              type="button"
              className="btn text"
              onClick={() => setIndex((current) => (current === null ? current : (current - 1 + items.length) % items.length))}
            >
              Prima
            </button>
            <p className="meta">{items[index].caption}</p>
            <button
              type="button"
              className="btn text"
              onClick={() => setIndex((current) => (current === null ? current : (current + 1) % items.length))}
            >
              Dopo
            </button>
          </footer>
        </div>
      ) : null}
    </>
  );
}

export function VideoFace({ youtubeId, title, poster }: { youtubeId: string; title: string; poster: string }) {
  const [on, setOn] = useState(false);
  if (!on) {
    return (
      <button type="button" className="video-face" onClick={() => setOn(true)}>
        <img src={poster} alt="Sala cinematografica vuota, usata come fermo prima del clip. Non è un fotogramma del video." />
        <span>Guarda</span>
      </button>
    );
  }
  return (
    <iframe
      className="video-frame"
      title={title}
      src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}

export function PageIntro({
  kicker,
  title,
  lede,
  crumbs,
}: {
  kicker: string;
  title: string;
  lede?: string;
  crumbs?: { href: string; label: string }[];
}) {
  return (
    <header className="page-intro">
      {crumbs ? (
        <p className="crumbs meta">
          {crumbs.map((crumb, crumbIndex) => (
            <span key={crumb.href}>
              {crumbIndex > 0 ? <span aria-hidden="true"> / </span> : null}
              <a href={crumb.href}>{crumb.label}</a>
            </span>
          ))}
        </p>
      ) : null}
      <p className="meta">{kicker}</p>
      <h1>{title}</h1>
      {lede ? <p className="lede">{lede}</p> : null}
    </header>
  );
}

export function ReleaseRows({ items }: { items: Release[] }) {
  return (
    <div>
      {items.map((item) => (
        <div className="release-row" key={item.slug}>
          <Cover title={item.title} year={item.year} size="sm" />
          <div>
            <Link to="/musica/$slug" params={{ slug: item.slug }} className="title">
              {item.title}
            </Link>
            <p className="meta">
              {item.year} · {kindLabel[item.kind]}
            </p>
          </div>
          <ListenLink slug={item.slug} sala>
            Ascolta
          </ListenLink>
        </div>
      ))}
    </div>
  );
}

export const homeIdentity = {
  title: "I testi li firma lei",
  body: "Dal 1984, con «Maman a tort», i dischi arrivano a distanza e non a cadenza. Prima di «Égrégore» — il tredicesimo studio, fissato al 30 ottobre 2026 — ce ne sono dodici. I video e le tournée, da Bercy al Nevermore del 2023, fanno parte del lavoro. Le interviste restano rare. I testi sono suoi. La società che la rappresenta è Hashtag NP; i dischi recenti escono su Stuffed Monkey. Qui non c'è tutta la vita: c'è il punto da cui si ascolta adesso, con tre brani già pubblici e un film in sala il 27 ottobre, che non è un concerto.",
};

export { featured, identityShot };
