import { ButtonLink } from './ButtonLink'

const SIGN_IN_URL =
  'https://app.grantedai.com/api/auth/signin?callbackUrl=/overview'

export default function GrantCTA() {
  return (
    <section className="bg-navy noise-overlay rounded-[24px] p-10 md:p-16 text-center relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="heading-lg text-white">Ready to start your proposal?</h2>
        <p className="body-lg text-white/50 mt-3 max-w-xl mx-auto">
          Granted uses AI to draft, review, and polish your grant application —
          saving weeks of work.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <ButtonLink href={SIGN_IN_URL} variant="primary">
            Draft Your Proposal
          </ButtonLink>
          <ButtonLink href="/grants" variant="ghost" className="text-white border-white/20 hover:border-white/40 hover:bg-white/5">
            Browse More Grants
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
