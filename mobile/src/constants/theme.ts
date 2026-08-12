export const colors = {
  background: "#DCE3EE",
  card: "#fffaf4",
  cardBorder: "#E2E6F0",

  navyDark: "#0B2A43",   // bottom nav bar, deepest accents
  navyMid: "#2F577F",    // buttons, checkmark circles, header icons
  navyMuted: "#8FA3B8",
  accentOrange: "#F0B37E",
  accentTeal: "#4F9C8C",

  danger: "#C0392B",
  textPrimary: "#1E3049",
  textOnDark: "#FFFFFF",
  textSecondary: "#5C6B7A",
  inputBackground: "#FFFFFF",
  inputBorder: "#1E3049",

  placeholder: "#8A96A3",

  tagAlert: "#F2B8B0",
  tagAlertText: "#7A2E24",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radii = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const typography = {
  heading: {
    fontSize: 28,
    fontWeight: "600" as const,
    color: colors.textPrimary,
  },
  subheading: {
    fontSize: 22,
    fontWeight: "500" as const,
    color: colors.textSecondary,
  },
  body: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  button: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.textOnDark,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#0B2A43",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  label: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 15,
    fontWeight: "700" as const,
    colors: colors.textPrimary,
  },
  gridLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  gridValue: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.textPrimary,
  },
  tagGroupLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: colors.textPrimary,
  },
  tagText: {
    fontSize: 14,
    color: colors.tagAlertText
  },
  placeholder: {
    fontSize: 16,
    color: colors.textSecondary,
  },
} as const;