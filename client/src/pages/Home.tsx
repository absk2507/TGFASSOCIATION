/**
 * TGF ASSOCIATION design reminder: preserve the long-form festival archive
 * rhythm, use parchment, indigo and saffron, with Fraunces editorial display
 * type and DM Sans metadata.
 */
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  Copy,
  Heart,
  Home as HomeIcon,
  Instagram,
  Landmark,
  Mail,
  MapPin,
  Menu,
  MessageCircleHeart,
  Phone,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const assetPath = (name: string) => `./assets/${name}`;

const assets = {
  logo: assetPath("tgf-logo.webp"),
  hero: assetPath("hero-ganesha.jpg"),
  idol2025: assetPath("idol-2025.webp"),
  idol2024: assetPath("idol-2024.webp"),
  idol2023: assetPath("idol-2023.webp"),
  idol2022: assetPath("idol-2022.webp"),
  idol2021: assetPath("idol-2021.webp"),
  auction: assetPath("auction-celebration.jpg"),
  group: assetPath("community-together.webp"),
  community: assetPath("festival-community.jpg"),
  procession: assetPath("festival-procession.jpg"),
};

const navItems = [
  ["Idols", "gallery"],
  ["Nimarjanam", "immersion"],
  ["Laddu Auction", "auction"],
  ["The Gang", "gang"],
  ["Members", "members"],
  ["Donate", "donate"],
  ["Find Us", "find-us"],
] as const;

const archive = [
  { year: "2026", date: "14 Sep 2026", image: null, status: "Loading...", disabled: true, note: "2026 preparations in progress" },
  { year: "2025", date: "27 Aug 2025", image: assets.idol2025, status: "Album", disabled: false },
  { year: "2024", date: "07 Sep 2024", image: assets.idol2024, status: "Album", disabled: false },
  { year: "2023", date: "19 Sep 2023", image: assets.idol2023, status: "Album", disabled: false },
  { year: "2022", date: "31 Aug 2022", image: assets.idol2022, status: "Album", disabled: false },
  { year: "2021", date: "10 Sep 2021", image: assets.idol2021, status: "Album", disabled: false },
];

const immersionAlbums = [
  { year: "2026", image: null, status: "Loading...", description: "2026 Nimarjanam send-off memories will be published after the festival.", disabled: true },
  { year: "2025", image: assets.procession, status: "Album", description: "Photos and videos from the 2025 send-off.", disabled: false },
  { year: "2024", image: assets.community, status: "Album", description: "Photos and videos from the 2024 send-off.", disabled: false },
  { year: "2023", image: assets.procession, status: "Album", description: "Photos and videos from the 2023 send-off.", disabled: false },
  { year: "2022", image: assets.community, status: "Album", description: "Photos and videos from the 2022 send-off.", disabled: false },
  { year: "2021", image: assets.procession, status: "Album", description: "Photos and videos from the 2021 send-off.", disabled: false },
];

const auctionYears = [
  { year: "2026", image: null, record: "Coming Soon", title: "Ganesh Chaturthi 2026", note: "The 2026 laddu auction will take place during festival celebrations. Winning contribution details will be recorded here.", isUpcoming: true },
  { year: "2025", image: assets.auction, record: "Rs. 16,000", title: "Won by Kiran and Sravan", note: "The winning contribution carries the celebration into the next year, supporting setup, decorations, prizes, and prasadam." },
  { year: "2024", image: assets.auction, record: "Rs. 15,000", title: "2024 Auction Record", note: "The 2024 winning contribution is preserved in the TGF Association annual ledger." },
  { year: "2023", image: assets.auction, record: "Rs. 13,500", title: "2023 Auction Record", note: "The 2023 winning contribution supported festival celebrations and community prasadam." },
  { year: "2022", image: assets.auction, record: "Rs. 11,000", title: "2022 Auction Record", note: "The 2022 winning contribution supported setup and community events." },
  { year: "2021", image: assets.auction, record: "Rs. 9,500", title: "2021 Auction Record", note: "The inaugural 2021 winning contribution helped inaugurate our annual community tradition." },
];

const seniorMembers = [
  { name: "Tarun Teja", role: "Founder", initials: "TT", hue: "#26275e" },
  { name: "Pavan", role: "Treasurer", initials: "P", hue: "#b87a36" },
];

const youthMembers = [
  { name: "Akhil Hari", role: "Event Organizer", initials: "AH", hue: "#3c3f81" },
  { name: "Balu", role: "Creative Director", initials: "B", hue: "#a54c64" },
  { name: "Sravan", role: "Volunteer", initials: "S", hue: "#50528f" },
];

