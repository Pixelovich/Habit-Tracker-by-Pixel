import { Stack } from 'expo-router';

/**
 * Nota: Inicialmente, la aplicación solo tiene una pantalla principal "Hoy".
 * Las tabs y navegación múltiple se agregarán en futuras iteraciones.
 * Por ahora, solo renderizamos la pantalla actual sin barra de navegación.
 * 
 * Esta es la versión para web (.web.tsx). Es idéntica a app-tabs.tsx
 * para garantizar que no se muestren elementos de navegación de Expo.
 */
export default function AppTabs() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
