'use client'

import { useState } from 'react'
import Container from '@/components/Container'

import HeroIllustrationA from '@/components/HeroIllustrationA'
import HeroIllustrationB from '@/components/HeroIllustrationB'
import HeroIllustrationC from '@/components/HeroIllustrationC'

import CoachConversationA from '@/components/CoachConversationA'
import CoachConversationB from '@/components/CoachConversationB'
import CoachConversationC from '@/components/CoachConversationC'

import DocumentStackA from '@/components/DocumentStackA'
import DocumentStackB from '@/components/DocumentStackB'
import DocumentStackC from '@/components/DocumentStackC'

type Slot = 'hero' | 'coach' | 'docs'

const TABS: { id: Slot; label: string }[] = [
  { id: 'hero', label: 'Hero Illustration' },
  { id: 'coach', label: 'Coach Conversation' },
  { id: 'docs', label: 'Document Stack' },
]

export default function PreviewPage() {
  const [slot, setSlot] = useState<Slot>('hero')
  const [variant, setVariant] = useState<'A' | 'B' | 'C'>('A')

  // Force remount on variant change so animations replay
  const key = `${slot}-${variant}`

  return (
    <main className="min-h-screen bg-cream">
      <div className="bg-navy text-white py-6">
        <Container>
          <h1 className="text-2xl font-bold">Image Variant Preview</h1>
          <p className="text-white/60 mt-1 text-sm">Click a tab, then pick A / B / C to see each variant. Animations replay on switch.</p>
        </Container>
      </div>

      <Container className="py-8">
        {/* Slot tabs */}
        <div className="flex gap-2 mb-4">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setSlot(tab.id); setVariant('A') }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                slot === tab.id
                  ? 'bg-navy text-white'
                  : 'bg-navy/10 text-navy hover:bg-navy/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Variant selector */}
        <div className="flex gap-2 mb-8">
          {(['A', 'B', 'C'] as const).map(v => (
            <button
              key={v}
              onClick={() => setVariant(v)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                variant === v
                  ? 'bg-brand-yellow text-navy'
                  : 'bg-brand-yellow/20 text-navy hover:bg-brand-yellow/40'
              }`}
            >
              Variant {v}
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="mb-8 text-sm text-navy-light">
          {slot === 'hero' && variant === 'A' && <p><strong>A — "The Live Draft":</strong> Document editor with real EPA grant text appearing line by line, RFP requirements checking off in a sidebar.</p>}
          {slot === 'hero' && variant === 'B' && <p><strong>B — "The Split Screen":</strong> Split-pane showing uploaded RFP on left, generated draft on right, with color-coded connections between them.</p>}
          {slot === 'hero' && variant === 'C' && <p><strong>C — "The Coach in Action":</strong> Chat interface showing the coach asking real questions, user answering, and draft sections materializing.</p>}
          {slot === 'coach' && variant === 'A' && <p><strong>A — "The Interview":</strong> Multi-turn chat with marine science questions, user responses, then a generated draft section appearing.</p>}
          {slot === 'coach' && variant === 'B' && <p><strong>B — "The Requirement Mapper":</strong> Visual/analytical interface with RFP requirement tags activating, questions asked, tags checking off.</p>}
          {slot === 'coach' && variant === 'C' && <p><strong>C — "The Before & After":</strong> Empty proposal outline fills in with real text as coach questions are asked in a sidebar.</p>}
          {slot === 'docs' && variant === 'A' && <p><strong>A — "The Complete Proposal":</strong> Table of contents with section checkmarks animating, real PFAS research grant text visible.</p>}
          {slot === 'docs' && variant === 'B' && <p><strong>B — "The Multi-Format Export":</strong> DOCX/PDF/Editor cards fanning out, each showing a different proposal section.</p>}
          {slot === 'docs' && variant === 'C' && <p><strong>C — "The Coverage Dashboard":</strong> Requirement checklist with status indicators, radial progress chart filling to 81%.</p>}
        </div>
      </Container>

      {/* Render area — dark bg for hero, light for others */}
      {slot === 'hero' ? (
        <div className="bg-navy py-16">
          <Container>
            <div className="max-w-xl mx-auto" key={key}>
              {variant === 'A' && <HeroIllustrationA />}
              {variant === 'B' && <HeroIllustrationB />}
              {variant === 'C' && <HeroIllustrationC />}
            </div>
          </Container>
        </div>
      ) : (
        <div className={slot === 'docs' ? 'bg-cream-dark py-16' : 'bg-cream py-16'}>
          <Container>
            <div className="max-w-xl mx-auto" key={key}>
              {slot === 'coach' && variant === 'A' && <CoachConversationA />}
              {slot === 'coach' && variant === 'B' && <CoachConversationB />}
              {slot === 'coach' && variant === 'C' && <CoachConversationC />}
              {slot === 'docs' && variant === 'A' && <DocumentStackA />}
              {slot === 'docs' && variant === 'B' && <DocumentStackB />}
              {slot === 'docs' && variant === 'C' && <DocumentStackC />}
            </div>
          </Container>
        </div>
      )}
    </main>
  )
}
