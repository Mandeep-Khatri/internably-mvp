import { Feather } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, spacing } from '@internably/ui/src';
import { ResourcesApi } from '@/api/resources';
import ScreenContainer from '@/screens/shared/ScreenContainer';

type MeResponse = { role?: 'USER' | 'ADMIN' | 'MODERATOR' };

type MemberSummary = {
  id: string;
  username?: string | null;
  profile?: { firstName?: string | null; lastName?: string | null } | null;
};

type AdminReport = {
  id: string;
  reason: string;
  details?: string | null;
  status: 'OPEN' | 'REVIEWED' | 'RESOLVED';
  createdAt: string;
  reporter?: MemberSummary | null;
  reportedUser?: MemberSummary | null;
  post?: { id: string; content: string; imageUrl?: string | null } | null;
};

const REASON_LABELS: Record<string, string> = {
  HARASSMENT: 'Harassment or bullying',
  HATE_SPEECH: 'Hate or discrimination',
  SEXUAL_CONTENT: 'Sexual or inappropriate content',
  VIOLENCE_OR_THREATS: 'Violence or threats',
  SCAM_OR_IMPERSONATION: 'Scam or impersonation',
  SPAM: 'Spam',
  PRIVACY_VIOLATION: 'Privacy violation',
  OTHER: 'Something else',
};

function memberName(member?: MemberSummary | null) {
  const first = member?.profile?.firstName?.trim() ?? '';
  const last = member?.profile?.lastName?.trim() ?? '';
  return `${first} ${last}`.trim() || member?.username || 'Deleted member';
}

function statusColor(status: AdminReport['status']) {
  if (status === 'RESOLVED') return '#247A3A';
  if (status === 'REVIEWED') return '#8A5A00';
  return '#B42318';
}

