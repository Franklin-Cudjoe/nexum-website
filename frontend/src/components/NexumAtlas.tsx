import { useEffect, useState, type CSSProperties } from 'react';
import {
  ArrowUpRight,
  Boxes,
  CircuitBoard,
  Drill,
  Network,
  PackageCheck,
  RadioTower,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

type CompanyKey = 'dc' | 'teq';
type StationKey = 'supply' | 'field' | 'handoff' | 'systems' | 'delivery';

type NexumAtlasProps = {
  onCompanySignal: (company: CompanyKey) => void;
};

type Station = {
  name: string;
  company: CompanyKey;
  companyName: string;
  accent: string;
  icon: LucideIcon;
  title: string;
  copy: string;
  signals: string[];
  x: string;
  y: string;
};

const stations: Record<StationKey, Station> = {
  supply: {
    name: 'Source',
    company: 'dc',
    companyName: 'NexumDC',
    accent: 'var(--industrial)',
    icon: Drill,
    title: 'Supply intelligence before the field asks twice.',
    copy: 'Consumables, vendor options, and stock posture stay close to the operational need.',
    signals: ['Bits and reamers', 'Critical sourcing', 'Stock discipline'],
    x: '18%',
    y: '26%',
  },
  field: {
    name: 'Field',
    company: 'dc',
    companyName: 'NexumDC',
    accent: 'var(--gold)',
    icon: PackageCheck,
    title: 'The field rhythm stays visible.',
    copy: 'Practical handoffs keep supply decisions tied to crews, timelines, and real operating pressure.',
    signals: ['Field continuity', 'Clear availability', 'Responsive support'],
    x: '24%',
    y: '72%',
  },
  handoff: {
    name: 'Handoff',
    company: 'teq',
    companyName: 'NexumTeQ',
    accent: 'var(--green)',
    icon: Workflow,
    title: 'The handoff becomes a shared operating view.',
    copy: 'Supply movement, field context, and technical delivery meet in one sharper workflow.',
    signals: ['Workflow layer', 'Decision rhythm', 'Shared visibility'],
    x: '52%',
    y: '51%',
  },
  systems: {
    name: 'Systems',
    company: 'teq',
    companyName: 'NexumTeQ',
    accent: 'var(--tech)',
    icon: CircuitBoard,
    title: 'Technical systems sharpen the next move.',
    copy: 'Automation, integrations, and software platforms turn repeated work into clearer execution.',
    signals: ['Automation', 'Integrations', 'Custom platforms'],
    x: '78%',
    y: '29%',
  },
  delivery: {
    name: 'Deploy',
    company: 'teq',
    companyName: 'NexumTeQ',
    accent: 'var(--cyan)',
    icon: RadioTower,
    title: 'Delivery closes the loop.',
    copy: 'The same standard carries through launch, support, measurement, and the next improvement cycle.',
    signals: ['Technical delivery', 'Support rhythm', 'Applied systems'],
    x: '82%',
    y: '74%',
  },
};

const stationOrder: StationKey[] = ['supply', 'field', 'handoff', 'systems', 'delivery'];

export default function NexumAtlas({ onCompanySignal }: NexumAtlasProps) {
  const [activeStation, setActiveStation] = useState<StationKey>('handoff');
  const current = stations[activeStation];
  const ActiveIcon = current.icon;

  useEffect(() => {
    onCompanySignal(current.company);
  }, [current.company, onCompanySignal]);

  return (
    <section className="atlas-section" aria-labelledby="atlas-title">
      <div className="atlas-heading">
        <span className="eyebrow">Operating atlas</span>
        <h2 id="atlas-title">Where field supply becomes technical momentum.</h2>
      </div>

      <div className="atlas-layout" style={{ '--atlas-accent': current.accent } as CSSProperties}>
        <div className="atlas-map" aria-label="Nexum operating stations">
          <svg className="atlas-route" viewBox="0 0 100 100" aria-hidden="true">
            <polyline points="18,26 24,72 52,51 78,29 82,74" />
            <polyline className="atlas-route-glow" points="18,26 24,72 52,51 78,29 82,74" />
          </svg>

          <div className="atlas-core" aria-hidden="true">
            <span>N</span>
            <strong>Nexum</strong>
          </div>

          <span className="atlas-ring atlas-ring--one" aria-hidden="true" />
          <span className="atlas-ring atlas-ring--two" aria-hidden="true" />

          {stationOrder.map((key, index) => {
            const station = stations[key];
            const Icon = station.icon;
            const isActive = key === activeStation;

            return (
              <button
                aria-pressed={isActive}
                className={`atlas-station ${isActive ? 'is-active' : ''}`}
                key={key}
                onClick={() => setActiveStation(key)}
                onFocus={() => setActiveStation(key)}
                onMouseEnter={() => setActiveStation(key)}
                style={
                  {
                    '--station-accent': station.accent,
                    '--station-delay': `${index * 120}ms`,
                    '--station-x': station.x,
                    '--station-y': station.y,
                  } as CSSProperties
                }
                type="button"
              >
                <Icon size={19} aria-hidden="true" />
                <span>{station.name}</span>
              </button>
            );
          })}
        </div>

        <article className="atlas-detail" aria-live="polite">
          <div className="atlas-detail-kicker">
            <ActiveIcon size={20} aria-hidden="true" />
            <span>{current.companyName}</span>
          </div>
          <h3>{current.title}</h3>
          <p>{current.copy}</p>

          <div className="atlas-signal-stack" aria-label={`${current.name} signals`}>
            {current.signals.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </div>

          <a className="atlas-link" href={current.company === 'dc' ? '#nexumdc' : '#nexumteq'}>
            Follow {current.companyName}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </article>

        <div className="atlas-balance" aria-label="Nexum company signal">
          <span className={current.company === 'dc' ? 'is-active' : undefined}>
            <Boxes size={17} aria-hidden="true" />
            NexumDC
          </span>
          <span className={current.company === 'teq' ? 'is-active' : undefined}>
            <Network size={17} aria-hidden="true" />
            NexumTeQ
          </span>
        </div>
      </div>
    </section>
  );
}
