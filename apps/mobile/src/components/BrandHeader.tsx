import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '@internably/ui/src';

export function BrandHeader() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Internably</Text>
      <Text style={styles.subtitle}>The College Student Network</Text>
      <Text style={styles.motto}>Built for interns. Powered by ambition.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  title: { ...typography.brand, color: colors.ink },
  subtitle: { ...typography.subtitle, color: colors.ink, marginTop: 4 },
  motto: { ...typography.secondary, color: colors.muted, marginTop: 2 },
});
