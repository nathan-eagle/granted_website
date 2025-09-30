export default function Container({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={['container', className].filter(Boolean).join(' ')}>{children}</div>
}
