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

export default function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    const cleanEmail = email.trim()

    if (!cleanEmail || !password || !confirmPassword) {
      Alert.alert('Faltan datos', 'Completa todos los campos.')
      return
    }

    if (password.length < 6) {
      Alert.alert(
        'Contraseña demasiado corta',
        'La contraseña debe tener al menos 6 caracteres.',
      )
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Las contraseñas no coinciden', 'Revísalas e inténtalo de nuevo.')
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
    })

    setLoading(false)

    if (error) {
      Alert.alert('No se ha podido crear la cuenta', error.message)
      return
    }

    if (data.session) {
      router.replace('/(tabs)')
      return
    }

    Alert.alert(
      'Cuenta creada',
      'Revisa tu correo electrónico para confirmar la cuenta.',
      [
        {
          text: 'Ir al login',
          onPress: () => router.replace('/(auth)/login'),
        },
      ],
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Habit Tracker</Text>
        <Text style={styles.subtitle}>Personal Edition</Text>

        <Text style={styles.heading}>Crear cuenta</Text>

        <Text style={styles.description}>
          Crea tu cuenta para guardar tus hábitos y acceder a ellos desde
          cualquier dispositivo.
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
          autoComplete="new-password"
        />

        <TextInput
          style={styles.input}
          placeholder="Repetir contraseña"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Crear cuenta</Text>
          )}
        </Pressable>

        <Link href="/(auth)/login" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>
              Ya tengo una cuenta
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
  heading: {
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