import { ComponentProps } from 'react'
import Link from 'next/link'

type Props = ComponentProps<'a'> & { href: string; variant?: 'primary' | 'ghost' }

export function ButtonLink({ href, children, className = '', variant = 'primary', ...rest }: Props) {
  const base = 'button ' + (variant === 'primary' ? 'button-primary' : 'button-ghost')
  return <Link href={href} className={base + ' ' + className} {...rest}>{children}</Link>
}
