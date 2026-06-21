// import React from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import SafeAreaWrapper from '@components/common/SafeAreaWrapper';
// import { COLORS, SIZES } from '@constants/Theme';

// const ServicesScreen: React.FC = () => {
//   return (
//     <SafeAreaWrapper>
//       <ScrollView style={styles.container}>
//         <View style={styles.content}>
//           <Text style={styles.title}>Our Services</Text>
//           <Text style={styles.paragraph}>Services content coming soon...</Text>
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
//     marginBottom: SIZES.lg,
//   },
//   paragraph: {
//     fontSize: SIZES.body1,
//     color: COLORS.textSecondary,
//   },
// });

// export default ServicesScreen;


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  MaterialIcons,
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Linking } from 'react-native';

const { width } = Dimensions.get('window');

// ── PAYMENT PLAN CARDS (Silver / Gold / Platinum) ────────────────────────────
// Screenshot pattern: icon top-left · 3-dot top-right ·
//   decorative circle bottom-right · bold plan name bottom-left
interface PaymentPlan {
  tier:       string;       // Silver / Gold / Platinum
  tagline:    string;
  price:      string;       // e.g. ₦15,000/mo
  period:     string;
  icon:       string;       // MaterialCommunityIcons name
  gradient:   [string, string]; // [card bg, decorative circle]
  textColor:  string;
  subColor:   string;
  features:   string[];
  payUrl:     string;       // payment link
  popular?:   boolean;
}

const PAYMENT_PLANS: PaymentPlan[] = [
  {
    tier:      'Silver',
    tagline:   'Essential Care',
    price:     '₦15,000',
    period:    '/ month',
    icon:      'shield-outline',
    gradient:  ['#6b7a99', '#8896b3'],
    textColor: '#ffffff',
    subColor:  'rgba(255,255,255,0.75)',
    payUrl:    'https://hospitalback-clean-0fre.onrender.com/api/payments/silver/',
    features:  [
      'General Practice visits',
      'Basic Lab Diagnostics',
      'Emergency consultation',
      'Pharmacy discounts (5%)',
    ],
  },
  {
    tier:      'Gold',
    tagline:   'Enhanced Health',
    price:     '₦35,000',
    period:    '/ month',
    icon:      'shield-star-outline',
    gradient:  ['#e67700', '#f59f00'],
    textColor: '#ffffff',
    subColor:  'rgba(255,255,255,0.75)',
    payUrl:    'https://hospitalback-clean-0fre.onrender.com/api/payments/gold/',
    popular:   true,
    features:  [
      'Everything in Silver',
      'Specialist consultations',
      'Ultrasound & ECG',
      'Pharmacy discounts (15%)',
      'Priority appointment booking',
    ],
  },
  {
    tier:      'Platinum',
    tagline:   'Premium Coverage',
    price:     '₦75,000',
    period:    '/ month',
    icon:      'shield-crown-outline',
    gradient:  ['#1378e5', '#0f5bbf'],
    textColor: '#ffffff',
    subColor:  'rgba(255,255,255,0.75)',
    payUrl:    'https://hospitalback-clean-0fre.onrender.com/api/payments/platinum/',
    features:  [
      'Everything in Gold',
      'Surgery coverage',
      'Hematology & Cardiology',
      'Pharmacy discounts (25%)',
      'Free ambulance service',
      'Annual full health check',
    ],
  },
];

