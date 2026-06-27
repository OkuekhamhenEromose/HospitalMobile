// src/screens/Auth/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
  Alert, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import type { RegisterData, Role, Gender } from '../../types';

type RegisterNavProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterNavProp;
}

// ── Colour palette ─────────────────────────────────────────────────────────────
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

const ETTA_LOGO = require('../../../assets/images/etta-logo.png');

// ── Role SVG icons ────────────────────────────────────────────────────────────

const PatientIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 64 64">
    <Path fill={color} d="M29.905 11.078a5.225 5.225 0 0 0 5.616-4.789A5.23 5.23 0 0 0 30.725.673a5.22 5.22 0 0 0-5.614 4.792a5.22 5.22 0 0 0 4.794 5.614zm1.431 10.461a3.516 3.516 0 0 1 2.852 3.464a3.53 3.53 0 0 1-3.528 3.528H19.228a2.24 2.24 0 0 1-2.074-3.088l1.236-2.885l13.766-9.86h-6.559c-2.519-.07-4.289.805-5.304 2.789c-.688 1.335-4.342 9.498-4.342 9.498a3.528 3.528 0 0 0 3.278 4.836h4.465l-1.317 8.66l-6.93 20.026a3.37 3.37 0 1 0 6.402 2.113l7.969-22.59c1.554 2.525 4.647 7.051 5.173 7.906c.121 1.421 1.234 13.948 1.234 13.948a3.374 3.374 0 0 0 3.657 3.059a3.37 3.37 0 0 0 3.059-3.657l-1.31-14.743a3.3 3.3 0 0 0-.49-1.471l-5.729-9.285l.912-11.653s1.357 4.611 1.458 4.944c.291.952.947 1.635 1.62 2.18c.394.314 7.081 4.865 7.081 4.865c.372.172.676.323 1.075.35a2.35 2.35 0 0 0 2.533-2.158a2.37 2.37 0 0 0-.92-2.061s-6.663-4.575-6.934-4.774a1.4 1.4 0 0 1-.439-.61l-2.637-9.498c-.429-1.437-1.877-2.673-3.708-2.673h-.789z" />
    <Path fill={color} d="M30.66 27.241a2.232 2.232 0 0 0 .24-4.453l-1.635 4.467z" />
  </Svg>
);

const DoctorIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={22} viewBox="0 0 448 512">
    <Path fill={color} d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-96 55.2C54 332.9 0 401.3 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-81-54-149.4-128-171.1V362c27.6 7.1 48 32.2 48 62v40c0 8.8-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16s7.2-16 16-16v-24c0-17.7-14.3-32-32-32s-32 14.3-32 32v24c8.8 0 16 7.2 16 16s-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16v-40c0-29.8 20.4-54.9 48-62v-57.1q-9-.9-18.3-.9h-91.4q-9.3 0-18.3.9v65.4c23.1 6.9 40 28.3 40 53.7c0 30.9-25.1 56-56 56s-56-25.1-56-56c0-25.4 16.9-46.8 40-53.7zM144 448a24 24 0 1 0 0-48a24 24 0 1 0 0 48" />
  </Svg>
);

const NurseIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={22} viewBox="0 0 20 24">
    <Path fill={color} d="M19.534 21.152a10.6 10.6 0 0 0-.51-3.901l.021.075c-.058-.172-.104-1.326-2.014-2.072c-1.406-.549-3.291-.454-4.688-1.406a2 2 0 0 1-.078-.311l-.002-.015a12.1 12.1 0 0 0 4.006-1.533l-.054.03c-2.012-.572-2.16-3.784-2.301-5.76c0-.558-.111-1.09-.312-1.575l.01.027l-.03-.118L14.758.001H4.796l1.172 4.595l-.03.117a4 4 0 0 0-.302 1.547c-.142 2.022-.302 5.188-2.301 5.76a11.9 11.9 0 0 0 3.873 1.49l.076.012c-.024.13-.052.239-.086.346l.006-.02c-1.396.952-3.28.855-4.688 1.406C.607 16 .562 17.154.504 17.326c-.321.962-.506 2.07-.506 3.221q0 .32.019.634l-.001-.029c-.01.368 0 .923 1.101 1.406c3.261 1.429 8.64 1.44 8.661 1.44a27.9 27.9 0 0 0 8.857-1.498l-.196.058c1.098-.483 1.105-1.038 1.098-1.409zM13.807.738l-.975 3.834H6.709L5.734.738z" />
    <Path fill={color} d="M8.234 3.063h1.077v1.079h.919V3.063h1.079v-.917h-1.083V1.071h-.919V2.15H8.234z" />
  </Svg>
);

const LabIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Path fill={color} d="M8 17c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4" />
    <Circle cx="8" cy="12" r="4" fill={color} />
    <Circle cx="20" cy="5" r="1" fill={color} />
    <Circle cx="21.5" cy="3.5" r=".5" fill={color} />
    <Circle cx="20.5" cy="1.5" r=".5" fill={color} />
    <Path fill={color} d="M16 7v1h1l.003 10.031C17 19.712 18 21 19.5 21s2.5-1.207 2.5-3V8h1V7Zm5 8l-.565.424a1.77 1.77 0 0 1-1.05.326H19V15h-1v-2h1v-1h-1v-2h1V9h-1V8h3Z" />
  </Svg>
);

const AdminIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 26 26">
    <Path fill={color} d="M16.563 15.9c-.159-.052-1.164-.505-.536-2.414h-.009c1.637-1.686 2.888-4.399 2.888-7.07c0-4.107-2.731-6.26-5.905-6.26c-3.176 0-5.892 2.152-5.892 6.26c0 2.682 1.244 5.406 2.891 7.088c.642 1.684-.506 2.309-.746 2.396c-3.324 1.203-7.224 3.394-7.224 5.557v.811c0 2.947 5.714 3.617 11.002 3.617c5.296 0 10.938-.67 10.938-3.617v-.811c0-2.228-3.919-4.402-7.407-5.557m-5.516 8.709c0-2.549 1.623-5.99 1.623-5.99l-1.123-.881c0-.842 1.453-1.723 1.453-1.723s1.449.895 1.449 1.723l-1.119.881s1.623 3.428 1.623 6.018c0 .406-3.906.312-3.906-.028" />
  </Svg>
);

// ── Field icons ───────────────────────────────────────────────────────────────

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

// ── Role chips config ──────────────────────────────────────────────────────────

const ROLES: { key: Role; label: string; Icon: React.FC<{ color: string }> }[] = [
  { key: 'PATIENT', label: 'Patient',       Icon: PatientIcon },
  { key: 'DOCTOR',  label: 'Doctor',        Icon: DoctorIcon  },
  { key: 'NURSE',   label: 'Nurse',         Icon: NurseIcon   },
  { key: 'LAB',     label: 'Lab Scientist', Icon: LabIcon     },
  { key: 'ADMIN',   label: 'Admin',         Icon: AdminIcon   },
];

// ── Form state type (aligned with RegisterData) ───────────────────────────────

interface FormState {
  fullname:  string;
  username:  string;
  email:     string;
  phone:     string;
  gender:    Gender | '';
  role:      Role;
  password1: string;
  password2: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();

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
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState<Partial<Record<keyof FormState, string>>>({});

