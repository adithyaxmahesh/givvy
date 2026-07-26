import type { CSSProperties, SVGProps } from 'react';

export interface WorkflowCardData {
  title: string;
  detail: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  tone: 'green' | 'blue' | 'lilac' | 'gold';
}

const toneColor: Record<WorkflowCardData['tone'], string> = {
  green: '#4E8A6B',
  blue: '#4C7FC4',
  lilac: '#7B7CB5',
  gold: '#BF9E5F',
};

interface WorkflowCardProps extends WorkflowCardData {
  style?: CSSProperties;
  className?: string;
}

/**
 * The small white workflow chips that orbit the hero machine. Authored in em
 * so it can live inside the scaling hero stage or in a fixed-size grid.
 */
export function WorkflowCard({ title, detail, icon: Icon, tone, style, className = '' }: WorkflowCardProps) {
  return (
    <div
      className={`bg-white ${className}`}
      style={{
        borderRadius: '1.6em',
        border: '0.1em solid #EDE8DF',
        boxShadow: '0 0.2em 0.4em rgba(20,36,61,0.03), 0 1.4em 3.4em -1.4em rgba(20,36,61,0.18)',
        padding: '1.55em 1.5em 1.5em',
        ...style,
      }}
    >
      <div style={{ display: 'flex', gap: '1.1em' }}>
        <Icon style={{ width: '2.6em', height: '2.6em', flexShrink: 0, color: toneColor[tone], marginTop: '0.15em' }} />
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: '1.22em',
              fontWeight: 600,
              lineHeight: 1.28,
              letterSpacing: '-0.01em',
              color: '#14243D',
            }}
          >
            {title}
          </p>
          <p style={{ margin: '0.6em 0 0', fontSize: '1.05em', lineHeight: 1.3, color: '#8B9199' }}>{detail}</p>
        </div>
      </div>
    </div>
  );
}
