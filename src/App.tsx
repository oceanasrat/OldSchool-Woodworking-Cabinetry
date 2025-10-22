import React, { useMemo, useState } from 'react'
import { Hammer, Image as ImageIcon, Phone, Mail, MapPin, ChevronRight, Star, Quote } from 'lucide-react'
import { useData } from './lib/data'

function Stars({ count=5 }: { count?: number }) {
  return (
    <div className="flex gap-1" aria-label={`${count} star rating`}>
      {Array.from({ length: count }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
    </div>
  )
}

function Modal({open,onClose,children}:{open:boolean,onClose:()=>void,children:React.ReactNode}){
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div className="max-w-4xl w-full card p-4" onClick={e=>e.stopPropagation()}>{children}</div>
    </div>
  )
}

export default function App(){
  const { site, projects, testimonials, blog } = useData()
  const [query,setQuery] = useState('')
  const [category,setCategory] = useState<'All'|'Cabinets'|'Furniture'|'Built-ins'>('All')
  const [material,setMaterial] = useState<'All'|'Walnut'|'Oak'|'Ash'|'Maple'>('All')
  const [viewer,setViewer] = useState<{title:string,images:string[]} | null>(null)

  const CATEGORIES = ['All','Cabinets','Furniture','Built-ins'] as const
  const MATERIALS = ['All','Walnut','Oak','Ash','Maple'] as const

  const filtered = useMemo(()=>(
    projects.filter(p =>
      (category==='All'||p.type===category) &&
      (material==='All'||(p as any).material===material) &&
      (query===''||p.title.toLowerCase().includes(query.toLowerCase()))
    )
  ),[projects,category,material,query])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
        <div className="container-max py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-semibold">
            <Hammer className="w-5 h-5" /> {site.name}
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#portfolio" className="hover:underline">Portfolio</a>
            <a href="#case-studies" className="hover:underline">Case Studies</a>
            <a href="#about" className="hover:underline">About</a>
            <a href="#testimonials" className="hover:underline">Reviews</a>
            <a href="#blog" className="hover:underline">Blog</a>
          </nav>
          <div className="flex items-center gap-2">
            <a className="btn-primary rounded-2xl" href="#contact">Get a Quote</a>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="section grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{site.tagline}</h1>
          <p className="mt-4 subtle max-w-xl">
            Handcrafted pieces tailored to your space. We design, build, and install cabinetry, furniture, and built-ins with premium materials and traditional joinery.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#portfolio" className="btn-primary rounded-2xl">View Portfolio</a>
            <a href="#contact" className="btn-outline rounded-2xl">Request a Quote</a>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted">
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{site.phone}</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{site.email}</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{site.city}</div>
          </div>
        </div>
        <div className="relative aspect-[4/3] rounded-2xl bg-surface overflow-hidden border border-border shadow-soft grid place-items-center">
          <ImageIcon className="w-12 h-12 opacity-30" />
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="section">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="heading">Portfolio</h2>
            <p className="subtle">Filter by project type, material, or search by name.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input className="input w-56" placeholder="Search projects…" value={query} onChange={(e)=>setQuery(e.target.value)} />
            <select className="input" value={category} onChange={(e)=>setCategory(e.target.value as any)}>
              {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input" value={material} onChange={(e)=>setMaterial(e.target.value as any)}>
              {MATERIALS.map(m=> <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="card overflow-hidden">
              <div className="relative aspect-[4/3] bg-black/5 grid place-items-center">
                <ImageIcon className="w-10 h-10 opacity-30" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{p.title}</h3>
                  <span className="badge">{p.type}</span>
                </div>
                <p className="subtle mt-1">{p.blurb}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {p.metrics.map((m,i)=> <span key={i} className="badge">{m}</span>)}
                </div>
                <button className="btn-outline w-full mt-4 rounded-xl" onClick={()=>setViewer({title:p.title,images:p.images})}>
                  View Photos
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="bg-white/60 border-y border-border">
        <div className="section">
          <h2 className="heading">Case Studies</h2>
          <p className="subtle">Story-driven breakdowns of featured builds.</p>
          <div className="mt-6 grid lg:grid-cols-2 gap-6">
            {projects.slice(0,2).map(p => (
              <div key={p.id} className="card p-5">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{p.title}</h3>
                  <span className="badge">{(p as any).material || ''}</span>
                </div>
                <p className="subtle mt-1">{p.blurb}</p>
                <details className="mt-3"><summary className="cursor-pointer">Materials & Hardware</summary>
                  <p className="subtle mt-2">Premium {(p as any).material?.toLowerCase?.() || 'wood'}, FSC-certified plywood, soft-close hinges, and hidden leveling feet.</p>
                </details>
                <details className="mt-2"><summary className="cursor-pointer">Techniques</summary>
                  <p className="subtle mt-2">Mortise-and-tenon joinery, precise edge-banding, spray booth finishing, and on-site scribing for a perfect fit.</p>
                </details>
                <details className="mt-2"><summary className="cursor-pointer">Process</summary>
                  <p className="subtle mt-2">From sketch to install: concept moodboard, 3D drawings, shop build with QA photos, delivery & clean install.</p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="heading">Our Story</h2>
          <p className="subtle mt-3 max-w-prose">
            We’re a small workshop building functional, honest furniture and cabinetry. Every piece is made to order. We blend time-tested methods with modern tooling.
          </p>
          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            <div className="card p-4"><div className="font-semibold text-base">Values</div><div className="subtle">Craft, transparency, and kindness.</div></div>
            <div className="card p-4"><div className="font-semibold text-base">Guarantee</div><div className="subtle">Two-year workmanship warranty.</div></div>
          </div>
        </div>
        <div className="aspect-[4/3] rounded-2xl bg-surface border border-border grid place-items-center">
          <ImageIcon className="w-12 h-12 opacity-30" />
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-white/60 border-y border-border">
        <div className="section">
          <h2 className="heading">Client Reviews</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {testimonials.map((t,i)=>(
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

      {/* Blog */}
      <section id="blog" className="section">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="heading">From the Shop Blog</h2>
            <p className="subtle">Tips, process notes, and project updates.</p>
          </div>
          <a className="btn-outline gap-2 rounded-xl" href="#"><span>View all</span><ChevronRight className="w-4 h-4" /></a>
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {blog.map(b => (
            <div key={(b as any).slug} className="card overflow-hidden">
              <div className="aspect-video bg-black/5 grid place-items-center">
                <span className="subtle">Cover</span>
              </div>
              <div className="p-5">
                <div className="text-lg font-semibold">{(b as any).title}</div>
                <div className="subtle">{new Date((b as any).date).toLocaleDateString()}</div>
                <p className="subtle mt-2">{(b as any).excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="heading">Request a Quote</h2>
          <p className="subtle">Tell us about your project. We usually reply within one business day.</p>
          <form className="mt-6 grid gap-4" method="POST" action={site.formspreeEndpoint || undefined}
                onSubmit={(e)=>{ if(!site.formspreeEndpoint){ e.preventDefault(); alert('Thanks! (Formspree not set)') } }}>
            <div className="grid sm:grid-cols-2 gap-4">
              <input required className="input" name="name" placeholder="Full name" />
              <input required type="email" className="input" name="email" placeholder="Email" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="input" name="phone" placeholder="Phone (optional)" />
              <input className="input" name="city" placeholder="City" />
            </div>
            <select className="input" name="service">
              {site.services.map((s:string) => <option key={s}>{s}</option>)}
            </select>
            <textarea required className="textarea min-h-[120px]" name="details" placeholder="Describe your project, dimensions, timeline, budget range…"></textarea>
            <div className="flex items-center justify-between">
              <div className="subtle">Follow our latest work on social media.</div>
              <button className="btn-primary rounded-2xl">Send Request</button>
            </div>
          </form>
        </div>
        <div className="card p-5 grid gap-3 text-sm text-muted">
          <div className="text-foreground font-semibold text-base">Why clients choose us</div>
          <div>• Transparent pricing & schedule</div>
          <div>• Design support with drawings</div>
          <div>• Workmanship warranty</div>
          <div>• Insured & background-checked</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white/70">
        <div className="section grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-semibold flex items-center gap-2"><Hammer className="w-4 h-4" /> {site.name}</div>
            <p className="subtle mt-2">Custom cabinetry, furniture, and built-ins for {site.city}.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-1 gap-3">
            <a href="#portfolio" className="hover:underline">Portfolio</a>
            <a href="#about" className="hover:underline">About</a>
            <a href="#blog" className="hover:underline">Blog</a>
            <a href="#contact" className="hover:underline">Get a Quote</a>
          </div>
          <div className="text-muted">
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{site.phone}</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{site.email}</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{site.city}</div>
          </div>
        </div>
      </footer>

      <Modal open={!!viewer} onClose={()=>setViewer(null)}>
        <div className="font-semibold text-lg mb-3">{viewer?.title}</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {viewer?.images.map((_,i)=>(
            <div key={i} className="aspect-video rounded-lg bg-black/5 grid place-items-center">
              <span className="subtle">Image {i+1}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
