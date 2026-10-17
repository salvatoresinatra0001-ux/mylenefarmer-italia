import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { OFFICIAL, SITE, getRelease, listenLinks } from "@/lib/catalog";
import { usePlayer } from "@/lib/player-store";
import { NoticeForm } from "./ui";

const NAV = [
  { to: "/musica", label: "Musica" },
  { to: "/date", label: "Date" },
  { to: "/bio", label: "Bio" },
  { to: "/media", label: "Media" },
  { to: "/contatti", label: "Contatti" },
] as const;

function isActive(pathname: string, to: string) {
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function Nav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [solid, setSolid] = useState(pathname !== "/");
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const open = usePlayer((state) => state.open);

  useEffect(() => {
    if (pathname !== "/") {
      setSolid(true);
      return;
    }
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    if (!menu) return;
    const root = menuRef.current;
    const previous = document.activeElement as HTMLElement | null;
    const nodes = () =>
      Array.from(root?.querySelectorAll<HTMLElement>("a, button") ?? []).filter((el) => !el.hasAttribute("disabled"));
    nodes()[0]?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenu(false);
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
      previous?.focus();
    };
  }, [menu]);

  return (
    <>
      <header className={solid ? "nav solid" : "nav"}>
        <div className="frame nav-inner">
          <Link to="/" className="wordmark">
            {SITE.name}
          </Link>
          <nav className="nav-links" aria-label="Sezioni">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} className={isActive(pathname, item.to) ? "active" : undefined} aria-current={isActive(pathname, item.to) ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/musica/$slug"
            params={{ slug: "des-lols-et-des-quoi" }}
            hash="sala"
            className="btn fill hide-sm"
            onClick={() => open("des-lols-et-des-quoi")}
          >
            Ascolta
          </Link>
          <button type="button" className="menu-btn" aria-expanded={menu} aria-controls="menu-pieno" onClick={() => setMenu(true)}>
            Menu
          </button>
        </div>
      </header>
      {menu ? (
        <div className="overlay" id="menu-pieno" ref={menuRef} role="dialog" aria-modal="true" aria-label="Menu">
          <header>
            <span className="wordmark">{SITE.name}</span>
            <button type="button" className="btn text" onClick={() => setMenu(false)}>
              Chiudi
            </button>
          </header>
          <nav>
            {NAV.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="overlay-cta">
            <Link
              to="/musica/$slug"
              params={{ slug: "des-lols-et-des-quoi" }}
              hash="sala"
              className="btn fill"
              onClick={() => open("des-lols-et-des-quoi")}
            >
              Ascolta
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="frame footer-grid">
        <div>
          <p className="meta">Avvisi di date e uscite</p>
          <p className="lede" style={{ marginTop: 8 }}>
            Solo quando esce un disco o si apre una città. Nessuna cadenza settimanale.
          </p>
          <NoticeForm id="footer-email" />
        </div>
        <div>
          <p className="meta">Edizione</p>
          <ul>
            <li>
              <Link to="/novita">Novità</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy</Link>
            </li>
            <li>
              <Link to="/note-legali">Note legali</Link>
            </li>
            <li>
              <a href={OFFICIAL.management} target="_blank" rel="noreferrer">
                Hashtag NP
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="meta">Fuori di qui</p>
          <ul>
            <li>
              <a href={OFFICIAL.youtube} target="_blank" rel="noreferrer">
                YouTube
              </a>
            </li>
            <li>
              <a href={OFFICIAL.spotifyArtist} target="_blank" rel="noreferrer">
                Spotify
              </a>
            </li>
            <li>
              <a href={OFFICIAL.preorder} target="_blank" rel="noreferrer">
                Il disco
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="frame" style={{ marginTop: 32 }}>
        <p className="meta">
          {SITE.edition}. Dati al {SITE.updated}. Non è il sito di Mylène Farmer, né di Stuffed Monkey, Sony o Hashtag NP.
          Le immagini sono quadri d'atelier, non fotografie dell'artista. I segni dei dischi non sono le copertine ufficiali.
        </p>
      </div>
    </footer>
  );
}

export function Player() {
  const slug = usePlayer((state) => state.slug);
  const close = usePlayer((state) => state.close);
  const release = slug ? getRelease(slug) : undefined;
  if (!release) return null;
  const links = listenLinks(release.title, release.youtubeId);
  return (
    <div className="player" role="region" aria-label="Lettore">
      <div className="player-row">
        <p className="player-title">
          {release.title}
          <span className="meta" style={{ display: "block" }}>
            In coda · l'audio non parte da solo
          </span>
        </p>
        {links.map((link) => (
          <a key={link.name} href={link.href} target="_blank" rel="noreferrer">
            {link.name}
          </a>
        ))}
        <Link to="/musica/$slug" params={{ slug: release.slug }} hash="sala">
          Scheda
        </Link>
        <button type="button" className="btn text" onClick={close}>
          Chiudi
        </button>
      </div>
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const slug = usePlayer((state) => state.slug);
  return (
    <div className={slug ? "pad" : undefined}>
      <a className="skip" href="#contenuto">
        Salta al contenuto
      </a>
      <Nav />
      <div id="contenuto">{children}</div>
      <Footer />
      <Player />
    </div>
  );
}
