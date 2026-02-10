import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { ButtonLink } from '@/components/ButtonLink'
import CheckoutButton from '@/components/CheckoutButton'

export const metadata: Metadata = {
  title: 'FAQ — Granted AI Grant Writing Tool',
  description:
    'Common questions about Granted: the largest grants + funders database, discovery-to-draft workflow, pricing, security, and data use.',
  alternates: { canonical: 'https://grantedai.com/faq' },
}

const faqs = [
  {
    q: 'How does Granted work?',
    a: 'Most teams start in Granted by searching the world&apos;s largest grants and funders database to find best-fit opportunities. Once you choose a target opportunity, upload your RFP or grant guidelines. Our AI reads the full document, identifies every required section, and maps out exactly what the funder is asking for. Then a Grant Writing Coach walks you through targeted questions about your organization, your project, and your goals. As you answer, Granted tracks your coverage of the RFP requirements in real time and drafts each section individually, grounded in your responses and the funder&apos;s criteria. The result is a complete, tailored proposal -- not a generic template.',
  },
  {
    q: 'How large is your grants and funders database?',
    a: 'Granted is building the world&apos;s largest grants and funders database, and it is continuously updated. We aggregate opportunities across federal, foundation, and corporate sources so you can discover, evaluate, and draft in one workflow.',
  },
  {
    q: "What\u2019s wrong with the way grant proposals are written today?",
    a: 'Most organizations spend weeks or months assembling proposals by hand, copying from old submissions, and hoping they&apos;ve addressed every requirement buried in a 40-page RFP. It&apos;s tedious, error-prone, and heavily favors large organizations with dedicated grant writers. Smaller nonprofits, researchers, and community groups often lack the resources to compete, even when their projects are stronger. Granted levels the playing field by handling the structural and analytical heavy lifting so you can focus on the substance of your work.',
  },
  {
    q: 'How much does Granted cost?',
    a: 'Granted offers two plans. The Basic plan is $29 per month and includes 20,000 words of AI-generated content, the Grant Writing Coach, full RFP Analysis, and unlimited projects. The Professional plan is $89 per month and includes unlimited words along with early access to new features. Both plans come with a 7-day free trial so you can experience the full workflow before committing.',
  },
  {
    q: 'Do you have a free trial?',
    a: 'Yes. Every plan includes a 7-day free trial with full access to all features. You can upload an RFP, go through the coaching process, and generate a complete draft before you ever pay a cent. If Granted isn&apos;t the right fit, just cancel before the trial ends and you won&apos;t be charged.',
  },
  {
    q: 'Is the content from Granted original?',
    a: 'Yes. Every proposal Granted produces is generated from scratch based on two inputs: the specific requirements extracted from your RFP and the specific answers you provide during the coaching session. No templates, no recycled language from other users, no boilerplate. Because the drafts are grounded in your unique project details and the funder&apos;s actual criteria, each output is original to your application.',
  },
  {
    q: 'How will my data be used?',
    a: 'Your proposals and organizational data are processed solely to generate your drafts. We never use your data to train AI models, and we never share it with third parties beyond what is strictly necessary for AI processing. All data is encrypted in transit using TLS 1.2+ and encrypted at rest using AES-256. You can delete all of your data at any time from your account. For full details, visit our <a href="/security" class="underline font-semibold text-navy hover:text-teal transition-colors">security page</a>.',
  },
  {
    q: 'Do you work with OpenAI, Microsoft, Google, Meta, or any other AI model providers?',
    a: 'Granted uses OpenAI&apos;s API to power its drafting and analysis capabilities. This means your data is sent to OpenAI for processing under their data processing agreement, which explicitly prohibits using API inputs to train their models. We do not share data with Microsoft, Google, Meta, or any other AI provider. For more details on how your data flows through our system, see our <a href="/security" class="underline font-semibold text-navy hover:text-teal transition-colors">security page</a>.',
  },
  {
    q: 'Is the Granted AI trustworthy?',
    a: 'Granted is designed to be transparent and verifiable at every step. The Grant Writing Coach asks you direct questions and shows you exactly which RFP requirements have been addressed and which still need attention. Every drafted section is tied to your specific answers, so you can trace where the content came from. We encourage you to review, edit, and refine every draft -- Granted is a writing partner, not an autopilot.',
  },
  {
    q: 'Can Granted get even a bad idea funded?',
    a: 'No, and we wouldn&apos;t want it to. Granted helps you present a strong project clearly and persuasively, but it cannot manufacture merit where none exists. If your project doesn&apos;t align with a funder&apos;s priorities or lacks a viable plan, the coaching process will surface those gaps honestly. What Granted does exceptionally well is ensure that a good project doesn&apos;t lose funding simply because the proposal was poorly structured or missed key requirements.',
  },
  {
    q: 'What projects can I use Granted for?',
    a: 'Granted works with any grant-funded project where you have an RFP or set of funder guidelines to upload. That includes federal grants, foundation grants, research funding, community development projects, environmental initiatives, education programs, public health proposals, and more. If there&apos;s a document that spells out what the funder wants, Granted can analyze it and help you respond to it.',
  },
  {
    q: 'How do I request a new feature?',
    a: 'We actively build based on user feedback. You can submit feature requests directly through the app using the feedback button, or email our team at any time. We review every request and prioritize based on how many users would benefit. Many of our recent features, including real-time requirement tracking, came directly from user suggestions.',
  },
  {
    q: 'Is it dishonest to use AI writing tools like Granted?',
    a: 'No. Granted doesn&apos;t fabricate credentials, invent data, or misrepresent your organization. It takes the real information you provide and helps you present it clearly, completely, and in alignment with the funder&apos;s requirements. Think of it as a highly skilled writing partner who never gets tired and never misses a requirement. The ideas, the data, and the project vision are all yours -- Granted just helps you communicate them effectively.',
  },
  {
    q: 'Can I trust Granted with highly sensitive or protected information?',
    a: 'We take data security seriously. All data is encrypted in transit with TLS 1.2+ and at rest with AES-256 encryption. Your information is never used to train AI models and is never shared with third parties beyond the processing needed to generate your drafts. You retain full control and can permanently delete all of your data at any time. For our complete security practices, visit the <a href="/security" class="underline font-semibold text-navy hover:text-teal transition-colors">security page</a>.',
  },
  {
    q: 'What happens if I cancel my plan?',
    a: 'If you cancel, you&apos;ll retain access to your account and all existing projects through the end of your current billing period. After that, your account will move to a read-only state where you can still view and export your past proposals but cannot generate new content. Your data remains stored securely until you choose to delete it. You can reactivate your subscription at any time to pick up where you left off.',
  },
]

