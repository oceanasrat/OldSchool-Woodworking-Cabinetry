import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronRight, Instagram, Facebook, Phone, Mail, MapPin, Filter, Hammer, Image as ImageIcon, Star, Quote, BookOpen, ExternalLink, CheckCircle2 } from "lucide-react";

// --- Demo Data (replace with your real content) ---
const PROJECTS = [
  { id: 1, title: "Walnut Shaker Cabinets", type: "Cabinets", material: "Walnut", hero: "/images/walnut-cabinets.jpg", images: ["/images/walnut-1.jpg","/images/walnut-2.jpg"], blurb: "Custom built-in kitchen with hand-rubbed oil finish.", metrics: ["120 hrs craftsmanship", "Zero-VOC finish", "Soft-close hardware" ] },
  { id: 2, title: "Live-Edge Dining Table", type: "Furniture", material: "Oak", hero: "/images/liveedge-table.jpg", images: ["/images/liveedge-1.jpg","/images/liveedge-2.jpg"], blurb: "Bookmatched slab table with butterfly keys.", metrics: ["Single-tree source", "Food-safe finish", "Powder-coated base"] },
  { id: 3, title: "Entryway Bench & Peg Rail", type: "Furniture", material: "Ash", hero: "/images/bench.jpg", images: ["/images/bench-1.jpg","/images/bench-2.jpg"], blurb: "Minimal hallway set with wedged tenons.", metrics: ["Solid ash", "Hand-cut joinery", "Natural oil finish"] },
  { id: 4, title: "Floating Media Console", type: "Cabinets", material: "Maple", hero: "/images/media-console.jpg", images: ["/images/media-1.jpg","/images/media-2.jpg"], blurb: "Wall-hung console with cord management.", metrics: ["Hidden mounting", "Matte UV finish", "Push-to-open"] },
  { id: 5, title: "Panelled Home Office", type: "Built-ins", material: "Oak", hero: "/images/office.jpg", images: ["/images/office-1.jpg","/images/office-2.jpg"], blurb: "Warm, functional workspace with storage.", metrics: ["Acoustic panels", "LED task lighting", "Cable passthroughs"] },
];

const TESTIMONIALS = [
  { name: "Sarah L.", quote: "The attention to detail is unreal. Our kitchen feels custom—and it is!", avatar: "", rating: 5 },
  { name: "Jason P.", quote: "Clear communication, on schedule, and gorgeous craftsmanship.", avatar: "", rating: 5 },
  { name: "Amara K.", quote: "From concept to install, everything was smooth. Highly recommended.", avatar: "", rating: 5 },
];

const BLOG = [
  { slug: "oil-vs-varnish", title: "Oil vs Varnish: Which Finish Suits Everyday Use?", date: "2025-08-12", excerpt: "A practical guide to choosing durable, beautiful finishes for high‑touch surfaces.", cover: "/images/finish.jpg" },
  { slug: "joinery-101", title: "Joinery 101: Mortise & Tenon Basics", date: "2025-07-28", excerpt: "Why traditional joinery still outperforms quick fixes in strength and longevity.", cover: "/images/joinery.jpg" },
  { slug: "selecting-wood", title: "Selecting Wood Species for Cabinetry", date: "2025-06-18", excerpt: "Tone, grain, movement—how to balance looks with stability and budget.", cover: "/images/species.jpg" },
];

const CATEGORIES = ["All", "Cabinets", "Furniture", "Built-ins"] as const;
const MATERIALS = ["All", "Walnut", "Oak", "Ash", "Maple"] as const;

type Category = typeof CATEGORIES[number];
type Material = typeof MATERIALS[number];

// --- Small helpers ---
const Stars = ({ count = 5 }: { count?: number }) => (
  <div className="flex gap-1" aria-label={`${count} star rating`}>
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-current" />
    ))}
  </div>
);

const Stat = ({ label }: { label: string }) => (
  <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs">
    <CheckCircle2 className="w-4 h-4" /> {label}
  </div>
);