// ── Colours ───────────────────────────────────────────────────────────────────
const C = {
  primary:   '#1378e5',
  secondary: '#177fed',
  red:       '#ef4444',
  white:     '#ffffff',
  bg:        '#f5f8ff',
  text:      '#1a2340',
  sub:       '#5a6a85',
  muted:     '#8898aa',
  border:    '#e2eaf5',
  green:     '#22c55e',
  dark:      '#111827',
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 DATA  — 16 services (15 from web + Research), each with a
// pastel illustrated-circle bg colour and accent icon colour
// ─────────────────────────────────────────────────────────────────────────────
type IconLib = 'MI' | 'Ion' | 'FA5' | 'MCI';

interface ServiceItem {
  label:  string;
  icon:   string;
  lib:    IconLib;
  bg:     string;   // circle background (pastel)
  color:  string;   // icon tint
}

const SERVICES: ServiceItem[] = [
  // row 1 of page 1
  { label: 'Emergency\nServices',    icon: 'local-hospital',        lib: 'MI',  bg: '#ffd6d6', color: '#e03131' },
  { label: 'Internal\nMedicine',     icon: 'medical-bag',           lib: 'MCI', bg: '#d0e8ff', color: '#1971c2' },
  { label: 'General\nPractice',      icon: 'stethoscope',           lib: 'FA5', bg: '#d3f9d8', color: '#2f9e44' },
  { label: 'Gynecology\nObstetrics', icon: 'child-care',            lib: 'MI',  bg: '#f3d9fa', color: '#9c36b5' },
  // row 2 of page 1
  { label: 'General\nSurgery',       icon: 'cut',                   lib: 'MCI', bg: '#fff3bf', color: '#e67700' },
  { label: 'Orthopedic\nSurgery',    icon: 'bone',                  lib: 'MCI', bg: '#d3f9d8', color: '#2f9e44' },
  { label: 'Dermatology',            icon: 'face-recognition',      lib: 'MCI', bg: '#ffe8cc', color: '#e8590c' },
  { label: 'Lab\nDiagnostics',       icon: 'flask-outline',         lib: 'Ion', bg: '#d0e8ff', color: '#1971c2' },
  // row 1 of page 2
  { label: 'Pharmacy',               icon: 'pharmacy',              lib: 'MCI', bg: '#ffd6d6', color: '#e03131' },
  { label: 'Plastic\nSurgery',       icon: 'scalpel',               lib: 'MCI', bg: '#f3d9fa', color: '#9c36b5' },
  { label: 'Acute\nIllnesses',       icon: 'pulse',                 lib: 'Ion', bg: '#ffd6d6', color: '#c92a2a' },
  { label: 'Hematology',             icon: 'water',                 lib: 'Ion', bg: '#ffe3e3', color: '#e03131' },
  // row 2 of page 2
  { label: 'Cardiology',             icon: 'heart-pulse',           lib: 'MCI', bg: '#ffd6d6', color: '#e03131' },
  { label: 'Gastro-\nenterology',    icon: 'stomach',               lib: 'MCI', bg: '#fff3bf', color: '#e67700' },
  { label: 'Nephrology',             icon: 'kidney',                lib: 'MCI', bg: '#d0e8ff', color: '#1971c2' },
  { label: 'Research',               icon: 'flask',                 lib: 'MCI', bg: '#d3f9d8', color: '#2f9e44' },
];

// 4 items per row × 2 rows = 8 per "page"
const COLS     = 4;
const ROWS     = 2;
const PER_PAGE = COLS * ROWS;                          // 8

// Build pages: array of arrays of 8
const PAGES: ServiceItem[][] = [];
for (let i = 0; i < SERVICES.length; i += PER_PAGE) {
  PAGES.push(SERVICES.slice(i, i + PER_PAGE));
}

// Cell sizing — 4 per row with 16px side padding + 8px gaps
const CELL_WIDTH = (width - 32 - 8 * (COLS - 1)) / COLS;

// ── Service detail lists ──────────────────────────────────────────────────────
const SERVICE_DETAILS: { title: string; items: string[] }[] = [
  { title: 'Emergency Services',     items: ['Seizures', 'Loss of consciousness', 'Acute severe asthma', 'Shock', 'Trauma / Lacerations / Cut injuries'] },
  { title: 'Internal Medicine',      items: ['Stroke', 'Diabetes and its complications', 'Thyroid disorders', 'Kidney failure / disease', 'Hypertension'] },
  { title: 'General Practice',       items: ['Peptic ulcer disease / gastritis', 'Malaria', 'Enteric fever', 'Diarrhea and complications', 'Sepsis'] },
  { title: 'Gynecology Obstetrics',  items: ['Antenatal services', 'Vaginal deliveries', 'Caesarean section', 'Menstrual disorder', 'Infertility', 'Myomectomy'] },
  { title: 'General Surgery',        items: ['Mastectomy', 'Hernia repair', 'Lumpectomy', 'Appendectomy', 'Exploratory laparotomy', 'Cholecystectomy'] },
  { title: 'Orthopedic Surgery',     items: ['Joint fusion', 'Fracture repair / Decompression', 'Spinal decompression', 'Knee arthroscopy', 'Club foot correction'] },
  { title: 'Dermatology',            items: ['Rashes / Urticaria', 'Fungal / Bacterial skin infection', 'Skin growth & lesions', 'Acne'] },
  { title: 'Lab Diagnostics',        items: ['Fully functional medical laboratory', 'Ultrasound scans', 'Electrocardiogram', 'Cardiotocograph'] },
  { title: 'Pharmacy',               items: ['Ambulance services', 'Prescription dispensing', 'OTC medications', 'Drug counselling'] },
  { title: 'Plastic Surgery',        items: ['Burns', 'Keloid escharification', 'Surgical debridement', 'Lipoma removal'] },
  { title: 'Acute Illnesses',        items: ['Pneumonia', 'Delirium', 'Loss of consciousness', 'Sepsis and shock'] },
  { title: 'Hematology',             items: ['Sickle cell disease', 'Blood transfusion', 'Bleeding disorders', 'Blood cancers', 'Chemotherapy'] },
  { title: 'Cardiology',             items: ['Chest pain', 'Heart failure', 'Irregular heartbeats', 'Defibrillator'] },
  { title: 'Gastroenterology',       items: ['Inflammatory bowel disease', 'Upper and lower GI bleeds', 'Liver disease', 'Pancreatic disease'] },
  { title: 'Nephrology',             items: ['Kidney disease', 'Hypertension', 'Electrolyte abnormalities'] },
  { title: 'Research',               items: ['Clinical trials', 'Evidence-based medicine', 'Medical publications', 'Health outcome studies'] },
];

// ── SECTION 2 — Patient Stories ───────────────────────────────────────────────
const STORIES = [
  { label: 'Recommendation',       value: 98 },
  { label: 'Wait time',            value: 70 },
  { label: 'Doctor friendliness',  value: 88 },
  { label: 'Detailed explanation', value: 80 },
];

// ── SECTION 3 — Packages ──────────────────────────────────────────────────────
const PLAN_TABS = ['3mo', '6mo', '12mo'];

const PLAN_FEATURES = [
  { title: 'Additional 2% NMS cash',     sub: 'Max ₦1,000 on prepaid medicine',       plans: [false, true,  true]  },
  { title: 'Additional 10% off on Lab',  sub: 'Existing offer + max ₦100 on lab',     plans: [false, true,  true]  },
  { title: 'Unlimited Free Delivery',    sub: 'Free delivery on orders above ₦99',    plans: [false, false, true]  },
  { title: 'Superfast Delivery',         sub: 'High priority delivery for all orders', plans: [false, false, true]  },
  { title: 'Priority Consultation',      sub: 'Skip the queue, book instantly',        plans: [false, false, true]  },
];

// ── Icon renderer ─────────────────────────────────────────────────────────────
function SvcIcon({ item, size = 28 }: { item: ServiceItem; size?: number }) {
  const p = { name: item.icon as any, size, color: item.color };
  switch (item.lib) {
    case 'Ion': return <Ionicons {...p} />;
    case 'FA5': return <FontAwesome5 {...p} size={size - 4} />;
    case 'MCI': return <MaterialCommunityIcons {...p} />;
    default:    return <MaterialIcons {...p} />;
  }
}

// ── Bar ───────────────────────────────────────────────────────────────────────
function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={bar.label}>{label}</Text>
      <View style={bar.row}>
        <View style={bar.track}>
          <View style={[bar.fill, { width: `${value}%` as any }]} />
        </View>
        <Text style={bar.pct}>{value}%</Text>
      </View>
    </View>
  );
}
const bar = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 6 },
  row:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  track: { flex: 1, height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: 4, backgroundColor: C.green },
  pct:   { fontSize: 12, fontWeight: '700', color: C.text, width: 34, textAlign: 'right' },
});

