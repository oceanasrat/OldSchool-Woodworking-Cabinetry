import React from 'react'
import { ClipboardList, Ruler, Hammer, Truck } from 'lucide-react'

export default function Timeline() {
  const steps = [
    { icon: ClipboardList, title: 'Consult', text: 'Free consult to discuss goals, budget, timelines.' },
    { icon: Ruler,         title: 'Design',  text: 'Measurements, materials, Mozaik 3D renders for sign-off.' },
    { icon: Hammer,        title: 'Build',   text: 'Precision joinery, finishing, and quality checks.' },
    { icon: Truck,         title: 'Install', text: 'White-glove delivery, install, and walkthrough.' },
  ]
  return (
    <ol className="grid gap-4">
      {steps.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/5">
            <Icon className="w-5 h-5" />
          </span>
          <div>
            <div className="font-semibold">{title}</div>
            <div className="opacity-80 text-sm">{text}</div>
          </div>
        </li>
      ))}
    </ol>
  )
}