// --- Main Page Component ---
export default function ArtisanPortfolio() {
  const [category, setCategory] = useState<Category>("All");
  const [material, setMaterial] = useState<Material>("All");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    return PROJECTS.filter(p => (category === "All" || p.type === category) && (material === "All" || p.material === material) && (query === "" || p.title.toLowerCase().includes(query.toLowerCase())));
  }, [category, material, query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-40 backdrop-blur border-b bg-background/80">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-semibold">
            <Hammer className="w-5 h-5" /> Old School Woodworks
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#portfolio" className="hover:underline">Portfolio</a>
            <a href="#case-studies" className="hover:underline">Case Studies</a>
            <a href="#about" className="hover:underline">About</a>
            <a href="#testimonials" className="hover:underline">Reviews</a>
            <a href="#blog" className="hover:underline">Blog</a>
          </div>
          <div className="flex items-center gap-2">
            <a href="#contact"><Button>Get a Quote</Button></a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden"><Filter className="w-4 h-4" /></Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Quick Nav</SheetTitle>
                </SheetHeader>
                <nav className="mt-4 grid gap-3 text-sm">
                  <a href="#portfolio" className="underline">Portfolio</a>
                  <a href="#case-studies" className="underline">Case Studies</a>
                  <a href="#about" className="underline">About</a>
                  <a href="#testimonials" className="underline">Reviews</a>
                  <a href="#blog" className="underline">Blog</a>
                  <a href="#contact" className="underline">Get a Quote</a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl md:text-5xl font-bold leading-tight">
              Bespoke Cabinets & Furniture—Built to Last
            </motion.h1>
            <p className="mt-4 text-muted-foreground max-w-prose">
              Handcrafted pieces tailored to your space. We design, build, and install cabinetry, furniture, and built‑ins with premium materials and traditional joinery.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#portfolio"><Button size="lg">View Portfolio</Button></a>
              <a href="#contact"><Button variant="outline" size="lg">Request a Quote</Button></a>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" />(214) 555‑0192</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" />hello@oldschoolwoodworks.com</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />Dallas–Fort Worth</div>
            </div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="relative aspect-[4/3] rounded-2xl bg-muted overflow-hidden shadow-xl">
            {/* Placeholder image */}
            <div className="absolute inset-0 grid place-items-center">
              <ImageIcon className="w-12 h-12 opacity-30" />
              <span className="sr-only">Project hero image</span>
            </div>
          </motion.div>
        </div>
      </section>

      <Separator />

      {/* Portfolio with Filters */}
      <section id="portfolio" className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">Portfolio</h2>
            <p className="text-muted-foreground">Filter by project type, material, or search by name.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Search projects…" value={query} onChange={(e) => setQuery(e.target.value)} className="w-56" />
            <Tabs value={category} onValueChange={(v) => setCategory(v as Category)}>
              <TabsList>
                {CATEGORIES.map(c => (
                  <TabsTrigger key={c} value={c}>{c}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Tabs value={material} onValueChange={(v) => setMaterial(v as Material)}>
              <TabsList>
                {MATERIALS.map(m => (
                  <TabsTrigger key={m} value={m}>{m}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <Card key={p.id} className="overflow-hidden group">
              <div className="relative aspect-[4/3] bg-muted">
                <div className="absolute inset-0 grid place-items-center">
                  <ImageIcon className="w-10 h-10 opacity-30" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {p.title}
                  <Badge variant="secondary">{p.type}</Badge>
                </CardTitle>
                <CardDescription>{p.blurb}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {p.metrics.map((m, i) => <Stat key={i} label={m} />)}
              </CardContent>
              <div className="px-6 pb-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">View Photos</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{p.title}</DialogTitle>
                    </DialogHeader>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {p.images.map((src, i) => (
                        <div key={i} className="aspect-video rounded-lg bg-muted grid place-items-center">
                          <ImageIcon className="w-10 h-10 opacity-30" />
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="text-2xl md:text-3xl font-semibold">Case Studies</h2>
          <p className="text-muted-foreground">Story‑driven breakdowns of featured builds.</p>
          <div className="mt-6 grid lg:grid-cols-2 gap-6">
            {PROJECTS.slice(0,2).map((p) => (
              <Card key={p.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">{p.title} <Badge>{p.material}</Badge></CardTitle>
                  <CardDescription>{p.blurb}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="materials">
                      <AccordionTrigger>Materials & Hardware</AccordionTrigger>
                      <AccordionContent>
                        Premium {p.material.toLowerCase()} lumber, FSC‑certified plywood, soft‑close hinges, and hidden leveling feet.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="techniques">
                      <AccordionTrigger>Techniques</AccordionTrigger>
                      <AccordionContent>
                        Mortise‑and‑tenon joinery, precise edge‑banding, spray booth finishing, and on‑site scribing for a perfect fit.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="process">
                      <AccordionTrigger>Process</AccordionTrigger>
                      <AccordionContent>
                        From sketch to install: concept moodboard, 3D drawing approval, shop build with QA photos, delivery & clean install.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="results">
                      <AccordionTrigger>Results</AccordionTrigger>
                      <AccordionContent>
                        Clients reported improved storage capacity, better lighting, and a cohesive aesthetic—raising the home’s appraisal value.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">Our Story</h2>
            <p className="mt-3 text-muted-foreground max-w-prose">
              We’re a small Dallas woodshop building functional, honest furniture and cabinetry. Every piece is made to order. We blend time‑tested methods with modern tooling, prioritizing sustainable materials and long‑term serviceability.
            </p>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Values</CardTitle>
                  <CardDescription>Craft, transparency, and kindness.</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Guarantee</CardTitle>
                  <CardDescription>Two‑year workmanship warranty.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
          <div className="aspect-[4/3] rounded-2xl bg-muted grid place-items-center">
            <ImageIcon className="w-12 h-12 opacity-30" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="text-2xl md:text-3xl font-semibold">Client Reviews</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Card key={i} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{t.name}</CardTitle>
                    <Stars count={t.rating} />
                  </div>
                  <CardDescription className="flex items-start gap-2"><Quote className="w-4 h-4 mt-0.5" /> {t.quote}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Previews */}
      <section id="blog" className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">From the Shop Blog</h2>
            <p className="text-muted-foreground">Tips, process notes, and project updates.</p>
          </div>
          <Button variant="ghost" className="gap-2">View all <ChevronRight className="w-4 h-4" /></Button>
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {BLOG.map((b) => (
            <Card key={b.slug} className="overflow-hidden">
              <div className="aspect-video bg-muted grid place-items-center">
                <BookOpen className="w-8 h-8 opacity-30" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{b.title}</CardTitle>
                <CardDescription>{new Date(b.date).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{b.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Contact / Lead Capture */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">Request a Quote</h2>
            <p className="text-muted-foreground">Tell us about your project. We usually reply within one business day.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thanks! We'll get back to you shortly."); }} className="mt-6 grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input required placeholder="Full name" />
                <Input required type="email" placeholder="Email" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input placeholder="Phone (optional)" />
                <Input placeholder="City" />
              </div>
              <Tabs defaultValue="cabinetry">
                <TabsList>
                  <TabsTrigger value="cabinetry">Cabinetry</TabsTrigger>
                  <TabsTrigger value="furniture">Furniture</TabsTrigger>
                  <TabsTrigger value="builtins">Built‑ins</TabsTrigger>
                </TabsList>
              </Tabs>
              <Textarea required placeholder="Describe your project, dimensions, timeline, and budget range…" className="min-h-[120px]" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Instagram className="w-4 h-4" />
                  <Facebook className="w-4 h-4" />
                  <a href="#" className="underline inline-flex items-center gap-1">See more work <ExternalLink className="w-3 h-3" /></a>
                </div>
                <Button size="lg">Send Request</Button>
              </div>
            </form>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Why clients choose us</CardTitle>
              <CardDescription>Trust, clarity, and craftsmanship.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 w-4 h-4" />Transparent pricing & schedule</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 w-4 h-4" />Design support with drawings</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 w-4 h-4" />Workmanship warranty</div>
              <div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 w-4 h-4" />Insured & background‑checked</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-semibold flex items-center gap-2"><Hammer className="w-4 h-4" /> Old School Woodworks</div>
            <p className="mt-2 text-muted-foreground">Custom cabinetry, furniture, and built‑ins for Dallas–Fort Worth.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-1 gap-3">
            <a href="#portfolio" className="hover:underline">Portfolio</a>
            <a href="#about" className="hover:underline">About</a>
            <a href="#blog" className="hover:underline">Blog</a>
            <a href="#contact" className="hover:underline">Get a Quote</a>
          </div>
          <div className="text-muted-foreground">
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" />(214) 555‑0192</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" />hello@oldschoolwoodworks.com</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />Dallas–Fort Worth</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
