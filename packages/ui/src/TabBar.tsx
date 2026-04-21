import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, typography } from './theme';

type Route = { key: string; name: string };
type TabBarProps = {
  state: { index: number; routes: Route[] };
  descriptors: Record<string, any>;
  navigation: any;
};

const labelMap: Record<string, string> = {
  home: 'Home',
  messages: 'Messages',
  grow: 'Network',
  profile: 'Profile',
};

const ACTIVE_GREEN = colors.primary;
const INACTIVE_GRAY = '#8E8E93';
const ICON_SIZE = 24;
const ICON_WRAP_SIZE = 36;

function IconContainer({
  focused,
  children,
}: {
  focused: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}>
      {children}
    </View>
  );
}

export function HomeTabIcon({ focused }: { focused: boolean }) {
  return (
    <IconContainer focused={focused}>
      <Ionicons
        name={focused ? 'home' : 'home-outline'}
        size={ICON_SIZE}
        color={focused ? '#FFFFFF' : INACTIVE_GRAY}
      />
    </IconContainer>
  );
}

export function MessagesTabIcon({ focused }: { focused: boolean }) {
  return (
    <IconContainer focused={focused}>
      <Ionicons
        name={focused ? 'chatbubble' : 'chatbubble-outline'}
        size={ICON_SIZE}
        color={focused ? '#FFFFFF' : INACTIVE_GRAY}
      />
    </IconContainer>
  );
}

export function NetworkTabIcon({ focused }: { focused: boolean }) {
  return (
    <IconContainer focused={focused}>
      <Ionicons
        name={focused ? 'people' : 'people-outline'}
        size={ICON_SIZE}
        color={focused ? '#FFFFFF' : INACTIVE_GRAY}
      />
    </IconContainer>
  );
}

export function ProfileTabIcon({ focused }: { focused: boolean }) {
  return (
    <IconContainer focused={focused}>
      <Ionicons
        name={focused ? 'person' : 'person-outline'}
        size={ICON_SIZE}
        color={focused ? '#FFFFFF' : INACTIVE_GRAY}
      />
    </IconContainer>
  );
}

export const TabBar = React.memo(function TabBar({
  state,
  descriptors,
  navigation,
}: TabBarProps) {
  const visibleRoutes = state.routes.filter((route) => route.name !== 'notifications');
  const activeRouteKey = state.routes[state.index]?.key;

  return (
    <View style={styles.wrap}>
      {visibleRoutes.map((route) => {
        const focused = activeRouteKey === route.key;
        const options = descriptors[route.key]?.options;

        const tabBarLabel = options?.tabBarLabel;
        const label =
          typeof tabBarLabel === 'string'
            ? tabBarLabel
            : typeof options?.title === 'string'
              ? options.title
              : labelMap[route.name] ?? route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.item}>
            {route.name === 'home' ? (
              <HomeTabIcon focused={focused} />
            ) : route.name === 'messages' ? (
              <MessagesTabIcon focused={focused} />
            ) : route.name === 'grow' ? (
              <NetworkTabIcon focused={focused} />
            ) : route.name === 'profile' ? (
              <ProfileTabIcon focused={focused} />
            ) : null}
            <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: '#D7D2C7',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 18 : 10,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    flex: 1,
  },
  iconWrap: {
    width: ICON_WRAP_SIZE,
    height: ICON_WRAP_SIZE,
    borderRadius: ICON_WRAP_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconWrapFocused: {
    backgroundColor: ACTIVE_GREEN,
  },
  label: {
    color: '#3B3B3B',
    ...typography.caption,
  },
  labelActive: {
    color: '#111111',
    fontWeight: '600',
  },
});
