import React, { useMemo, useState } from 'react'
import { Hammer, Image as ImageIcon, Phone, Mail, MapPin, Quote, Star } from 'lucide-react'
import { useData } from './lib/data'
import SmartEstimator from './components/SmartEstimator'
import ZoomGallery from './components/ZoomGallery'
import Timeline from './components/Timeline'

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-1" aria-label={`${count} star rating`}>
      {Array.from({ length: count }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
    </div>
  )
}

function Modal({
  open, onClose, children,
}: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-x-0 top-0 bottom-0 sm:inset-y-10 sm:mx-auto sm:max-w-4xl">
        <div className="h-[100dvh] sm:h-auto bg-surface border border-border shadow-soft rounded-none sm:rounded-2xl overflow-auto">
          <div className="p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const { site, projects, testimonials, blog } = useData()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'All' | 'Kitchens' | 'Bathrooms' | 'Mudrooms' | 'Laundry' | 'Closets' | 'Furniture'>('All')
  const [material, setMaterial] = useState<'All' | 'Walnut' | 'Oak' | 'Ash' | 'Maple'>('All')
  const [viewer, setViewer] = useState<{ title: string, images: string[] } | null>(null)
  const [showEstimator, setShowEstimator] = useState(false)
  const [estimateSummary, setEstimateSummary] = useState('')

  const filtered = useMemo(() =>
    projects.filter((p: any) =>
      (category === 'All' || p.type === category) &&
      (material === 'All' || p.material === material) &&
      (query === '' || p.title.toLowerCase().includes(query.toLowerCase()))
    ), [projects, category, material, query])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
        <div className="container-max py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 font-semibold">
            {/* ABSOLUTE SITE PATH — works on GitHub Pages */}
            <img
              src="/OldSchool-Woodworking-Cabinetry/images/brand/logo.png"
              alt="Old School Woodworking"
              className="h-7 w-auto"
            />
            <span className="hidden sm:inline text-brand">{site?.name || 'Old School Woodworking'}</span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#portfolio" className="hover:underline">Portfolio</a>
            <a href="#case-studies" className="hover:underline">Case Studies</a>
            <a href="#about" className="hover:underline">Story</a>
            <a href="#testimonials" className="hover:underline">Reviews</a>
            <a href="#blog" className="hover:underline">Blog</a>
          </nav>

          <div className="flex items-center gap-2">
            <button className="btn-outline rounded-2xl" onClick={() => setShowEstimator(true)}>Free AI Estimate</button>
            <a className="btn-primary rounded-2xl" href="#contact">Get a Quote</a>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="section grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-brand">{site?.tagline || 'Bespoke cabinetry & furniture'}</h1>
          <p className="mt-4 subtle max-w-xl">
            Handcrafted pieces tailored to your space. We design, build, and install cabinetry, furniture, and built-ins with premium materials and traditional joinery.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-outline rounded-2xl" onClick={() => setShowEstimator(true)}>Free AI Estimate</button>
            <a href="#portfolio" className="btn-primary rounded-2xl">View Portfolio</a>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted">
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{site?.phone}</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{site?.email}</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{site?.city}</div>
          </div>
        </div>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-soft">
          {site?.heroUrl ? (
            <img src={site.heroUrl} alt="Workshop" className="h-full w-full object-cover" />
          ) : (
            <div className="grid place-items-center h-full w-full bg-black/5"><ImageIcon className="w-12 h-12 opacity-30" /></div>
          )}
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="section">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="heading">Portfolio</h2>
            <p className="subtle">Filter by room type, material, or search by name.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input className="input w-56" placeholder="Search projects…" value={query} onChange={(e) => setQuery(e.target.value)} />
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value as any)}>
              {['All', 'Kitchens', 'Bathrooms', 'Mudrooms', 'Laundry', 'Closets', 'Furniture'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input" value={material} onChange={(e) => setMaterial(e.target.value as any)}>
              {['All', 'Walnut', 'Oak', 'Ash', 'Maple'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p: any) => (
            <div key={p.id} className="card overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* IMPORTANT: use the JSON URL as-is; do NOT wrap with any helper */}
                <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{p.title}</h3>
                  <span className="badge">{p.type}</span>
                </div>
                <p className="subtle mt-1">{p.blurb}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {p.metrics?.map((m: string, i: number) => <span key={i} className="badge">{m}</span>)}
                </div>
                <button
                  className="btn-outline w-full mt-4 rounded-xl"
                  onClick={() => setViewer({ title: p.title, images: p.images /* as-is */ })}
                >
                  View Photos
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies (simple) */}
      <section id="case-studies" className="bg-white/60 border-y border-border">
        <div className="section">
          <h2 className="heading">Case Studies</h2>
          <p className="subtle">Story-driven breakdowns of featured builds.</p>
          <div className="mt-6 grid lg:grid-cols-2 gap-6">
            {projects.slice(0, 2).map((p: any) => (
              <div key={p.id} className="card p-5">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{p.title}</h3>
                  <span className="badge">{p.material || ''}</span>
                </div>
                <p className="subtle mt-1">{p.blurb}</p>
                <details className="mt-3"><summary className="cursor-pointer">Materials & Hardware</summary>
                  <p className="subtle mt-2">Premium {p.material?.toLowerCase?.() || 'wood'}, FSC plywood, soft-close hardware.</p>
                </details>
                <details className="mt-2"><summary className="cursor-pointer">Techniques</summary>
                  <p className="subtle mt-2">Mortise/tenon joinery, precise edge-banding, spray-booth finishing.</p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax band */}
      <section
        className="h-56 md:h-72 bg-cover bg-center"
        style={{ backgroundImage: `url(${site?.parallaxUrl || '/OldSchool-Woodworking-Cabinetry/images/brand/wood.jpg'})`, backgroundAttachment: 'fixed' }}
        aria-hidden="true"
      />

      {/* Story + Timeline */}
      <section id="about" className="section">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="heading">The Craftsman Story</h2>
            <p className="subtle mt-3 max-w-prose">
              Old School Woodworking is a small, family shop in Texas. We build pieces to last —
              carefully selected lumber, honest joinery, and finishes you can live with.
            </p>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              <div className="card p-4"><div className="font-semibold text-base text-brand">Values</div><div className="subtle">Craft, transparency, kindness.</div></div>
              <div className="card p-4"><div className="font-semibold text-base text-brand">Guarantee</div><div className="subtle">2-year workmanship warranty.</div></div>
            </div>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold mb-3">How We Work</h3>
            <Timeline />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-white/60 border-y border-border">
        <div className="section">
          <h2 className="heading">Client Reviews</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {testimonials.map((t: any, i: number) => (
              <div key={i} className="card p-5">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-base">{t.name}</div>
                  <Stars count={t.rating as number} />
                </div>
                <div className="flex items-start gap-2 subtle mt-2"><Quote className="w-4 h-4 mt-0.5" /> {t.quote}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog (minimal) */}
      <section id="blog" className="section">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="heading">From the Shop Blog</h2>
            <p className="subtle">Tips, process notes, and project updates.</p>
          </div>
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {blog.map((b: any) => (
            <div key={b.slug} className="card overflow-hidden">
              <div className="aspect-video bg-black/5 overflow-hidden">
                {b.cover
                  ? <img src={b.cover} alt="" className="h-full w-full object-cover" />
                  : <div className="grid place-items-center h-full w-full"><span className="subtle">Cover</span></div>}
              </div>
              <div className="p-5">
                <div className="text-lg font-semibold">{b.title}</div>
                <div className="subtle">{new Date(b.date).toLocaleDateString()}</div>
                <p className="subtle mt-2">{b.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact + Estimator */}
      <section id="contact" className="section grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="heading">Request a Free Consultation</h2>
          <p className="subtle">Tell us about your project. We usually reply within one business day.</p>

          {estimateSummary && (
            <div className="card p-4 mb-4">
              <div className="text-sm subtle mb-2">AI Estimate summary (you can edit before sending):</div>
              <textarea
                className="textarea min-h-[100px]"
                name="estimate"
                value={estimateSummary}
                onChange={(e) => setEstimateSummary(e.target.value)}
              />
            </div>
          )}

          <form className="mt-6 grid gap-4"
                method="POST"
                action={site?.formspreeEndpoint || undefined}
                onSubmit={(e) => { if (!site?.formspreeEndpoint) { e.preventDefault(); alert('Thanks! (Formspree not set)') } }}>
            <div className="grid sm:grid-cols-2 gap-4">
              <input required className="input" name="name" placeholder="Full name" />
              <input required type="email" className="input" name="email" placeholder="Email" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="input" name="phone" placeholder="Phone (optional)" />
              <input className="input" name="city" placeholder="City" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <select className="input" name="project_type" defaultValue="Kitchens">
                {['Kitchens', 'Bathrooms', 'Mudrooms', 'Laundry', 'Closets', 'Furniture'].map(x => <option key={x}>{x}</option>)}
              </select>
              <select className="input" name="budget" defaultValue="$10k–$20k">
                {['<$5k', '$5k–$10k', '$10k–$20k', '$20k–$40k', '$40k+'].map(x => <option key={x}>{x}</option>)}
              </select>
              <select className="input" name="timeline" defaultValue="Flexible">
                {['ASAP (4–6 weeks)', 'Soon (2–3 months)', 'Flexible'].map(x => <option key={x}>{x}</option>)}
              </select>
            </div>

            <input className="input" name="mozaik_link" placeholder="Link to Mozaik files (Drive/Dropbox)" />
            <textarea required className="textarea min-h-[120px]" name="details"
                      placeholder="Describe your project, dimensions, finishes, timeline, budget range…"></textarea>
            <div className="flex items-center justify-between">
              <div className="subtle">Prefer a quick ballpark? Try the “Free AI Estimate”.</div>
              <button className="btn-primary rounded-2xl">Send Request</button>
            </div>
          </form>
        </div>
        <div className="card p-5 grid gap-3 text-sm text-muted">
          <div className="text-foreground font-semibold text-base">Why clients choose us</div>
          <div>• Transparent pricing & schedule</div>
          <div>• Mozaik 3D design support</div>
          <div>• Workmanship warranty</div>
          <div>• Insured & background-checked</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white/70">
        <div className="section grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-semibold flex items-center gap-2"><Hammer className="w-4 h-4" /> {site?.name || 'Old School Woodworking'}</div>
            <p className="subtle mt-2">Custom cabinetry, furniture, and built-ins for {site?.city || 'your area'}.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-1 gap-3">
            <a href="#portfolio" className="hover:underline">Portfolio</a>
            <a href="#about" className="hover:underline">Story</a>
            <a href="#blog" className="hover:underline">Blog</a>
            <a href="#contact" className="hover:underline">Get a Quote</a>
          </div>
          <div className="text-muted">
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{site?.phone}</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{site?.email}</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{site?.city}</div>
          </div>
        </div>
      </footer>

      {/* Photo viewer */}
      <Modal open={!!viewer} onClose={() => setViewer(null)}>
        {viewer && <ZoomGallery title={viewer.title} images={viewer.images} />}
      </Modal>

      {/* Estimator modal */}
      <Modal open={showEstimator} onClose={() => setShowEstimator(false)}>
        <SmartEstimator
          onClose={() => setShowEstimator(false)}
          onUse={(summary: string) => {
            setEstimateSummary(summary)
            setShowEstimator(false)
            const el = document.getElementById('contact')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
        />
      </Modal>
    </div>
  )
}
