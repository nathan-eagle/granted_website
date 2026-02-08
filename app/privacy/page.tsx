import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Granted AI collects, uses, and protects your data. Read our full privacy policy.',
  alternates: { canonical: 'https://grantedai.com/privacy' },
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-navy text-white">
          <Container className="py-28 text-center md:py-36">
            <h1 className="heading-xl text-white">Privacy Policy</h1>
            <p className="body-lg mt-4 text-white/60">Last updated: February 7, 2026</p>
          </Container>
        </section>

        <Container className="py-20 md:py-28">
          <div className="prose prose-navy mx-auto max-w-3xl">
            <h2 className="heading-md mb-4">1. Introduction</h2>
            <p className="body-lg text-navy-light mb-8">
              Granted AI (&ldquo;Granted,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website at grantedai.com and the Granted application at app.grantedai.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
            </p>

            <h2 className="heading-md mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-semibold text-navy mb-2">Account Information</h3>
            <p className="body-lg text-navy-light mb-4">
              When you create an account, we collect your name, email address, and authentication credentials (managed through Google OAuth or email-based sign-in). If you subscribe to a paid plan, payment processing is handled by Stripe; we do not store your credit card number.
            </p>
            <h3 className="text-lg font-semibold text-navy mb-2">Content You Provide</h3>
            <p className="body-lg text-navy-light mb-4">
              This includes RFPs and grant guidelines you upload, answers you provide during coaching sessions, organization details, collaborator information, and the grant proposals we generate for you.
            </p>
            <h3 className="text-lg font-semibold text-navy mb-2">Usage Data</h3>
            <p className="body-lg text-navy-light mb-8">
              We automatically collect certain information when you visit our site, including your IP address, browser type, pages visited, time spent, and referring URLs. We use Google Analytics 4 and Microsoft Clarity for this purpose.
            </p>

            <h2 className="heading-md mb-4">3. How We Use Your Information</h2>
            <ul className="body-lg text-navy-light mb-8 list-disc pl-6 space-y-2">
              <li>To provide and maintain the Granted service, including generating grant proposals based on your inputs</li>
              <li>To process your transactions and manage your subscription</li>
              <li>To send you service-related communications (account confirmations, billing notices, support responses)</li>
              <li>To improve our service through aggregated, anonymized usage analytics</li>
              <li>To detect and prevent fraud or abuse</li>
            </ul>

            <h2 className="heading-md mb-4">4. AI Processing &amp; Third-Party Data Sharing</h2>
            <p className="body-lg text-navy-light mb-4">
              Granted uses OpenAI&rsquo;s API to power its drafting and analysis capabilities. When you use our service, your uploaded RFPs and coaching session answers are sent to OpenAI for processing. OpenAI&rsquo;s API data processing agreement explicitly prohibits using API inputs to train their models.
            </p>
            <p className="body-lg text-navy-light mb-8">
              We do not sell, rent, or share your personal information with third parties for their marketing purposes. We may share data with service providers who assist us in operating our platform (e.g., Stripe for payments, Resend for transactional emails, Supabase for database hosting), each bound by contractual obligations to protect your data.
            </p>

            <h2 className="heading-md mb-4">5. Data Security</h2>
            <p className="body-lg text-navy-light mb-8">
              All data is encrypted in transit using TLS 1.2+ and at rest using AES-256 encryption. We use Supabase with row-level security for database access controls. While no method of transmission or storage is 100% secure, we implement industry-standard measures to protect your information.
            </p>

            <h2 className="heading-md mb-4">6. Data Retention &amp; Deletion</h2>
            <p className="body-lg text-navy-light mb-8">
              We retain your data for as long as your account is active or as needed to provide our services. If you cancel your subscription, your data remains accessible in read-only mode until you request deletion. You can permanently delete all of your data at any time from your account settings or by contacting us at support@grantedai.com.
            </p>

            <h2 className="heading-md mb-4">7. Cookies &amp; Tracking Technologies</h2>
            <p className="body-lg text-navy-light mb-4">
              We use cookies and similar technologies for:
            </p>
            <ul className="body-lg text-navy-light mb-8 list-disc pl-6 space-y-2">
              <li><strong>Essential cookies:</strong> Required for authentication and core site functionality</li>
              <li><strong>Analytics cookies:</strong> Google Analytics 4 and Microsoft Clarity to understand how visitors use our site</li>
            </ul>

            <h2 className="heading-md mb-4">8. Your Rights</h2>
            <p className="body-lg text-navy-light mb-4">
              Depending on your jurisdiction, you may have the right to:
            </p>
            <ul className="body-lg text-navy-light mb-8 list-disc pl-6 space-y-2">
              <li>Access, correct, or delete your personal information</li>
              <li>Object to or restrict certain processing of your data</li>
              <li>Request a portable copy of your data</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="body-lg text-navy-light mb-8">
              To exercise any of these rights, contact us at support@grantedai.com.
            </p>

            <h2 className="heading-md mb-4">9. Children&rsquo;s Privacy</h2>
            <p className="body-lg text-navy-light mb-8">
              Granted is not intended for use by anyone under the age of 16. We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us and we will promptly delete it.
            </p>

            <h2 className="heading-md mb-4">10. Changes to This Policy</h2>
            <p className="body-lg text-navy-light mb-8">
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page with a revised &ldquo;Last updated&rdquo; date. Continued use of the service after changes constitutes acceptance of the updated policy.
            </p>

            <h2 className="heading-md mb-4">11. Contact Us</h2>
            <p className="body-lg text-navy-light">
              If you have questions about this Privacy Policy, contact us at:
            </p>
            <p className="body-lg text-navy-light mt-2">
              <strong>Granted AI</strong><br />
              Email: support@grantedai.com
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