const contactPhones = [
  { raw: "+919059307481", display: "+91 90593 07481", id: "phone1" },
  { raw: "+919391277632", display: "+91 93912 77632", id: "phone2" },
  { raw: "+917386616435", display: "+91 73866 16435", id: "phone3" },
];
const contactEmail = "tgfassociation@gmail.com";

function SectionHeading({ icon, eyebrow, title, description }: { icon: React.ReactNode; eyebrow: string; title: string; description: string }) {
  return (
    <div className="section-heading">
      <div className="eyebrow"><span className="section-seal">{icon}</span>{eyebrow}</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [openMenu, setOpenMenu] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const submitComment = trpc.comments.submit.useMutation({
    onSuccess: () => {
      toast.success("Thank you! Your comment has been sent to TGF Association.");
    },
    onError: () => toast.error("Sorry, we couldn't send your comment. Please try again."),
  });

  const copyToClipboard = async (text: string, key: string, label: string) => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopiedKey(key);
      toast.success(`${label} copied to your clipboard`);
      window.setTimeout(() => setCopiedKey(curr => (curr === key ? null : curr)), 1800);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const copyUpi = () => copyToClipboard("tgfassociation@upi", "upi", "UPI ID");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitComment.isPending) return;

    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get("name") || "").trim();
    const message = String(values.get("message") || "").trim();

    if (!name) {
      toast.error("Please enter your name.");
      const nameInput = form.elements.namedItem("name") as HTMLInputElement | null;
      nameInput?.focus();
      return;
    }

    if (!message) {
      toast.error("Please enter your comment.");
      const messageInput = form.elements.namedItem("message") as HTMLTextAreaElement | null;
      messageInput?.focus();
      return;
    }

    submitComment.mutate(
      { name, message },
      { onSuccess: () => form.reset() },
    );
  };

  const handleArchiveAction = (label: string) => toast(`${label} will open shortly.`);

  return (
    <div className="archive-shell">
      <header className="site-header">
        <div className="nav-shell">
          <button className="brand" onClick={() => scrollToId("top")} aria-label="TGF ASSOCIATION home">
            <span className="brand-emblem"><img src={assets.logo} alt="TGF ASSOCIATION logo" width={40} height={40} decoding="async" fetchPriority="high" /></span>
            <span className="brand-word">TGF ASSOCIATION</span>
          </button>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map(([label, id]) => <button key={id} onClick={() => scrollToId(id)}>{label}</button>)}
          </nav>
          <a className="follow-button" href="https://www.instagram.com/bundooks.crew?igsi=ajM2anZ4eWh3bDg4&utm_source=qr" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><Instagram size={15} /> bundooks.crew</a>
          <button className="menu-button" onClick={() => setOpenMenu(!openMenu)} aria-label="Toggle navigation menu">{openMenu ? <X /> : <Menu />}</button>
        </div>
        {openMenu && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {navItems.map(([label, id]) => (
              <button key={id} onClick={() => { scrollToId(id); setOpenMenu(false); }}>{label}<ChevronRight size={16} /></button>
            ))}
          </nav>
        )}
      </header>

      <main id="top">
        <section className="hero" style={{ backgroundImage: `url(${assets.hero})` }}>
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-kicker"><span className="mini-logo"><img src={assets.logo} alt="TGF ASSOCIATION logo" width={44} height={44} decoding="async" fetchPriority="high" /></span><div><strong>NTR NAGAR, ROAD NO:10, 11, 12.</strong><span>TGF ASSOCIATION community archive</span></div></div>
            <h1>TGF ASSOCIATION</h1>
            <p>A TGF ASSOCIATION collective celebrating Ganesh Chaturthi every year with idols, immersion, laddu auctions, and community memories.</p>
            <div className="hero-actions">
              <button className="button primary" onClick={() => scrollToId("gallery")}><Camera size={16} /> Open our archive</button>
              <button className="button light" onClick={() => scrollToId("donate")}><Heart size={16} /> Support Next Year</button>
            </div>
          </div>
        </section>

        <section className="event-ribbon" aria-label="Community details">
          <span><CalendarDays size={15} /> Ganesh Chaturthi 2026</span><span><UsersRound size={15} /> TGF ASSOCIATION GROUP</span><span><Landmark size={15} /> Donations through UPI</span>
        </section>

        <section className="chapter" id="gallery">
          <div className="wide-container">
            <SectionHeading icon={<Camera size={14} />} eyebrow="Gallery" title="Our idols, year by year" description="A living archive of the Ganesh idols welcomed home by TGF ASSOCIATION, arranged as a side-by-side collection of annual albums." />
            <div className="archive-grid">
              {archive.map((card, idx) => (
                <article className={`archive-card ${card.year === "2025" ? "featured-record" : ""}`} key={card.year}>
                  {card.image ? (
                    <img
                      src={card.image}
                      alt={`${card.year} Ganesh Chaturthi idol`}
                      width={310}
                      height={285}
                      loading={idx <= 2 ? "eager" : "lazy"}
                      decoding="async"
                      {...(idx <= 2 ? { fetchPriority: "high" as const } : {})}
                    />
                  ) : (
                    <div className="card-placeholder">
                      <Sparkles size={24} className="placeholder-icon" />
                      <span>{card.year === "2026" ? "Celebration 2026" : `${card.year} Archive`}</span>
                      <small>{card.note || "Loading memories..."}</small>
                    </div>
                  )}
                  <div className="archive-copy">
                    <div className="card-topline"><h3>{card.year}</h3><span>{card.status}</span></div>
                    <p className="small-line">{card.date}</p>
                    <button className="archive-action" disabled={card.disabled} onClick={() => handleArchiveAction(`${card.year} gallery`)}>
                      {card.disabled ? (card.year === "2026" ? "Coming Soon" : "Archive Record") : `Open ${card.year} memories`}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="chapter divider" id="immersion">
          <div className="wide-container">
            <SectionHeading icon={<Sparkles size={14} />} eyebrow="Immersion" title="Nimarjanam memories" description="The final send-off each year, with colors, water, drums, and the walk that closes the celebration." />
            <div className="immersion-grid">
              {immersionAlbums.map((album) => (
                <article className="immersion-card" key={album.year}>
                  {album.image ? (
                    <img
                      src={album.image}
                      alt={`${album.year} immersion memories`}
                      width={240}
                      height={220}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="card-placeholder immersion-placeholder">
                      <Sparkles size={22} className="placeholder-icon" />
                      <span>{album.year === "2026" ? "Nimarjanam 2026" : `${album.year} Send-off`}</span>
                      <small>Coming Soon</small>
                    </div>
                  )}
                  <div>
                    <div className="card-topline"><h3>{album.year}</h3><span>{album.status}</span></div>
                    <p className="small-line">Immersion album</p>
                    <p>{album.description}</p>
                    <button className="archive-action" disabled={album.disabled} onClick={() => handleArchiveAction(`${album.year} immersion album`)}>
                      {album.disabled ? "Coming Soon" : `Open the ${album.year} send-off`}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="chapter divider" id="auction">
          <div className="wide-container">
            <SectionHeading icon={<Landmark size={14} />} eyebrow="Auction" title="Laddu Auction, year by year" description="A side-by-side TGF ledger of the winning moments and stories that help carry each celebration into the next year." />
            <div className="auction-rail">
              {auctionYears.map((auction) => (
                <article className="auction-year-card" key={auction.year}>
                  {auction.image ? (
                    <img
                      src={auction.image}
                      alt={`${auction.year} laddu auction archive`}
                      width={310}
                      height={230}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="card-placeholder auction-placeholder">
                      <Landmark size={24} className="placeholder-icon" />
                      <span>{auction.year === "2026" ? "Laddu Auction 2026" : `${auction.year} Ledger`}</span>
                      <small>Coming Soon</small>
                    </div>
                  )}
                  <div className="auction-year-copy">
                    <span className="auction-folio">LADDU LEDGER / {auction.year}</span>
                    <h3>{auction.record}</h3>
                    <h4>{auction.title}</h4>
                    <p>{auction.note}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="chapter divider" id="gang">
          <div className="wide-container">
            <SectionHeading icon={<UsersRound size={14} />} eyebrow="The gang" title="TGF ASSOCIATION, together" description="The friends and volunteers who show up every year and make the celebration feel like home." />
            <figure className="group-photo">
              <img
                src={assets.group}
                alt="TGF ASSOCIATION community volunteers together"
                width={1000}
                height={560}
                loading="lazy"
                decoding="async"
              />
              <figcaption>One TGF, many hands, and a shared reason to return every year.</figcaption>
            </figure>
          </div>
        </section>

        <section className="chapter divider" id="members">
          <div className="wide-container">
            <SectionHeading icon={<UsersRound size={14} />} eyebrow="TGF ASSOCIATION" title="The hands behind TGF" description="The people who arrange the lights, remember the small details, and return every year to bring our Ganesh Chaturthi home." />

            <div className="member-group">
              <h3 className="member-group-title">Senior (Members & Guides)</h3>
              <div className="member-strip" role="list">
                {seniorMembers.map((member, index) => (
                  <article key={member.name} className="member-card senior-card" role="listitem">
                    <span className="member-folio">Senior / 0{index + 1}</span>
                    <div className="member-avatar" style={{ background: member.hue }}>{member.initials}</div>
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="member-group" style={{ marginTop: "1.8rem" }}>
              <h3 className="member-group-title">Youth (Members & Volunteers)</h3>
              <div className="member-strip" role="list">
                {youthMembers.map((member, index) => (
                  <article key={member.name} className="member-card youth-card" role="listitem">
                    <span className="member-folio">Youth / 0{index + 1}</span>
                    <div className="member-avatar" style={{ background: member.hue }}>{member.initials}</div>
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="chapter divider" id="donate">
          <div className="wide-container">
            <SectionHeading icon={<Heart size={14} />} eyebrow="Support" title="Support TGF ASSOCIATION" description="Contributions support TGF, decorations, prasadam, sound system, idol, and community gifts." />
            <div className="support-layout">
              <div className="qr-card" aria-label="QR code placeholder"><div className="qr-folio">NTR NAGAR LEDGER / 2026</div><div className="qr-grid"><div className="qr-center">₹</div></div><span>Scan to support via UPI</span></div>
              <div className="support-card"><div className="upi-apps"><span>PhonePe</span><span>Google Pay</span><span>Paytm</span><span>BHIM</span></div><h3>Support TGF ASSOCIATION</h3><p>Scan the QR code or use the UPI ID below from any UPI app.</p><div className="upi-id"><div><span>UPI ID</span><b>tgfassociation@upi</b></div><button onClick={copyUpi}>{copiedKey === "upi" ? <Check size={15} /> : <Copy size={15} />}{copiedKey === "upi" ? "Copied" : "Copy"}</button></div></div>
            </div>
          </div>
        </section>

        <section className="chapter divider" id="find-us">
          <div className="wide-container">
            <SectionHeading icon={<MapPin size={14} />} eyebrow="Find us" title="The way back to NTR NAGAR" description="Visit TGF in NTR NAGAR, or find a familiar TGF ASSOCIATION voice for celebration updates and contributions." />
            <div className="contact-grid">
              <article className="contact-card">
                <div className="contact-icon"><HomeIcon size={20} /></div>
                <h3>TGF ASSOCIATION</h3>
                <p>NTR NAGAR, ROAD NO:10, 11, 12.</p>
                <a className="button primary compact" href="https://maps.app.goo.gl/GNckd875jwQb6S1v5?g_st=ic" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><MapPin size={14} /> Pin TGF</a>
              </article>
              <article className="contact-card">
                <div className="contact-icon saffron"><MessageCircleHeart size={20} /></div>
                <h3>Reach our circle</h3>
                {contactPhones.map(phone => (
                  <div className="contact-item-row" key={phone.id}>
                    <a href={`tel:${phone.raw}`} aria-label={`Call ${phone.display}`}><Phone size={13} /> {phone.display}</a>
                    <button
                      type="button"
                      className="copy-btn"
                      onClick={() => copyToClipboard(phone.display, phone.id, phone.display)}
                      aria-label={`Copy phone number ${phone.display}`}
                      title="Copy phone number"
                    >
                      {copiedKey === phone.id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      <span>{copiedKey === phone.id ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                ))}
                <div className="contact-item-row">
                  <a href={`mailto:${contactEmail}`} aria-label={`Email ${contactEmail}`}><Mail size={13} /> {contactEmail}</a>
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={() => copyToClipboard(contactEmail, "email", contactEmail)}
                    aria-label="Copy email address"
                    title="Copy email address"
                  >
                    {copiedKey === "email" ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    <span>{copiedKey === "email" ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="chapter divider feedback-section" id="feedback">
          <div className="wide-container">
            <SectionHeading icon={<Mail size={14} />} eyebrow="Comments" title="Share a comment with TGF" description="Every comment is saved for TGF ASSOCIATION and sends an owner notification when it arrives." />
            <form className="feedback-form" onSubmit={handleSubmit} noValidate>
              <label>
                Name *
                <input
                  name="name"
                  required
                  maxLength={120}
                  placeholder="Your name"
                  disabled={submitComment.isPending}
                />
              </label>
              <label className="comment-field">
                Comment *
                <textarea
                  name="message"
                  required
                  maxLength={2000}
                  placeholder="Write your comment here..."
                  disabled={submitComment.isPending}
                />
              </label>
              <button
                className="button primary compact"
                type="submit"
                disabled={submitComment.isPending}
              >
                {submitComment.isPending ? "Sending..." : "Send comment"} <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer><div className="wide-container footer-content"><span className="footer-identity"><img src={assets.logo} alt="TGF ASSOCIATION logo" width={26} height={26} loading="lazy" decoding="async" />2026 TGF ASSOCIATION, NTR NAGAR, ROAD NO:10, 11, 12.</span><a className="footer-button" href="https://www.instagram.com/bundooks.crew?igsi=ajM2anZ4eWh3bDg4&utm_source=qr" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><Instagram size={15} /> bundooks.crew</a></div></footer>
    </div>
  );
}
