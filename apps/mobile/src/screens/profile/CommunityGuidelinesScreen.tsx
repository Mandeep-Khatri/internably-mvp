import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { ReactNode } from 'react';
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

type GuidelineSectionProps = {
  title: string;
  children: ReactNode;
};

function GuidelineSection({ title, children }: GuidelineSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Body({ children }: { children: ReactNode }) {
  return <Text style={styles.body}>{children}</Text>;
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletMark}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

export default function CommunityGuidelinesScreen() {
  async function contactSupport() {
    try {
      await Linking.openURL(
        'mailto:support@internably.com?subject=Internably%20Community%20Safety',
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
        <Text style={styles.title}>Community Guidelines</Text>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Feather name="heart" size={26} color={colors.primary} />
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Build a helpful student community</Text>
          <Text style={styles.heroBody}>
            Internably is a place for students and interns to connect, learn,
            share opportunities, and support one another.
          </Text>
        </View>
      </View>

      <Text style={styles.updated}>Last updated: November 6, 2026</Text>

      <GuidelineSection title="1. Who can use Internably">
        <Body>
          You must be at least 16 years old to use Internably. Provide accurate
          information about yourself, your school, and your experience. Do not
          create an account for someone else or pretend to be another person,
          school, employer, or organization.
        </Body>
      </GuidelineSection>

      <GuidelineSection title="2. Treat people with respect">
        <Body>
          Communicate professionally and respect other members' boundaries.
          Disagreement is allowed, but personal attacks and abusive behavior
          are not.
        </Body>
        <Bullet>Do not harass, bully, stalk, threaten, or intimidate anyone.</Bullet>
        <Bullet>
          Do not use hateful or discriminatory language based on identity or
          protected characteristics.
        </Bullet>
        <Bullet>
          Do not shame, objectify, or encourage others to target a member.
        </Bullet>
      </GuidelineSection>

      <GuidelineSection title="3. Keep content safe">
        <Bullet>
          Do not post sexually explicit content, nonconsensual intimate images,
          or any sexual content involving minors.
        </Bullet>
        <Bullet>
          Do not promote violence, self-harm, dangerous behavior, or illegal
          activity.
        </Bullet>
        <Bullet>
          Do not post graphic, exploitative, or otherwise seriously disturbing
          content.
        </Bullet>
        <Bullet>
          Never use Internably to exploit, groom, or endanger a young person.
        </Bullet>
      </GuidelineSection>

      <GuidelineSection title="4. Be honest and authentic">
        <Bullet>
          Do not impersonate others or misrepresent your education,
          qualifications, employment, or affiliations.
        </Bullet>
        <Bullet>
          Do not post fake internships, jobs, events, scholarships, or other
          deceptive opportunities.
        </Bullet>
        <Bullet>
          Do not use Internably for scams, fraud, phishing, pyramid schemes, or
          requests for suspicious payments.
        </Bullet>
      </GuidelineSection>

      <GuidelineSection title="5. Respect privacy and ownership">
        <Bullet>
          Do not share another person's private information, messages, images,
          or documents without permission.
        </Bullet>
        <Bullet>
          Do not post confidential school, employer, client, or workplace
          information unless you are authorized to share it.
        </Bullet>
        <Bullet>
          Share only content you own or have permission to use. Respect
          copyrights, trademarks, and other legal rights.
        </Bullet>
      </GuidelineSection>

      <GuidelineSection title="6. No spam or platform abuse">
        <Bullet>
          Do not send repeated unwanted messages, mass solicitations, or
          unauthorized advertisements.
        </Bullet>
        <Bullet>
          Do not scrape member information, use unauthorized bots, upload
          malware, or attempt to bypass security or moderation controls.
        </Bullet>
        <Bullet>
          Do not create additional accounts to avoid a block, suspension, or
          other restriction.
        </Bullet>
      </GuidelineSection>

      <GuidelineSection title="7. Connect and message responsibly">
        <Body>
          Respect when someone declines a connection or stops responding. Never
          pressure another member for money, passwords, financial details,
          government identification, private images, or an in-person meeting.
          Verify opportunities independently before applying or sharing
          sensitive information.
        </Body>
      </GuidelineSection>

      <GuidelineSection title="8. Report and block">
        <Body>
          If you experience or see abusive behavior, objectionable content,
          scams, threats, or another safety concern, use the available blocking
          tools and contact us through Settings → Contact Support. For an
          immediate danger, contact local emergency services first.
        </Body>
      </GuidelineSection>

      <GuidelineSection title="9. How we enforce these guidelines">
        <Body>
          Internably may review reports and relevant account activity. Depending
          on the situation, we may remove content, warn a member, limit
          features, suspend or permanently delete an account, preserve
          information for safety or legal reasons, or contact appropriate
          authorities. Serious violations may result in action without prior
          warning.
        </Body>
      </GuidelineSection>

      <GuidelineSection title="10. Contact us">
        <Body>
          Questions, reports, and safety concerns can be sent to
          support@internably.com. Include relevant details and screenshots when
          possible, but do not put yourself at risk to collect evidence.
        </Body>
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
      </GuidelineSection>
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
    fontSize: 26,
    lineHeight: 32,
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
    marginBottom: 8,
    color: colors.text,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
  },
  body: {
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