export default function AdminConsoleScreen() {
  const queryClient = useQueryClient();
  const meQuery = useQuery<MeResponse>({
    queryKey: ['me'],
    queryFn: ResourcesApi.usersMe,
  });
  const isAdmin =
    meQuery.data?.role === 'ADMIN' || meQuery.data?.role === 'MODERATOR';

  const reportsQuery = useQuery<AdminReport[]>({
    queryKey: ['admin-reports'],
    queryFn: ResourcesApi.adminReports,
    enabled: isAdmin,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AdminReport['status'] }) =>
      ResourcesApi.updateReportStatus(id, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    },
    onError: () => {
      Alert.alert('Unable to update report', 'Please check your connection and try again.');
    },
  });

  if (meQuery.isLoading) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      </ScreenContainer>
    );
  }

  if (!isAdmin) {
    return (
      <ScreenContainer>
        <View style={styles.accessCard}>
          <Feather name="lock" size={34} color={colors.primary} />
          <Text style={styles.accessTitle}>Admin access required</Text>
          <Text style={styles.accessBody}>
            This area is available only to Internably administrators and moderators.
          </Text>
          <Pressable onPress={() => router.back()} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Back to Settings</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer noPadding scroll={false}>
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => router.back()}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Moderation Reports</Text>
          <Text style={styles.subtitle}>Review safety reports and record an outcome.</Text>
        </View>
      </View>

      {reportsQuery.isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : reportsQuery.isError ? (
        <View style={styles.accessCard}>
          <Text style={styles.accessTitle}>Unable to load reports</Text>
          <Pressable onPress={() => reportsQuery.refetch()} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={reportsQuery.data ?? []}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={reportsQuery.isRefetching}
              onRefresh={reportsQuery.refetch}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const updating =
              statusMutation.isPending && statusMutation.variables?.id === item.id;
            return (
              <View style={styles.reportCard}>
                <View style={styles.reportHeader}>
                  <View style={styles.reportHeaderCopy}>
                    <Text style={styles.reason}>
                      {REASON_LABELS[item.reason] ?? item.reason}
                    </Text>
                    <Text style={styles.date}>
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { borderColor: statusColor(item.status) }]}>
                    <Text style={[styles.statusText, { color: statusColor(item.status) }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.metaLabel}>Reported by</Text>
                <Text style={styles.metaValue}>{memberName(item.reporter)}</Text>
                <Text style={styles.metaLabel}>Reported member</Text>
                <Text style={styles.metaValue}>{memberName(item.reportedUser)}</Text>

                {!!item.post && (
                  <View style={styles.postPreview}>
                    <Text style={styles.metaLabel}>Reported post</Text>
                    <Text numberOfLines={5} style={styles.postContent}>
                      {item.post.content}
                    </Text>
                  </View>
                )}

                {!!item.details && (
                  <View style={styles.detailsBox}>
                    <Text style={styles.metaLabel}>Additional details</Text>
                    <Text style={styles.details}>{item.details}</Text>
                  </View>
                )}

                <View style={styles.linkRow}>
                  {!!item.reportedUser?.id && (
                    <Pressable
                      onPress={() => router.push(`/profile/${item.reportedUser?.id}`)}
                      style={styles.linkButton}
                    >
                      <Text style={styles.linkText}>View member</Text>
                    </Pressable>
                  )}
                  {!!item.post?.id && (
                    <Pressable
                      onPress={() => router.push(`/posts/${item.post?.id}`)}
                      style={styles.linkButton}
                    >
                      <Text style={styles.linkText}>View post</Text>
                    </Pressable>
                  )}
                </View>

                <View style={styles.actions}>
                  {item.status === 'OPEN' && (
                    <Pressable
                      disabled={updating}
                      onPress={() =>
                        statusMutation.mutate({ id: item.id, status: 'REVIEWED' })
                      }
                      style={[styles.actionButton, styles.reviewButton, updating && styles.disabled]}
                    >
                      <Text style={styles.reviewText}>Mark Reviewed</Text>
                    </Pressable>
                  )}
                  {item.status !== 'RESOLVED' ? (
                    <Pressable
                      disabled={updating}
                      onPress={() =>
                        statusMutation.mutate({ id: item.id, status: 'RESOLVED' })
                      }
                      style={[styles.actionButton, styles.resolveButton, updating && styles.disabled]}
                    >
                      <Text style={styles.resolveText}>Resolve</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      disabled={updating}
                      onPress={() =>
                        statusMutation.mutate({ id: item.id, status: 'OPEN' })
                      }
                      style={[styles.actionButton, styles.reviewButton, updating && styles.disabled]}
                    >
                      <Text style={styles.reviewText}>Reopen</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="check-circle" size={40} color={colors.primary} />
              <Text style={styles.emptyTitle}>No reports</Text>
              <Text style={styles.emptyBody}>New member and post reports will appear here.</Text>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E0D6',
    backgroundColor: colors.background,
  },
  back: { color: colors.primary, fontSize: 17, lineHeight: 24, fontWeight: '700' },
  headerCopy: { flex: 1 },
  title: { color: colors.text, fontSize: 24, lineHeight: 30, fontWeight: '900' },
  subtitle: { marginTop: 2, color: colors.muted, fontSize: 14, lineHeight: 19 },
  loading: { marginTop: 56 },
  accessCard: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E0D6',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  accessTitle: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '900',
    textAlign: 'center',
  },
  accessBody: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
  primaryButton: {
    minHeight: 44,
    marginTop: spacing.md,
    borderRadius: 22,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  listContent: { padding: spacing.md, paddingBottom: 90 },
  reportCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1DBD0',
    backgroundColor: '#FFFFFF',
  },
  reportHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  reportHeaderCopy: { flex: 1 },
  reason: { color: colors.text, fontSize: 18, lineHeight: 24, fontWeight: '900' },
  date: { marginTop: 2, color: colors.muted, fontSize: 12, lineHeight: 17 },
  statusBadge: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 11, lineHeight: 15, fontWeight: '900' },
  metaLabel: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metaValue: { marginTop: 2, color: colors.text, fontSize: 15, lineHeight: 20, fontWeight: '700' },
  postPreview: { marginTop: 4 },
  postContent: { marginTop: 3, color: '#4F4A43', fontSize: 15, lineHeight: 21 },
  detailsBox: { marginTop: 6, padding: spacing.sm, borderRadius: 10, backgroundColor: '#F7F3EB' },
  details: { marginTop: 3, color: '#4F4A43', fontSize: 14, lineHeight: 20 },
  linkRow: { marginTop: spacing.sm, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  linkButton: {
    minHeight: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  linkText: { color: colors.primary, fontSize: 13, fontWeight: '800' },
  actions: { marginTop: spacing.md, flexDirection: 'row', gap: spacing.sm },
  actionButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  reviewButton: { borderWidth: 1, borderColor: '#8A5A00' },
  resolveButton: { backgroundColor: colors.primary },
  reviewText: { color: '#8A5A00', fontSize: 14, fontWeight: '800' },
  resolveText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  disabled: { opacity: 0.55 },
  empty: { alignItems: 'center', paddingTop: 64 },
  emptyTitle: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '900',
  },
  emptyBody: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
});
