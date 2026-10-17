export const SITE = {
  name: "Mylène Farmer",
  edition: "Edizione italiana",
  updated: "14 ottobre 2026",
  promise: "Dopo il disco resta una voce bassa, e una scena che non spiega il testo.",
  promiseClose: "Quello che resta non è il ritornello: è il tono con cui è stato detto.",
} as const;

export const OFFICIAL = {
  preorder: "https://mylenefarmer.lnk.to/EGREGORE",
  youtube: "https://www.youtube.com/channel/UC8bXAHcitOUnxe7cFg6Curg",
  youtubeClip: "https://www.youtube.com/watch?v=rNSohl3J59o",
  youtubeId: "rNSohl3J59o",
  spotifyArtist: "https://open.spotify.com/artist/0e04xgVBPU6mE2QkSHlufD",
  spotifyEmbed:
    "https://open.spotify.com/embed/artist/0e04xgVBPU6mE2QkSHlufD?utm_source=generator",
  management: "https://hashtagnp.com",
  figaro:
    "https://www.lefigaro.fr/musique/une-magnifique-aventure-artistique-dj-snake-annonce-une-collaboration-avec-mylene-farmer-20261007",
  franceinfo:
    "https://www.franceinfo.fr/culture/musique/le-13e-album-studio-de-mylene-farmer-egregore-sortira-le-30-octobre_8078912.html",
  mylenenet: "https://www.mylene.net/modules/index.php?r=4&z=5612",
} as const;

export type Kind = "album" | "single" | "live";

export type Track = {
  title: string;
  duration?: string;
  note?: string;
};

export type Release = {
  slug: string;
  title: string;
  year: number;
  dateLabel: string;
  sort: string;
  kind: Kind;
  labelName: string;
  credit: string;
  seo: string;
  lede: string;
  body: string[];
  tracks: Track[];
  tracksNote: string;
  youtubeId?: string;
  homeSecondary?: boolean;
};

export type News = {
  slug: string;
  dateLabel: string;
  sort: string;
  title: string;
  seo: string;
  lede: string;
  body: string[];
  release?: string;
};

export type Shot = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  wide?: boolean;
};

export type Show = {
  day: string;
  month: string;
  year: string;
  iso: string;
  city: string;
  venue: string;
  status: "sala" | "disponibile" | "pochi" | "soldout";
  action: { label: string; href: string } | null;
  note: string;
};

export const shots: Shot[] = [
  {
    src: "/images/tenda.jpg",
    width: 1200,
    height: 1600,
    alt: "Tenda di velluto rosso in pieghe verticali, una sola luce chiara sulla stoffa, senza persone.",
    caption: "Tenda. Quadro d'atelier, 2026.",
  },
  {
    src: "/images/scala.jpg",
    width: 1200,
    height: 1600,
    alt: "Scala di pietra chiara con un fascio di luce e un lembo di stoffa rossa su un gradino.",
    caption: "Scala. Quadro d'atelier, 2026.",
  },
  {
    src: "/images/pioggia.jpg",
    width: 1728,
    height: 1152,
    wide: true,
    alt: "Vetro bagnato di notte, luci di strada fuori fuoco, nessuna insegna leggibile.",
    caption: "Vetro, notte. Quadro d'atelier, 2026.",
  },
  {
    src: "/images/cinema.jpg",
    width: 1792,
    height: 1008,
    wide: true,
    alt: "Sala cinematografica vuota, schermo chiaro visto dal corridoio laterale, sedute scure.",
    caption: "Sala. Quadro d'atelier, 2026.",
  },
  {
    src: "/images/scrivania.jpg",
    width: 1600,
    height: 1200,
    alt: "Scrivania scura con un foglio bianco, un nastro di seta rossa e una penna, senza scrittura.",
    caption: "Foglio bianco. Quadro d'atelier, 2026.",
  },
  {
    src: "/images/stadio.jpg",
    width: 1792,
    height: 1008,
    wide: true,
    alt: "Stadio vuoto di notte, fotografato dal prato, una striscia di luce rossa su una tribuna.",
    caption: "Prato vuoto. Quadro d'atelier, 2026.",
  },
];

export const heroShot = {
  src: "/images/sala.jpg",
  width: 1792,
  height: 1008,
  alt: "Fila di poltrone di velluto rosso in un teatro vuoto, luce laterale, tende scure, senza pubblico.",
  caption: "Platea vuota. Quadro d'atelier, 2026.",
};

export const identityShot = {
  src: "/images/identita.jpg",
  width: 1200,
  height: 1600,
  alt: "Una rosa rossa appoggiata di lato su seta nera, muro chiaro al bordo, luce dura.",
  caption: "Rosa su seta. Quadro d'atelier, 2026.",
};

export const shows: Show[] = [
  {
    day: "27",
    month: "ott",
    year: "2026",
    iso: "2026-10-27",
    city: "Più città",
    venue: "Sale cinematografiche",
    status: "sala",
    action: { label: "Info", href: OFFICIAL.preorder },
    note: "Proiezione di «Égrégore», non un concerto. Una sera, in più paesi.",
  },
];

export const quotes = [
  {
    text: "Égrégore. […] J'aime la notion vibratoire de la communion.",
    source: "Mylène Farmer, Le Parisien",
    year: "2025",
    href: OFFICIAL.mylenenet,
    note: "Parola scelta in un'intervista con Tatiana de Rosnay, 14 set 2025. Il virgolettato è riportato dall'archivio Mylene.net.",
  },
  {
    text: "Partager une magnifique aventure artistique avec une icône française.",
    source: "DJ Snake, Le Figaro",
    year: "2026",
    href: OFFICIAL.figaro,
    note: "Dichiarazione del 7 ott 2026, il giorno in cui annuncia la collaborazione sul disco.",
  },
] as const;

const rights =
  "I testi non sono riprodotti: restano agli aventi diritto. Si ascoltano sulle piattaforme.";

