import { Fragment, lazy, Suspense, useState } from 'react';
import {
  ArrowUpRight,
  CircuitBoard,
  Drill,
  Network,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Waypoints,
  Workflow,
} from 'lucide-react';

const NexumScene = lazy(() => import('./components/NexumScene'));

type CompanyKey = 'dc' | 'teq';

const companies = {
  dc: {
    name: 'NexumDC',
    label: 'Drilling consumables',
    title: 'Field-ready drilling supply for demanding operations.',
    copy:
      'NexumDC keeps drilling teams supplied with dependable drilling consumables, sourcing discipline, stock visibility, and field continuity.',
    accent: 'var(--industrial)',
    icon: Drill,
    metrics: ['Bits, Reamers,', 'Sourcing and stock discipline', 'Field support continuity'],
  },
  teq: {
    name: 'NexumTeQ',
    label: 'Technology company',
    title: 'Software, automation, and technical delivery.',
    copy:
      'NexumTeQ builds the digital products, automation layers, integrations, and applied systems that make modern operations sharper.',
    accent: 'var(--tech)',
    icon: CircuitBoard,
    metrics: ['Custom software platforms', 'Systems integration'],
  },
};

const strengths = [
  {
    title: 'Field Readiness',
    copy: 'Consumables, parts, sourcing, and supply rhythm handled with the discipline that field operations need.',
    icon: PackageCheck,
  },
  {
    title: 'Technical Intelligence',
    copy: 'Software, automation, and systems thinking that bring visibility and better decisions into everyday work.',
    icon: CircuitBoard,
  },
  {
    title: 'Delivery Standard',
    copy: 'Reliability, delivery quality, and long-term relationships held to a clear Nexum standard.',
    icon: Waypoints,
  },
  {
    title: 'Accountable Delivery',
    copy: 'Clear ownership from first contact, whether the need is practical supply or technical execution.',
    icon: ShieldCheck,
  },
];

const timeline = [
  'Source critical consumables',
  'Support field operations',
  'Build digital workflows',
  'Deploy technical systems',
];

const companyKeys: CompanyKey[] = ['dc', 'teq'];

function App() {
  const [activeCompany, setActiveCompany] = useState<CompanyKey>('dc');

  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <Suspense fallback={<div className="scene-wrap scene-fallback" aria-hidden="true" />}>
          <NexumScene activeCompany={activeCompany} />
        </Suspense>
        <nav className="nav" aria-label="Primary navigation">
          <a className="brand-mark" href="#top" aria-label="Nexum home">
            <span>N</span>
            Nexum
          </a>
          <div className="nav-links">
            <a href="#companies">Companies</a>
            <a href="#about">About Us</a>
            <a href="#model">Model</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        <div className="hero-content" id="top">
          <div className="hero-kicker">
            <Sparkles size={18} aria-hidden="true" />
            Field supply and technology
          </div>
          <h1 id="hero-title">Nexum</h1>
          <p className="hero-copy">
            NexumDC supports drilling consumables. NexumTeQ builds technology systems for clearer, faster operations.
          </p>
          <div className="hero-actions" aria-label="Explore Nexum companies">
            <a className="primary-action action-dc" href="#nexumdc" onMouseEnter={() => setActiveCompany('dc')}>
              NexumDC
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a className="secondary-action action-teq" href="#nexumteq" onMouseEnter={() => setActiveCompany('teq')}>
              NexumTeQ
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="signal-strip" aria-label="Nexum operating signals">
          <div>
            <strong>DC</strong>
            <span>Drilling consumables</span>
          </div>
          <div>
            <strong>Nexum</strong>
          </div>
          <div>
            <strong>TeQ</strong>
            <span>Technology systems</span>
          </div>
        </div>
      </section>

      <section className="about-section" id="about" aria-labelledby="about-title">
        <div className="about-copy">
          <span className="eyebrow">About us</span>
          <h2 id="about-title">Practical delivery for field supply and technology work.</h2>
        </div>
        <div className="about-details">
          <p>
            Nexum keeps the experience direct, technical, and delivery-minded for teams that need dependable execution.
          </p>
          <p>
            NexumDC focuses on drilling consumables, sourcing discipline, stock visibility, and field continuity.
          </p>
          <p>
            NexumTeQ focuses on software platforms, workflow automation, systems integration, and applied technical
            delivery.
          </p>
        </div>
      </section>

      <section className="companies-section" id="companies" aria-labelledby="companies-title">
        <div className="section-heading">
          <span className="eyebrow">Company routes</span>
          <h2 id="companies-title">Two specialist companies with distinct roles.</h2>
        </div>

        <div className="company-grid">
          {companyKeys.map((key, index) => {
            const company = companies[key];
            const Icon = company.icon;

            return (
              <Fragment key={company.name}>
                {index === 1 && (
                  <aside className="nexus-bridge" aria-hidden="true">
                    <span className="bridge-dot" />
                    <div className="bridge-line" />
                    <div className="bridge-copy">
                      <Workflow size={20} aria-hidden="true" />
                    </div>
                    <div className="bridge-line" />
                    <span className="bridge-dot" />
                  </aside>
                )}

                <article
                  className={`company-card company-card--${key} ${activeCompany === key ? 'is-active' : ''}`}
                  id={key === 'dc' ? 'nexumdc' : 'nexumteq'}
                  onFocus={() => setActiveCompany(key)}
                  onMouseEnter={() => setActiveCompany(key)}
                  style={{ '--company-accent': company.accent } as React.CSSProperties}
                >
                  <div className="company-topline">
                    <span className="company-icon">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <span>{company.label}</span>
                  </div>
                  <h3>{company.name}</h3>
                  <p className="company-title">{company.title}</p>
                  <p>{company.copy}</p>
                  <ul aria-label={`${company.name} focus areas`}>
                    {company.metrics.map((metric) => (
                      <li key={metric}>{metric}</li>
                    ))}
                  </ul>
                  <a href="#contact" className="company-link">
                    Start with {company.name}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </article>
              </Fragment>
            );
          })}
        </div>
      </section>

      <section className="model-section" id="model" aria-labelledby="model-title">
        <div className="model-copy">
          <span className="eyebrow">Operating model</span>
          <h2 id="model-title">Built for focused field and technology delivery.</h2>
          <p>
            Each business keeps its own focus, language, and delivery rhythm: drilling consumables on one side,
            technical systems on the other.
          </p>
        </div>

        <div className="strength-grid">
          {strengths.map((strength) => {
            const Icon = strength.icon;

            return (
              <article className="strength-card" key={strength.title}>
                <Icon size={24} aria-hidden="true" />
                <h3>{strength.title}</h3>
                <p>{strength.copy}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="flow-section" aria-labelledby="flow-title">
        <div className="flow-heading">
          <Network size={28} aria-hidden="true" />
          <h2 id="flow-title">Field supply. Digital capability.</h2>
        </div>
        <div className="flow-track" aria-label="Nexum growth sequence">
          {timeline.map((item, index) => (
            <div className="flow-step" key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div>
          <span className="eyebrow">Next move</span>
          <h2 id="contact-title">Start the right Nexum conversation.</h2>
        </div>
        <a className="primary-action" href="mailto:hello@nexum.example">
          Start a conversation
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}

export default App;
