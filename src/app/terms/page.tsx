import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions – WhoPay",
  description: "Terms and conditions for using WhoPay – the fun bill-splitting game.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f5f0ff] dark:bg-[#0a0a1a] text-[var(--foreground)]">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#a855f7] hover:text-[#9333ea] transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="bg-white/70 dark:bg-[#12122a]/80 backdrop-blur-xl rounded-[40px] border border-[#7c3aed]/20 p-8 md:p-12 shadow-[0_0_40px_rgba(124,58,237,0.08)]">
          <h1 className="text-3xl md:text-4xl font-black text-[#a855f7] mb-2">Terms & Conditions</h1>
          <p className="text-sm text-[#7c3aed]/50 font-semibold mb-8">Last updated: May 30, 2026</p>

          <div className="space-y-8 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">1. Acceptance of Terms</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                By accessing, downloading, or using WhoPay (&quot;the App&quot;), you agree to be bound by these Terms & Conditions (&quot;Terms&quot;). If you do not agree with any part of these Terms, you must immediately cease using the App. Continued use of the App constitutes your acceptance of any future revisions to these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">2. Eligibility</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                You must be at least 13 years of age to use the App. By using the App, you represent and warrant that you meet this age requirement. If you are under 13, you are not permitted to use the App. Users under 18 should use the App only with the involvement of a parent or legal guardian.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">3. Description of Service</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                WhoPay is a social entertainment application designed to randomly select who pays the bill among a group of participants. The App features spin wheels, dice rolls, and various game modes including Classic, Double, Lucky, Chaos, Elimination, and Troll modes. All outcomes are determined by random algorithms and are provided for entertainment purposes only. The App does not facilitate or process any real financial transactions between users.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">4. User Accounts & Data</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                The App may store game preferences, player names, group information, and spin/dice history locally on your device or on our servers for functionality purposes. You are responsible for any activity that occurs under your usage. You agree not to create false player names, impersonate others, or use the App for any unlawful purpose.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">5. User Conduct</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                You agree to use the App responsibly and respectfully. Prohibited conduct includes but is not limited to: (a) Harassment, bullying, or abusive behavior towards other players; (b) Using offensive, discriminatory, or inappropriate player names; (c) Attempting to manipulate, reverse-engineer, or exploit the App&apos;s random outcome algorithms; (d) Interfering with the App&apos;s functionality or security; (e) Using the App for any form of real-money gambling, wagering, or betting. We reserve the right to restrict or terminate access for violations of these rules.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">6. No Real Gambling</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                WhoPay is strictly a game of chance for entertainment purposes. No real money bets, wagering, stakes, or gambling of any kind takes place within the App. The App does not process payments, handle financial transactions, or facilitate any exchange of value. Any payment decisions made based on the App&apos;s outcomes are purely informal social agreements between users and are not enforced, endorsed, or facilitated by WhoPay or its developers. Users are solely responsible for any financial agreements they choose to make.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">7. Intellectual Property</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                All content, design, graphics, code, and features of the App are the intellectual property of WhoPay and its developers. You may not reproduce, distribute, modify, create derivative works from, or publicly display any part of the App without prior written permission. The WhoPay name, logo, and branding are proprietary.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">8. Limitation of Liability</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                The App is provided &quot;as is&quot; and &quot;as available&quot; without any warranties, express or implied. To the maximum extent permitted by law, WhoPay and its developers disclaim all liability for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the App. This includes but is not limited to: financial disputes between users, data loss, service interruptions, or any decisions made based on App outcomes. All payment obligations resulting from App use are strictly between the participants.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">9. Indemnification</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                You agree to indemnify, defend, and hold harmless WhoPay and its developers from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of or related to your use of the App, violation of these Terms, or violation of any rights of another party.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">10. Third-Party Links & Services</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                The App may contain links to third-party websites or services that are not owned or controlled by WhoPay. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party services. You access such services at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">11. Termination</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                We reserve the right to terminate or suspend your access to the App at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, third parties, or the App itself. Upon termination, your right to use the App will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">12. Changes to Terms</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                We reserve the right to modify, update, or replace these Terms at any time. Changes will be effective immediately upon posting to this page. Your continued use of the App after any changes constitutes acceptance of the new Terms. We encourage you to review this page periodically for updates.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">13. Governing Law</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the developers are based, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved through informal negotiation first.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">14. Contact Information</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                For any questions, concerns, or requests regarding these Terms, please reach out to us through the App&apos;s settings menu, support channels, or by contacting the development team directly. We aim to respond to all inquiries within a reasonable timeframe.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
