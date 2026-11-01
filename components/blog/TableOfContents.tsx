'use client'

import { useEffect, useMemo, useState } from 'react'

export type TocItem = { id: string; text: string; level: 1 | 2 | 3 }

/**
 * Índice del artículo con resaltado de la sección visible.
 * Se oculta si hay menos de 3 secciones (no aporta valor).
 */
export default function TableOfContents({ items }: { items: TocItem[] }) {
  const key = useMemo(() => items.map((i) => i.id).join('|'), [items])
  const [active, setActive] = useState<string>(items[0]?.id ?? '')

  useEffect(() => {
    const ids = key ? key.split('|') : []
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-100px 0px -68% 0px', threshold: [0, 1] }
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [key])

  if (items.length < 3) return null

  return (
    <nav aria-label="Índice del artículo">
      <p
        className="label"
        style={{ marginBottom: 14, color: '#9ca3af' }}
      >
        En este artículo
      </p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, borderLeft: '1px solid rgba(0,0,0,0.08)' }}>
        {items.map((item) => {
          const isActive = item.id === active
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                style={{
                  display: 'block',
                  padding: '7px 0 7px 14px',
                  marginLeft: -1,
                  borderLeft: `2px solid ${isActive ? '#2563eb' : 'transparent'}`,
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  lineHeight: 1.45,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#111827' : '#6b7280',
                  textDecoration: 'none',
                  paddingLeft: item.level === 3 ? 26 : 14,
                  transition: 'color 200ms ease, border-color 200ms ease',
                }}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
