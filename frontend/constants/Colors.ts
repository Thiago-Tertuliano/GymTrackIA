/**
 * Cores do GymTrack AI - Tema minimalista com toques energéticos
 * Preto, cinza e amarelo para remeter à energia
 */

const tintColorLight = '#FFD700'; // Amarelo energético
const tintColorDark = '#FFD700'; // Mesmo amarelo no modo escuro

export const Colors = {
  light: {
    text: '#333333',
    background: '#F5F5F5',
    tint: tintColorLight,
    icon: '#666666',
    tabIconDefault: '#999999',
    tabIconSelected: tintColorLight,
    primary: '#111111', // Preto para botões
    secondary: '#00BFFF', // Azul neon para ações
    accent: '#00FF7F', // Verde limão para destaque
    surface: '#FFFFFF',
    border: '#E0E0E0',
    success: '#00FF7F',
    warning: '#FFD700',
    error: '#FF4444',
  },
  dark: {
    text: '#ECEDEE',
    background: '#121212',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#FFD700', // Amarelo para botões no modo escuro
    secondary: '#00BFFF', // Azul neon
    accent: '#00FF7F', // Verde limão
    surface: '#1E1E1E',
    border: '#333333',
    success: '#00FF7F',
    warning: '#FFD700',
    error: '#FF4444',
  },
};
