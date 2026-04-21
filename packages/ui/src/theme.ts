export const colors = {
  background: '#F6F3EA',
  primary: '#0E8F2C',
  text: '#000000',
  border: '#E5E0D6',
  surface: '#FFFFFF',
  muted: '#6F6B62',
  card: '#FBF9F4',
  dark: '#000000',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  pill: 999,
};

export const typography = {
  brand: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '700' as const,
    fontFamily: 'Inter',
  },
  screenTitle: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '600' as const,
    fontFamily: 'Inter',
  },
  sectionHeader: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
    fontFamily: 'Inter',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '500' as const,
    fontFamily: 'Inter',
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400' as const,
    fontFamily: 'Inter',
  },
  button: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
    fontFamily: 'Inter',
  },
  secondary: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
    fontFamily: 'Inter',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    fontFamily: 'Inter',
  },
};

export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
};
