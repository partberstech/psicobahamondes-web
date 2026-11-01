import type { ReactNode } from 'react'
import type { Inline } from '@/lib/notion'

/**
 * Renderiza texto enriquecido de Notion respetando negrita, cursiva,
 * código, subrayado, tachado y enlaces.
 */
export default function RichText({ value }: { value?: Inline[] | null }) {
  if (!value || value.length === 0) return null

  return (
    <>
      {value.map((s, i) => {
        let el: ReactNode = s.text

        if (s.code) {
          el = (
            <code
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875em',
                padding: '0.12em 0.38em',
                borderRadius: 6,
                background: 'rgba(37,99,235,0.07)',
                color: '#1d4ed8',
                whiteSpace: 'pre-wrap',
              }}
            >
              {el}
            </code>
          )
        }
        if (s.bold) {
          el = (
            <strong style={{ fontWeight: 700, color: '#111827' }}>{el}</strong>
          )
        }
        if (s.italic) el = <em style={{ fontStyle: 'italic' }}>{el}</em>
        if (s.underline) {
          el = <span style={{ textDecoration: 'underline', textUnderlineOffset: 2 }}>{el}</span>
        }
        if (s.strikethrough) el = <span style={{ textDecoration: 'line-through' }}>{el}</span>
        if (s.link) {
          el = (
            <a
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#2563eb',
                textDecoration: 'underline',
                textDecorationThickness: '1px',
                textUnderlineOffset: 3,
                fontWeight: 500,
              }}
            >
              {el}
            </a>
          )
        }

        return <span key={i}>{el}</span>
      })}
    </>
  )
}
