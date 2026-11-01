'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import type { RichBlock } from '@/lib/notion'
import RichText from './RichText'
import { toEmbedUrl } from '@/lib/embed'

const BODY = {
  fontFamily: 'var(--font-body)',
  color: '#374151',
  fontSize: '1.0625rem',
  lineHeight: 1.85,
}

function Heading({ level, id, children }: { level: 1 | 2 | 3; id: string; children: ReactNode }) {
  const sizes: Record<number, string> = {
    1: 'clamp(1.625rem, 3.2vw, 2.125rem)',
    2: 'clamp(1.5rem, 2.8vw, 1.875rem)',
    3: 'clamp(1.1875rem, 2vw, 1.375rem)',
  }
  return (
    <h2
      id={id}
      className="group scroll-mt-28"
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: sizes[level],
        lineHeight: 1.25,
        letterSpacing: '-0.025em',
        fontWeight: 700,
        color: '#111827',
        marginTop: level === 3 ? '2.25rem' : '3rem',
        marginBottom: '1rem',
      }}
    >
      {children}
      <a
        href={`#${id}`}
        aria-label="Enlazar esta sección"
        className="ml-2 opacity-0 transition-opacity group-hover:opacity-100"
        style={{ color: '#c7d2fe', fontWeight: 400, textDecoration: 'none' }}
      >
        #
      </a>
    </h2>
  )
}

