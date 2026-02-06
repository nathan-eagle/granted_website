'use client'

import { useInView } from '@/hooks/useInView'

export default function AnimatedGoldRule() {
  const { ref, isInView } = useInView({ threshold: 0.5 })

  return (
    <div ref={ref} className="overflow-hidden">
      <div
        className="gold-rule"
        style={{
          transform: isInView ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transformOrigin: 'center',
        }}
      />
    </div>
  )
}
