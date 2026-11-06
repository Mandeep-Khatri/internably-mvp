import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, spacing } from '@internably/ui/src';
import ScreenContainer from '../shared/ScreenContainer';

type TermsSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  closing?: string[];
};

const TERMS_SECTIONS: TermsSection[] = [
  {
    title: '1. Acceptance of these Terms',
    paragraphs: [
      'These Terms of Use (“Terms”) are an agreement between you and Internably, LLC (“Internably,” “we,” “our,” or “us”). They govern your access to and use of the Internably website, iOS application, and related services (collectively, the “Services”).',
      'By creating an account, submitting an application, accessing, or using the Services, you agree to these Terms and acknowledge the Privacy Policy and Community Guidelines available in the app. If you do not agree, do not use the Services.',
    ],
  },
  {
    title: '2. Eligibility',
    paragraphs: [
      'You must be at least 16 years old to use Internably. If you are under the age of legal majority where you live, you may use the Services only with permission from a parent or legal guardian where required.',
      'Internably is intended primarily for verified students, interns, and members of the Internably community. You must provide accurate, current, and complete information during application, registration, verification, and use of the Services.',
      'We may require a valid school email address, proof of enrollment, internship information, or other reasonable verification. Applying does not guarantee acceptance. We may approve, deny, suspend, or revoke access when necessary to protect the community or enforce these Terms.',
    ],
  },
  {
    title: '3. Accounts and security',
    paragraphs: ['You are responsible for:'],
    bullets: [
      'Maintaining the confidentiality of your login credentials.',
      'All activity conducted through your account.',
      'Providing accurate account and profile information.',
      'Updating your information when it changes.',
      'Promptly notifying us if you suspect unauthorized access.',
    ],
    closing: [
      'You may not share, sell, transfer, or allow another person to use your account. You may not create an account for another person without authorization.',
    ],
  },
  {
    title: '4. The Internably Services',
    paragraphs: ['Internably may allow members to:'],
    bullets: [
      'Create a student or intern profile.',
      'Find and connect with other members.',
      'Create posts and comments.',
      'Like and share posts.',
      'Join or participate in groups.',
      'Exchange private messages.',
      'Discover events, opportunities, resources, or professional information.',
    ],
    closing: [
      'We may add, change, suspend, or discontinue features. We do not guarantee that every feature will always be available or operate without interruption.',
      'Internably does not guarantee an internship, employment opportunity, professional relationship, event invitation, response, connection, or particular outcome.',
    ],
  },
  {
    title: '5. Member conduct',
    paragraphs: [
      'You agree to use Internably respectfully, lawfully, and professionally. You may not use the Services to:',
    ],
    bullets: [
      'Harass, bully, stalk, threaten, intimidate, exploit, or abuse another person.',
      'Post hateful, discriminatory, defamatory, obscene, sexually explicit, violent, or otherwise objectionable content.',
      'Share nonconsensual intimate imagery or sexual content involving minors.',
      'Encourage self-harm, violence, illegal activity, or dangerous conduct.',
      'Impersonate a person, school, employer, company, or organization.',
      'Misrepresent your identity, enrollment, employment, qualifications, or affiliations.',
      'Post scams, fraudulent opportunities, deceptive promotions, or misleading information.',
      'Send spam, mass solicitations, or unauthorized advertising.',
      'Collect, scrape, sell, or misuse information about other members.',
      'Share another person’s private or confidential information without authorization.',
      'Infringe copyrights, trademarks, privacy rights, or other legal rights.',
      'Upload malware or attempt to disrupt, bypass, or gain unauthorized access to the Services.',
      'Use bots, scripts, or other automated systems without written permission.',
      'Use Internably for an unlawful purpose.',
    ],
    closing: [
      'The Community Guidelines in the app provide additional conduct rules and are incorporated into these Terms.',
    ],
  },
  {
    title: '6. User content',
    paragraphs: [
      '“User Content” includes profiles, posts, images, comments, messages, reports, links, and other material submitted through the Services. You retain ownership of your User Content.',
      'By submitting User Content, you grant Internably a worldwide, non-exclusive, royalty-free license to host, store, reproduce, process, transmit, display, and distribute that content only as reasonably necessary to operate, secure, moderate, and improve the Services.',
      'This license ends when your content is deleted from our active systems, except where:',
    ],
    bullets: [
      'The content was shared with others and remains in their records.',
      'Retention is reasonably necessary for security, legal compliance, dispute resolution, or enforcement.',
      'The content remains temporarily in backups or service-provider systems.',
      'The content has been aggregated or de-identified.',
    ],
    closing: [
      'You represent that you own or have the necessary rights to submit your User Content. Do not submit confidential employer, school, client, or third-party information unless you are authorized to share it.',
    ],
  },
  {
    title: '7. Visibility of content and messages',
    paragraphs: [
      'Information on your profile and content posted in feeds or groups may be visible to other members.',
      'Private messages are intended for conversation participants. Internably may access, preserve, or disclose messages when reasonably necessary to investigate a report, protect a member, enforce our rules, maintain platform security, or comply with law.',
      'Do not assume content shared with another member will remain private because recipients may save, copy, or capture it.',
    ],
  },
  {
    title: '8. Reporting, blocking, and moderation',
    paragraphs: [
      'You may block abusive members using the blocking tools in the app. You may report objectionable content, abusive conduct, scams, safety concerns, or suspected violations through Settings → Contact Support or by emailing support@internably.com.',
      'We may review reports and account activity and take actions including:',
    ],
    bullets: [
      'Removing or restricting content.',
      'Issuing warnings or limiting features.',
      'Suspending or permanently terminating accounts.',
      'Preserving or providing information when required by law.',
      'Referring credible threats or illegal conduct to appropriate authorities.',
    ],
    closing: [
      'We may act without prior notice when reasonably necessary to protect users, the Services, or the public. We are not obligated to monitor every communication or item of User Content before it is posted.',
    ],
  },
  {
    title: '9. Member interactions and safety',
    paragraphs: [
      'Internably may use school emails, application information, or other methods to support verification, but we do not guarantee the identity, background, accuracy, conduct, qualifications, or intentions of every member.',
      'Use reasonable judgment when communicating with or meeting another member. Do not send money, financial credentials, government identification numbers, or other highly sensitive information to people you meet through Internably.',
      'Internably is not responsible for arrangements, meetings, employment discussions, or other interactions between members.',
    ],
  },
  {
    title: '10. Opportunities and third-party information',
    paragraphs: [
      'Internably may display internships, jobs, events, resources, links, or information provided by members or third parties.',
      'Unless expressly stated, Internably does not endorse or guarantee any school, employer, opportunity, event, product, or third-party service. You are responsible for verifying opportunities before applying, sharing information, making commitments, or attending events.',
    ],
  },
  {
    title: '11. Intellectual property',
    paragraphs: [
      'The Services, excluding User Content, are owned by Internably or its licensors and are protected by intellectual-property laws.',
      'Internably’s name, logos, designs, software, branding, and original platform content may not be copied, modified, distributed, sold, or used without written permission, except as allowed by law.',
      'If you believe content on Internably infringes your rights, contact support@internably.com with enough information for us to evaluate the request.',
    ],
  },
  {
    title: '12. Third-party services and links',
    paragraphs: [
      'The Services may rely on or link to third-party platforms, including authentication, hosting, media-storage, email, website, and professional-networking services.',
      'Your use of third-party services may be governed by their own terms and privacy policies. Internably is not responsible for third-party services that we do not control.',
    ],
  },
  {
    title: '13. Privacy',
    paragraphs: [
      'Our collection and use of personal information are described in the Internably Privacy Policy, available from Settings. By using the Services, you acknowledge that you have reviewed the Privacy Policy.',
    ],
  },
  {
    title: '14. Suspension, termination, and account deletion',
    paragraphs: [
      'You may stop using Internably at any time. You can initiate deletion through Settings → Delete Account.',
      'We may restrict, suspend, or terminate access if we reasonably believe that you:',
    ],
    bullets: [
      'Violated these Terms or the Community Guidelines.',
      'Harmed, threatened, or created risk for another member.',
      'Misused the Services or submitted false verification information.',
      'Engaged in fraud, spam, impersonation, or unlawful conduct.',
      'Created security, operational, or legal risk.',
    ],
    closing: [
      'Where appropriate, you may contact support@internably.com to ask about an enforcement decision. Provisions that should survive termination—including ownership, disclaimers, limitations of liability, and dispute provisions—will remain in effect.',
    ],
  },
  {
    title: '15. iOS application license',
    paragraphs: [
      'The Internably iOS application is licensed, not sold. Your use of the iOS application is also subject to Apple’s applicable App Store rules and Standard Licensed Application End User License Agreement. Apple is not responsible for providing maintenance or support for Internably.',
    ],
  },
  {
    title: '16. Disclaimers',
    paragraphs: [
      'To the maximum extent permitted by law, the Services are provided “as is” and “as available.” Internably does not guarantee that the Services will be uninterrupted, error-free, secure, accurate, or free from harmful components.',
      'We do not guarantee the accuracy of User Content, member profiles, opportunities, links, advice, or information provided by members or third parties. Nothing provided through Internably constitutes legal, financial, educational, employment, or professional advice.',
      'Some jurisdictions do not allow certain warranty exclusions, so portions of this section may not apply to you.',
    ],
  },
  {
    title: '17. Limitation of liability',
    paragraphs: [
      'To the maximum extent permitted by law, Internably and its officers, employees, contractors, and agents will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages arising from or related to:',
    ],
    bullets: [
      'Use of or inability to use the Services.',
      'User Content or the conduct of another member.',
      'Unauthorized access to an account.',
      'Third-party services, links, opportunities, or events.',
      'Loss of data, reputation, opportunities, or profits.',
    ],
    closing: [
      'Nothing in these Terms excludes liability that cannot legally be excluded.',
    ],
  },
  {
    title: '18. Indemnification',
    paragraphs: [
      'To the extent permitted by law, you agree to defend, indemnify, and hold harmless Internably, LLC and its officers, employees, contractors, and agents from claims, damages, obligations, losses, liabilities, and reasonable expenses arising from your use or misuse of the Services, your User Content, your violation of these Terms, your violation of another person’s rights, or your unlawful conduct.',
      'This section does not apply where prohibited by law.',
    ],
  },
  {
    title: '19. Governing law and disputes',
    paragraphs: [
      'These Terms are governed by applicable United States law and the law of the state in which Internably, LLC is organized, without regard to conflict-of-law principles.',
      'Before filing a legal claim, you and Internably agree to make a reasonable effort to resolve the dispute informally by contacting support@internably.com. Nothing prevents either party from seeking urgent injunctive or protective relief where legally appropriate.',
    ],
  },
  {
    title: '20. Changes to these Terms',
    paragraphs: [
      'We may update these Terms when the Services, our practices, or legal requirements change. We will revise the “Last updated” date and, when appropriate, provide additional notice through the Services or by email.',
      'Your continued use of the Services after updated Terms become effective means you accept the updated Terms, to the extent permitted by law.',
    ],
  },
  {
    title: '21. General provisions',
    paragraphs: [
      'If any provision of these Terms is found unenforceable, the remaining provisions will remain in effect. Our failure to enforce a provision is not a waiver of our right to enforce it later.',
      'You may not transfer your rights or obligations under these Terms without written permission. Internably may transfer these Terms as part of a merger, acquisition, reorganization, financing, or sale of assets.',
      'These Terms, the Privacy Policy, and the Community Guidelines constitute the agreement between you and Internably concerning the Services.',
    ],
  },
  {
    title: '22. Contact us',
    paragraphs: [
      'Questions about these Terms may be sent to Internably, LLC at support@internably.com.',
    ],
  },
];