export const releases: Release[] = [
  {
    slug: "egregore",
    title: "Égrégore",
    year: 2026,
    dateLabel: "30 ott 2026",
    sort: "2026-10-30",
    kind: "album",
    labelName: "Stuffed Monkey / Sony",
    credit: "Testi di Mylène Farmer. Brani già pubblici composti con DJ Lewis; «Des lols et des quoi» anche con Antoine Chatenet.",
    seo: "Égrégore esce il 30 ott 2026. Tre brani sono già pubblici. Tredicesimo album in studio, Stuffed Monkey e Sony.",
    lede: "Tredicesimo album in studio. Esce il 30 ottobre 2026. La scaletta intera non è ancora pubblica.",
    body: [
      "Il titolo è una parola che lei stessa, nel 2025, ha indicato come la sua preferita: uno spirito di gruppo, nel senso che il termine ha in certa letteratura esoterica. Non è un concetto spiegato nel disco, perché il disco non è ancora uscito. È il nome scelto, e la data fissata.",
      "L'annuncio del giorno — 30 ottobre — arriva il 24 giugno 2026 da Hashtag NP. La fotografia di copertina è di Jean-Baptiste Mondino, che aveva già fotografato «Désobéissance» e la raccolta «Histoires de». Questa edizione non riproduce quella copertina: il quadrato qui a fianco è un segno tipografico.",
      "Al 14 ottobre 2026 i brani già ascoltabili sono tre. «C'est à qui le tour» è in piattaforma dal 29 maggio 2026. «Des lols et des quoi» dall'11 settembre, con un clip di Thierry e Didier Poiraud. «Confession», del 13 maggio 2025, è l'inedito cantato a Cannes in omaggio a David Lynch. Il 7 ottobre DJ Snake annuncia una collaborazione sul disco: il titolo del brano non è stato reso pubblico. Non lo inventiamo.",
      "Tre giorni prima dell'uscita, il 27 ottobre, un film di circa 65 minuti viene proiettato per una sera nelle sale. Non è la tournée. I registi indicati pubblicamente includono Julia Ducournau, Gilles Lellouche, François Hanss, Antonin Baudry, Thierry e Didier Poiraud.",
    ],
    tracks: [
      { title: "C'est à qui le tour", duration: "2:49", note: "Pubblico dal 29 mag 2026" },
      { title: "Des lols et des quoi", duration: "3:38", note: "Pubblico dall'11 set 2026" },
      { title: "Confession", duration: "2:46", note: "Pubblico dal 13 mag 2025" },
    ],
    tracksNote:
      "Non è la scaletta del disco. Sono i tre brani già usciti. L'ordine sul album può essere un altro. " + rights,
  },
  {
    slug: "des-lols-et-des-quoi",
    title: "Des lols et des quoi",
    year: 2026,
    dateLabel: "11 set 2026",
    sort: "2026-09-11",
    kind: "single",
    labelName: "Stuffed Monkey / Sony",
    credit:
      "Testo di Mylène Farmer. Musiche di DJ Lewis e Antoine Chatenet. Clip di Thierry e Didier Poiraud. Mastering Mike Marsh.",
    seo: "«Des lols et des quoi» esce l'11 set 2026, secondo singolo verso Égrégore. Clip di Thierry e Didier Poiraud.",
    lede: "Secondo singolo verso «Égrégore». Tre minuti e trentotto. Il clip ufficiale dura di più, perché non è il solo master.",
    body: [
      "Esce l'11 settembre 2026, in digitale, distribuito da Sony Music Entertainment France per Stuffed Monkey. Il clip, firmato dai fratelli Poiraud, è sul canale YouTube dell'artista. Il brano entra in «Égrégore», in uscita il 30 ottobre.",
      "Il testo gira intorno alla lingua che si abbassa, ai «lols», a Ronsard. Non lo trascriviamo qui. Si sente nel master, non in una copia incollata.",
      "In questa edizione è il brano da aprire se si vuole ascoltare qualcosa di già pubblicato del disco nuovo. L'album, come oggetto, è un'altra pagina.",
    ],
    tracks: [{ title: "Des lols et des quoi", duration: "3:38" }],
    tracksNote: rights,
    youtubeId: "rNSohl3J59o",
    homeSecondary: true,
  },
  {
    slug: "cest-a-qui-le-tour",
    title: "C'est à qui le tour",
    year: 2026,
    dateLabel: "29 mag 2026",
    sort: "2026-05-29",
    kind: "single",
    labelName: "Stuffed Monkey / Sony",
    credit: "Testo di Mylène Farmer. Composizione e produzione di DJ Lewis.",
    seo: "«C'est à qui le tour», singolo del 29 mag 2026, primo estratto annunciato di Égrégore. Musiche di DJ Lewis.",
    lede: "Primo estratto annunciato del tredicesimo album. In piattaforma dal 29 maggio 2026.",
    body: [
      "Hashtag NP lo indica come disponibile il 28 maggio 2026 a notte, quindi il 29 in Francia. È il brano con cui il disco nuovo smette di essere solo una voce di corridoio. DJ Lewis firma la musica. Un maxi successivo aggiunge remix, tra gli altri di Ofenbach, Myd, Take a Daytrip e dello stesso DJ Lewis: non li contiamo come scaletta dell'album.",
      "La durata pubblicata è 2:49. Il titolo del disco, in quel momento, non è ancora «Égrégore»: il nome arriva a giugno, con la data del 30 ottobre.",
    ],
    tracks: [{ title: "C'est à qui le tour", duration: "2:49" }],
    tracksNote: rights,
    homeSecondary: true,
  },
  {
    slug: "confession",
    title: "Confession",
    year: 2025,
    dateLabel: "13 mag 2025",
    sort: "2025-05-13",
    kind: "single",
    labelName: "Stuffed Monkey",
    credit: "Inedito eseguito al Festival di Cannes 2025, in omaggio a David Lynch. Entra poi in «Égrégore».",
    seo: "«Confession», inedito del 13 mag 2025, cantato a Cannes in omaggio a David Lynch. Poi sul disco Égrégore.",
    lede: "Un inedito prima del disco. Cannes, maggio 2025, dedicato a David Lynch.",
    body: [
      "Nel maggio 2025 Mylène Farmer canta «Confession» in apertura del Festival di Cannes. Non è un singolo di campagna nel senso stretto: è un omaggio, e resta fuori dal mercato per un po'. Quando «Égrégore» viene annunciato, il brano viene contato tra quelli del tredicesimo album.",
      "La durata indicata nelle schede pubbliche è 2:46. Non alleghiamo una storia di produzione che non è stata scritta nero su bianco. Il fatto verificabile è la data, il luogo e la dedica.",
    ],
    tracks: [{ title: "Confession", duration: "2:46", note: "Cannes, omaggio a David Lynch" }],
    tracksNote: rights,
  },
  {
    slug: "nevermore",
    title: "Nevermore",
    year: 2024,
    dateLabel: "2024",
    sort: "2024-12-31",
    kind: "live",
    labelName: "Stuffed Monkey",
    credit: "Documento del tour Nevermore, stadi e grandi sale, 2023.",
    seo: "Nevermore, album dal vivo 2024, documenta la tournée del 2023. Nessuna nuova data di quel tour è in calendario.",
    lede: "Il live della tournée 2023. Non è un invito a un concerto: quei concerti sono già stati fatti.",
    body: [
      "Nevermore è il nome della tournée che nel 2023 riporta Mylène Farmer nelle grandi venue francesi, dopo il disco «L'Emprise». L'album dal vivo esce l'anno dopo. In questa edizione non ricopiamo la scaletta della sera: cambia poco da una data all'altra, e si ascolta sul disco, non su una tabella ricostruita.",
      "Al 14 ottobre 2026 non risulta una nuova serie di concerti. La pagina Date tiene solo la proiezione in sala del film «Égrégore», il 27 ottobre 2026, e lo dice in chiaro.",
    ],
    tracks: [],
    tracksNote: "Scaletta non trascritta. Si ascolta sul disco dal vivo. " + rights,
  },
  {
    slug: "lemprise",
    title: "L'Emprise",
    year: 2022,
    dateLabel: "25 nov 2022",
    sort: "2022-11-25",
    kind: "album",
    labelName: "Stuffed Monkey",
    credit:
      "Testi di Mylène Farmer, salvo «Rayon vert» (AaRON). Musiche in gran parte di Woodkid. Registrato allo Studio Guillaume Tell, Parigi, 2021–2022.",
    seo: "L'Emprise, 25 nov 2022, dodicesimo album in studio. Woodkid, Moby, Archive, AaRON. Prima di Égrégore.",
    lede: "Dodicesimo album in studio. Quattro anni prima di «Égrégore». La presa del titolo è anche il modo di lavorare: pochi dischi, molta scena.",
    body: [
      "Esce il 25 novembre 2022 su Stuffed Monkey. Woodkid firma la maggior parte delle musiche e, con Tepr, gran parte della produzione. Non è un disco di un solo compositore: «Do You Know Who I Am» e «Ne plus renaître» vengono da Darius Keeler di Archive; «Rallumer les étoiles» e «Bouteille à la mer» da Moby; «Rayon vert» è scritto e prodotto da AaRON, unico brano del disco il cui testo non è di lei.",
      "Il disco arriva a circa 56 minuti nella edizione di riferimento. Alcune stampe aggiungono versioni piano e voce. Qui sotto c'è la scaletta dei dodici brani principali, con le durate pubblicate. «À tout jamais» e «Rayon vert» sono i singoli che hanno camminato di più in radio, ma il disco non si riduce a quei due.",
      "Dopo l'uscita arriva il tour Nevermore, nel 2023. Il live è un'altra scheda.",
    ],
    tracks: [
      { title: "Invisibles", duration: "3:35" },
      { title: "À tout jamais", duration: "3:46" },
      { title: "Que l'aube est belle", duration: "5:08" },
      { title: "L'Emprise", duration: "3:54" },
      { title: "Do You Know Who I Am", duration: "4:03", note: "Musica di Darius Keeler" },
      { title: "Rallumer les étoiles", duration: "4:24", note: "Musica di Moby" },
      { title: "Rayon vert", duration: "3:45", note: "Con AaRON" },
      { title: "Ode à l'apesanteur", duration: "3:32" },
      { title: "Que je devienne...", duration: "4:14" },
      { title: "Ne plus renaître", duration: "6:06" },
      { title: "D'un autre part", duration: "3:12" },
      { title: "Bouteille à la mer", duration: "4:16" },
    ],
    tracksNote: "Scaletta dell'edizione principale. Le versioni piano/voce di alcune stampe non sono elencate. " + rights,
    homeSecondary: true,
  },
  {
    slug: "desobeissance",
    title: "Désobéissance",
    year: 2018,
    dateLabel: "28 set 2018",
    sort: "2018-09-28",
    kind: "album",
    labelName: "Sony",
    credit: "Testi di Mylène Farmer. Undicesimo album in studio. Dentro c'è «N'oublie pas», con LP.",
    seo: "Désobéissance, 28 set 2018, undicesimo album in studio, etichetta Sony. Include «N'oublie pas» con LP.",
    lede: "Undicesimo studio. Pubblicato da Sony il 28 settembre 2018. Il duetto con LP è il brano che molti cercano per primo.",
    body: [
      "«Désobéissance» segna il passaggio a Sony dopo una lunga stagione Polydor. I singoli che tengono la campagna sono «Rolling Stone», «N'oublie pas» — cantato con LP — e poi «Sentimentale» e «Désobéissance». La copertina, ancora una fotografia di Mondino, non è riprodotta qui.",
      "Non trascriviamo l'intera scaletta: le edizioni deluxe aggiungono brani e non vogliamo presentare una lista a metà come se fosse il disco. I quattro titoli sopra sono quelli usciti come singoli. Il resto si apre sulla piattaforma, nell'ordine dell'edizione che hai davanti.",
      "È l'ultimo album in studio prima di «L'Emprise». In mezzo non c'è un disco fantasma: c'è il tempo, che nel suo calendario conta più dell'anno solare.",
    ],
    tracks: [
      { title: "Rolling Stone", note: "Singolo" },
      { title: "N'oublie pas", note: "Con LP" },
      { title: "Sentimentale", note: "Singolo" },
      { title: "Désobéissance", note: "Singolo" },
    ],
    tracksNote: "Singoli della campagna, non la scaletta integrale. " + rights,
    homeSecondary: true,
  },
  {
    slug: "interstellaires",
    title: "Interstellaires",
    year: 2015,
    dateLabel: "6 nov 2015",
    sort: "2015-11-06",
    kind: "album",
    labelName: "Polydor",
    credit: "Decimo album in studio. Include «Stolen Car», cantata con Sting.",
    seo: "Interstellaires, 6 nov 2015, decimo album in studio. Contiene «Stolen Car» con Sting.",
    lede: "6 novembre 2015. Il brano che esce dal disco verso un pubblico più largo è «Stolen Car», con Sting.",
    body: [
      "«Interstellaires» è il decimo studio, ancora su Polydor. Il duetto «Stolen Car» è la porta d'ingresso per chi non segue il catalogo da «Libertine». Non è, da solo, il disco: «City of Love» e la title track tengono un altro registro, più elettrico e più breve di certe ballate degli anni novanta.",
      "La scaletta integrale non è ricopiata. I titoli sicuri della campagna stanno sotto. Le durate, se non le abbiamo ricontrollate sul master, non le inventiamo.",
    ],
    tracks: [
      { title: "Interstellaires" },
      { title: "Stolen Car", note: "Con Sting" },
      { title: "City of Love" },
    ],
    tracksNote: "Selezione. Non è la scaletta integrale. " + rights,
  },
  {
    slug: "monkey-me",
    title: "Monkey Me",
    year: 2012,
    dateLabel: "3 dic 2012",
    sort: "2012-12-03",
    kind: "album",
    labelName: "Polydor",
    credit: "Nono album in studio. Title track e «À l'ombre» sono i brani di campagna più visibili.",
    seo: "Monkey Me, dicembre 2012, nono album in studio di Mylène Farmer, etichetta Polydor.",
    lede: "Nono studio, fine 2012. Il titolo è anche il singolo che apre la stagione, insieme ad «À l'ombre».",
    body: [
      "Dopo «Bleu noir», disco di collaboratori esterni, «Monkey Me» torna a una scrittura più chiusa, di nuovo vicina a Laurent Boutonnat sul piano musicale. Esce su Polydor all'inizio di dicembre 2012. L'anno dopo il tour Timeless porta il repertorio, questo disco compreso, negli stadi.",
      "Elenco qui i brani con cui il disco si è fatto riconoscere, non una scaletta spacciata per completa.",
    ],
    tracks: [{ title: "Monkey Me" }, { title: "À l'ombre" }, { title: "Quand" }],
    tracksNote: "Selezione. Non è la scaletta integrale. " + rights,
  },
  {
    slug: "bleu-noir",
    title: "Bleu noir",
    year: 2010,
    dateLabel: "6 dic 2010",
    sort: "2010-12-06",
    kind: "album",
    labelName: "Polydor",
    credit: "Ottavo album in studio. Musiche di Moby, RedOne e Archive, tra gli altri. Testi di Mylène Farmer.",
    seo: "Bleu noir, 6 dic 2010. Moby, RedOne e Archive sullo stesso disco. Testi di Mylène Farmer.",
    lede: "Dicembre 2010. Per una volta le musiche non passano da un solo compositore storico.",
    body: [
      "«Bleu noir» divide il disco in tre mani: Moby, RedOne, Archive. I testi restano suoi. È lo scarto più netto rispetto al lungo periodo scritto con Laurent Boutonnat. «Oui mais... non», «Bleu noir» e «Lonely Lisa» sono i singoli. Il colore del titolo non diventa il colore di questo sito: qui il rosso è un accento, non una citazione di copertina.",
      "La scaletta sotto è una selezione. L'ordine vero è quello dell'edizione che apri in piattaforma.",
    ],
    tracks: [
      { title: "Oui mais... non", note: "Singolo" },
      { title: "Bleu noir" },
      { title: "Lonely Lisa", note: "Singolo" },
    ],
    tracksNote: "Selezione. Non è la scaletta integrale. " + rights,
  },
  {
    slug: "point-de-suture",
    title: "Point de suture",
    year: 2008,
    dateLabel: "25 ago 2008",
    sort: "2008-08-25",
    kind: "album",
    labelName: "Polydor",
    credit: "Settimo album in studio. Elettronica secca. Il tour successivo passa dallo Stade de France.",
    seo: "Point de suture, 2008, settimo album in studio. Da qui si arriva al tour N°5 on Tour, Stade de France 2009.",
    lede: "2008. Batterie elettroniche, cori netti, cinque singoli. L'anno dopo lo stadio.",
    body: [
      "«Point de suture» esce nell'estate 2008. I singoli — «Dégénération», «Appelle mon numéro», «Si j'avais au moins...», «C'est dans l'air», «Sextonik» — coprono quasi mezzo disco, cosa rara nel suo catalogo, dove di solito si campaigna meno. Le musiche tornano a Laurent Boutonnat.",
      "Nel 2009 la tournée N°5 on Tour riempie lo Stade de France. Il live è una scheda a parte. Qui restano i titoli dei singoli, non una scaletta ricostruita a orecchio.",
    ],
    tracks: [
      { title: "Dégénération" },
      { title: "Appelle mon numéro" },
      { title: "Si j'avais au moins..." },
      { title: "C'est dans l'air" },
      { title: "Sextonik" },
    ],
    tracksNote: "Singoli. Non è la scaletta integrale. " + rights,
  },
  {
    slug: "avant-que-lombre",
    title: "Avant que l'ombre...",
    year: 2005,
    dateLabel: "4 apr 2005",
    sort: "2005-04-04",
    kind: "album",
    labelName: "Polydor",
    credit: "Sesto album in studio. Nel 2006 una serie di concerti a Bercy, documentata dal live omonimo.",
    seo: "Avant que l'ombre..., aprile 2005, sesto album in studio. Poi tredici sere a Bercy nel 2006.",
    lede: "Aprile 2005. Un disco lungo, e l'anno dopo tredici sere nello stesso palazzo.",
    body: [
      "«Avant que l'ombre...» esce il 4 aprile 2005. I brani che escono come singoli includono la title track, «Fuck Them All», «Q.I.» e «Redonne-moi». Il disco è più lento di «Point de suture», che arriverà tre anni dopo, e più vicino a una forma di canzone lunga.",
      "Nel gennaio 2006 inizia la residenza a Bercy. Il live «Avant que l'ombre... à Bercy» documenta quelle sere. Non mischiamo le due scalette.",
    ],
    tracks: [
      { title: "Avant que l'ombre..." },
      { title: "Fuck Them All" },
      { title: "Q.I." },
      { title: "Redonne-moi" },
    ],
    tracksNote: "Singoli e title track. Non è la scaletta integrale. " + rights,
  },
  {
    slug: "innamoramento",
    title: "Innamoramento",
    year: 1999,
    dateLabel: "7 apr 1999",
    sort: "1999-04-07",
    kind: "album",
    labelName: "Polydor",
    credit: "Quinto album in studio. Il tour che ne segue si chiama Mylenium.",
    seo: "Innamoramento, 7 aprile 1999, quinto album in studio. Poi il Mylenium Tour.",
    lede: "1999. Il titolo è italiano. Il disco no: resta francese, e il tour si chiamerà Mylenium.",
    body: [
      "«Innamoramento» esce il 7 aprile 1999. «L'Âme-stram-gram», «Souviens-toi du jour», «Optimistique-moi» e la title track sono i pezzi con cui il disco circola. Le musiche sono di Laurent Boutonnat, i testi suoi. L'anno dopo il Mylenium Tour porta in scena anche il repertorio dei dieci anni precedenti.",
      "Il titolo non fa di questo un disco italiano. Lo teniamo nella discografia con il nome originale, senza tradurlo.",
    ],
    tracks: [
      { title: "L'Âme-stram-gram" },
      { title: "Souviens-toi du jour" },
      { title: "Optimistique-moi" },
      { title: "Innamoramento" },
    ],
    tracksNote: "Selezione. Non è la scaletta integrale. " + rights,
  },
  {
    slug: "anamorphosee",
    title: "Anamorphosée",
    year: 1995,
    dateLabel: "17 ott 1995",
    sort: "1995-10-17",
    kind: "album",
    labelName: "Polydor",
    credit: "Quarto album in studio. Registrato a Los Angeles. Chitarre più avanti nel mix.",
    seo: "Anamorphosée, 17 ott 1995, quarto album in studio, registrato a Los Angeles. «California», «XXL».",
    lede: "Ottobre 1995. Los Angeles, chitarre, un passo di lato rispetto alla dance dei primi dischi.",
    body: [
      "«Anamorphosée» esce il 17 ottobre 1995, registrato a Los Angeles. «XXL», «L'Instant X», «California», «Comme j'ai mal» sono i singoli. Il suono è più ruvido: la chitarra sta davanti, la programmazione non scompare. Laurent Boutonnat resta il compositore di riferimento, con musicisti americani in studio.",
      "È il disco che molti ascoltano dopo «L'autre...», quando cercano un altro corpo sonoro e non solo un'altra raccolta di singoli.",
    ],
    tracks: [
      { title: "California" },
      { title: "XXL" },
      { title: "L'Instant X" },
      { title: "Comme j'ai mal" },
    ],
    tracksNote: "Singoli. Non è la scaletta integrale. " + rights,
  },
  {
    slug: "lautre",
    title: "L'autre...",
    year: 1991,
    dateLabel: "9 apr 1991",
    sort: "1991-04-09",
    kind: "album",
    labelName: "Polydor",
    credit: "Terzo album in studio. Contiene «Désenchantée». Duetto «Regrets» con Jean-Louis Murat.",
    seo: "L'autre..., 9 aprile 1991. Il disco di «Désenchantée». Terzo album in studio, Polydor.",
    lede: "9 aprile 1991. Il disco da cui esce «Désenchantée», e con essa una scala di pubblico diversa.",
    body: [
      "«L'autre...» è il terzo studio. «Désenchantée» ne è il singolo che attraversa l'Europa francofona e resta, trent'anni dopo, il brano più cercato del catalogo. Non è l'unico: «Je t'aime mélancolie», «Beyond My Control» e «Regrets», cantato con Jean-Louis Murat, tengono il disco. Le musiche sono di Laurent Boutonnat.",
      "Dopo questo album le sale diventano troppo piccole. I live di Bercy, a metà anni novanta, partono da qui. La scaletta sotto è una selezione dei brani di campagna, non il disco intero nell'ordine di stampa.",
    ],
    tracks: [
      { title: "Désenchantée" },
      { title: "Je t'aime mélancolie" },
      { title: "Regrets", note: "Con Jean-Louis Murat" },
      { title: "Beyond My Control" },
      { title: "L'autre" },
    ],
    tracksNote: "Selezione. Non è la scaletta integrale. " + rights,
    homeSecondary: true,
  },
  {
    slug: "ainsi-soit-je",
    title: "Ainsi soit je...",
    year: 1988,
    dateLabel: "18 apr 1988",
    sort: "1988-04-18",
    kind: "album",
    labelName: "Polydor",
    credit: "Secondo album in studio. «Sans contrefaçon», «Pourvu qu'elles soient douces».",
    seo: "Ainsi soit je..., 1988, secondo album in studio. «Sans contrefaçon» e «Pourvu qu'elles soient douces».",
    lede: "1988. Il secondo disco, e i due singoli che fissano un'immagine prima ancora del repertorio successivo.",
    body: [
      "«Ainsi soit je...» esce nel 1988 su Polydor. «Sans contrefaçon» e «Pourvu qu'elles soient douces» sono i brani che entrano nella lingua comune, insieme a «Ainsi soit je...» e «Sans logique». Testi suoi, musiche di Laurent Boutonnat, clip già pensati come cortometraggi e non come promo da rotazione.",
      "È il disco che prepara «L'autre...», non un'anteprima minore. Chi parte da «Désenchantée» e torna indietro di tre anni trova già la stessa voce, meno arena e più studio.",
    ],
    tracks: [
      { title: "Sans contrefaçon" },
      { title: "Pourvu qu'elles soient douces" },
      { title: "Ainsi soit je..." },
      { title: "Sans logique" },
    ],
    tracksNote: "Selezione. Non è la scaletta integrale. " + rights,
    homeSecondary: true,
  },
  {
    slug: "cendres-de-lune",
    title: "Cendres de lune",
    year: 1986,
    dateLabel: "apr 1986",
    sort: "1986-04-01",
    kind: "album",
    labelName: "Polydor",
    credit: "Primo album in studio. Due anni dopo «Maman a tort», singolo del 1984.",
    seo: "Cendres de lune, aprile 1986, primo album in studio. Prima c'è il singolo «Maman a tort», 1984.",
    lede: "Aprile 1986. Il primo 33 giri. Il singolo che la fa conoscere, «Maman a tort», è del 1984.",
    body: [
      "«Cendres de lune» raccoglie l'inizio del lavoro con Laurent Boutonnat. «Plus grandir» è il brano che rappresenta il disco nella prima campagna. «Libertine», spesso associato a questo periodo, circola con le ristampe successive più che con la prima stampa: non lo mettiamo in scaletta come se fosse sempre stato lì.",
      "Prima dell'album c'è «Maman a tort», 1984. È il punto zero pubblico. Non è, da solo, una poetica già chiusa: è un singolo, con un clip, e un nome d'arte che non è il nome di nascita.",
    ],
    tracks: [
      { title: "Plus grandir", note: "Sul disco del 1986" },
      { title: "Maman a tort", note: "Singolo, 1984" },
      { title: "Libertine", note: "Ristampe successive" },
    ],
    tracksNote: "Non è la scaletta della prima stampa. Sono tre titoli del periodo, con la loro data. " + rights,
  },
  {
    slug: "live-2019",
    title: "Live 2019",
    year: 2019,
    dateLabel: "2019",
    sort: "2019-10-18",
    kind: "live",
    labelName: "Sony",
    credit: "Album dal vivo della tournée 2019, dopo «Désobéissance».",
    seo: "Live 2019, documento della tournée seguita a Désobéissance. Album dal vivo, non una data in vendita.",
    lede: "Il disco della tournée 2019. Nove date in Francia, tra cui Paris La Défense Arena.",
    body: [
      "Dopo «Désobéissance» c'è una tournée breve, nel 2019, e un album dal vivo omonimo. Non è Nevermore e non è Timeless: è la serie di concerti tra il disco Sony e il lungo silenzio di studio che porta a «L'Emprise».",
      "La scaletta della sera non è ricopiata. Il disco c'è, sulle piattaforme, con il titolo «Live 2019».",
    ],
    tracks: [],
    tracksNote: "Scaletta non trascritta. " + rights,
  },
  {
    slug: "timeless-2013",
    title: "Timeless 2013",
    year: 2013,
    dateLabel: "2013",
    sort: "2013-12-09",
    kind: "live",
    labelName: "Polydor",
    credit: "Album dal vivo del tour Timeless, stadi, 2013.",
    seo: "Timeless 2013, album dal vivo della tournée negli stadi seguita a Monkey Me.",
    lede: "Stadi, 2013. Il live che chiude il ciclo di «Monkey Me».",
    body: [
      "Timeless è la tournée del 2013, costruita come spettacolo da stadio dopo «Monkey Me». L'album dal vivo esce lo stesso anno. È uno dei documenti in cui il repertorio degli anni ottanta e quello più recente stanno sulla stessa sera, con una macchina di scena molto più grande del brano.",
      "Non ne facciamo un programma di sala. Si ascolta il disco, oppure no.",
    ],
    tracks: [],
    tracksNote: "Scaletta non trascritta. " + rights,
  },
  {
    slug: "n5-on-tour",
    title: "N°5 on Tour",
    year: 2009,
    dateLabel: "2009",
    sort: "2009-12-07",
    kind: "live",
    labelName: "Polydor",
    credit: "Album dal vivo del tour 2009, compreso lo Stade de France. Segue «Point de suture».",
    seo: "N°5 on Tour, live 2009. Documenta la tournée di Point de suture, Stade de France compreso.",
    lede: "2009. Il live dello Stade de France e del tour legato a «Point de suture».",
    body: [
      "N°5 on Tour è il nome della tournée 2009 e dell'album che la registra. Lo Stade de France è la data che resta nelle cronache, non l'unica. Il repertorio poggia su «Point de suture» e sui singoli dei vent'anni precedenti.",
      "La scaletta non è trascritta in questa scheda.",
    ],
    tracks: [],
    tracksNote: "Scaletta non trascritta. " + rights,
  },
  {
    slug: "avant-que-lombre-bercy",
    title: "Avant que l'ombre... à Bercy",
    year: 2006,
    dateLabel: "2006",
    sort: "2006-12-04",
    kind: "live",
    labelName: "Polydor",
    credit: "Album dal vivo delle sere a Bercy, gennaio 2006.",
    seo: "Avant que l'ombre... à Bercy, live 2006. Tredici concerti a Parigi-Bercy all'inizio del 2006.",
    lede: "Tredici sere, stesso palazzo, gennaio 2006. Poi il disco.",
    body: [
      "La residenza a Bercy del gennaio 2006 segue di meno di un anno «Avant que l'ombre...». L'album dal vivo esce nel corso del 2006. È un documento di sala, non di stadio: la differenza con N°5 on Tour, tre anni dopo, si sente nelle dimensioni prima che nei brani.",
      "Non ricopiamo il programma della sera.",
    ],
    tracks: [],
    tracksNote: "Scaletta non trascritta. " + rights,
  },
  {
    slug: "mylenium-tour",
    title: "Mylenium Tour",
    year: 2000,
    dateLabel: "2000",
    sort: "2000-12-01",
    kind: "live",
    labelName: "Polydor",
    credit: "Album dal vivo del tour seguito a «Innamoramento».",
    seo: "Mylenium Tour, album dal vivo del 2000, dopo Innamoramento.",
    lede: "Il tour del 1999-2000, e il disco che lo ferma.",
    body: [
      "Mylenium Tour parte dopo «Innamoramento» e ne prende una parte del nome. L'album dal vivo esce nel 2000. È la prima grande documentazione di palco dopo i concerti di Bercy di metà anni novanta, con un repertorio che ormai copre tre dischi di successo di fila.",
      "Scaletta non trascritta.",
    ],
    tracks: [],
    tracksNote: "Scaletta non trascritta. " + rights,
  },
  {
    slug: "live-a-bercy",
    title: "Live à Bercy",
    year: 1997,
    dateLabel: "1997",
    sort: "1997-05-21",
    kind: "live",
    labelName: "Polydor",
    credit: "Album dal vivo dei concerti a Bercy, 1996.",
    seo: "Live à Bercy, 1997. Documenta i concerti parigini del 1996, dopo Anamorphosée.",
    lede: "I concerti del 1996 a Parigi-Bercy. Il disco esce l'anno dopo.",
    body: [
      "Nel 1996 Mylène Farmer porta «Anamorphosée» e il repertorio precedente a Bercy, per una serie di sere. «Live à Bercy» esce nel 1997. È il momento in cui il concerto smette di essere la promozione del disco e diventa un oggetto con la stessa cura del disco.",
      "La scaletta della sera non è elencata qui.",
    ],
    tracks: [],
    tracksNote: "Scaletta non trascritta. " + rights,
  },
  {
    slug: "en-concert",
    title: "En concert",
    year: 1989,
    dateLabel: "1989",
    sort: "1989-12-04",
    kind: "live",
    labelName: "Polydor",
    credit: "Primo album dal vivo, tour 1989.",
    seo: "En concert, 1989, primo album dal vivo di Mylène Farmer, dopo Ainsi soit je...",
    lede: "Primo live. 1989. Il palco è già una regia, non solo una promozione.",
    body: [
      "«En concert» documenta la tournée del 1989, dopo «Ainsi soit je...». È il primo album dal vivo. I clip avevano già una misura cinematografica; il palco, da qui in poi, viene costruito con la stessa idea: una sera scritta, non una sequenza di singoli.",
      "Non ne pubblichiamo la scaletta ricostruita.",
    ],
    tracks: [],
    tracksNote: "Scaletta non trascritta. " + rights,
  },
];