export default function ArticleBody({ blocks }: { blocks: RichBlock[] }) {
  const [openToggles, setOpenToggles] = useState<Record<number, boolean>>({})

  if (!blocks || blocks.length === 0) return null

  return (
    <div style={BODY}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'heading':
            return (
              <Heading key={i} level={b.level} id={b.id}>
                <RichText value={b.rich} />
              </Heading>
            )

          case 'paragraph':
            return (
              <p key={i} style={{ marginBottom: '1.5rem' }}>
                <RichText value={b.rich} />
              </p>
            )

          case 'list':
            return b.ordered ? (
              <ol
                key={i}
                style={{ margin: '1.5rem 0 1.75rem', paddingLeft: 0, listStyle: 'none' }}
              >
                {b.items.map((it, j) => (
                  <li
                    key={j}
                    style={{
                      position: 'relative',
                      paddingLeft: it.depth > 0 ? '3.25rem' : '2rem',
                      marginBottom: '0.75rem',
                      color: it.depth > 0 ? '#6b7280' : undefined,
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        position: 'absolute',
                        left: it.depth > 0 ? '1.75rem' : 0,
                        top: '0.15em',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: '#2563eb',
                      }}
                    >
                      {j + 1}.
                    </span>
                    <RichText value={it.rich} />
                  </li>
                ))}
              </ol>
            ) : (
              <ul
                key={i}
                style={{ margin: '1.5rem 0 1.75rem', paddingLeft: 0, listStyle: 'none' }}
              >
                {b.items.map((it, j) => (
                  <li
                    key={j}
                    style={{
                      position: 'relative',
                      paddingLeft: it.depth > 0 ? '3.25rem' : '2rem',
                      marginBottom: '0.75rem',
                      color: it.depth > 0 ? '#6b7280' : undefined,
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        position: 'absolute',
                        left: it.depth > 0 ? '1.85rem' : '0.25rem',
                        top: '0.7em',
                        width: 6,
                        height: 6,
                        borderRadius: 9999,
                        background: it.depth > 0 ? '#c7d2fe' : '#2563eb',
                      }}
                    />
                    <RichText value={it.rich} />
                  </li>
                ))}
              </ul>
            )

          case 'quote':
            return (
              <blockquote
                key={i}
                style={{
                  margin: '2.5rem 0',
                  padding: '0.25rem 0 0.25rem 1.5rem',
                  borderLeft: '3px solid #2563eb',
                  fontSize: '1.1875rem',
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                  color: '#4b5563',
                }}
              >
                <RichText value={b.rich} />
              </blockquote>
            )

          case 'callout':
            return (
              <aside
                key={i}
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                  margin: '2rem 0',
                  padding: '1.125rem 1.25rem',
                  borderRadius: 16,
                  background: 'linear-gradient(180deg, #f8fafc, #f1f5f9)',
                  border: '1px solid rgba(37,99,235,0.12)',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                }}
              >
                <span aria-hidden style={{ fontSize: '1.125rem', lineHeight: 1.4 }}>
                  {b.emoji}
                </span>
                <div style={{ color: '#334155' }}>
                  <RichText value={b.rich} />
                </div>
              </aside>
            )

          case 'divider':
            return (
              <div
                key={i}
                role="separator"
                style={{
                  height: 1,
                  margin: '3rem auto',
                  maxWidth: 120,
                  background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)',
                }}
              />
            )

          case 'image':
            return (
              <figure key={i} style={{ margin: '2.5rem 0' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.url}
                  alt={b.caption.map((c) => c.text).join('') || ''}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 18,
                    border: '1px solid rgba(0,0,0,0.05)',
                    background: '#f3f4f6',
                  }}
                />
                {b.caption.length > 0 && (
                  <figcaption
                    style={{
                      marginTop: 12,
                      fontSize: '0.8125rem',
                      color: '#9ca3af',
                      textAlign: 'center',
                    }}
                  >
                    <RichText value={b.caption} />
                  </figcaption>
                )}
              </figure>
            )

          case 'code':
            return (
              <pre
                key={i}
                style={{
                  margin: '2rem 0',
                  padding: '1.125rem 1.25rem',
                  borderRadius: 16,
                  background: '#0f172a',
                  color: '#e2e8f0',
                  overflowX: 'auto',
                  fontSize: '0.875rem',
                  lineHeight: 1.7,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <code>{b.text}</code>
              </pre>
            )

          case 'toggle': {
            const open = Boolean(openToggles[i])
            return (
              <div
                key={i}
                style={{
                  margin: '1.25rem 0',
                  border: '1px solid rgba(0,0,0,0.07)',
                  borderRadius: 14,
                  overflow: 'hidden',
                  background: '#fcfcfd',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenToggles((prev) => ({ ...prev, [i]: !prev[i] }))}
                  aria-expanded={open}
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    gap: 10,
                    padding: '0.875rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#111827',
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-block',
                      transform: open ? 'rotate(90deg)' : 'none',
                      transition: 'transform 250ms ease',
                      color: '#2563eb',
                    }}
                  >
                    ▸
                  </span>
                  <span style={{ flex: 1 }}>
                    <RichText value={b.rich} />
                  </span>
                </button>
                {open && b.children.length > 0 && (
                  <div style={{ padding: '0 1rem 1rem 2.25rem', fontSize: '0.9875rem' }}>
                    <ArticleBody blocks={b.children} />
                  </div>
                )}
              </div>
            )
          }

          case 'todo':
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  margin: '0.6rem 0',
                  color: b.checked ? '#9ca3af' : undefined,
                  textDecoration: b.checked ? 'line-through' : undefined,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    flex: '0 0 auto',
                    marginTop: '0.35em',
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    border: '1.5px solid',
                    borderColor: b.checked ? '#2563eb' : '#d1d5db',
                    background: b.checked ? '#2563eb' : 'transparent',
                    color: '#fff',
                    fontSize: 11,
                    lineHeight: '13px',
                    textAlign: 'center',
                  }}
                >
                  {b.checked ? '✓' : ''}
                </span>
                <span>
                  <RichText value={b.rich} />
                </span>
              </div>
            )

          case 'video':
            return (
              <div
                key={i}
                style={{
                  margin: '2.5rem 0',
                  aspectRatio: '16 / 9',
                  borderRadius: 18,
                  overflow: 'hidden',
                  background: '#0f172a',
                }}
              >
                <iframe
                  src={toEmbedUrl(b.url)}
                  title="Video del artículo"
                  style={{ width: '100%', height: '100%', border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )

          case 'bookmark':
            return (
              <a
                key={i}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  margin: '1.75rem 0',
                  padding: '0.9rem 1.125rem',
                  borderRadius: 14,
                  border: '1px solid rgba(0,0,0,0.08)',
                  background: '#ffffff',
                  textDecoration: 'none',
                  color: '#111827',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  transition: 'box-shadow 250ms ease',
                }}
              >
                <span aria-hidden style={{ fontSize: '1rem' }}>
                  🔗
                </span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {b.title || b.url}
                </span>
                <span aria-hidden style={{ color: '#2563eb' }}>
                  ↗
                </span>
              </a>
            )

          case 'table':
            return (
              <div key={i} style={{ margin: '2rem 0', overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.9375rem',
                    minWidth: 320,
                  }}
                >
                  <tbody>
                    {b.rows.map((row, r) => {
                      const isHeader = b.hasHeader && r === 0
                      return (
                        <tr
                          key={r}
                          style={{
                            borderBottom: '1px solid rgba(0,0,0,0.07)',
                            background: isHeader ? '#f9fafb' : undefined,
                          }}
                        >
                          {row.cells.map((cell, c) => {
                            const content = <RichText value={cell} />
                            const style = {
                              padding: '0.7rem 0.9rem',
                              textAlign: 'left' as const,
                              fontFamily: 'var(--font-body)',
                              fontWeight: isHeader ? 700 : 400,
                              color: isHeader ? '#111827' : '#374151',
                              borderRight:
                                c < row.cells.length - 1
                                  ? '1px solid rgba(0,0,0,0.05)'
                                  : undefined,
                            }
                            return isHeader ? (
                              <th key={c} scope="col" style={style}>
                                {content}
                              </th>
                            ) : (
                              <td key={c} style={style}>
                                {content}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
