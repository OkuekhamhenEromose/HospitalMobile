// screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types/navigation';
// import { useAuth } from '../../contexts/AuthContext';  // ← uncomment when wiring API

type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginNavProp;
}

const C = {
  primary:  '#1378e5',
  white:    '#ffffff',
  bg:       '#f5f8ff',
  border:   '#e2eaf5',
  text:     '#1a2340',
  sub:      '#5a6a85',
  muted:    '#8898aa',
  red:      '#ef4444',
  inputBg:  '#f3f6fc',
};

const UserIcon = ({ color = C.muted }: { color?: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path fill={color} d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10m0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4" />
  </Svg>
);

const LockIcon = ({ color = C.muted }: { color?: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path fill={color} d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2m-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2m3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1z" />
  </Svg>
);

const EyeIcon = ({ visible, color = C.muted }: { visible: boolean; color?: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    {visible
      ? <Path fill={color} d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3" />
      : <Path fill={color} d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l2.17 2.17C11.21 6.62 11.6 6.5 12 6.5zM2 4.27l2.28 2.28.46.46A11.8 11.8 0 0 0 3 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L21.73 22 23 20.73 3.27 3zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2m4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3z" />
    }
  </Svg>
);

const HospitalLogo = () => (
  <Svg width={48} height={48} viewBox="0 0 48 48">
    <Rect x="0" y="0" width="48" height="48" rx="14" fill={C.primary} />
    <Rect x="20" y="8"  width="8"  height="32" rx="3" fill={C.white} />
    <Rect x="8"  y="20" width="32" height="8"  rx="3" fill={C.white} />
  </Svg>
);

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState<{ username?: string; password?: string }>({});

  // const { login } = useAuth();  // ← uncomment when wiring API

  const validate = () => {
    const e: typeof errors = {};
    if (!username.trim()) e.username = 'Username is required';
    if (!password)        e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // ── Wire real auth here ──────────────────────────────────────────────
      // await login({ username, password });
      // ────────────────────────────────────────────────────────────────────

      // Navigate to Main tabs: dismiss the Auth modal, land on Home tab.
      // navigation.getParent() walks up to the root Stack from inside AuthNavigator.
      navigation.getParent()?.navigate('Main', { screen: 'Home' } as any);
    } catch (err: any) {
      Alert.alert('Login Failed', err.message ?? 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <HospitalLogo />
            <Text style={styles.appName}>Etha-Atlantic</Text>
            <Text style={styles.appSub}>Memorial Hospital</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome Back!</Text>
            <Text style={styles.cardSub}>Sign in to access your health portal</Text>

            {/* Username */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Username</Text>
              <View style={[styles.inputRow, errors.username ? styles.inputError : null]}>
                <UserIcon color={username ? C.primary : C.muted} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor={C.muted}
                  autoCapitalize="none"
                  value={username}
                  onChangeText={v => { setUsername(v); setErrors(e => ({ ...e, username: undefined })); }}
                />
              </View>
              {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={[styles.inputRow, errors.password ? styles.inputError : null]}>
                <LockIcon color={password ? C.primary : C.muted} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={C.muted}
                  secureTextEntry={!showPass}
                  value={password}
                  onChangeText={v => { setPassword(v); setErrors(e => ({ ...e, password: undefined })); }}
                />
                <TouchableOpacity onPress={() => setShowPass(v => !v)} activeOpacity={0.6}>
                  <EyeIcon visible={showPass} color={C.sub} />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <TouchableOpacity style={styles.forgotWrap} activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
              onPress={handleLogin} activeOpacity={0.85} disabled={loading}
            >
              {loading ? <ActivityIndicator color={C.white} /> : <Text style={styles.primaryBtnText}>SIGN IN</Text>}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryBtnText}>CREATE AN ACCOUNT</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            By signing in you agree to our{' '}
            <Text style={styles.footerLink}>Terms</Text> &{' '}
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: C.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 32 },

  header: { alignItems: 'center', paddingTop: 36, paddingBottom: 24, gap: 6 },
  appName: { fontSize: 22, fontWeight: '800', color: C.text, marginTop: 10 },
  appSub:  { fontSize: 13, color: C.sub, letterSpacing: 0.3 },

  card: {
    backgroundColor: C.white, borderRadius: 24, padding: 24,
    shadowColor: '#1378e5', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08, shadowRadius: 24, elevation: 6,
  },
  cardTitle: { fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 4 },
  cardSub:   { fontSize: 13, color: C.sub, marginBottom: 24 },

  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: C.sub, marginBottom: 6, letterSpacing: 0.4, textTransform: 'uppercase' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.inputBg, borderRadius: 12,
    paddingHorizontal: 14, height: 52,
    borderWidth: 1.5, borderColor: C.border,
  },
  inputError: { borderColor: C.red },
  input: { flex: 1, fontSize: 14, color: C.text, paddingVertical: 0 },
  errorText: { fontSize: 11, color: C.red, marginTop: 4, marginLeft: 2 },

  forgotWrap: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -4 },
  forgotText: { fontSize: 12, color: C.primary, fontWeight: '600' },

  primaryBtn: {
    backgroundColor: C.primary, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: C.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  primaryBtnDisabled: { opacity: 0.65 },
  primaryBtnText: { color: C.white, fontWeight: '800', fontSize: 14, letterSpacing: 1 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { fontSize: 12, color: C.muted, fontWeight: '600' },

  secondaryBtn: { borderWidth: 1.5, borderColor: C.primary, borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  secondaryBtnText: { color: C.primary, fontWeight: '800', fontSize: 14, letterSpacing: 1 },

  footer: { textAlign: 'center', fontSize: 11, color: C.muted, marginTop: 20 },
  footerLink: { color: C.primary, fontWeight: '600' },
});