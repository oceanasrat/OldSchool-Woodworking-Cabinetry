import React from 'react'
import { Hammer, Home, Layers, Package } from 'lucide-react'

const icons = {
  Kitchens: <Home className="text-amber-700 w-10 h-10" />,
  'Built-ins': <Layers className="text-amber-700 w-10 h-10" />,
  Furniture: <Package className="text-amber-700 w-10 h-10" />,
}

const services = [
  {
    title: 'Kitchens',
    description: 'Custom cabinetry, islands, soft-close hardware.',
  },
  {
    title: 'Built-ins',
    description: 'Media walls, bookshelves, mudroom lockers.',
  },
  {
    title: 'Furniture',
    description: 'Tables, vanities, benches in premium hardwoods.',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-[#FAF6F1] to-[#FDFBF9]">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <div className="uppercase tracking-wider text-amber-800 font-semibold text-sm">What We Do</div>
          <h2 className="text-4xl font-extrabold text-amber-900 mt-2">Services</h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="relative p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100"
            >
              {/* Icon top-right */}
              <div className="absolute top-4 right-4 opacity-80">
                {icons[service.title as keyof typeof icons] || <Hammer className="text-amber-700 w-10 h-10" />}
              </div>

              <h3 className="text-xl font-bold text-amber-900 mb-2">{service.title}</h3>
              <p className="text-gray-700 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