export const news: News[] = [
  {
    slug: "dj-snake",
    dateLabel: "7 ott 2026",
    sort: "2026-10-07",
    title: "DJ Snake annuncia una collaborazione",
    seo: "Il 7 ott 2026 DJ Snake annuncia una collaborazione con Mylène Farmer sul disco Égrégore. Il titolo del brano non è pubblico.",
    lede: "Il produttore pubblica delle foto e una frase. Il brano non ha ancora un titolo reso noto.",
    body: [
      "Il 7 ottobre 2026 William Grigahcine, in arte DJ Snake, scrive di condividere un'avventura artistica con Mylène Farmer e pubblica immagini del set. Le Figaro legge l'annuncio come una collaborazione destinata a «Égrégore», il disco del 30 ottobre.",
      "Il titolo del pezzo non è stato comunicato. Non lo anticipiamo. Si sa già, invece, che DJ Lewis firma i singoli «C'est à qui le tour» e «Des lols et des quoi». Sono due mani diverse, e in questa pagina restano distinte.",
      "La frase di DJ Snake, in originale, è nella pagina Media, con il link all'articolo.",
    ],
    release: "egregore",
  },
  {
    slug: "avant-premiere",
    dateLabel: "25 set 2026",
    sort: "2026-09-25",
    title: "Il film in sala, una sera",
    seo: "Il 27 ott 2026 «Égrégore» si vede al cinema, una sera, in più paesi. Non è un concerto e non sostituisce il disco del 30.",
    lede: "Pathé Live allarga le sale. La data resta il 27 ottobre 2026. Il disco esce tre giorni dopo.",
    body: [
      "«Égrégore», il film di circa 65 minuti, è annunciato per una sola sera: il 27 ottobre 2026. Non è il concerto Nevermore e non è una tournée nuova. È una proiezione, legata all'uscita del disco il 30 ottobre.",
      "Dopo Francia, Belgio e Svizzera, a fine settembre 2026 vengono aggiunti Canada e Messico, con sedute IMAX in alcune città francesi già esaurite e replicate. I registi associati pubblicamente ai brani includono Julia Ducournau, Gilles Lellouche, François Hanss, Antonin Baudry e i fratelli Poiraud.",
      "I biglietti non si comprano da questa edizione. Il collegamento utile è quello ufficiale del disco, che raccoglie i rivenditori.",
    ],
    release: "egregore",
  },
  {
    slug: "des-lols-esce",
    dateLabel: "11 set 2026",
    sort: "2026-09-11",
    title: "Esce «Des lols et des quoi»",
    seo: "L'11 set 2026 esce «Des lols et des quoi», con clip di Thierry e Didier Poiraud. Secondo singolo di Égrégore.",
    lede: "Tre minuti e trentotto in piattaforma. Il clip è sul canale ufficiale.",
    body: [
      "L'11 settembre 2026 esce «Des lols et des quoi». Testo di Mylène Farmer, musiche di DJ Lewis e Antoine Chatenet, clip di Thierry e Didier Poiraud. È il secondo singolo visibile della campagna di «Égrégore», dopo «C'est à qui le tour».",
      "Il video dura più del master, come spesso succede quando il clip non è un playback secco. L'ascolto del brano, in questa edizione, si apre dalla scheda, senza audio automatico.",
    ],
    release: "des-lols-et-des-quoi",
  },
  {
    slug: "data-del-disco",
    dateLabel: "24 giu 2026",
    sort: "2026-06-24",
    title: "Il disco ha un nome e un giorno",
    seo: "Il 24 giu 2026 viene fissata l'uscita di Égrégore: 30 ottobre 2026. Tredicesimo album in studio.",
    lede: "Hashtag NP pubblica la data. 30 ottobre 2026. Tredicesimo studio.",
    body: [
      "Il 24 giugno 2026 la società che rappresenta Mylène Farmer annuncia il titolo «Égrégore» e il giorno: 30 ottobre 2026. Franceinfo lo riporta il giorno dopo. È il tredicesimo album in studio, quattro anni dopo «L'Emprise».",
      "In quel momento il primo singolo, «C'est à qui le tour», è già fuori da quasi un mese. «Confession», l'inedito di Cannes 2025, verrà contato nel disco. La copertina mostrata nell'annuncio è una fotografia di Jean-Baptiste Mondino. Non la ripubblichiamo.",
    ],
    release: "egregore",
  },
  {
    slug: "primo-singolo",
    dateLabel: "29 mag 2026",
    sort: "2026-05-29",
    title: "«C'est à qui le tour» è in piattaforma",
    seo: "Dal 29 mag 2026 si ascolta «C'est à qui le tour», primo singolo del disco poi intitolato Égrégore.",
    lede: "Il disco non ha ancora il nome definitivo. Il singolo sì.",
    body: [
      "A fine maggio 2026 esce «C'est à qui le tour», prodotto da DJ Lewis. Le schede radio parlano di un tredicesimo album per l'autunno, senza ancora fissare il titolo «Égrégore». La durata è 2:49.",
      "Un maxi con remix — Ofenbach, Myd, Take a Daytrip, DJ Lewis — arriva nelle settimane successive. Quei remix non sono, di per sé, l'album.",
    ],
    release: "cest-a-qui-le-tour",
  },
  {
    slug: "cannes-confession",
    dateLabel: "13 mag 2025",
    sort: "2025-05-13",
    title: "A Cannes, «Confession»",
    seo: "Il 13 mag 2025 a Cannes Mylène Farmer canta «Confession», omaggio a David Lynch. Il brano entra in Égrégore.",
    lede: "Un inedito in apertura di festival. La dedica è a David Lynch.",
    body: [
      "Nel maggio 2025, al Festival di Cannes, Mylène Farmer canta «Confession». È un omaggio a David Lynch, non l'apertura di una campagna disco. Il brano resta in circolazione e, un anno dopo, viene incluso nel ciclo di «Égrégore».",
      "Tra questa sera e il 30 ottobre 2026 non c'è un album intero. C'è questo titolo, poi il silenzio di qualche mese, poi «C'est à qui le tour».",
    ],
    release: "confession",
  },
];