function Paragraph({ children }: { children: string }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

function Bullet({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletMark}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

export default function TermsOfUseScreen() {
  async function contactSupport() {
    try {
      await Linking.openURL(
        'mailto:support@internably.com?subject=Internably%20Terms',
      );
    } catch {
      Alert.alert(
        'Unable to open email',
        'Please contact support@internably.com.',
      );
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={() => router.back()}
        >
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Terms of Use</Text>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Feather name="file-text" size={25} color={colors.primary} />
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Internably Terms of Use</Text>
          <Text style={styles.heroBody}>
            These Terms explain the rules for accessing and using Internably.
          </Text>
        </View>
      </View>

      <Text style={styles.updated}>
        Effective: November 5, 2026 · Last updated: November 5, 2026
      </Text>

      {TERMS_SECTIONS.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.paragraphs?.map((paragraph) => (
            <Paragraph key={paragraph}>{paragraph}</Paragraph>
          ))}
          {section.bullets?.map((bullet) => (
            <Bullet key={bullet}>{bullet}</Bullet>
          ))}
          {section.closing?.map((paragraph) => (
            <Paragraph key={paragraph}>{paragraph}</Paragraph>
          ))}
          {section.title === '22. Contact us' && (
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Email Internably support"
              onPress={() => void contactSupport()}
              style={({ pressed }) => [
                styles.supportButton,
                pressed && styles.supportButtonPressed,
              ]}
            >
              <Feather name="mail" size={18} color="#FFFFFF" />
              <Text style={styles.supportButtonText}>Contact Support</Text>
            </Pressable>
          )}
        </View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  back: {
    color: colors.primary,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CFE7D5',
    backgroundColor: '#EAF6ED',
  },
  heroIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  heroCopy: {
    flex: 1,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
  },
  heroBody: {
    marginTop: 4,
    color: '#59544C',
    fontSize: 15,
    lineHeight: 21,
  },
  updated: {
    marginTop: spacing.sm,
    marginBottom: 4,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  section: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E0D6',
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    marginBottom: 4,
    color: colors.text,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
  },
  paragraph: {
    marginTop: 7,
    color: '#4F4A43',
    fontSize: 15,
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 7,
  },
  bulletMark: {
    width: 18,
    color: colors.primary,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
  },
  bulletText: {
    flex: 1,
    color: '#4F4A43',
    fontSize: 15,
    lineHeight: 22,
  },
  supportButton: {
    minHeight: 46,
    marginTop: spacing.md,
    borderRadius: 23,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
  },
  supportButtonPressed: {
    opacity: 0.82,
  },
  supportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '800',
  },
});
