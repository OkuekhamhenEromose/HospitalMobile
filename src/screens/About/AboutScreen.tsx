// import React from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import SafeAreaWrapper from '@components/common/SafeAreaWrapper';
// import { COLORS, SIZES } from '@constants/Theme';

// const AboutScreen: React.FC = () => {
//   return (
//     <SafeAreaWrapper>
//       <ScrollView style={styles.container}>
//         <View style={styles.content}>
//           <Text style={styles.title}>About Etha-Atlantic Memorial Hospital</Text>
//           <Text style={styles.subtitle}>Ikate Lekki, Lagos</Text>
          
//           <Text style={styles.paragraph}>
//             Etha-Atlantic Memorial Hospital Lekki stands as the premier private
//             hospital in Lekki, Lagos. Our foundation was laid with the singular
//             purpose of delivering world-class healthcare to the community of Lagos
//             and the broader Nigerian populace.
//           </Text>

//           <Text style={styles.paragraph}>
//             Established by a physician with medical training and experience practicing
//             in the US, along with access to expert consultation and up-to-date research.
//             Markedly, he has teamed up with bright and dedicated Nigerian physicians and
//             other allied health professionals with training home and abroad to provide
//             excellent care.
//           </Text>

//           <Text style={styles.sectionTitle}>Our Mission</Text>
//           <Text style={styles.paragraph}>
//             To provide world-class healthcare services to the community of Lagos and
//             the broader Nigerian populace, upholding the highest standards of medical
//             excellence and patient care.
//           </Text>

//           <Text style={styles.sectionTitle}>Our Vision</Text>
//           <Text style={styles.paragraph}>
//             To be the leading private healthcare institution in West Africa, recognized
//             for our commitment to evidence-based medicine, advanced technology, and
//             compassionate patient care.
//           </Text>
//         </View>
//       </ScrollView>
//     </SafeAreaWrapper>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   content: {
//     padding: SIZES.paddingLg,
//   },
//   title: {
//     fontSize: SIZES.h2,
//     fontWeight: '700',
//     color: COLORS.primary,
//     marginBottom: SIZES.sm,
//   },
//   subtitle: {
//     fontSize: SIZES.h4,
//     fontWeight: '600',
//     color: COLORS.textSecondary,
//     marginBottom: SIZES.lg,
//   },
//   sectionTitle: {
//     fontSize: SIZES.h4,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//     marginTop: SIZES.lg,
//     marginBottom: SIZES.sm,
//   },
//   paragraph: {
//     fontSize: SIZES.body1,
//     lineHeight: SIZES.body1 * 1.6,
//     color: COLORS.textSecondary,
//     marginBottom: SIZES.md,
//   },
// });

// export default AboutScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// ── Colours ──────────────────────────────────────────────────────────────────
const C = {
  primary:   '#1378e5',
  secondary: '#177fed',
  red:       '#ef4444',
  white:     '#ffffff',
  bg:        '#f5f8ff',
  text:      '#1a2340',
  sub:       '#5a6a85',
  muted:     '#8898aa',
  star:      '#f59e0b',
  dark:      '#111827',
  border:    '#e2eaf5',
};

// ── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = ['About', 'Details'];

// ── Hero images (carousel) ────────────────────────────────────────────────────
const HERO_IMAGES = [
  require('../../../assets/images/hero-doctor.jpg'),
  require('../../../assets/images/hero-doctor.jpg'),
];

// ── Stat pills (replaces "8 hours · 16°C · 4.5" from screenshot) ─────────────
const STAT_PILLS = [
  { icon: 'access-time',    label: 'Open 24/7'  },
  { icon: 'local-hospital', label: 'Specialist' },
  { icon: 'star',           label: '4.9'        },
];

// ── Feature cards (horizontal scroll — from HomeScreen) ──────────────────────
const FEATURE_CARDS = [
  { title: 'Professional Team',   icon: 'people',         desc: 'Highly qualified physicians and health professionals providing excellent care.',     bg: C.primary   },
  { title: 'Advanced Technology', icon: 'devices',        desc: 'Electronic medical records and telemedicine for fast, quality healthcare delivery.', bg: C.secondary },
  { title: 'Great Facilities',    icon: 'local-hospital', desc: 'World-class equipment: BiPAP, CTG, ultrasound, ECG, cardiac monitors and more.',    bg: C.red       },
];

