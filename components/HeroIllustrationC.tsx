'use client'

import { useEffect, useState } from 'react'

/* ── Variant C: "The Coach in Action" ──
   Chat-style interface showing the grant writing coach asking a real question,
   the user answering, then a polished draft section materializing below.
   Shows the back-and-forth that makes Granted unique. */

interface Message {
  role: 'coach' | 'user' | 'draft'
  text: string
  label?: string
}

const conversation: Message[] = [
  {
    role: 'coach',
    text: 'What specific environmental health outcomes will this project measure? The EPA scoring rubric weights measurable outcomes at 20 points.',
  },
  {
    role: 'user',
    text: 'We want to reduce PM2.5 exposure in Washington Heights and track asthma ER visits in the 14 NYCHA developments we serve.',
  },
  {
    role: 'draft',
    label: 'Expected Outcomes',
    text: 'This project will achieve two primary outcomes: (1) a 15% reduction in ambient PM2.5 concentrations within target census tracts, validated through a network of 40 hyperlocal sensors; and (2) a 20% decrease in pediatric asthma-related emergency department visits across 14 NYCHA developments serving 22,000 residents.',
  },
  {
    role: 'coach',
    text: 'Strong. Now describe your community engagement strategy — how will residents participate in data collection?',
  },
  {
    role: 'user',
    text: 'We train Community Health Workers from the neighborhood. They help place sensors, read data, and report back at monthly town halls.',
  },
  {
    role: 'draft',
    label: 'Community Engagement',
    text: 'WE ACT will recruit and train 120 Community Health Workers (CHWs) from target neighborhoods to serve as citizen scientists. CHWs will co-locate sensors, conduct weekly data quality checks, and present findings at monthly community town halls, ensuring environmental data remains accessible and actionable.',
  },
]

