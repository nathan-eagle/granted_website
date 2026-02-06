'use client'

import { useInView } from '@/hooks/useInView'

interface RevealOnScrollProps {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section'
}

export default function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: RevealOnScrollProps) {
  const { ref, isInView } = useInView({ threshold: 0.15 })

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  )
}
