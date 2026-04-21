import { Text } from 'react-native';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';

export default function AdminPlaceholderScreen() {
  return (
    <Screen>
      <Card>
        <Text style={{ fontSize: 22, fontWeight: '800' }}>Admin Console (MVP Placeholder)</Text>
        <Text>- Review applications</Text>
        <Text>- Approve/deny members</Text>
        <Text>- Moderate reports</Text>
        <Text>- Manage communities</Text>
      </Card>
    </Screen>
  );
}