export default function HeroIllustrationC() {
  const [step, setStep] = useState(0)

  // 8 steps: 0=mount, 1-6=messages, 7=coverage bar, 8=done
  useEffect(() => {
    const delays = [500, 1200, 1800, 2600, 3300, 3900, 4600, 5000]
    const timers = delays.map((d, i) =>
      setTimeout(() => setStep(i + 1), d)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  const fade = (visible: boolean, delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(8px)',
    transition: `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms`,
  })

  const msgVisible = (idx: number) => step >= idx + 1

  // Find the last visible coach message index for typing indicator
  const latestVisibleIdx = conversation.reduce(
    (acc, _, i) => (msgVisible(i) ? i : acc),
    -1
  )
  const showTyping =
    latestVisibleIdx >= 0 &&
    latestVisibleIdx < conversation.length - 1 &&
    !msgVisible(latestVisibleIdx + 1) &&
    conversation[latestVisibleIdx].role !== 'draft'

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* ── Main card ── */}
      <div className="relative rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-white/[0.03]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
          </div>
          <div className="flex-1 text-center flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow/60" />
            <span className="text-[10px] font-medium text-white/30 tracking-wide">
              Grant Writing Coach
            </span>
          </div>
          {/* Live badge */}
          <div
            className="flex items-center gap-1"
            style={{
              opacity: step >= 1 ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 animate-pulse" />
            <span className="text-[8px] text-emerald-400/50 font-mono">
              active
            </span>
          </div>
        </div>

        {/* Chat area */}
        <div className="p-4 space-y-3 min-h-[320px] max-h-[380px] overflow-hidden">
          {conversation.map((msg, i) => {
            if (msg.role === 'coach') {
              return (
                <div
                  key={i}
                  className="flex gap-2.5 items-start"
                  style={fade(msgVisible(i))}
                >
                  {/* Coach avatar */}
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-yellow/20 border border-brand-yellow/30 flex items-center justify-center">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M8 2C5.24 2 3 4.24 3 7C3 8.8 3.92 10.37 5.33 11.2V14L7.78 12.53C7.85 12.53 7.92 12.53 8 12.53C10.76 12.53 13 10.29 13 7.53C13 4.77 10.76 2 8 2Z"
                        fill="#F5CF49"
                        fillOpacity="0.6"
                      />
                    </svg>
                  </div>
                  {/* Coach bubble */}
                  <div className="flex-1 rounded-xl rounded-tl-sm bg-white/[0.06] border border-white/[0.08] px-3 py-2">
                    <span className="text-[9px] leading-relaxed text-white/55">
                      {msg.text}
                    </span>
                  </div>
                </div>
              )
            }

            if (msg.role === 'user') {
              return (
                <div
                  key={i}
                  className="flex justify-end"
                  style={fade(msgVisible(i))}
                >
                  <div className="max-w-[80%] rounded-xl rounded-tr-sm bg-brand-yellow/10 border border-brand-yellow/15 px-3 py-2">
                    <span className="text-[9px] leading-relaxed text-brand-yellow/70">
                      {msg.text}
                    </span>
                  </div>
                </div>
              )
            }

            // Draft section
            return (
              <div key={i} style={fade(msgVisible(i))}>
                <div className="ml-8 rounded-xl bg-white/[0.04] border border-emerald-400/15 px-3 py-2.5 relative">
                  {/* Draft badge */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-1 h-3 rounded-sm bg-emerald-400/50" />
                    <span className="text-[8px] font-semibold text-emerald-400/60 uppercase tracking-wider">
                      {msg.label}
                    </span>
                    <span className="text-[7px] text-white/20 ml-auto font-mono">
                      auto-generated
                    </span>
                  </div>
                  <p className="text-[8px] leading-relaxed text-white/45 font-mono">
                    {msg.text}
                  </p>
                  {/* Subtle left accent */}
                  <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full bg-emerald-400/20" />
                </div>
              </div>
            )
          })}

          {/* Typing indicator */}
          {showTyping && (
            <div className="flex gap-2.5 items-start" style={fade(true)}>
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-yellow/20 border border-brand-yellow/30 flex items-center justify-center">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8 2C5.24 2 3 4.24 3 7C3 8.8 3.92 10.37 5.33 11.2V14L7.78 12.53C7.85 12.53 7.92 12.53 8 12.53C10.76 12.53 13 10.29 13 7.53C13 4.77 10.76 2 8 2Z"
                    fill="#F5CF49"
                    fillOpacity="0.6"
                  />
                </svg>
              </div>
              <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl rounded-tl-sm bg-white/[0.06] border border-white/[0.08]">
                <div
                  className="w-1 h-1 rounded-full bg-white/30"
                  style={{ animation: 'blink 1.2s infinite 0s' }}
                />
                <div
                  className="w-1 h-1 rounded-full bg-white/30"
                  style={{ animation: 'blink 1.2s infinite 0.2s' }}
                />
                <div
                  className="w-1 h-1 rounded-full bg-white/30"
                  style={{ animation: 'blink 1.2s infinite 0.4s' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom: mini coverage tracker */}
        <div
          className="px-5 py-2.5 border-t border-white/[0.06] bg-white/[0.02]"
          style={fade(step >= 7)}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono text-white/25 uppercase tracking-wider">
                RFP Coverage
              </span>
              <span className="text-[7px] font-mono text-white/15">
                2 of 6 sections drafted
              </span>
            </div>
            <span
              className="text-[10px] font-bold text-brand-yellow tabular-nums"
              style={{
                opacity: step >= 7 ? 1 : 0,
                transition: 'opacity 0.4s ease 0.2s',
              }}
            >
              38%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-yellow to-brand-gold"
              style={{
                width: step >= 7 ? '38%' : '0%',
                transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Floating context card ── */}
      <div
        className="absolute -bottom-4 -right-3 w-40 rounded-lg border border-white/10 bg-white/[0.05] backdrop-blur-sm p-2.5 hidden md:block"
        style={{
          opacity: step >= 3 ? 0.8 : 0,
          transform: step >= 3 ? 'translateY(0) rotate(1deg)' : 'translateY(8px) rotate(1deg)',
          transition: 'all 0.5s ease',
        }}
      >
        <div className="text-[7px] font-mono text-brand-yellow/50 uppercase tracking-widest mb-1.5">
          Your org profile
        </div>
        <div className="space-y-1">
          <div className="text-[8px] text-white/35">
            WE ACT for Environmental Justice
          </div>
          <div className="text-[7px] text-white/20">
            Northern Manhattan &bull; 501(c)(3)
          </div>
          <div className="text-[7px] text-white/20">
            Focus: Air quality, EJ, community health
          </div>
        </div>
      </div>
    </div>
  )
}
