// screens/Auth/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

// ── colour tokens ─────────────────────────────────────────────────────────────
const C = {
  primary:   '#1378e5',
  primaryDk: '#0f5bbf',
  white:     '#ffffff',
  bg:        '#f5f8ff',
  border:    '#e2eaf5',
  text:      '#1a2340',
  sub:       '#5a6a85',
  muted:     '#8898aa',
  red:       '#ef4444',
  inputBg:   '#f3f6fc',
  success:   '#10b981',
};

// ── RBAC roles ────────────────────────────────────────────────────────────────
type Role = 'PATIENT' | 'DOCTOR' | 'NURSE' | 'LAB' | 'ADMIN';
const ROLES: { key: Role; label: string; icon: string }[] = [
  { key: 'PATIENT', label: 'Patient',       icon: '🧑‍⚕️' },
  { key: 'DOCTOR',  label: 'Doctor',        icon: '👨‍⚕️' },
  { key: 'NURSE',   label: 'Nurse',         icon: '🩺' },
  { key: 'LAB',     label: 'Lab Scientist', icon: '🔬' },
  { key: 'ADMIN',   label: 'Admin',         icon: '🛡️' },
];

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const UserIcon = ({ color = C.muted }: { color?: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path fill={color} d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10m0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4" />
  </Svg>
);

const MailIcon = ({ color = C.muted }: { color?: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path fill={color} d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4-8 5-8-5V6l8 5 8-5z" />
  </Svg>
);

const LockIcon = ({ color = C.muted }: { color?: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path fill={color} d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2m-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2m3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1z" />
  </Svg>
);

const PhoneIcon = ({ color = C.muted }: { color?: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path fill={color} d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02z" />
  </Svg>
);

const EyeIcon = ({ visible, color = C.muted }: { visible: boolean; color?: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    {visible ? (
      <Path fill={color} d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3" />
    ) : (
      <Path fill={color} d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l2.17 2.17C11.21 6.62 11.6 6.5 12 6.5zM2 4.27l2.28 2.28.46.46A11.8 11.8 0 0 0 3 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L21.73 22 23 20.73 3.27 3zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2m4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3z" />
    )}
  </Svg>
);

// ── Hospital cross logo ───────────────────────────────────────────────────────
const HospitalLogo = () => (
  <Svg width={44} height={44} viewBox="0 0 48 48">
    <Rect x="0" y="0" width="48" height="48" rx="14" fill={C.primary} />
    <Rect x="20" y="8" width="8" height="32" rx="3" fill={C.white} />
    <Rect x="8" y="20" width="32" height="8" rx="3" fill={C.white} />
  </Svg>
);

// ── Form state type ───────────────────────────────────────────────────────────
interface FormState {
  fullname:  string;
  username:  string;
  email:     string;
  phone:     string;
  gender:    'M' | 'F' | 'O' | '';
  role:      Role;
  password1: string;
  password2: string;
}

// ── Component ─────────────────────────────────────────────────────────────────
interface RegisterScreenProps {
  navigation?: any;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [form, setForm] = useState<FormState>({
    fullname:  '',
    username:  '',
    email:     '',
    phone:     '',
    gender:    '',
    role:      'PATIENT',
    password1: '',
    password2: '',
  });
  const [showPass1,  setShowPass1]  = useState(false);
  const [showPass2,  setShowPass2]  = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [errors,     setErrors]     = useState<Partial<Record<keyof FormState, string>>>({});

  const set = (key: keyof FormState) => (val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.fullname.trim())  e.fullname  = 'Full name is required';
    if (!form.username.trim())  e.username  = 'Username is required';
    if (!form.email.trim())     e.email     = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password1)        e.password1 = 'Password is required';
    else if (form.password1.length < 8) e.password1 = 'Min 8 characters';
    if (form.password1 !== form.password2) e.password2 = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // TODO: wire up apiService.registerWithImage() + AuthContext login()
      Alert.alert(
        'Registration',
        `Account for ${form.fullname} (${form.role}) — wire up API here.`,
      );
      navigation?.navigate?.('Login');
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  const field = (
    label: string,
    key: keyof FormState,
    opts: {
      icon: React.ReactNode;
      placeholder: string;
      keyboardType?: any;
      autoCapitalize?: any;
      secure?: boolean;
      onEye?: () => void;
      eyeVisible?: boolean;
    },
  ) => (
    <View style={styles.fieldGroup} key={key}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputRow, errors[key] ? styles.inputError : null]}>
        {opts.icon}
        <TextInput
          style={styles.input}
          placeholder={opts.placeholder}
          placeholderTextColor={C.muted}
          keyboardType={opts.keyboardType ?? 'default'}
          autoCapitalize={opts.autoCapitalize ?? 'words'}
          secureTextEntry={opts.secure && !opts.eyeVisible}
          value={form[key] as string}
          onChangeText={set(key)}
        />
        {opts.onEye && (
          <TouchableOpacity onPress={opts.onEye} activeOpacity={0.6}>
            <EyeIcon visible={!!opts.eyeVisible} color={C.sub} />
          </TouchableOpacity>
        )}
      </View>
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <HospitalLogo />
            <Text style={styles.cardTitle}>Let's Get Started!</Text>
            <Text style={styles.cardSub}>
              Create your Etha-Atlantic health portal account
            </Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {/* Role picker */}
            <Text style={styles.fieldLabel}>I am a…</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.roleScroll}
              style={{ marginBottom: 18 }}
            >
              {ROLES.map(r => (
                <TouchableOpacity
                  key={r.key}
                  style={[
                    styles.roleChip,
                    form.role === r.key && styles.roleChipActive,
                  ]}
                  onPress={() => setForm(f => ({ ...f, role: r.key }))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.roleEmoji}>{r.icon}</Text>
                  <Text
                    style={[
                      styles.roleLabel,
                      form.role === r.key && styles.roleLabelActive,
                    ]}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Fields */}
            {field('Full Name', 'fullname', {
              icon: <UserIcon color={form.fullname ? C.primary : C.muted} />,
              placeholder: 'Enter your full name',
            })}
            {field('Username', 'username', {
              icon: <UserIcon color={form.username ? C.primary : C.muted} />,
              placeholder: 'Choose a username',
              autoCapitalize: 'none',
            })}
            {field('Email', 'email', {
              icon: <MailIcon color={form.email ? C.primary : C.muted} />,
              placeholder: 'Enter your email',
              keyboardType: 'email-address',
              autoCapitalize: 'none',
            })}
            {field('Phone (optional)', 'phone', {
              icon: <PhoneIcon color={form.phone ? C.primary : C.muted} />,
              placeholder: 'e.g. +234 800 000 0000',
              keyboardType: 'phone-pad',
              autoCapitalize: 'none',
            })}

            {/* Gender row */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Gender</Text>
              <View style={styles.genderRow}>
                {([['M', 'Male'], ['F', 'Female'], ['O', 'Other']] as const).map(([k, l]) => (
                  <TouchableOpacity
                    key={k}
                    style={[
                      styles.genderBtn,
                      form.gender === k && styles.genderBtnActive,
                    ]}
                    onPress={() => setForm(f => ({ ...f, gender: k }))}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.genderLabel,
                        form.gender === k && styles.genderLabelActive,
                      ]}
                    >
                      {l}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {field('Password', 'password1', {
              icon: <LockIcon color={form.password1 ? C.primary : C.muted} />,
              placeholder: 'Min 8 characters',
              autoCapitalize: 'none',
              secure: true,
              eyeVisible: showPass1,
              onEye: () => setShowPass1(v => !v),
            })}
            {field('Confirm Password', 'password2', {
              icon: <LockIcon color={form.password2 ? C.primary : C.muted} />,
              placeholder: 'Re-enter your password',
              autoCapitalize: 'none',
              secure: true,
              eyeVisible: showPass2,
              onEye: () => setShowPass2(v => !v),
            })}

            {/* Submit */}
            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
              onPress={handleRegister}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={C.white} />
              ) : (
                <Text style={styles.primaryBtnText}>CREATE ACCOUNT</Text>
              )}
            </TouchableOpacity>

            {/* Sign in link */}
            <TouchableOpacity
              onPress={() => navigation?.navigate?.('Login')}
              activeOpacity={0.7}
              style={styles.loginRow}
            >
              <Text style={styles.loginHint}>
                Already have an account?{' '}
                <Text style={styles.loginLink}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            By creating an account you agree to our{' '}
            <Text style={styles.footerLink}>Terms</Text> &{' '}
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: C.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 36 },

  header: { alignItems: 'center', paddingTop: 28, paddingBottom: 20, gap: 6 },
  cardTitle: { fontSize: 22, fontWeight: '800', color: C.text, marginTop: 10 },
  cardSub:   { fontSize: 13, color: C.sub, textAlign: 'center', lineHeight: 20 },

  card: {
    backgroundColor: C.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#1378e5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },

  // Role chips
  roleScroll: { gap: 8, paddingBottom: 2 },
  roleChip: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.inputBg,
    minWidth: 76,
    gap: 4,
  },
  roleChipActive: {
    borderColor: C.primary,
    backgroundColor: '#eff6ff',
  },
  roleEmoji: { fontSize: 20 },
  roleLabel: { fontSize: 11, fontWeight: '600', color: C.sub, textAlign: 'center' },
  roleLabelActive: { color: C.primary },

  // Fields
  fieldGroup: { marginBottom: 14 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.sub,
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.inputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  inputError: { borderColor: C.red },
  input: { flex: 1, fontSize: 14, color: C.text, paddingVertical: 0 },
  errorText: { fontSize: 11, color: C.red, marginTop: 4, marginLeft: 2 },

  // Gender
  genderRow: { flexDirection: 'row', gap: 8 },
  genderBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.inputBg,
    alignItems: 'center',
  },
  genderBtnActive: { borderColor: C.primary, backgroundColor: '#eff6ff' },
  genderLabel: { fontSize: 13, fontWeight: '600', color: C.sub },
  genderLabelActive: { color: C.primary },

  // CTA
  primaryBtn: {
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryBtnDisabled: { opacity: 0.65 },
  primaryBtnText: { color: C.white, fontWeight: '800', fontSize: 14, letterSpacing: 1 },

  loginRow: { alignItems: 'center', marginTop: 18 },
  loginHint: { fontSize: 13, color: C.muted },
  loginLink: { color: C.primary, fontWeight: '700' },

  footer: { textAlign: 'center', fontSize: 11, color: C.muted, marginTop: 18 },
  footerLink: { color: C.primary, fontWeight: '600' },
});