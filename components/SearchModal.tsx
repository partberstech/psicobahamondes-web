'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { BlogPost } from '@/lib/notion'

// ─── keyboard navigation hook ─────────────────────────────────────
const fadeOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

const slidePanel = {
  initial: { opacity: 0, scale: 0.96, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 10 },
  transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] },
}

export default function SearchModal() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loaded, setLoaded] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Load posts once
  useEffect(() => {
    if (open && !loaded) {
      fetch('/api/blog')
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d) => {
          setPosts(d.posts || [])
          setLoaded(true)
        })
        .catch(() => {})
    }
  }, [open, loaded])

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((p) => !p)
      }
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setQuery('')
      setActiveIdx(0)
    }
  }, [open])

  // Reset index on query change
  useEffect(() => {
    setActiveIdx(0)
  }, [query])

  const filtered = posts
    .filter((p) => {
      if (!query.trim()) return true
      const q = query.toLowerCase()
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    })
    .slice(0, 10)

  const goTo = useCallback(
    (slug: string) => {
      setOpen(false)
      router.push(`/blog/${slug}`)
    },
    [router],
  )

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[activeIdx]) {
      e.preventDefault()
      goTo(filtered[activeIdx].slug)
    }
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Buscar artículos"
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-60"
        style={{
          background: 'rgba(255,255,255,0.06)',
          color: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        Buscar
        <kbd
          style={{
            fontFamily: 'inherit',
            fontSize: 10,
            padding: '1px 6px',
            borderRadius: 4,
            background: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            {...fadeOverlay}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              {...slidePanel}
              onClick={(e: any) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden"
              style={{
                background: '#ffffff',
                borderRadius: 20,
                boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05)',
              }}
            >
              {/* Search input */}
              <div
                className="flex items-center gap-3 px-5"
                style={{ borderBottom: '1px solid #f3f4f6' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar artículos…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full py-4 outline-none text-base"
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: '#111827',
                    background: 'transparent',
                  }}
                />
                <kbd
                  style={{
                    fontFamily: 'inherit',
                    fontSize: 11,
                    padding: '2px 7px',
                    borderRadius: 6,
                    background: '#f3f4f6',
                    color: '#9ca3af',
                    fontWeight: 500,
                  }}
                >
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[50vh] overflow-y-auto py-2">
                {!loaded ? (
                  <div className="flex items-center gap-2 px-5 py-8 text-sm" style={{ color: '#9ca3af' }}>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" opacity="0.3" /><path d="M22 12a10 10 0 0 1-10 10" />
                    </svg>
                    Cargando artículos…
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="px-5 py-8 text-sm text-center" style={{ color: '#9ca3af' }}>
                    {query ? `Sin resultados para "${query}"` : 'No hay artículos publicados'}
                  </div>
                ) : (
                  filtered.map((post, i) => (
                    <button
                      key={post.id}
                      onClick={() => goTo(post.slug)}
                      onMouseEnter={() => setActiveIdx(i)}
                      className="w-full text-left px-5 py-3 transition-colors flex items-start gap-4"
                      style={{
                        background: i === activeIdx ? '#f9fafb' : 'transparent',
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                            style={{
                              background: 'rgba(37,99,235,0.08)',
                              color: '#2563eb',
                            }}
                          >
                            {post.category}
                          </span>
                          {post.type === 'Video' && (
                            <span className="text-[10px]">🎬</span>
                          )}
                        </div>
                        <p
                          className="text-sm font-semibold truncate"
                          style={{
                            fontFamily: 'var(--font-display)',
                            color: '#111827',
                          }}
                        >
                          {post.title}
                        </p>
                        {post.excerpt && (
                          <p
                            className="text-xs truncate mt-0.5"
                            style={{ color: '#9ca3af' }}
                          >
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                      <span className="text-[11px] whitespace-nowrap mt-0.5" style={{ color: '#9ca3af' }}>
                        {post.date}
                      </span>
                    </button>
                  ))
                )}
              </div>

              {/* Footer hint */}
              <div
                className="flex items-center gap-4 px-5 py-2.5 text-[11px]"
                style={{ borderTop: '1px solid #f3f4f6', color: '#9ca3af' }}
              >
                <span>↑↓ Navegar</span>
                <span>↵ Abrir</span>
                <span className="ml-auto">⌘K Cerrar</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
