import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy – WhoPay",
  description: "Privacy policy for WhoPay – how we handle your data.",
};

export default function PrivacyPage() {
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
          <h1 className="text-3xl md:text-4xl font-black text-[#a855f7] mb-2">Privacy Policy</h1>
          <p className="text-sm text-[#7c3aed]/50 font-semibold mb-8">Last updated: May 30, 2026</p>

          <div className="space-y-8 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">1. Information We Collect</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                WhoPay collects only the minimum data necessary for the App to function properly. This may include:
              </p>
              <ul className="list-disc pl-5 mt-2 text-[#7c3aed]/60 dark:text-[#9b8ec4] space-y-1">
                <li><strong className="text-[var(--foreground)]">Player Names:</strong> Names you enter for game participants (these are stored locally or temporarily for game sessions).</li>
                <li><strong className="text-[var(--foreground)]">Group Information:</strong> Group names and member lists you create.</li>
                <li><strong className="text-[var(--foreground)]">Game History:</strong> Records of spin and dice outcomes, including winners and participants, to display your history.</li>
                <li><strong className="text-[var(--foreground)]">Preferences:</strong> Theme preference (dark/light mode), sound settings, and other App configuration choices.</li>
                <li><strong className="text-[var(--foreground)]">Achievement Data:</strong> Your unlocked achievements, XP, and level information.</li>
              </ul>
              <p className="mt-2 text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                We do not collect personal identifiable information such as real names, email addresses, phone numbers, or payment information unless you voluntarily provide it through a direct communication channel.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">2. How We Use Your Data</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                Your data is used exclusively for the following purposes:
              </p>
              <ul className="list-disc pl-5 mt-2 text-[#7c3aed]/60 dark:text-[#9b8ec4] space-y-1">
                <li>Operating the App and providing game functionality</li>
                <li>Displaying game history and tracking achievements</li>
                <li>Saving your preferences and settings</li>
                <li>Improving user experience and App performance</li>
                <li>Debugging and technical support</li>
              </ul>
              <p className="mt-2 text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                We do <strong>not</strong> sell, rent, lease, trade, or share your personal data with third parties for any purpose, including advertising, marketing, or analytics.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">3. Local Storage & Device Data</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                WhoPay uses browser local storage and IndexedDB to store the following data on your device:
              </p>
              <ul className="list-disc pl-5 mt-2 text-[#7c3aed]/60 dark:text-[#9b8ec4] space-y-1">
                <li><strong>Theme preference</strong> (dark/light mode) so your choice persists across sessions</li>
                <li><strong>Game state</strong> including current participants, recent history, and achievements</li>
                <li><strong>App configuration</strong> such as sound and vibration settings</li>
              </ul>
              <p className="mt-2 text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                This data remains on your device. It is only transmitted to our servers when you use online features such as saving game history to the cloud. You can clear this data at any time through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">4. Server Data & MongoDB</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                For certain features, such as saving and retrieving spin/dice history, data may be stored on our MongoDB database. This data is limited to game-related information (participant names, winners, timestamps) and does not include personal identifiers. We implement standard security practices to protect this data, including encryption in transit and restricted database access.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">5. Data Security</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                We take reasonable and appropriate measures to protect your data from unauthorized access, alteration, disclosure, or destruction. These measures include encryption of data in transit (HTTPS), secure database access controls, and regular security reviews. However, please be aware that no method of electronic storage or transmission over the internet is 100% secure. We cannot guarantee absolute security and encourage you to use the App responsibly.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">6. Third-Party Services</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                WhoPay does <strong>not</strong> integrate with any third-party analytics, advertising, tracking, or marketing services. We do not use cookies for tracking purposes. The App does not contain third-party SDKs that collect user data. We believe in your privacy and have designed the App to be as data-minimal as possible.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">7. Children&apos;s Privacy</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                WhoPay is not directed at children under the age of 13. We do not knowingly collect, use, or store personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal data, please contact us immediately. We will take steps to delete such information promptly. The App is intended for general audiences and users aged 13 and above.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">8. Data Retention</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                We retain game history and preference data for as long as your account or session is active, or as needed to provide you with the App&apos;s features. You can request deletion of your data by contacting us. Local storage data can be cleared at any time through your browser settings. Server-stored history may be periodically purged to maintain performance.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">9. Your Rights</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                Depending on your jurisdiction, you may have the following rights regarding your data:
              </p>
              <ul className="list-disc pl-5 mt-2 text-[#7c3aed]/60 dark:text-[#9b8ec4] space-y-1">
                <li><strong>Access:</strong> Request a copy of the data we hold about you.</li>
                <li><strong>Deletion:</strong> Request that we delete your data.</li>
                <li><strong>Correction:</strong> Request that we correct inaccurate data.</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service.</li>
                <li><strong>Withdrawal:</strong> Withdraw consent for data processing where applicable.</li>
              </ul>
              <p className="mt-2 text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                To exercise any of these rights, please contact us using the information provided in the Contact section below.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">10. Changes to This Privacy Policy</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or App features. When we make changes, we will update the &quot;Last updated&quot; date at the top of this page. We encourage you to review this Privacy Policy periodically. Your continued use of the App after changes are posted constitutes your acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">11. Contact Us</h2>
              <p className="text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please reach out to us:
              </p>
              <ul className="list-disc pl-5 mt-2 text-[#7c3aed]/60 dark:text-[#9b8ec4] space-y-1">
                <li>Through the App&apos;s settings or feedback section</li>
                <li>By contacting the development team via the App&apos;s support channels</li>
              </ul>
              <p className="mt-2 text-[#7c3aed]/60 dark:text-[#9b8ec4]">
                We will respond to your inquiry as promptly as possible.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
