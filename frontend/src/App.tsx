import { lazy, Suspense, useEffect, useState, type CSSProperties, type MouseEvent } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CircuitBoard,
  Drill,
  FileCheck2,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Waypoints,
} from 'lucide-react';

const NexumScene = lazy(() => import('./components/NexumScene'));

type CompanyKey = 'dc' | 'teq';
type PageKey = 'home' | CompanyKey;

type Company = {
  key: CompanyKey;
  name: string;
  label: string;
  headline: string;
  intro: string;
  accent: string;
  path: string;
  contact: string;
  icon: typeof Drill;
  highlights: string[];
  capabilities: Array<{
    title: string;
    copy: string;
  }>;
  process: string[];
};

const companies: Record<CompanyKey, Company> = {
  dc: {
    key: 'dc',
    name: 'NexumDC',
    label: 'Drilling consumables',
    headline: 'Dedicated supply for drilling consumables.',
    intro:
      'NexumDC serves drilling operations with consumables, sourcing discipline, stock visibility, and field support continuity.',
    accent: 'var(--industrial)',
    path: '/nexumdc',
    contact: 'mailto:nexumdc@nexum.example',
    icon: Drill,
    highlights: ['Bits and reamers', 'Consumables sourcing', 'Stock discipline', 'Field support continuity'],
    capabilities: [
      {
        title: 'Consumables Focus',
        copy: 'A focused supply route for drilling consumables and related operational requirements.',
      },
      {
        title: 'Sourcing Discipline',
        copy: 'Supplier options, availability checks, and procurement rhythm handled with clear ownership.',
      },
      {
        title: 'Field Continuity',
        copy: 'Support built around the practical timing and reliability expectations of field operations.',
      },
    ],
    process: ['Identify requirement', 'Source and confirm', 'Prepare supply', 'Support field continuity'],
  },
  teq: {
    key: 'teq',
    name: 'NexumTeQ',
    label: 'Technology company',
    headline: 'Dedicated technology delivery.',
    intro:
      'NexumTeQ builds software platforms, workflow automation, integrations, and applied technical systems.',
    accent: 'var(--tech)',
    path: '/nexumteq',
    contact: 'mailto:nexumteq@nexum.example',
    icon: CircuitBoard,
    highlights: ['Custom software platforms', 'Workflow automation', 'Systems integration', 'Technical delivery'],
    capabilities: [
      {
        title: 'Software Platforms',
        copy: 'Custom product and platform work shaped around operational needs and maintainable delivery.',
      },
      {
        title: 'Automation',
        copy: 'Workflow automation that reduces repeated work and improves visibility across technical tasks.',
      },
      {
        title: 'Systems Integration',
        copy: 'Connected tools, data movement, and applied systems delivered with practical engineering standards.',
      },
    ],
    process: ['Define scope', 'Design system', 'Build and integrate', 'Deploy and support'],
  },
};

const umbrellaStandards = [
  {
    title: 'Umbrella Clarity',
    copy: 'Nexum presents the parent identity first, then directs each visitor to the right company page.',
    icon: Building2,
  },
  {
    title: 'Independent Focus',
    copy: 'Each subcompany keeps its own role, language, contact path, and operating surface.',
    icon: Waypoints,
  },
  {
    title: 'Brand Standard',
    copy: 'Nexum maintains the quality bar and brand discipline across its separate companies.',
    icon: BadgeCheck,
  },
  {
    title: 'Direct Entry',
    copy: 'Company-specific needs begin on the company-specific page with a direct contact path.',
    icon: FileCheck2,
  },
];

const companyKeys: CompanyKey[] = ['dc', 'teq'];

function getPageFromPath(pathname: string): PageKey {
  if (pathname.toLowerCase().includes('nexumdc')) return 'dc';
  if (pathname.toLowerCase().includes('nexumteq')) return 'teq';

  return 'home';
}

