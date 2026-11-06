import { Feather } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, spacing } from '@internably/ui/src';
import { ResourcesApi } from '@/api/resources';

export type ReportTarget = {
  type: 'post' | 'user';
  id: string;
  label?: string;
};

type ReportModalProps = {
  visible: boolean;
  target: ReportTarget | null;
  onClose: () => void;
};

const REASONS = [
  { value: 'HARASSMENT', label: 'Harassment or bullying' },
  { value: 'HATE_SPEECH', label: 'Hate or discrimination' },
  { value: 'SEXUAL_CONTENT', label: 'Sexual or inappropriate content' },
  { value: 'VIOLENCE_OR_THREATS', label: 'Violence or threats' },
  { value: 'SCAM_OR_IMPERSONATION', label: 'Scam or impersonation' },
  { value: 'SPAM', label: 'Spam' },
  { value: 'PRIVACY_VIOLATION', label: 'Privacy violation' },
  { value: 'OTHER', label: 'Something else' },
] as const;

function errorMessage(error: unknown) {
  const maybeAxiosError = error as {
    response?: { data?: { message?: string | string[] } };
    message?: string;
  };
  const message = maybeAxiosError.response?.data?.message ?? maybeAxiosError.message;
  return Array.isArray(message)
    ? message.join(', ')
    : message ?? 'Please check your connection and try again.';
}

export default function ReportModal({ visible, target, onClose }: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    if (!visible) {
      setReason('');
      setDetails('');
    }
  }, [visible]);

  const reportMutation = useMutation({
    mutationFn: async () => {
      if (!target || !reason) throw new Error('Choose a reason for the report.');
      const payload = { reason, details: details.trim() || undefined };
      if (target.type === 'post') return ResourcesApi.reportPost(target.id, payload);
      return ResourcesApi.reportUser(target.id, payload);
    },
    onSuccess: () => {
      onClose();
      Alert.alert(
        'Report submitted',
        'Thank you for helping keep Internably safe. Our moderation team will review it.',
      );
    },
    onError: (error: unknown) => {
      Alert.alert('Unable to submit report', errorMessage(error));
    },
  });

  function close() {
    if (!reportMutation.isPending) onClose();
  }

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={close}
    >
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={close}>
          <Pressable style={styles.card} onPress={() => {}}>
            <View style={styles.handle} />
            <View style={styles.header}>
              <View style={styles.headerCopy}>
                <Text style={styles.title}>
                  Report {target?.type === 'user' ? 'member' : 'post'}
                </Text>
                <Text style={styles.subtitle} numberOfLines={2}>
                  {target?.label
                    ? `Tell us what is wrong with ${target.label}.`
                    : 'Tell us what happened.'}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close report"
                hitSlop={10}
                onPress={close}
                style={styles.closeButton}
              >
                <Feather name="x" size={22} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              <Text style={styles.label}>Choose a reason</Text>
              <View style={styles.reasons}>
                {REASONS.map((item) => {
                  const selected = reason === item.value;
                  return (
                    <Pressable
                      key={item.value}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      onPress={() => setReason(item.value)}
                      style={[styles.reasonRow, selected && styles.reasonRowSelected]}
                    >
                      <View style={[styles.radio, selected && styles.radioSelected]}>
                        {selected && <View style={styles.radioDot} />}
                      </View>
                      <Text style={styles.reasonText}>{item.label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.label}>Additional details (optional)</Text>
              <TextInput
                value={details}
                onChangeText={setDetails}
                placeholder="Add information that will help us review this report"
                placeholderTextColor="#7A746C"
                multiline
                maxLength={1000}
                style={styles.detailsInput}
                textAlignVertical="top"
              />
              <Text style={styles.counter}>{details.length}/1000</Text>

              <Text style={styles.notice}>
                Reports are confidential. Misusing the reporting system may result in account action.
              </Text>

              <View style={styles.actions}>
                <Pressable
                  disabled={reportMutation.isPending}
                  onPress={close}
                  style={[styles.button, styles.cancelButton]}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  disabled={!reason || reportMutation.isPending}
                  onPress={() => reportMutation.mutate()}
                  style={[
                    styles.button,
                    styles.submitButton,
                    (!reason || reportMutation.isPending) && styles.disabled,
                  ]}
                >
                  <Text style={styles.submitText}>
                    {reportMutation.isPending ? 'Submitting…' : 'Submit Report'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardWrap: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  card: {
    maxHeight: '92%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.background,
    paddingTop: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#C8C2B8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerCopy: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 36,
  },
  label: {
    marginTop: spacing.sm,
    marginBottom: 8,
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
  },
  reasons: {
    gap: 7,
  },
  reasonRow: {
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DED8CD',
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
  },
  reasonRowSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EAF6ED',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8A847B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  reasonText: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
  detailsInput: {
    minHeight: 94,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DED8CD',
    padding: spacing.sm,
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
    backgroundColor: '#FFFFFF',
  },
  counter: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'right',
  },
  notice: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    marginTop: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    minHeight: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  cancelButton: {
    flex: 0.8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  submitButton: {
    flex: 1.2,
    backgroundColor: '#B42318',
  },
  cancelText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.5,
  },
});
