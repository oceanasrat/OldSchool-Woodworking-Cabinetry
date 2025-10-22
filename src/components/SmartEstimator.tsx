import React, { useMemo, useState } from "react"
import { Calculator, X, Send } from "lucide-react"

/**
 * ZERO-COST “AI” ESTIMATOR
 * -------------------------------------------------
 * Client-side rules (no servers/APIs). Tweak CONFIG only.
 */
const CONFIG = {
  laborRate: 65,             // $/hr shop rate
  overheadPct: 0.20,         // 20% overhead
  profitPct: 0.15,           // 15% profit

  // Cabinetry/Built-ins baseline per linear foot BEFORE overhead/profit
  cabinetLFRate: { materials: 220, labor: 260 },

  // Furniture baseline per sq ft footprint BEFORE overhead/profit
  furniturePsfRate: 140,

  finish: {
    oil:   { label: "Natural Oil",  hoursPerSqFt: 0.10, materialsPerSqFt: 1.5 },
    poly:  { label: "Poly/Varnish", hoursPerSqFt: 0.20, materialsPerSqFt: 2.5 },
    paint: { label: "Painted",      hoursPerSqFt: 0.35, materialsPerSqFt: 3.5 },
  },

  materialFactor: { Walnut: 1.35, Oak: 1.10, Maple: 1.15, Ash: 1.0 },

  complexityFactor: { Basic: 0.9, Standard: 1.0, Premium: 1.25, Custom: 1.5 },

  hardwarePremium: { none: 0, premium: 200 }, // per piece or per 4 LF

  install: {
    hourly: 60,
    baseHoursCabinet: 6,
    hoursPerLF: 0.5,
    furnitureHours: 2,
    perMile: 1.25,
  },

  rushFactor: { none: 1.0, rush: 1.15 },

  rangePct: 0.12, // +/- range around total
}

// ---------- types ----------
type ProjectType = "Cabinetry" | "Furniture" | "Built-ins"
type Material = "Walnut" | "Oak" | "Maple" | "Ash"
type Complexity = "Basic" | "Standard" | "Premium" | "Custom"
type FinishKey = keyof typeof CONFIG.finish
type Rush = "none" | "rush"

type EstimatorState = {
  projectType: ProjectType
  material: Material
  lengthIn: number
  widthIn: number
  heightIn: number
  complexity: Complexity
  finish: FinishKey
  hardware: "none" | "premium"
  install: boolean
  distanceMiles: number
  rush: Rush
}

const DEFAULTS: EstimatorState = {
  projectType: "Cabinetry",
  material: "Walnut",
  lengthIn: 96,  // 8ft run
  widthIn: 24,
  heightIn: 36,
  complexity: "Standard",
  finish: "poly",
  hardware: "none",
  install: true,
  distanceMiles: 10,
  rush: "none",
}

type CalcOut = {
  subtotal: number
  ohp: number
  total: number
  low: number
  high: number
  weeks: number
  lineItems: Array<{ label: string; amount: number }>
}

// ---------- helpers ----------
function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)) }
function asNum(v: string) { return Number.isFinite(+v) ? +v : 0 }
function money(n: number) { return `$${Math.round(n).toLocaleString()}` }

function buildSummary(input: EstimatorState, out: CalcOut) {
  const lines = [
    `Free AI Estimate (non-binding)`,
    `Type: ${input.projectType}`,
    `Material: ${input.material}`,
    `Complexity: ${input.complexity}`,
    `Finish: ${CONFIG.finish[input.finish].label}`,
    input.projectType === "Cabinetry" || input.projectType === "Built-ins"
      ? `Length: ${input.lengthIn} in (${(input.lengthIn/12).toFixed(1)} lf)`
      : `Size: ${input.lengthIn} x ${input.widthIn} x ${input.heightIn} in`,
    `Hardware: ${input.hardware === "premium" ? "Premium" : "Basic"}`,
    `Install: ${input.install ? `Yes (${input.distanceMiles} miles)` : "No"}`,
    `Rush: ${input.rush === "rush" ? "Yes" : "No"}`,
    ``,
    `Subtotal (before overhead/profit): ${money(out.subtotal)}`,
    `Overhead & Profit: ${money(out.ohp)}`,
    `Estimated Range: ${money(out.low)} – ${money(out.high)}`,
    `Suggested Timeline: ~${out.weeks} weeks`,
  ]
  return lines.join("\n")
}

