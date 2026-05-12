import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import logo from './assets/logo.svg'
import logoIcon from './assets/logo-icon.svg'
import notFound from './assets/404.svg'
import './styles.css'

type LinkItem = {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: number
  createdAt: string
}

type FieldErrors = Partial<Record<'originalUrl' | 'shortUrl', string[]>>

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3333').replace(/\/$/, '')

const SHORT_BASE_URL = (import.meta.env.VITE_SHORT_BASE_URL || 'https://brev.ly').replace(/\/$/, '')

const FRONT_URL = (import.meta.env.VITE_FRONT_URL || window.location.origin).replace(/\/$/, '')

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 8.75A2.75 2.75 0 0 1 10.75 6h6.5A2.75 2.75 0 0 1 20 8.75v6.5A2.75 2.75 0 0 1 17.25 18h-6.5A2.75 2.75 0 0 1 8 15.25v-6.5Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 14.25h-.25A2.75 2.75 0 0 1 2 11.5V4.75A2.75 2.75 0 0 1 4.75 2h6.75a2.75 2.75 0 0 1 2.75 2.75V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 7l.8 12.2A2 2 0 0 0 8.8 21h6.4a2 2 0 0 0 2-1.8L18 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 7V4.75A1.75 1.75 0 0 1 10.75 3h2.5A1.75 1.75 0 0 1 15 4.75V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m7.5 9.5 4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 17v1.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10.4 13.6a3 3 0 0 0 4.24 0l2.83-2.83a3 3 0 1 0-4.24-4.24l-.72.72" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M13.6 10.4a3 3 0 0 0-4.24 0l-2.83 2.83a3 3 0 1 0 4.24 4.24l.72-.72" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw data
  }

  if (response.status === 204) return undefined as T
  return response.json()
}

function normalizeUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

