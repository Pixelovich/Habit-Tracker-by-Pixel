import { Stack } from 'expo-router';

/**
 * Nota: Inicialmente, la aplicación solo tiene una pantalla principal "Hoy".
 * Las tabs y navegación múltiple se agregarán en futuras iteraciones.
 * Por ahora, solo renderizamos la pantalla actual sin barra de navegación.
 */
export default function AppTabs() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
