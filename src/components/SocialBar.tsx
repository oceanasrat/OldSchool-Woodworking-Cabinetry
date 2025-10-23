import React from 'react'
import { Facebook, Instagram, Youtube, Linkedin, Home, Music2, Bookmark, Globe } from 'lucide-react'

type Social = Partial<{
  instagram: string
  facebook: string
  tiktok: string
  youtube: string
  pinterest: string
  linkedin: string
  houzz: string
}>

const BRAND_STYLES: Record<string, { color: string; Icon: React.ComponentType<any> }> = {
  instagram: { color: '#E4405F', Icon: Instagram },
  facebook:  { color: '#1877F2', Icon: Facebook },
  tiktok:    { color: '#000000', Icon: Music2 },     // tasteful fallback
  youtube:   { color: '#FF0000', Icon: Youtube },
  pinterest: { color: '#E60023', Icon: Bookmark },   // tasteful fallback
  linkedin:  { color: '#0A66C2', Icon: Linkedin },
  houzz:     { color: '#4DBA3D', Icon: Home }        // tasteful fallback
}

export default function SocialBar({ social }: { social?: Social }) {
  if (!social) return null
  const entries = Object.entries(social).filter(([, url]) => !!url)

  if (entries.length === 0) return null

  return (
    <div className="flex flex-wrap gap-3">
      {entries.map(([key, url]) => {
        const conf = BRAND_STYLES[key] || { color: '#1F2937', Icon: Globe }
        const Icon = conf.Icon
        return (
          <a
            key={key}
            href={url as string}
            target="_blank"
            rel="noreferrer"
            aria-label={key}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full"
            style={{ background: conf.color }}
            title={key[0].toUpperCase() + key.slice(1)}
          >
            <Icon className="w-5 h-5 text-white" />
          </a>
        )
      })}
    </div>
  )
}
