import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Link, router } from 'expo-router'

import { supabase } from '@/services/supabase'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    const cleanEmail = email.trim()

    if (!cleanEmail || !password) {
      Alert.alert('Faltan datos', 'Introduce tu email y contraseña.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    })

    setLoading(false)

    if (error) {
      Alert.alert('No se ha podido iniciar sesión', error.message)
      return
    }

    router.replace('/(tabs)')
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Habit Tracker</Text>
        <Text style={styles.subtitle}>Personal Edition</Text>

        <Text style={styles.welcome}>Bienvenido</Text>
        <Text style={styles.description}>
          Inicia sesión para acceder a tus hábitos y registros.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoComplete="email"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          )}
        </Pressable>

        <Link href="/(auth)/register" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>
              Crear una cuenta
            </Text>
          </Pressable>
        </Link>

        <Text style={styles.footer}>
          Designed & built by Luis Lecumberri · 2026
        </Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.6,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 48,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    opacity: 0.7,
    marginBottom: 24,
    lineHeight: 22,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.5,
    marginTop: 40,
  },
})