function calculate(s: EstimatorState): CalcOut {
  const matFactor = CONFIG.materialFactor[s.material]
  const cx = CONFIG.complexityFactor[s.complexity]
  const finishCfg = CONFIG.finish[s.finish]
  const rush = CONFIG.rushFactor[s.rush]
  const range = CONFIG.rangePct

  let materials = 0
  let labor = 0
  let finishCost = 0
  let hardware = 0
  let install = 0
  let weeks = 2

  if (s.projectType === "Cabinetry" || s.projectType === "Built-ins") {
    const lf = clamp(s.lengthIn / 12, 1, 1000)
    const baseMat = CONFIG.cabinetLFRate.materials * lf * matFactor
    const baseLabor = CONFIG.cabinetLFRate.labor * lf * cx
    const finishArea = 8 * lf // sqft approx
    const finishLabor = finishArea * finishCfg.hoursPerSqFt * CONFIG.laborRate
    const finishMat = finishArea * finishCfg.materialsPerSqFt

    materials += baseMat + finishMat
    labor += baseLabor + finishLabor
    hardware += s.hardware === "premium" ? Math.ceil(lf / 4) * CONFIG.hardwarePremium.premium : 0
    if (s.install) {
      const installHours = CONFIG.install.baseHoursCabinet + (lf * CONFIG.install.hoursPerLF)
      install += installHours * CONFIG.install.hourly + s.distanceMiles * CONFIG.install.perMile
    }
    weeks = Math.max(2, Math.ceil(lf / 6))
  } else {
    // Furniture
    const area = clamp((s.lengthIn * s.widthIn) / 144, 1, 10000) // sqft footprint
    const base = CONFIG.furniturePsfRate * area
    // split materials/labor roughly
    materials += base * 0.5 * matFactor
    labor += base * 0.5 * cx
    const finishArea = area * 1.8 // tops + sides approx
    const finishLabor = finishArea * finishCfg.hoursPerSqFt * CONFIG.laborRate
    const finishMat = finishArea * finishCfg.materialsPerSqFt
    finishCost += finishLabor + finishMat
    hardware += s.hardware === "premium" ? CONFIG.hardwarePremium.premium : 0
    if (s.install) {
      install += (CONFIG.install.furnitureHours * CONFIG.install.hourly) + s.distanceMiles * CONFIG.install.perMile
    }
    weeks = 2 + Math.ceil(area / 12)
  }

  const subtotal = (materials + labor + finishCost + hardware + install) * rush
  const ohp = subtotal * (CONFIG.overheadPct + CONFIG.profitPct)
  const total = subtotal + ohp
  const low = total * (1 - range)
  const high = total * (1 + range)

  const lineItems = [
    { label: "Materials", amount: materials },
    { label: "Shop Labor", amount: labor },
    { label: "Finishing", amount: finishCost },
    { label: "Hardware", amount: hardware },
    { label: "Install/Travel", amount: install },
    { label: "Overhead + Profit", amount: ohp },
  ]

  return { subtotal, ohp, total, low, high, weeks, lineItems }
}

