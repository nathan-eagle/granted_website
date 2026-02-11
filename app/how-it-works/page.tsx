import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works — Granted',
}

export default function HowItWorksPage() {
  redirect('/#how-it-works')
}