// ─────────────────────────────────────────────────────────────────────────────
export default function ServicesScreen({ navigation }: { navigation?: any }) {
  const [selectedIdx,  setSelectedIdx]  = useState<number | null>(null);
  const [activePlan,   setActivePlan]   = useState(2);
  const [dotPage,      setDotPage]      = useState(0);
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);

  const onHScroll = (e: any) => {
    // each "page" is exactly (width - 32) wide
    const pageW = width - 32;
    setDotPage(Math.round(e.nativeEvent.contentOffset.x / pageW));
  };

  return (
    <View style={s.root}>
      {/* Top bar */}
      <SafeAreaView style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation?.goBack?.()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color={C.text} />
        </TouchableOpacity>
        <Text style={s.topBarTitle}>Our Services</Text>
        <View style={{ width: 38 }} />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ══════════════════════════════════════════════════════════
            SECTION 1 — Horizontal-paging icon grid
            Layout: 2 rows × 4 cols per page, swipe left→right
        ══════════════════════════════════════════════════════════ */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Medical Services</Text>
          <View style={s.divider} />
          <Text style={s.sectionSub}>Tap a service to see details · swipe to explore all</Text>

          {/* Horizontal paging scroll */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onHScroll}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={width - 32}   // snap per page
            snapToAlignment="start"
            contentContainerStyle={{ gap: 0 }}
            style={{ marginHorizontal: -18 }} // bleed to section edges
          >
            {PAGES.map((page, pageIdx) => (
              <View
                key={pageIdx}
                style={{
                  width: width - 32,
                  paddingHorizontal: 18,
                }}
              >
                {/* Split page into 2 rows of 4 */}
                {[0, 1].map(rowIdx => (
                  <View key={rowIdx} style={s.iconRow}>
                    {page.slice(rowIdx * COLS, rowIdx * COLS + COLS).map((item, colIdx) => {
                      const globalIdx = pageIdx * PER_PAGE + rowIdx * COLS + colIdx;
                      const isActive  = selectedIdx === globalIdx;
                      return (
                        <TouchableOpacity
                          key={colIdx}
                          style={[s.iconCell, { width: CELL_WIDTH }]}
                          onPress={() => setSelectedIdx(isActive ? null : globalIdx)}
                          activeOpacity={0.75}
                        >
                          {/* Illustrated circle (screenshot style) */}
                          <View style={[
                            s.iconCircle,
                            { backgroundColor: item.bg },
                            isActive && s.iconCircleActive,
                          ]}>
                            <SvcIcon item={item} size={28} />
                          </View>
                          <Text style={s.iconLabel} numberOfLines={2}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>

          {/* Page dots */}
          <View style={s.dotsRow}>
            {PAGES.map((_, i) => (
              <View
                key={i}
                style={[s.dot, i === dotPage ? s.dotActive : s.dotOff]}
              />
            ))}
          </View>

          {/* Expanded detail panel */}
          {selectedIdx !== null && (
            <View style={s.detailPanel}>
              <View style={s.detailHeader}>
                <Text style={s.detailTitle}>{SERVICE_DETAILS[selectedIdx]?.title}</Text>
                <TouchableOpacity onPress={() => setSelectedIdx(null)}>
                  <Ionicons name="close-circle" size={20} color={C.muted} />
                </TouchableOpacity>
              </View>
              <View style={s.detailSep} />
              {SERVICE_DETAILS[selectedIdx]?.items.map((item, i) => (
                <View key={i} style={s.detailRow}>
                  <View style={s.detailBullet} />
                  <Text style={s.detailText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ══════════════════════════════════════════════════════════
            SECTION 2 — Patient Stories
        ══════════════════════════════════════════════════════════ */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Patient Stories</Text>
          <View style={s.divider} />

          <View style={s.recoRow}>
            <Text style={s.recoLabel}>Recommendation</Text>
            <View style={s.thumbCircle}>
              <Ionicons name="thumbs-up" size={13} color={C.green} />
            </View>
          </View>

          {STORIES.map((st, i) => (
            <StatBar key={i} label={st.label} value={st.value} />
          ))}

          {/* Quote cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingRight: 4 }}
            style={{ marginTop: 14 }}
          >
            {[
              { name: 'Adaeze O.',  text: 'Excellent care from the emergency team. Very professional.', stars: 5 },
              { name: 'Emeka J.',   text: 'The doctors explained everything clearly. Highly recommend!', stars: 5 },
              { name: 'Fatima B.',  text: 'Modern facilities and compassionate nursing team.',            stars: 4 },
            ].map((q, i) => (
              <View key={i} style={[s.quoteCard, { width: width * 0.65 }]}>
                <View style={{ flexDirection: 'row', gap: 2, marginBottom: 6 }}>
                  {Array.from({ length: q.stars }).map((_, j) => (
                    <Ionicons key={j} name="star" size={12} color="#f59e0b" />
                  ))}
                </View>
                <Text style={s.quoteText}>"{q.text}"</Text>
                <Text style={s.quoteName}>— {q.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ══════════════════════════════════════════════════════════
            SECTION 2.5 — Payment Plan Cards (Silver / Gold / Platinum)
            Card layout from screenshot:
              icon top-left · 3-dot menu top-right
              decorative circle bottom-right
              plan name bold bottom-left
        ══════════════════════════════════════════════════════════ */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Health Plans</Text>
          <View style={s.divider} />
          <Text style={s.sectionSub}>
            Pick a plan and pay securely to activate your coverage
          </Text>

          {/* Horizontal scroll of 3 cards — partially peeks next card */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={CARD_W + 14}
            snapToAlignment="start"
            contentContainerStyle={{ gap: 14, paddingRight: 20 }}
            style={{ marginHorizontal: -18, paddingLeft: 18, marginTop: 4 }}
          >
            {PAYMENT_PLANS.map((plan, pi) => (
              <View key={pi} style={{ width: CARD_W }}>

                {/* ── Main card (screenshot pattern) ── */}
                <View style={[pc.card, { backgroundColor: plan.gradient[0] }]}>

                  {/* Popular badge */}
                  {plan.popular && (
                    <View style={pc.popularBadge}>
                      <Text style={pc.popularText}>Most Popular</Text>
                    </View>
                  )}

                  {/* Top row: icon + 3-dot */}
                  <View style={pc.cardTopRow}>
                    <View style={pc.cardIconWrap}>
                      <MaterialCommunityIcons
                        name={plan.icon as any}
                        size={30}
                        color={plan.textColor}
                      />
                    </View>
                    <TouchableOpacity
                      style={pc.dotsBtn}
                      onPress={() => setExpandedPlan(expandedPlan === pi ? null : pi)}
                      activeOpacity={0.7}
                    >
                      <Text style={[pc.dotsText, { color: plan.textColor }]}>⋮</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Price in the middle */}
                  <View style={pc.priceRow}>
                    <Text style={[pc.price, { color: plan.textColor }]}>{plan.price}</Text>
                    <Text style={[pc.pricePeriod, { color: plan.subColor }]}>{plan.period}</Text>
                  </View>

                  {/* Decorative circle bottom-right (screenshot pattern) */}
                  <View style={[pc.decCircleLg, { backgroundColor: plan.gradient[1] }]} />
                  <View style={[pc.decCircleSm, { backgroundColor: plan.gradient[1] }]} />

                  {/* Plan name bottom-left (screenshot bold title) */}
                  <View style={pc.cardBottomRow}>
                    <View>
                      <Text style={[pc.tierName, { color: plan.textColor }]}>{plan.tier}</Text>
                      <Text style={[pc.tagline, { color: plan.subColor }]}>{plan.tagline}</Text>
                    </View>
                  </View>
                </View>

                {/* ── Expanded features + Pay button (shown on 3-dot tap) ── */}
                {expandedPlan === pi && (
                  <View style={pc.featurePanel}>
                    <Text style={pc.featurePanelTitle}>What's included</Text>
                    {plan.features.map((f, fi) => (
                      <View key={fi} style={pc.featureRow}>
                        <View style={[pc.featureDot, { backgroundColor: plan.gradient[0] }]} />
                        <Text style={pc.featureText}>{f}</Text>
                      </View>
                    ))}

                    {/* Payment CTA */}
                    <TouchableOpacity
                      style={[pc.payBtn, { backgroundColor: plan.gradient[0] }]}
                      onPress={() => Linking.openURL(plan.payUrl)}
                      activeOpacity={0.88}
                    >
                      <MaterialCommunityIcons name="credit-card-outline" size={17} color="#fff" />
                      <Text style={pc.payBtnText}>Pay for {plan.tier} Plan</Text>
                      <Ionicons name="arrow-forward" size={15} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={pc.collapseBtn}
                      onPress={() => setExpandedPlan(null)}
                      activeOpacity={0.7}
                    >
                      <Text style={pc.collapseTxt}>Close</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* ── Quick Pay button always visible below card ── */}
                {expandedPlan !== pi && (
                  <TouchableOpacity
                    style={[pc.quickPayBtn, { borderColor: plan.gradient[0] }]}
                    onPress={() => Linking.openURL(plan.payUrl)}
                    activeOpacity={0.85}
                  >
                    <MaterialCommunityIcons
                      name="credit-card-check-outline"
                      size={16}
                      color={plan.gradient[0]}
                    />
                    <Text style={[pc.quickPayTxt, { color: plan.gradient[0] }]}>
                      Subscribe Now
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ══════════════════════════════════════════════════════════
            SECTION 3 — Packages plan comparison
        ══════════════════════════════════════════════════════════ */}
        <View style={[s.section, { marginBottom: 24 }]}>
          <Text style={s.sectionTitle}>Our Packages</Text>
          <View style={s.divider} />
          <Text style={s.sectionSub}>Choose a healthcare plan that works for you</Text>

          {/* Tab toggle */}
          <View style={s.planTabs}>
            {PLAN_TABS.map((tab, i) => (
              <TouchableOpacity
                key={i}
                style={[s.planTab, i === activePlan && s.planTabOn]}
                onPress={() => setActivePlan(i)}
                activeOpacity={0.8}
              >
                <Text style={[s.planTabTxt, i === activePlan && s.planTabTxtOn]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Column headers */}
          <View style={[s.planRow, { marginBottom: 4 }]}>
            <View style={{ flex: 1 }} />
            {PLAN_TABS.map((t, i) => (
              <View key={i} style={[s.planColHead, i === activePlan && s.planColHeadOn]}>
                <Text style={[s.planColHeadTxt, i === activePlan && { color: C.primary, fontWeight: '800' }]}>
                  {t}
                </Text>
              </View>
            ))}
          </View>

          {/* Feature rows */}
          {PLAN_FEATURES.map((feat, fi) => (
            <View key={fi} style={[s.planRow, fi % 2 === 0 && { backgroundColor: '#f8faff', borderRadius: 10 }]}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={s.featTitle}>{feat.title}</Text>
                <Text style={s.featSub}>{feat.sub}</Text>
              </View>
              {feat.plans.map((has, pi) => (
                <View key={pi} style={s.planCheckCol}>
                  <View style={[
                    s.checkCircle,
                    {
                      backgroundColor: has
                        ? (pi === activePlan ? C.primary : '#dbeafe')
                        : '#f3f4f6',
                    },
                  ]}>
                    <Ionicons
                      name={has ? 'checkmark' : 'remove'}
                      size={13}
                      color={has ? (pi === activePlan ? C.white : C.primary) : C.muted}
                    />
                  </View>
                </View>
              ))}
            </View>
          ))}

          {/* CTA */}
          <TouchableOpacity
            style={s.cta}
            onPress={() => navigation?.navigate?.('Packages')}
            activeOpacity={0.88}
          >
            <Text style={s.ctaTxt}>Get {PLAN_TABS[activePlan]} Plan</Text>
            <Ionicons name="arrow-forward" size={16} color={C.white} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:       { flex: 1, backgroundColor: C.bg },

  // Top bar
  topBar:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  backBtn:    { width: 38, height: 38, borderRadius: 19, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' },
  topBarTitle:{ fontSize: 17, fontWeight: '700', color: C.text },

  // Section card
  section:    { backgroundColor: C.white, marginHorizontal: 16, marginTop: 16, borderRadius: 20, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  sectionTitle:{ fontSize: 17, fontWeight: '800', color: C.text, marginBottom: 6 },
  divider:    { width: 36, height: 3, backgroundColor: C.primary, borderRadius: 2, marginBottom: 10 },
  sectionSub: { fontSize: 12, color: C.sub, lineHeight: 18, marginBottom: 14 },

  // Icon grid — rows
  iconRow:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },

  // Each icon cell
  iconCell:   { alignItems: 'center', paddingVertical: 6 },
  iconCircle: {
    width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 8,
    // soft shadow so circles look lifted like screenshot
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
  },
  iconCircleActive: { borderWidth: 2.5, borderColor: C.primary },
  iconLabel:  { fontSize: 10, color: C.sub, textAlign: 'center', fontWeight: '500', lineHeight: 13 },

  // Page dots
  dotsRow:    { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 14 },
  dot:        { height: 6, borderRadius: 3 },
  dotActive:  { width: 18, backgroundColor: C.primary },
  dotOff:     { width: 6,  backgroundColor: '#d1d5db' },

  // Detail panel
  detailPanel:{ marginTop: 14, backgroundColor: C.bg, borderRadius: 14, padding: 14, borderLeftWidth: 3, borderLeftColor: C.primary },
  detailHeader:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  detailTitle:{ fontSize: 14, fontWeight: '700', color: C.text },
  detailSep:  { height: 1, backgroundColor: C.border, marginBottom: 10 },
  detailRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 7 },
  detailBullet:{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.primary, marginTop: 5 },
  detailText: { fontSize: 13, color: C.sub, flex: 1, lineHeight: 19 },

  // Patient stories
  recoRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  recoLabel:  { fontSize: 13, fontWeight: '700', color: C.text },
  thumbCircle:{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center' },
  quoteCard:  { backgroundColor: C.bg, borderRadius: 14, padding: 14 },
  quoteText:  { fontSize: 12, color: C.sub, lineHeight: 18, fontStyle: 'italic', marginBottom: 6 },
  quoteName:  { fontSize: 11, fontWeight: '700', color: C.text },

  // Packages
  planTabs:   { flexDirection: 'row', backgroundColor: C.bg, borderRadius: 50, padding: 4, marginBottom: 16, gap: 4 },
  planTab:    { flex: 1, paddingVertical: 9, borderRadius: 50, alignItems: 'center' },
  planTabOn:  { backgroundColor: C.primary },
  planTabTxt: { fontSize: 13, fontWeight: '600', color: C.muted },
  planTabTxtOn:{ color: C.white, fontWeight: '700' },

  planColHead:   { width: 46, alignItems: 'center', paddingVertical: 6, borderRadius: 8 },
  planColHeadOn: { backgroundColor: '#eff6ff' },
  planColHeadTxt:{ fontSize: 12, fontWeight: '600', color: C.muted },

  planRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, marginBottom: 2 },
  featTitle:  { fontSize: 12, fontWeight: '700', color: C.text, marginBottom: 2 },
  featSub:    { fontSize: 10, color: C.muted, lineHeight: 14 },
  planCheckCol:{ width: 46, alignItems: 'center' },
  checkCircle:{ width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },

  cta:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.primary, borderRadius: 50, paddingVertical: 15, marginTop: 18, elevation: 4, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  ctaTxt:     { color: C.white, fontSize: 15, fontWeight: '700' },
});

// Card width for horizontal plan cards
const CARD_W = 220;

// Payment card styles (pc)
const pc = StyleSheet.create({
  card: { borderRadius: 14, padding: 14, overflow: 'hidden' },
  popularBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  popularText: { fontSize: 11, fontWeight: '700', color: '#111' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardIconWrap: { width: 46, height: 46, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)' },
  dotsBtn: { padding: 6 },
  dotsText: { fontSize: 18 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 10 },
  price: { fontSize: 22, fontWeight: '900' },
  pricePeriod: { fontSize: 12, marginLeft: 6 },
  decCircleLg: { position: 'absolute', width: 90, height: 90, borderRadius: 45, right: -28, bottom: -28, opacity: 0.9 },
  decCircleSm: { position: 'absolute', width: 50, height: 50, borderRadius: 25, right: -6, bottom: -6, opacity: 0.9 },
  cardBottomRow: { marginTop: 34 },
  tierName: { fontSize: 16, fontWeight: '900' },
  tagline: { fontSize: 12, marginTop: 2 },
  featurePanel: { backgroundColor: C.bg, padding: 12, borderRadius: 12, marginTop: 10 },
  featurePanelTitle: { fontSize: 14, fontWeight: '800', marginBottom: 8, color: C.text },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  featureDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  featureText: { fontSize: 13, color: C.sub, flex: 1 },
  payBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, borderRadius: 10, marginTop: 8 },
  payBtnText: { color: '#fff', fontWeight: '800' },
  collapseBtn: { marginTop: 8, alignItems: 'center' },
  collapseTxt: { color: C.muted, fontWeight: '700' },
  quickPayBtn: { marginTop: 10, borderWidth: 1, borderRadius: 10, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  quickPayTxt: { fontSize: 13, fontWeight: '800' },
});