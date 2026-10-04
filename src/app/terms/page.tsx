import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for NCD Website",
};

export default function TermsPage() {
  const lastUpdated = "12 October 2026";

  return (
    <Container className="py-8 md:py-12 max-w-3xl">
      <PageHeader
        title="Terms of Service"
        description={`Last updated: ${lastUpdated}`}
        className="mb-8"
      />

      <Card className="prose prose-invert max-w-none p-6 md:p-8">
        <section className="mb-8">
          <h2 className="type-h3 font-medium mb-4">1. Acceptance of Terms</h2>
          <p className="type-body text-text-secondary">
            By accessing and using the NCD Website (&#34;the Site&#34;), you accept and agree to be bound by these Terms of Service (&#34;Terms&#34;). If you do not agree to these Terms, please do not use the Site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="type-h3 font-medium mb-4">2. Description of Service</h2>
          <p className="type-body text-text-secondary">
            The NCD Website is the digital home of NCD (NEXA Community Development), a community organization under NEXA. The Site provides a platform for members to connect, share knowledge, document projects and competitions, track activities, and manage organizational transparency.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="type-h3 font-medium mb-4">3. User Accounts</h2>
          <ul className="list-disc list-inside space-y-2 type-body text-text-secondary">
            <li>Access to authenticated areas of the Site requires a valid user account.</li>
            <li>Accounts are created by invitation only and managed by NCD leadership.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You must provide accurate and complete information when creating your profile.</li>
            <li>You are responsible for all activities that occur under your account.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="type-h3 font-medium mb-4">4. Acceptable Use</h2>
          <p className="type-body text-text-secondary mb-4">
            You agree not to use the Site for any unlawful or prohibited purpose. Specifically, you agree not to:
          </p>
          <ul className="list-disc list-inside space-y-2 type-body text-text-secondary">
            <li>Impersonate any person or entity, or falsely state your affiliation.</li>
            <li>Upload or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or obscene.</li>
            <li>Interfere with or disrupt the Site, servers, or networks.</li>
            <li>Attempt to gain unauthorized access to any portion of the Site or related systems.</li>
            <li>Collect or store personal data about other users without their consent.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="type-h3 font-medium mb-4">5. Content and Intellectual Property</h2>
          <ul className="list-disc list-inside space-y-2 type-body text-text-secondary">
            <li>The Site and its original content, features, and functionality are owned by NCD and are protected by international copyright, trademark, and other intellectual property laws.</li>
            <li>User-generated content (profiles, project documentation, knowledge articles, etc.) remains the intellectual property of the creator, but by posting you grant NCD a non-exclusive, royalty-free license to display and distribute such content on the Site.</li>
            <li>You may not reproduce, distribute, or create derivative works from any content on the Site without explicit permission, except for your own contributions.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="type-h3 font-medium mb-4">6. Privacy and Personal Data</h2>
          <ul className="list-disc list-inside space-y-2 type-body text-text-secondary">
            <li>We collect and process personal data in accordance with applicable privacy laws.</li>
            <li>Profile information (name, email, major, cohort, skills) is visible to other authenticated members based on your privacy settings.</li>
            <li>You may update or request deletion of your personal data at any time through your profile settings.</li>
            <li>We do not sell your personal data to third parties.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="type-h3 font-medium mb-4">7. NCD Kas (Financial Ledger)</h2>
          <ul className="list-disc list-inside space-y-2 type-body text-text-secondary">
            <li>The NCD Kas is a transparent ledger for recording organizational income and expenses.</li>
            <li>Access to detailed transaction data is restricted to authenticated members.</li>
            <li>Only authorized roles (as determined by NCD leadership) may create or modify entries.</li>
            <li>All entries are append-only; corrections are made via adjusting entries.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="type-h3 font-medium mb-4">8. Termination</h2>
          <p className="type-body text-text-secondary">
            NCD reserves the right to suspend or terminate your account and access to the Site at any time, with or without cause, including for violation of these Terms. Upon termination, your right to use the Site immediately ceases.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="type-h3 font-medium mb-4">9. Disclaimer of Warranties</h2>
          <p className="type-body text-text-secondary">
            The Site is provided &#34;as is&#34; and &#34;as available&#34; without warranties of any kind, either express or implied. NCD does not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="type-h3 font-medium mb-4">10. Limitation of Liability</h2>
          <p className="type-body text-text-secondary">
            In no event shall NCD, its officers, members, or contributors be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="type-h3 font-medium mb-4">11. Changes to Terms</h2>
          <p className="type-body text-text-secondary">
            NCD reserves the right to modify these Terms at any time. Changes will be effective immediately upon posting to this page. Your continued use of the Site after any changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="type-h3 font-medium mb-4">12. Governing Law</h2>
          <p className="type-body text-text-secondary">
            These Terms shall be governed by and construed in accordance with the laws of Indonesia, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="type-h3 font-medium mb-4">13. Contact</h2>
          <p className="type-body text-text-secondary">
            If you have any questions about these Terms, please contact NCD leadership at <a href="mailto:leadership@ncd.id" className="text-ncd-electric hover:underline">leadership@ncd.id</a>.
          </p>
        </section>

        <div className="pt-8 border-t border-border text-sm text-text-muted">
          <p>Last updated: {lastUpdated}</p>
          <p>&copy; 2026 NCD (NEXA Community Development)</p>
        </div>
      </Card>
    </Container>
  );
}