function App() {
  const [page, setPage] = useState<PageKey>(() => getPageFromPath(window.location.pathname));
  const activeCompany = page === 'home' ? 'dc' : page;

  useEffect(() => {
    const handlePopState = () => setPage(getPageFromPath(window.location.pathname));

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page]);

  function navigate(path: string, event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    window.history.pushState({}, '', path);
    setPage(getPageFromPath(path));
  }

  return (
    <main>
      {page === 'home' ? (
        <HomePage activeCompany={activeCompany} navigate={navigate} />
      ) : (
        <CompanyPage company={companies[page]} navigate={navigate} />
      )}
    </main>
  );
}

type NavigateHandler = (path: string, event: MouseEvent<HTMLAnchorElement>) => void;

function Nav({ compact = false, navigate }: { compact?: boolean; navigate: NavigateHandler }) {
  return (
    <nav className="nav" aria-label="Primary navigation">
      <a className="brand-mark" href="/" onClick={(event) => navigate('/', event)} aria-label="Nexum home">
        <span>N</span>
        Nexum
      </a>
      <div className="nav-links">
        {compact ? (
          <>
            <a href="/" onClick={(event) => navigate('/', event)}>
              Home
            </a>
            <a href="#contact">Contact</a>
          </>
        ) : (
          <>
            <a href="#about">About</a>
            <a href="#companies">Companies</a>
            <a href="#standards">Standards</a>
            <a href="#contact">Contact</a>
          </>
        )}
      </div>
    </nav>
  );
}