// ---------- component ----------
export default function SmartEstimator(props: { onUse: (summary: string) => void; onClose: () => void }) {
  const [s, setS] = useState<EstimatorState>(DEFAULTS)

  const out = useMemo(() => calculate(s), [s])
  const update = (patch: Partial<EstimatorState>) => setS(prev => ({ ...prev, ...patch }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Calculator className="w-5 h-5" /> Free AI Estimate
        </div>
        <button className="btn-outline rounded-xl" onClick={props.onClose}>
          <X className="w-4 h-4" /> Close
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Left: inputs */}
        <div className="md:col-span-2 card p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <select className="input" value={s.projectType} onChange={e=>update({projectType: e.target.value as any})}>
              <option>Cabinetry</option>
              <option>Built-ins</option>
              <option>Furniture</option>
            </select>
            <select className="input" value={s.material} onChange={e=>update({material: e.target.value as any})}>
              <option>Walnut</option><option>Oak</option><option>Maple</option><option>Ash</option>
            </select>
          </div>

          { (s.projectType === "Cabinetry" || s.projectType === "Built-ins") ? (
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="text-sm subtle">Run Length (inches)
                <input className="input mt-1" value={s.lengthIn} onChange={e=>update({lengthIn: asNum(e.target.value)})} />
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="text-sm subtle">Complexity
                  <select className="input mt-1" value={s.complexity} onChange={e=>update({complexity: e.target.value as any})}>
                    <option>Basic</option><option>Standard</option><option>Premium</option><option>Custom</option>
                  </select>
                </label>
                <label className="text-sm subtle">Finish
                  <select className="input mt-1" value={s.finish} onChange={e=>update({finish: e.target.value as any})}>
                    <option value="oil">Natural Oil</option>
                    <option value="poly">Poly/Varnish</option>
                    <option value="paint">Painted</option>
                  </select>
                </label>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-3">
              <label className="text-sm subtle">Length (in)
                <input className="input mt-1" value={s.lengthIn} onChange={e=>update({lengthIn: asNum(e.target.value)})} />
              </label>
              <label className="text-sm subtle">Width (in)
                <input className="input mt-1" value={s.widthIn} onChange={e=>update({widthIn: asNum(e.target.value)})} />
              </label>
              <label className="text-sm subtle">Height (in)
                <input className="input mt-1" value={s.heightIn} onChange={e=>update({heightIn: asNum(e.target.value)})} />
              </label>
              <label className="text-sm subtle col-span-2">Complexity
                <select className="input mt-1" value={s.complexity} onChange={e=>update({complexity: e.target.value as any})}>
                  <option>Basic</option><option>Standard</option><option>Premium</option><option>Custom</option>
                </select>
              </label>
              <label className="text-sm subtle">Finish
                <select className="input mt-1" value={s.finish} onChange={e=>update({finish: e.target.value as any})}>
                  <option value="oil">Natural Oil</option>
                  <option value="poly">Poly/Varnish</option>
                  <option value="paint">Painted</option>
                </select>
              </label>
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-3">
            <label className="text-sm subtle">Hardware
              <select className="input mt-1" value={s.hardware} onChange={e=>update({hardware: e.target.value as any})}>
                <option value="none">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </label>
            <label className="text-sm subtle">Install?
              <select className="input mt-1" value={String(s.install)} onChange={e=>update({install: e.target.value === "true"})}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="text-sm subtle">Distance (miles)
              <input className="input mt-1" value={s.distanceMiles} onChange={e=>update({distanceMiles: asNum(e.target.value)})} />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="text-sm subtle">Rush?
              <select className="input mt-1" value={s.rush} onChange={e=>update({rush: e.target.value as any})}>
                <option value="none">No</option>
                <option value="rush">Yes (15%)</option>
              </select>
            </label>
          </div>
        </div>

        {/* Right: summary */}
        <div className="card p-4 space-y-3">
          <div className="text-sm subtle">Estimated range</div>
          <div className="text-2xl font-semibold">{money(out.low)} – {money(out.high)}</div>
          <div className="text-sm subtle">Target timeline: ~{out.weeks} weeks</div>

          <div className="mt-3 border-t border-border pt-3 space-y-1 text-sm">
            {out.lineItems.map((li, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="subtle">{li.label}</span>
                <span className="font-medium">{money(li.amount)}</span>
              </div>
            ))}
          </div>

          <button
            className="btn-primary rounded-xl w-full mt-3 flex items-center justify-center gap-2"
            onClick={() => props.onUse(buildSummary(s, out))}
            title="Send these numbers into the contact form"
          >
            <Send className="w-4 h-4" /> Use these numbers in the form
          </button>
        </div>
      </div>
    </div>
  )
}