export default function FAQPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a.replace(/<[^>]*>/g, ''),
      },
    })),
  }

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main>
        <section className="bg-navy text-white">
          <Container className="py-28 text-center md:py-36">
            <h1 className="heading-xl text-white">Granted FAQs</h1>
          </Container>
        </section>

        <Container className="py-28 md:py-32">
          <h2 className="heading-lg text-center">Frequently Asked Questions</h2>
          <div className="mt-12 divide-y divide-navy/10 border-y border-navy/10">
            {faqs.map((faq, i) => (
              <details key={i} className="group">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-left text-base font-semibold text-navy md:text-lg">
                  {faq.q}
                  <span className="text-slate-400 transition-transform duration-200 group-open:rotate-180">
                    <svg aria-hidden className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                    </svg>
                  </span>
                </summary>
                <div
                  className="body-lg pb-6 text-navy-light"
                  dangerouslySetInnerHTML={{ __html: faq.a }}
                />
              </details>
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/features" variant="ghost">Discover more features</ButtonLink>
          </div>
        </Container>

        <section className="bg-navy text-white">
          <Container className="py-24 text-center md:py-32">
            <h3 className="heading-lg text-white">Start winning grants today</h3>
            <p className="body-lg mx-auto mt-4 max-w-2xl text-white/60">
              Find best-fit opportunities and draft stronger proposals in one platform.
            </p>
            <div className="mt-10">
              <CheckoutButton label="Draft Your First Proposal" />
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
