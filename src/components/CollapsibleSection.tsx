import { type ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function CollapsibleSection({ title, defaultOpen = true, children }: CollapsibleSectionProps) {
  return (
    <details className="collapsible-section" open={defaultOpen}>
      <summary className="collapsible-header">{title}</summary>
      <div className="collapsible-content">{children}</div>
    </details>
  );
}