// ── Doctors list (Image 2 pattern) ────────────────────────────────────────────
const DOCTORS = [
  { name: 'Dr. Chidi Okonkwo',  role: 'Senior Surgeon',         hours: '8:00 AM–4:00 PM', fee: '$20', rating: 4.9 },
  { name: 'Dr. Amaka Nwosu',    role: 'Consultant Physician',   hours: '9:00 AM–5:00 PM', fee: '$15', rating: 5.0 },
  { name: 'Dr. Emeka Eze',      role: 'Cardiologist',           hours: '7:30 AM–3:30 PM', fee: '$25', rating: 4.8 },
  { name: 'Dr. Ngozi Adeyemi',  role: 'Obstetrics & Gynecology',hours: '8:00 AM–4:00 PM', fee: '$18', rating: 4.7 },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface AboutScreenProps {
  navigation?: any;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AboutScreen({ navigation }: AboutScreenProps) {
  const [activeTab,   setActiveTab]   = useState(0);
  const [isSaved,     setIsSaved]     = useState(false);
  const [heroIndex,   setHeroIndex]   = useState(0);

  const onHeroScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setHeroIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

        {/* ══════════════════════════════════════════════════════════
            HERO IMAGE CAROUSEL  (Image 1 top section)
        ══════════════════════════════════════════════════════════ */}
        <View style={styles.heroWrap}>
          {/* Carousel */}
          <FlatList
            data={HERO_IMAGES}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onHeroScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <Image source={item} style={styles.heroImage} resizeMode="cover" />
            )}
          />

          {/* Dot indicators */}
          {HERO_IMAGES.length > 1 && (
            <View style={styles.dotsRow}>
              {HERO_IMAGES.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === heroIndex ? styles.dotOn : styles.dotOff]}
                />
              ))}
            </View>
          )}

          {/* Dark gradient card over bottom of image — Image 1 pattern */}
          <View style={styles.heroOverCard}>
            <View style={styles.heroOverCardInner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroOverTitle}>Etta-Atlantic Memorial Hospital</Text>
                <View style={styles.heroLocRow}>
                  <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.heroLocText}>Ikate Lekki, Lagos</Text>
                </View>
              </View>
              {/* Price-style badge */}
              <View>
                <Text style={styles.heroOverPriceLabel}>Est.</Text>
                <Text style={styles.heroOverPrice}>2018</Text>
              </View>
            </View>
          </View>

          {/* Back + Save overlay (Abeeshak pattern) */}
          <SafeAreaView style={styles.heroButtons}>
            <View style={styles.heroButtonsRow}>
              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => navigation?.goBack?.()}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={20} color={C.dark} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => setIsSaved(v => !v)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={isSaved ? C.primary : C.dark}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* ══════════════════════════════════════════════════════════
            CONTENT AREA
        ══════════════════════════════════════════════════════════ */}
        <View style={styles.content}>

          {/* ── Tabs: "Overview | Details" → "About | Details" ── */}
          <View style={styles.tabRow}>
            {TABS.map((tab, i) => (
              <TouchableOpacity
                key={i}
                style={styles.tabItem}
                onPress={() => setActiveTab(i)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, i === activeTab && styles.tabTextActive]}>
                  {tab}
                </Text>
                {i === activeTab && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Stat pills row (Image 1 · 8hrs · 16°C · 4.5 pattern) ── */}
          <View style={styles.pillRow}>
            {STAT_PILLS.map((p, i) => (
              <View key={i} style={styles.pill}>
                <MaterialIcons name={p.icon as any} size={15} color={C.text} />
                <Text style={styles.pillText}>{p.label}</Text>
              </View>
            ))}
          </View>

          {activeTab === 0 ? (
            <>
              {/* ── Section heading ── */}
              <Text style={styles.sectionHeading}>
                About Etha-Atlantic Memorial Hospital
              </Text>
              <View style={styles.sectionDivider} />

              <Text style={styles.body}>
                Etta-Atlantic Memorial Hospital Lekki stands as the premier private
                hospital in Lekki, Lagos. Our foundation was laid with the singular
                purpose of delivering world-class healthcare to the community of Lagos
                and the broader Nigerian populace.{' '}
                <Text style={styles.bodyMuted}>
                  Established by a physician with medical training and experience in
                  the US, teamed with bright and dedicated Nigerian physicians and
                  allied health professionals.
                </Text>
              </Text>

              {/* ── Our Mission ── */}
              <View style={styles.missionCard}>
                <View style={styles.missionIconWrap}>
                  <MaterialIcons name="flag" size={22} color={C.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.missionTitle}>Our Mission</Text>
                  <Text style={styles.missionBody}>
                    To provide world-class healthcare services to the community of Lagos
                    and the broader Nigerian populace, upholding the highest standards of
                    medical excellence and patient care.
                  </Text>
                </View>
              </View>

              {/* ── Our Vision ── */}
              <View style={[styles.missionCard, { backgroundColor: '#fff5f5' }]}>
                <View style={[styles.missionIconWrap, { backgroundColor: '#fee2e2' }]}>
                  <MaterialIcons name="visibility" size={22} color={C.red} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.missionTitle, { color: C.red }]}>Our Vision</Text>
                  <Text style={styles.missionBody}>
                    To be the leading private healthcare institution in West Africa,
                    recognised for our commitment to evidence-based medicine, advanced
                    technology, and compassionate patient care.
                  </Text>
                </View>
              </View>

              {/* ── Feature cards (horizontal scroll from HomeScreen) ── */}
              <Text style={[styles.sectionHeading, { marginTop: 20 }]}>Why Choose Us</Text>
              <View style={styles.sectionDivider} />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featureScroll}
                style={{ marginTop: 12 }}
              >
                {FEATURE_CARDS.map((card, i) => (
                  <View key={i} style={[styles.featureCard, { backgroundColor: card.bg }]}>
                    <MaterialIcons name={card.icon as any} size={26} color={C.white} />
                    <Text style={styles.featureCardTitle}>{card.title}</Text>
                    <Text style={styles.featureCardDesc}>{card.desc}</Text>
                  </View>
                ))}
              </ScrollView>

              {/* ── Top Doctors (Image 2 pattern) ── */}
              <Text style={[styles.sectionHeading, { marginTop: 24 }]}>Top Doctors</Text>
              <View style={styles.sectionDivider} />

              {DOCTORS.map((doc, i) => (
                <View key={i} style={styles.doctorCard}>
                  {/* Avatar */}
                  <Image
                    source={require('../../../assets/images/hero-doctor.jpg')}
                    style={styles.doctorAvatar}
                    resizeMode="cover"
                  />

                  {/* Info */}
                  <View style={styles.doctorInfo}>
                    {/* Name + rating */}
                    <View style={styles.doctorNameRow}>
                      <Text style={styles.doctorName}>{doc.name}</Text>
                      <View style={styles.ratingPill}>
                        <Ionicons name="star" size={11} color={C.star} />
                        <Text style={styles.ratingText}>{doc.rating}</Text>
                      </View>
                    </View>

                    <Text style={styles.doctorRole}>{doc.role}</Text>

                    {/* Hours */}
                    <View style={styles.doctorMetaRow}>
                      <Ionicons name="time-outline" size={12} color={C.muted} />
                      <Text style={styles.doctorMeta}>{doc.hours}</Text>
                    </View>

                    {/* Fee */}
                    <Text style={styles.doctorFee}>Fee: {doc.fee}</Text>
                  </View>

                  {/* Arrow button (Image 2 dark circle) */}
                  <TouchableOpacity
                    style={styles.arrowBtn}
                    onPress={() => navigation?.navigate?.('Book')}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="arrow-forward" size={18} color={C.white} />
                  </TouchableOpacity>
                </View>
              ))}
            </>
          ) : (
            /* ── Details tab ── */
            <View style={styles.detailsTab}>
              {[
                { label: 'Location',    value: 'Ikate Lekki, Lagos, Nigeria' },
                { label: 'Phone',       value: '+234 800 000 0000' },
                { label: 'Email',       value: 'info@ettaatlantic.com' },
                { label: 'Hours',       value: '24 hours, 7 days a week' },
                { label: 'Founded',     value: '2018' },
                { label: 'Accredited', value: 'WHO Standards Compliant' },
              ].map((row, i) => (
                <View key={i} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{row.label}</Text>
                  <Text style={styles.detailValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        {/* end content */}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Book Now CTA (Image 1 bottom sticky bar) ── */}
      <View style={styles.stickyBar}>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => navigation?.navigate?.('Book')}
          activeOpacity={0.88}
        >
          <Text style={styles.bookBtnText}>Book Appointment</Text>
          <Ionicons name="navigate-outline" size={18} color={C.white} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.white },

  // Hero
  heroWrap:  { width, height: 280, position: 'relative' },
  heroImage: { width, height: 280 },

  dotsRow: {
    position: 'absolute', bottom: 70,
    left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', gap: 5,
  },
  dot:    { height: 6, borderRadius: 3 },
  dotOn:  { width: 16, backgroundColor: C.white },
  dotOff: { width: 6,  backgroundColor: 'rgba(255,255,255,0.45)' },

  // Dark card over bottom of hero (Image 1 pattern)
  heroOverCard: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(17,24,39,0.82)',
    paddingHorizontal: 18, paddingVertical: 14,
  },
  heroOverCardInner: { flexDirection: 'row', alignItems: 'center' },
  heroOverTitle:     { color: C.white, fontSize: 16, fontWeight: '800', marginBottom: 4 },
  heroLocRow:        { flexDirection: 'row', alignItems: 'center', gap: 3 },
  heroLocText:       { color: 'rgba(255,255,255,0.75)', fontSize: 12 },
  heroOverPriceLabel:{ color: 'rgba(255,255,255,0.6)', fontSize: 10, textAlign: 'right' },
  heroOverPrice:     { color: C.white, fontSize: 22, fontWeight: '800', textAlign: 'right' },

  // Overlay buttons
  heroButtons: { position: 'absolute', top: 0, left: 0, right: 0 },
  heroButtonsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 10,
  },
  circleBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: C.white,
    justifyContent: 'center', alignItems: 'center',
    elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 4,
  },

  // Content
  content: { paddingHorizontal: 20, paddingTop: 18 },

  // Tabs
  tabRow: { flexDirection: 'row', gap: 24, marginBottom: 16 },
  tabItem: { alignItems: 'center', paddingBottom: 4 },
  tabText: { fontSize: 15, color: C.muted, fontWeight: '500' },
  tabTextActive: { color: C.text, fontWeight: '700' },
  tabUnderline: {
    height: 3, width: '100%', borderRadius: 2,
    backgroundColor: C.text, marginTop: 4,
  },

  // Stat pills (Image 1 · 8hrs · 16°C · 4.5)
  pillRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 20,
  },
  pillText: { fontSize: 12, color: C.text, fontWeight: '500' },

  // Body text
  sectionHeading: { fontSize: 16, fontWeight: '800', color: C.text, marginBottom: 6 },
  sectionDivider: { width: 36, height: 3, backgroundColor: C.primary, borderRadius: 2, marginBottom: 12 },
  body:           { fontSize: 13, color: C.text, lineHeight: 21, marginBottom: 14 },
  bodyMuted:      { color: C.sub },

  // Mission / Vision cards
  missionCard: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    backgroundColor: '#eff6ff',
    borderRadius: 14, padding: 14, marginBottom: 12,
  },
  missionIconWrap: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#dbeafe',
    justifyContent: 'center', alignItems: 'center',
  },
  missionTitle: { fontSize: 13, fontWeight: '700', color: C.primary, marginBottom: 4 },
  missionBody:  { fontSize: 12, color: C.sub, lineHeight: 19 },

  // Feature cards
  featureScroll: { gap: 10, paddingRight: 4 },
  featureCard: {
    width: width * 0.60, borderRadius: 14,
    padding: 14, gap: 7, marginRight: 2,
  },
  featureCardTitle: { color: C.white, fontWeight: '700', fontSize: 13 },
  featureCardDesc:  { color: 'rgba(255,255,255,0.85)', fontSize: 11, lineHeight: 17 },

  // Doctor cards (Image 2 pattern)
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    gap: 12,
  },
  doctorAvatar: {
    width: 64, height: 64, borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  doctorInfo:   { flex: 1 },
  doctorNameRow:{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  doctorName:   { fontSize: 13, fontWeight: '700', color: C.text, flex: 1, marginRight: 6 },
  ratingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#fef9ee',
    paddingHorizontal: 7, paddingVertical: 3,
    borderRadius: 20,
  },
  ratingText:   { fontSize: 11, fontWeight: '600', color: C.text },
  doctorRole:   { fontSize: 11, color: C.sub, marginBottom: 4 },
  doctorMetaRow:{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  doctorMeta:   { fontSize: 11, color: C.muted },
  doctorFee:    { fontSize: 11, color: C.sub, fontWeight: '500' },

  // Arrow button (Image 2 dark circle)
  arrowBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: C.dark,
    justifyContent: 'center', alignItems: 'center',
  },

  // Details tab
  detailsTab:  { paddingTop: 4 },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  detailLabel: { fontSize: 13, color: C.muted, fontWeight: '500' },
  detailValue: { fontSize: 13, color: C.text,  fontWeight: '600', maxWidth: '60%', textAlign: 'right' },

  // Sticky Book Now bar (Image 1 bottom)
  stickyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: C.white,
    paddingHorizontal: 20, paddingVertical: 14,
    borderTopWidth: 1, borderTopColor: '#f1f5f9',
  },
  bookBtn: {
    backgroundColor: C.dark,
    borderRadius: 50,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtnText: { color: C.white, fontSize: 15, fontWeight: '700' },
});