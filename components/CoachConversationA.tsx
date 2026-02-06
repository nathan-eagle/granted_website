'use client'

import { useState, useEffect } from 'react'

interface Message {
  role: 'coach' | 'user'
  text: string
  time: string
}

const conversation: Message[] = [
  {
    role: 'coach',
    text: 'What specific gap in marine debris monitoring does your work address?',
    time: '2:14 PM',
  },
  {
    role: 'user',
    text: 'Current sonar imaging can detect debris >30cm, but misses microplastic aggregations entirely. We use multi-frequency acoustic arrays to resolve clusters down to 2cm.',
    time: '2:14 PM',
  },
  {
    role: 'coach',
    text: 'Strong. How will you validate detection accuracy against existing visual survey methods?',
    time: '2:15 PM',
  },
  {
    role: 'user',
    text: 'Paired ROV dives with acoustic sweeps across 3 Puget Sound sites. We compare detections to ground-truth counts from divers and trawl samples.',
    time: '2:15 PM',
  },
  {
    role: 'coach',
    text: 'What broader impact does this enable beyond your lab?',
    time: '2:16 PM',
  },
  {
    role: 'user',
    text: 'Open-source detection firmware for NOAA monitoring vessels. We also train tribal fisheries staff through our Coastal Stewards partnership.',
    time: '2:16 PM',
  },
]

const draftLines = [
  'The proposed research addresses a critical blind spot in marine debris',
  'monitoring: the inability of current acoustic systems to resolve',
  'sub-30cm debris aggregations in turbid coastal environments...',
]

export default function CoachConversationA() {
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [showDraft, setShowDraft] = useState(false)
  const [draftProgress, setDraftProgress] = useState(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    // Stagger messages appearing
    conversation.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleMessages(i + 1)
        }, 600 + i * 650)
      )
    })

    // Show "generating" state
    timers.push(
      setTimeout(() => {
        setShowDraft(true)
      }, 600 + conversation.length * 650 + 400)
    )

    // Reveal draft lines
    draftLines.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setDraftProgress(i + 1)
        }, 600 + conversation.length * 650 + 900 + i * 350)
      )
    })

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="rounded-2xl bg-white border border-navy/10 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-navy/10 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-yellow to-brand-gold flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A1628" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-navy leading-tight">Granted Coach</p>
            <p className="text-[11px] text-navy-light/60 leading-tight">NSF CAREER Proposal</p>
          </div>
          <div className="ml-auto flex gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Messages */}
        <div className="px-4 py-4 flex flex-col gap-3 max-h-[340px] overflow-hidden">
          {conversation.slice(0, visibleMessages).map((msg, i) => (
            <div
              key={i}
              className="transition-all duration-500 ease-out"
              style={{
                opacity: i < visibleMessages ? 1 : 0,
                transform: i < visibleMessages ? 'translateY(0)' : 'translateY(12px)',
              }}
            >
              {msg.role === 'coach' ? (
                <div className="flex gap-2.5 items-start">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-yellow to-brand-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0A1628" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] text-navy leading-snug font-medium">{msg.text}</p>
                    <p className="text-[10px] text-navy-light/40 mt-1">{msg.time}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2.5 items-start justify-end">
                  <div className="flex-1 flex flex-col items-end">
                    <div className="bg-navy/[0.04] rounded-xl rounded-tr-sm px-3.5 py-2.5 max-w-[88%]">
                      <p className="text-[13px] text-navy/80 leading-snug">{msg.text}</p>
                    </div>
                    <p className="text-[10px] text-navy-light/40 mt-1">{msg.time}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-white">PN</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Draft generation */}
          {showDraft && (
            <div
              className="mt-2 pt-3 border-t border-dashed border-brand-yellow/40 transition-all duration-500"
              style={{
                opacity: showDraft ? 1 : 0,
                transform: showDraft ? 'translateY(0)' : 'translateY(8px)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-brand-yellow/20 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#f2c833" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <p className="text-[11px] font-semibold text-brand-gold tracking-wide uppercase">
                  Generating Specific Aims...
                </p>
              </div>
              <div className="bg-navy/[0.02] rounded-lg px-3 py-2.5 border border-navy/5">
                {draftLines.slice(0, draftProgress).map((line, i) => (
                  <span
                    key={i}
                    className="text-[12px] text-navy/70 leading-relaxed transition-opacity duration-300"
                    style={{ opacity: i < draftProgress ? 1 : 0 }}
                  >
                    {line}{' '}
                  </span>
                ))}
                {draftProgress > 0 && draftProgress < draftLines.length && (
                  <span className="typewriter-cursor" />
                )}
                {draftProgress >= draftLines.length && (
                  <span className="typewriter-cursor" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