export const bio = {
  seo: "Bio di Mylène Farmer: dal 1984 a Égrégore, 30 ott 2026. Testi suoi, pochi dischi, scene grandi. Edizione italiana.",
  paragraphs: [
    "Mylène Farmer firma i propri testi dal 1984 e li mette, quasi sempre, dentro una scena più grande della canzone. Il nome in copertina non è quello di nascita. Mylène Jeanne Gautier nasce il 12 settembre 1961 a Pierrefonds, in Québec, e cresce in Francia. Le interviste restano rare. I dischi non seguono il calendario dell'industria: arrivano quando il lavoro è chiuso, non quando il trimestre lo chiede.",
    "Il primo tempo è quello scritto con Laurent Boutonnat, immagini comprese. «Maman a tort» esce nel 1984. «Cendres de lune» nel 1986, «Ainsi soit je...» nel 1988, «L'autre...» nel 1991. Da «Désenchantée» in poi le sale diventano stadi e residenze: Bercy, poi i tour che portano il titolo di un disco — Mylenium, Avant que l'ombre, N°5 on Tour, Timeless. I clip, fin dall'inizio, durano quanto un cortometraggio. Non sono un contorno promozionale.",
    "Il secondo tempo allarga i compositori senza cambiare la firma dei testi. «Anamorphosée», 1995, si registra a Los Angeles e sposta le chitarre avanti. «Bleu noir», 2010, mette sullo stesso disco Moby, RedOne e Archive. «Interstellaires», 2015, include «Stolen Car», cantata con Sting. «Désobéissance», 28 settembre 2018, è pubblicato da Sony dopo una lunga stagione Polydor; dentro c'è «N'oublie pas», con LP.",
    "Il terzo tempo è quello che si sta ascoltando adesso, o che si sta per ascoltare. «L'Emprise» esce il 25 novembre 2022: Woodkid ne firma la maggior parte delle musiche, con brani anche di Moby, Archive e AaRON. Nel 2023 la tournée Nevermore riempie di nuovo le grandi venue; il live esce nel 2024. Il 13 maggio 2025, a Cannes, canta «Confession», inedito pensato come omaggio a David Lynch.",
    "Il 30 ottobre 2026 esce «Égrégore», tredicesimo album in studio, su Stuffed Monkey con Sony. I brani già pubblici sono «C'est à qui le tour», «Des lols et des quoi» e «Confession». Il 7 ottobre 2026 DJ Snake annuncia una collaborazione: il titolo non è stato pubblicato. Il 27 ottobre un film di circa 65 minuti, con più registi, viene proiettato per una sera. Non è un concerto. Al 14 ottobre 2026 nessuna data di tour risulta annunciata.",
    "Il management è Hashtag NP, società fondata da Pascal Nègre insieme a Live Nation. Le cifre di vendita che circolano in stampa stanno sopra i 30 milioni di dischi: il numero esatto cambia secondo la fonte, e qui non viene arrotondato a uno slogan. Si ascolta il disco. Il resto è scena, e la scena ha le sue date, quando ci sono.",
  ],
};

export function getRelease(slug: string) {
  return releases.find((item) => item.slug === slug);
}

export function getNews(slug: string) {
  return news.find((item) => item.slug === slug);
}

export function listenLinks(title: string, youtubeId?: string) {
  const q = encodeURIComponent(`Mylène Farmer ${title}`);
  return [
    { name: "Spotify", href: `https://open.spotify.com/search/${q}` },
    { name: "Apple Music", href: `https://music.apple.com/fr/search?term=${q}` },
    { name: "Deezer", href: `https://www.deezer.com/search/${q}` },
    {
      name: "YouTube",
      href: youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : `https://www.youtube.com/results?search_query=${q}`,
    },
  ];
}

export const featured = releases.find((item) => item.slug === "egregore")!;
export const secondary = releases.filter((item) => item.homeSecondary);

export const kindLabel: Record<Kind, string> = {
  album: "Album",
  single: "Singolo",
  live: "Live",
};