  const set = (key: keyof FormState) => (val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
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
      const payload: RegisterData = {
        username:  form.username,
        email:     form.email,
        password1: form.password1,
        password2: form.password2,
        fullname:  form.fullname,
        role:      form.role,
        ...(form.phone  ? { phone:  form.phone }             : {}),
        ...(form.gender ? { gender: form.gender as Gender }  : {}),
      };

      // register() in AuthContext creates account + auto-logs in
      await register(payload);

      // Auth state update triggers AppNavigator to switch to Main automatically
      navigation.getParent()?.navigate('Main', { screen: 'Home' } as never);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      Alert.alert('Registration Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Field builder ─────────────────────────────────────────────────────────

  const field = (
    label: string,
    key: keyof FormState,
    opts: {
      icon: React.ReactNode;
      placeholder: string;
      keyboardType?: 'default' | 'email-address' | 'phone-pad';
      autoCapitalize?: 'none' | 'words' | 'sentences' | 'characters';
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
          autoCorrect={false}
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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Image source={ETTA_LOGO} style={styles.logo} resizeMode="contain" />
            <Text style={styles.cardTitle}>Let's Get Started!</Text>
            <Text style={styles.cardSub}>Create your Etha-Atlantic health portal account</Text>
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
              {ROLES.map(({ key, label, Icon }) => {
                const active = form.role === key;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.roleChip, active && styles.roleChipActive]}
                    onPress={() => setForm(f => ({ ...f, role: key }))}
                    activeOpacity={0.7}
                  >
                    <Icon color={active ? C.primary : C.muted} />
                    <Text style={[styles.roleLabel, active && styles.roleLabelActive]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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

            {/* Gender */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Gender</Text>
              <View style={styles.genderRow}>
                {([['M', 'Male'], ['F', 'Female'], ['O', 'Other']] as const).map(([k, l]) => (
                  <TouchableOpacity
                    key={k}
                    style={[styles.genderBtn, form.gender === k && styles.genderBtnActive]}
                    onPress={() => setForm(f => ({ ...f, gender: k }))}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.genderLabel, form.gender === k && styles.genderLabelActive]}>
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
              {loading
                ? <ActivityIndicator color={C.white} />
                : <Text style={styles.primaryBtnText}>CREATE ACCOUNT</Text>
              }
            </TouchableOpacity>

            {/* Sign-in link */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
              style={styles.loginRow}
            >
              <Text style={styles.loginHint}>
                Already have an account?{' '}
                <Text style={styles.loginLink}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>

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
  logo:   { width: 120, height: 48 },
  cardTitle: { fontSize: 22, fontWeight: '800', color: C.text, marginTop: 10 },
  cardSub:   { fontSize: 13, color: C.sub, textAlign: 'center', lineHeight: 20 },

  card: {
    backgroundColor: C.white, borderRadius: 24, padding: 24,
    shadowColor: '#1378e5', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08, shadowRadius: 24, elevation: 6,
  },

  roleScroll:      { gap: 8, paddingBottom: 2 },
  roleChip: {
    alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 14, borderWidth: 1.5, borderColor: C.border,
    backgroundColor: C.inputBg, minWidth: 76, gap: 6,
  },
  roleChipActive:  { borderColor: C.primary, backgroundColor: '#eff6ff' },
  roleLabel:       { fontSize: 11, fontWeight: '600', color: C.sub,     textAlign: 'center' },
  roleLabelActive: { fontSize: 11, fontWeight: '600', color: C.primary, textAlign: 'center' },

  fieldGroup: { marginBottom: 14 },
  fieldLabel: {
    fontSize: 11, fontWeight: '700', color: C.sub, marginBottom: 6,
    letterSpacing: 0.5, textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.inputBg, borderRadius: 12,
    paddingHorizontal: 14, height: 52,
    borderWidth: 1.5, borderColor: C.border,
  },
  inputError: { borderColor: C.red },
  input:      { flex: 1, fontSize: 14, color: C.text, paddingVertical: 0 },
  errorText:  { fontSize: 11, color: C.red, marginTop: 4, marginLeft: 2 },

  genderRow:        { flexDirection: 'row', gap: 8 },
  genderBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    borderWidth: 1.5, borderColor: C.border,
    backgroundColor: C.inputBg, alignItems: 'center',
  },
  genderBtnActive:   { borderColor: C.primary, backgroundColor: '#eff6ff' },
  genderLabel:       { fontSize: 13, fontWeight: '600', color: C.sub },
  genderLabelActive: { fontSize: 13, fontWeight: '600', color: C.primary },

  primaryBtn: {
    backgroundColor: C.primary, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginTop: 8,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  primaryBtnDisabled: { opacity: 0.65 },
  primaryBtnText: { color: C.white, fontWeight: '800', fontSize: 14, letterSpacing: 1 },

  loginRow: { alignItems: 'center', marginTop: 18 },
  loginHint: { fontSize: 13, color: C.muted },
  loginLink: { color: C.primary, fontWeight: '700' },

  footer:     { textAlign: 'center', fontSize: 11, color: C.muted, marginTop: 18 },
  footerLink: { color: C.primary, fontWeight: '600' },
});
