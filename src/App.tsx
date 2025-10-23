import React, { useMemo, useState } from 'react'
import { Hammer, Image as ImageIcon, Phone, Mail, MapPin, Quote, Star, ChevronRight } from 'lucide-react'
import { useData } from './lib/data'
import SmartEstimator from './components/SmartEstimator'
import ZoomGallery from './components/ZoomGallery'
import Timeline from './components/Timeline'
import SocialBar from './components/SocialBar'

/** Small helpers */
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
      <div className="absolute inset-x-0 top-0 bottom-0 sm:inset-y-10 sm:mx-auto sm:max-w-5xl">
        <div className="h-[100dvh] sm:h-auto bg-white border border-[#e5e7eb] shadow-2xl rounded-none sm:rounded-2xl overflow-auto">
          <div className="p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

/** Warm earthy palette fallbacks */
const palette = {
  cream: '#FAF7F2',
  charcoal: '#1F2937',
  copper: '#B87333',
  wood: '#8B5E34',
  border: '#E5E7EB',
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
    <div className="min-h-screen" style={{ background: palette.cream, color: palette.charcoal }}>
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b" style={{ background: 'rgba(250,247,242,.90)', backdropFilter: 'blur(6px)', borderColor: palette.border }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 font-semibold">
  <img
    src="/OldSchool-Woodworking-Cabinetry/images/brand/logo.png"
    alt="Old School Woodworking and Cabinetry logo"
    className="h-10 sm:h-12 w-auto shrink-0"   // ⬅️ slightly larger than before
  />
  <span
    className="hidden md:inline whitespace-nowrap"
    style={{ color: palette.copper }}
  >
    {site?.name || 'Old School Woodworking and Cabinetry'}
  </span>
</a>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#portfolio" className="hover:underline">Portfolio</a>
            <a href="#case-studies" className="hover:underline">Case Studies</a>
            <a href="#about" className="hover:underline">Story</a>
            <a href="#services" className="hover:underline">Services</a>
            <a href="#testimonials" className="hover:underline">Reviews</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </nav>

          {/* CTAs — desktop: show both; mobile: primary only */}
          <div className="hidden sm:flex items-center gap-2">
            <a
              href="#contact"
              className="px-4 py-2 rounded-2xl border"
              aria-label="Book a free 15-minute consultation"
              style={{ borderColor: palette.border }}
            >
              Free Consultation
            </a>
            <button
              className="px-4 py-2 rounded-2xl text-white"
              aria-label="Open the quote estimator"
              style={{ background: palette.copper }}
              onClick={() => setShowEstimator(true)}
            >
              Get a Quote
            </button>
          </div>
          {/* Mobile: single primary CTA for clarity */}
          <div className="sm:hidden flex items-center gap-2">
            <a
              href="#contact"
              className="px-3 py-2 rounded-lg text-white"
              style={{ background: palette.copper }}
              aria-label="Book a free consultation"
            >
              Free Consultation
            </a>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight" style={{ color: palette.wood }}>
            {site?.tagline || 'Bespoke cabinetry & furniture'}
          </h1>
          <p className="mt-4 max-w-xl opacity-80">
            Handcrafted pieces tailored to your space. We design, build, and install cabinetry, furniture, and built-ins with premium materials and traditional joinery.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#portfolio" className="px-4 py-2 rounded-2xl border" style={{ borderColor: palette.border }}>View Portfolio</a>
            <a href="#about" className="px-4 py-2 rounded-2xl text-white" style={{ background: palette.wood }}>Our Story</a>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm opacity-80">
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{site?.phone}</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{site?.email}</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{site?.city}</div>
          </div>
        </div>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden" style={{ border: `1px solid ${palette.border}`, boxShadow: '0 10px 30px rgba(0,0,0,.08)' }}>
          {site?.heroUrl
            ? <img src={site.heroUrl} alt="Workshop" className="h-full w-full object-cover" />
            : <div className="grid place-items-center h-full w-full bg-black/5"><ImageIcon className="w-12 h-12 opacity-30" /></div>}
        </div>
      </section>

      {/* Parallax band */}
      <section
        className="h-56 md:h-72 bg-cover bg-center"
        style={{
          backgroundImage: `url(${site?.parallaxUrl || '/OldSchool-Woodworking-Cabinetry/images/brand/wood.jpg'})`,
          backgroundAttachment: 'fixed'
        }}
        aria-hidden="true"
      />

      {/* Portfolio */}
      <section id="portfolio" className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: palette.wood }}>Portfolio</h2>
            <p className="opacity-80">Interactive gallery with zoom-in. Filter by room type, material, or search by name.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              className="px-3 py-2 rounded-xl border w-56"
              style={{ borderColor: palette.border }}
              placeholder="Search projects…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select className="px-3 py-2 rounded-xl border" style={{ borderColor: palette.border }} value={category} onChange={(e) => setCategory(e.target.value as any)}>
              {['All', 'Kitchens', 'Bathrooms', 'Mudrooms', 'Laundry', 'Closets', 'Furniture'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="px-3 py-2 rounded-xl border" style={{ borderColor: palette.border }} value={material} onChange={(e) => setMaterial(e.target.value as any)}>
              {['All', 'Walnut', 'Oak', 'Ash', 'Maple'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p: any) => (
            <div key={p.id} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${palette.border}`, boxShadow: '0 10px 25px rgba(0,0,0,.06)' }}>
              <div className="relative aspect-[4/3] overflow-hidden group">
                {/* Use JSON URL as-is; do NOT wrap with any helper */}
                <img
                  src={p.images[0]}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{p.title}</h3>
                  <span className="px-2.5 py-1 text-xs rounded-full" style={{ background: '#eee' }}>{p.type}</span>
                </div>
                <p className="opacity-80 mt-1">{p.blurb}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {p.metrics?.map((m: string, i: number) => (
                    <span key={i} className="px-2 py-1 text-xs rounded-full" style={{ background: '#f5f5f5' }}>{m}</span>
                  ))}
                </div>
                <button
                  className="w-full mt-4 px-4 py-2 rounded-xl border hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ borderColor: palette.border }}
                  onClick={() => setViewer({ title: p.title, images: p.images })}
                >
                  View Photos <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="border-y" style={{ borderColor: palette.border, background: '#ffffffb3' }}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold" style={{ color: palette.wood }}>Case Studies</h2>
          <p className="opacity-80">Narrative breakdowns: materials, techniques, decisions, and outcomes.</p>
          <div className="mt-6 grid lg:grid-cols-2 gap-6">
            {projects.slice(0, 2).map((p: any) => (
              <div key={p.id} className="rounded-2xl p-5" style={{ border: `1px solid ${palette.border}`, background: 'white' }}>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{p.title}</h3>
                  <span className="px-2 py-0.5 text-xs rounded-full" style={{ background: '#f5f5f5' }}>{p.material || ''}</span>
                </div>
                <p className="opacity-80 mt-1">{p.blurb}</p>
                <details className="mt-3"><summary className="cursor-pointer">Materials & Hardware</summary>
                  <p className="opacity-80 mt-2">Premium {p.material?.toLowerCase?.() || 'wood'}, FSC plywood, soft-close hardware.</p>
                </details>
                <details className="mt-2"><summary className="cursor-pointer">Techniques</summary>
                  <p className="opacity-80 mt-2">Mortise & tenon joinery, accurate edge-banding, pro spray-booth finishing.</p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story + Timeline */}
      <section id="about" className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: palette.wood }}>The Craftsman Story</h2>
            <p className="opacity-80 mt-3 max-w-prose">
              Old School Woodworking is a small, family shop in Texas. We build pieces to last —
              carefully selected lumber, honest joinery, and finishes you can live with.
            </p>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              <div className="rounded-2xl p-4" style={{ border: `1px solid ${palette.border}`, background: 'white' }}>
                <div className="font-semibold" style={{ color: palette.wood }}>Values</div>
                <div className="opacity-80">Craft, transparency, kindness.</div>
              </div>
              <div className="rounded-2xl p-4" style={{ border: `1px solid ${palette.border}`, background: 'white' }}>
                <div className="font-semibold" style={{ color: palette.wood }}>Guarantee</div>
                <div className="opacity-80">2-year workmanship warranty.</div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl p-5" style={{ border: `1px solid ${palette.border}`, background: 'white' }}>
            <h3 className="font-semibold mb-3">Process Timeline</h3>
            <Timeline />
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold" style={{ color: palette.wood }}>Services</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {[
            { name: 'Kitchens', blurb: 'Custom cabinetry, islands, soft-close hardware.' },
            { name: 'Built-ins', blurb: 'Media walls, bookshelves, mudroom lockers.' },
            { name: 'Furniture', blurb: 'Tables, vanities, benches in premium hardwoods.' }
          ].map((s) => (
            <div key={s.name} className="rounded-2xl p-5 relative overflow-hidden"
                 style={{ border: `1px solid ${palette.border}`, background: 'white' }}>
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10" style={{ background: palette.copper }} />
              <div className="font-semibold">{s.name}</div>
              <p className="opacity-80 mt-1">{s.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-y" style={{ borderColor: palette.border, background: '#ffffffb3' }}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold" style={{ color: palette.wood }}>Client Testimonials</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {(testimonials?.length ? testimonials : [
              { name: 'Avery P.', rating: 5, quote: 'Flawless fit and finish. Communication was excellent.' },
              { name: 'Jon D.', rating: 5, quote: 'The walnut kitchen changed our home. Worth every penny.' },
              { name: 'Maya K.', rating: 5, quote: 'From design to install, they were meticulous and kind.' }
            ]).map((t: any, i: number) => (
              <div key={i} className="rounded-2xl p-5" style={{ border: `1px solid ${palette.border}`, background: 'white' }}>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{t.name}</div>
                  <Stars count={t.rating || 5} />
                </div>
                <div className="flex items-start gap-2 opacity-80 mt-2"><Quote className="w-4 h-4 mt-0.5" /> {t.quote}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact + Free Consultation + Mozaik link */}
      <section id="contact" className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: palette.wood }}>Request a Free Consultation</h2>
          <p className="opacity-80">Tell us about your project. We usually reply within one business day.</p>

          {estimateSummary && (
            <div className="rounded-2xl p-4 mb-4" style={{ border: `1px solid ${palette.border}`, background: 'white' }}>
              <div className="text-sm opacity-80 mb-2">AI Estimate summary (you can edit before sending):</div>
              <textarea
                className="w-full px-3 py-2 rounded-xl border min-h-[100px]"
                style={{ borderColor: palette.border }}
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
              <input required className="px-3 py-2 rounded-xl border" style={{ borderColor: palette.border }} name="name" placeholder="Full name" />
              <input required type="email" className="px-3 py-2 rounded-xl border" style={{ borderColor: palette.border }} name="email" placeholder="Email" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="px-3 py-2 rounded-xl border" style={{ borderColor: palette.border }} name="phone" placeholder="Phone (optional)" />
              <input className="px-3 py-2 rounded-xl border" style={{ borderColor: palette.border }} name="city" placeholder="City" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <select className="px-3 py-2 rounded-xl border" style={{ borderColor: palette.border }} name="project_type" defaultValue="Kitchens">
                {['Kitchens', 'Bathrooms', 'Mudrooms', 'Laundry', 'Closets', 'Furniture'].map(x => <option key={x}>{x}</option>)}
              </select>
              <select className="px-3 py-2 rounded-xl border" style={{ borderColor: palette.border }} name="budget" defaultValue="$10k–$20k">
                {['<$5k', '$5k–$10k', '$10k–$20k', '$20k–$40k', '$40k+'].map(x => <option key={x}>{x}</option>)}
              </select>
              <select className="px-3 py-2 rounded-xl border" style={{ borderColor: palette.border }} name="timeline" defaultValue="Flexible">
                {['ASAP (4–6 weeks)', 'Soon (2–3 months)', 'Flexible'].map(x => <option key={x}>{x}</option>)}
              </select>
            </div>

            {/* Mozaik integration link */}
            <input className="px-3 py-2 rounded-xl border" style={{ borderColor: palette.border }}
                   name="mozaik_link" placeholder="Link to Mozaik files (Drive/Dropbox)" />

            <textarea required className="px-3 py-2 rounded-xl border min-h-[120px]" style={{ borderColor: palette.border }}
                      name="details" placeholder="Describe your project, dimensions, finishes, timeline, budget range…"></textarea>

            <div className="flex items-center justify-between">
              <div className="opacity-80 text-sm">Prefer a quick ballpark? Tap <em>Get a Quote</em> in the header.</div>
              <button className="px-4 py-2 rounded-2xl text-white" style={{ background: palette.copper }}>Send Request</button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl p-5 grid gap-3 text-sm opacity-90"
             style={{ border: `1px solid ${palette.border}`, background: 'white' }}>
          <div className="font-semibold" style={{ color: palette.wood }}>Why clients choose us</div>
          <div>• Transparent pricing & schedule</div>
          <div>• Mozaik 3D design support</div>
          <div>• Workmanship warranty</div>
          <div>• Insured & background-checked</div>

          {(site?.social && Object.keys(site.social).length > 0) && (
  <>
    <div className="mt-2 font-semibold" style={{ color: palette.wood }}>Follow</div>
    <SocialBar social={site.social} />
  </>
)}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: palette.border, background: '#ffffffb3' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-semibold flex items-center gap-2"><Hammer className="w-4 h-4" /> {site?.name || 'Old School Woodworking'}</div>
            <p className="opacity-80 mt-2">Custom cabinetry, furniture, and built-ins for {site?.city || 'your area'}.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-1 gap-3">
            <a href="#portfolio" className="hover:underline">Portfolio</a>
            <a href="#about" className="hover:underline">Story</a>
            <a href="#services" className="hover:underline">Services</a>
            <a href="#contact" className="hover:underline">Get a Quote</a>
          </div>
          <div className="opacity-80">
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

      {/* Estimator modal (Get a Quote) */}
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