function App() {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const isRedirectPage = useMemo(() => {
    const slug = window.location.pathname.replace(/^\//, '').trim()
    return slug.length > 0 && slug !== 'not-found'
  }, [])

  useEffect(() => {
    if (isRedirectPage) return
    loadLinks()
  }, [isRedirectPage])

  if (isRedirectPage) return <RedirectPage />
  if (window.location.pathname === '/not-found') return <NotFoundPage />

  async function loadLinks() {
    try {
      setIsLoading(true)
      const data = await request<{ links: LinkItem[] }>('/links')
      setLinks(data.links)
    } catch {
      setMessage('Não foi possível carregar os links. Confira se o backend está rodando.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setFieldErrors({})
    setIsSaving(true)

    try {
      await request<{ link: LinkItem }>('/links', {
        method: 'POST',
        body: JSON.stringify({ originalUrl: normalizeUrl(originalUrl), shortUrl: shortUrl.trim() }),
      })

      setOriginalUrl('')
      setShortUrl('')
      await loadLinks()
    } catch (error: any) {
      if (error?.errors) setFieldErrors(error.errors)
      setMessage(error?.message || 'Erro ao criar link.')
    } finally {
      setIsSaving(false)
    }
  }

 async function handleCopy(link: LinkItem) {
  const url = `${FRONT_URL}/${link.shortUrl}`
  await navigator.clipboard.writeText(url)
  setCopiedId(link.id)
  window.setTimeout(() => setCopiedId(null), 1400)
}

  async function handleDelete(id: string) {
    const previous = links
    setLinks((current) => current.filter((link) => link.id !== id))

    try {
      await request<void>(`/links/${id}`, { method: 'DELETE' })
    } catch {
      setLinks(previous)
      setMessage('Não foi possível remover esse link.')
    }
  }

  async function handleExport() {
    setMessage('')
    setIsExporting(true)

    try {
      const data = await request<{ url: string }>('/links/export', { method: 'POST' })
      window.open(data.url, '_blank', 'noopener,noreferrer')
    } catch {
      setMessage('Não foi possível exportar o CSV. Confira as variáveis da Cloudflare R2 no backend.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <img src={logo} alt="brev.ly" className="brand" />
      </section>

      <section className="content-grid">
        <aside className="card create-card">
          <h1>Novo link</h1>

          <form onSubmit={handleSubmit} noValidate>
            <label className="field">
              <span>Link original</span>
              <input
                value={originalUrl}
                onChange={(event) => setOriginalUrl(event.target.value)}
                placeholder="www.exemplo.com.br"
                className={fieldErrors.originalUrl ? 'error' : ''}
              />
              {fieldErrors.originalUrl && <small>{fieldErrors.originalUrl[0]}</small>}
            </label>

            <label className="field">
              <span>Link encurtado</span>
              <div className="short-input-wrap">
                <strong>brev.ly/</strong>
                <input
                  value={shortUrl}
                  onChange={(event) => setShortUrl(event.target.value)}
                  placeholder="meu-link"
                  className={fieldErrors.shortUrl ? 'error' : ''}
                />
              </div>
              {fieldErrors.shortUrl && <small>{fieldErrors.shortUrl[0]}</small>}
            </label>

            {message && <p className="feedback">{message}</p>}

            <button className="primary-button" disabled={isSaving || !originalUrl || !shortUrl}>
              {isSaving ? 'Salvando...' : 'Salvar link'}
            </button>
          </form>
        </aside>

        <section className="card links-card">
          <header className="links-header">
            <h2>Meus links</h2>
            <button className="secondary-button" onClick={handleExport} disabled={isExporting || links.length === 0}>
              <DownloadIcon />
              {isExporting ? 'Exportando...' : 'Baixar CSV'}
            </button>
          </header>

          <div className="links-list">
            {isLoading && <p className="muted-state">Carregando links...</p>}

            {!isLoading && links.length === 0 && (
              <div className="empty-state">
                <LinkIcon />
                <p>Ainda não existem links cadastrados</p>
              </div>
            )}

            {!isLoading && links.map((link) => (
              <article className="link-row" key={link.id}>
              <a 
                    href={`${FRONT_URL}/${link.shortUrl}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="link-info"
                  >
                    <strong>{SHORT_BASE_URL.replace(/^https?:\/\//, '')}/{link.shortUrl}</strong>
                    <span>{link.originalUrl}</span>
                </a>

                <div className="link-actions">
                  <span>{link.accessCount} acessos</span>
                  <button title="Copiar" onClick={() => handleCopy(link)} className={copiedId === link.id ? 'copied' : ''}>
                    <CopyIcon />
                  </button>
                  <button title="Excluir" onClick={() => handleDelete(link.id)}>
                    <TrashIcon />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

function RedirectPage() {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const shortUrl = window.location.pathname.replace(/^\//, '').trim()

    async function redirect() {
      try {
        const data = await request<{ link: LinkItem }>(`/links/${shortUrl}`)
        await request<{ link: LinkItem }>(`/links/${data.link.id}/access`, { method: 'PATCH' }).catch(() => null)
        window.location.href = data.link.originalUrl
      } catch {
        setFailed(true)
        window.history.replaceState(null, '', '/not-found')
      }
    }

    redirect()
  }, [])

  if (failed) return <NotFoundPage />

  return (
    <main className="center-page">
      <section className="message-card redirect-card">
        <img src={logoIcon} alt="brev.ly" />
        <h1>Redirecionando...</h1>
        <p>O link será aberto automaticamente em alguns instantes.</p>
        <p>Não foi redirecionado? <a href="/">Volte para a página inicial</a>.</p>
      </section>
    </main>
  )
}

function NotFoundPage() {
  return (
    <main className="center-page">
      <section className="message-card not-found-card">
        <img src={notFound} alt="404" className="not-found-asset" />
        <h1>Link não encontrado</h1>
        <p>O link que você está tentando acessar não existe, foi removido ou é uma URL inválida.</p>
        <a href="/" className="home-link">Voltar para a página inicial</a>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
