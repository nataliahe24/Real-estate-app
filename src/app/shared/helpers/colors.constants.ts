export const THEME_COLORS = {
  BLUE: '#3366FF',
  GRAY_MEDIUM: '#555',
  GRAY_DARK: '#333'
} as const;

export type ThemeColorKeys = keyof typeof THEME_COLORS; 