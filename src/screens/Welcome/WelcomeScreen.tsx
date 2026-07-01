// screens/Welcome/WelcomeScreen.tsx
import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity,
  FlatList, NativeSyntheticEvent, NativeScrollEvent, Image, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';

type WelcomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeNavProp;
}

const { width, height } = Dimensions.get('window');

const C = {
  primary: '#1378e5',
  white:   '#ffffff',
  text:    '#1a2340',
  sub:     '#5a6a85',
  muted:   '#8898aa',
};

const HOSPITAL_DOCTOR  = require('../../../assets/images/hospitaldoctor.png');
const HOSPITAL_DOCTOR2 = require('../../../assets/images/hospitaldoctor2.png');
const HOSPITAL_DOCTOR3 = require('../../../assets/images/hospitaldoctor3.png');

const SLIDES = [
  {
    key: '1',
    image:    HOSPITAL_DOCTOR,
    accentBg: '#dbeafe',
    title: 'World-Class\nHospital Care',
    subtitle:
      'Lumen Healthcare brings specialist-grade healthcare to No 15 Adeola Odeku Street, Victoria Island, Lagos — at your fingertips.',
  },
  {
    key: '2',
    image:    HOSPITAL_DOCTOR2,
    accentBg: '#eff6ff',
    title: 'Expert Doctors\nAt Your Service',
    subtitle:
      'Consult highly qualified physicians and health professionals committed to evidence-based medicine, 24/7.',
  },
  {
    key: '3',
    image:    HOSPITAL_DOCTOR3,
    accentBg: '#f0fdf4',
    title: 'A Team Built\nAround You',
    subtitle:
      'From nurses and lab scientists to specialists — our multidisciplinary team puts your wellbeing first.',
  },
];

export default function WelcomeScreen({ navigation }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width));

  const goToAuth = () => navigation.navigate('Auth', { screen: 'Login' });

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      goToAuth();
    }
  };

  const slide = SLIDES[activeIndex];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={slide.accentBg} />

      {/* ── Illustration area (top ~56%) ── */}
      <View style={[styles.illustrationBg, { backgroundColor: slide.accentBg }]}>
        <SafeAreaView style={styles.topBar}>
          <View />
          <TouchableOpacity onPress={goToAuth} activeOpacity={0.7}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </SafeAreaView>

        <FlatList
          ref={flatListRef}
          data={SLIDES}
          keyExtractor={item => item.key}
          horizontal pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={onScroll}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Image
                source={item.image}
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>
          )}
        />
      </View>

      {/* ── Bottom white card ── */}
      <View style={styles.bottomCard}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex ? styles.dotActive : styles.dotInactive]} />
          ))}
        </View>

        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>

        <TouchableOpacity style={styles.ctaBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.ctaBtnText}>
            {activeIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToAuth} activeOpacity={0.7} style={styles.loginRow}>
          <Text style={styles.loginHint}>
            Already have an account?{' '}
            <Text style={styles.loginLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const CARD_HEIGHT = height * 0.44;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.white },

  illustrationBg: { height: height - CARD_HEIGHT, overflow: 'hidden' },

  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 8,
  },
  skipText: { fontSize: 14, color: C.sub, fontWeight: '600' },

  slide: { width, alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingBottom: 16 },
  illustration: { width: width * 0.78, height: (height - CARD_HEIGHT) - 80 },

  bottomCard: {
    flex: 1,
    backgroundColor: C.white,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    marginTop: -24,
    paddingHorizontal: 28, paddingTop: 28, paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06, shadowRadius: 16, elevation: 8,
  },

  dotsRow: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  dot: { height: 7, borderRadius: 4 },
  dotActive:   { width: 24, backgroundColor: C.primary },
  dotInactive: { width: 7,  backgroundColor: '#cbd5e1' },

  title: { fontSize: 28, fontWeight: '800', color: C.text, lineHeight: 36, marginBottom: 10, letterSpacing: -0.3 },
  subtitle: { fontSize: 14, color: C.sub, lineHeight: 22, marginBottom: 28 },

  ctaBtn: {
    backgroundColor: C.primary, borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: C.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6, marginBottom: 14,
  },
  ctaBtnText: { color: C.white, fontWeight: '700', fontSize: 16, letterSpacing: 0.3 },

  loginRow: { alignItems: 'center' },
  loginHint: { fontSize: 13, color: C.muted },
  loginLink: { color: C.primary, fontWeight: '700' },
});