function HomePage({ activeCompany, navigate }: { activeCompany: CompanyKey; navigate: NavigateHandler }) {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <Suspense fallback={<div className="scene-wrap scene-fallback" aria-hidden="true" />}>
          <NexumScene activeCompany={activeCompany} />
        </Suspense>
        <Nav navigate={navigate} />

        <div className="hero-content" id="top">
          <div className="hero-kicker">
            <Sparkles size={18} aria-hidden="true" />
            Umbrella company
          </div>
          <h1 id="hero-title">Nexum</h1>
          <p className="hero-copy">
            As the parent company, Nexum oversees and supports a growing portfolio of specialist businesses in mining related 
            technology and services. By combining strategic leadership with shared brand values, Nexum creates a cohesive 
            group of companies built for innovation, reliability, and long-term growth.
          </p>
          <div className="hero-actions" aria-label="Explore Nexum companies">
            {companyKeys.map((key) => {
              const company = companies[key];

              return (
                <a
                  className={`primary-action action-${key}`}
                  href={company.path}
                  key={company.name}
                  onClick={(event) => navigate(company.path, event)}
                >
                  Visit {company.name}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="signal-strip" aria-label="Nexum company directory">
          <div>
            <strong>Nexum</strong>
            <span>Umbrella company</span>
          </div>
          <div>
            <strong>NexumDC</strong>
            <span>Own company page</span>
          </div>
          <div>
            <strong>NexumTeQ</strong>
            <span>Own company page</span>
          </div>
        </div>
      </section>

      <section className="about-section" id="about" aria-labelledby="about-title">
        <div className="about-copy">
          <span className="eyebrow">About Nexum</span>
          <h2 id="about-title">The parent company comes first.</h2>
        </div>
        <div className="about-details">
          <p>Nexum is the parent company overseeing a portfolio of specialised businesses.</p>
          <p>It provides the unified brand identity, strategic direction, and presentation standards that connect each company within the group.</p>
          <p>Each subsidiary operates through its own dedicated platform, with distinct services, expertise, and communication channels tailored to its industry.</p>
          <p>Select a company below to explore its services and access its dedicated page.</p>
        </div>
      </section>

      <section className="companies-section" id="companies" aria-labelledby="companies-title">
        <div className="section-heading">
          <span className="eyebrow">Subcompanies</span>
          <h2 id="companies-title">Choose the company you need.</h2>
        </div>

        <div className="company-grid company-grid--directory">
          {companyKeys.map((key) => {
            const company = companies[key];
            const Icon = company.icon;

            return (
              <article
                className={`company-card company-card--${key}`}
                id={key === 'dc' ? 'nexumdc' : 'nexumteq'}
                key={company.name}
                style={{ '--company-accent': company.accent } as CSSProperties}
              >
                <div className="company-topline">
                  <span className="company-icon">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span>{company.label}</span>
                </div>
                <h3>{company.name}</h3>
                <p className="company-title">{company.headline}</p>
                <p>{company.intro}</p>
                <ul aria-label={`${company.name} focus areas`}>
                  {company.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <a href={company.path} onClick={(event) => navigate(company.path, event)} className="company-link">
                  Open {company.name}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="model-section" id="standards" aria-labelledby="standards-title">
        <div className="model-copy">
          <span className="eyebrow">Nexum standard</span>
          <h2 id="standards-title">A clear parent brand with separate company routes.</h2>
          <p>Nexum introduces the group, then lets each subcompany speak for itself on its own page.</p>
        </div>

        <div className="strength-grid">
          {umbrellaStandards.map((standard) => {
            const Icon = standard.icon;

            return (
              <article className="strength-card" key={standard.title}>
                <Icon size={24} aria-hidden="true" />
                <h3>{standard.title}</h3>
                <p>{standard.copy}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div>
          <span className="eyebrow">Nexum contact</span>
          <h2 id="contact-title">Start with the umbrella company.</h2>
        </div>
        <a className="primary-action" href="mailto:hello@nexum.example">
          Contact Nexum
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </section>
    </>
  );
}

function CompanyPage({ company, navigate }: { company: Company; navigate: NavigateHandler }) {
  const Icon = company.icon;

  return (
    <>
      <section
        className={`hero company-hero company-hero--${company.key}`}
        aria-labelledby="company-title"
        style={{ '--company-accent': company.accent } as CSSProperties}
      >
        <Suspense fallback={<div className="scene-wrap scene-fallback" aria-hidden="true" />}>
          <NexumScene activeCompany={company.key} />
        </Suspense>
        <Nav compact navigate={navigate} />

        <div className="hero-content" id="top">
          <a className="back-link" href="/" onClick={(event) => navigate('/', event)}>
            <ArrowLeft size={17} aria-hidden="true" />
            Nexum
          </a>
          <div className="hero-kicker">
            <Icon size={18} aria-hidden="true" />
            {company.label}
          </div>
          <h1 id="company-title">{company.name}</h1>
          <p className="hero-copy">{company.intro}</p>
          <div className="hero-actions">
            <a className={`primary-action action-${company.key}`} href={company.contact}>
              Contact {company.name}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="company-strip" aria-label={`${company.name} focus`}>
          {company.highlights.map((highlight) => (
            <div key={highlight}>
              <strong>{highlight}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="company-page-section" aria-labelledby="capabilities-title">
        <div className="section-heading">
          <span className="eyebrow">{company.name}</span>
          <h2 id="capabilities-title">{company.headline}</h2>
        </div>
        <div className="capability-grid">
          {company.capabilities.map((capability) => (
            <article className="strength-card" key={capability.title}>
              <ShieldCheck size={24} aria-hidden="true" />
              <h3>{capability.title}</h3>
              <p>{capability.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="company-page-section" aria-labelledby="process-title">
        <div className="flow-heading">
          <PackageCheck size={28} aria-hidden="true" />
          <h2 id="process-title">{company.name} process</h2>
        </div>
        <div className="flow-track">
          {company.process.map((item, index) => (
            <div className="flow-step" key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="company-contact-title">
        <div>
          <span className="eyebrow">Company contact</span>
          <h2 id="company-contact-title">Speak with {company.name}.</h2>
        </div>
        <a className={`primary-action action-${company.key}`} href={company.contact}>
          Contact {company.name}
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </section>
    </>
  );
}

export default App;
