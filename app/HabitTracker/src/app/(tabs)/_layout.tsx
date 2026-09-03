import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#2196F3' }}>
      <Tabs.Screen name="index" options={{ title: 'Hoy', tabBarIcon: () => <Text>🏠</Text> }} />
      <Tabs.Screen name="history" options={{ title: 'Historial', tabBarIcon: () => <Text>📅</Text> }} />
      <Tabs.Screen name="statistics" options={{ title: 'Estadísticas', tabBarIcon: () => <Text>📊</Text> }} />
      <Tabs.Screen name="settings" options={{ title: 'Ajustes', tabBarIcon: () => <Text>⚙️</Text> }} />
    </Tabs>
  );
}
