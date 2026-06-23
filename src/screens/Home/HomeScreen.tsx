// HOMESCREEN.TSX
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Linking,
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

// ── Hospital location (replace with real coords) ─────────────────────────────
const HOSPITAL_LAT  = 6.4281;
const HOSPITAL_LNG  = 3.4219;
const WHATSAPP_NUM  = '2348000000000'; // replace with real number

// ── Colour tokens ─────────────────────────────────────────────────────────────
const C = {
  primary:   '#1378e5',
  primaryDk: '#0f5bbf',
  secondary: '#177fed',
  red:       '#ef4444',
  white:     '#ffffff',
  bg:        '#f5f8ff',
  border:    '#e2eaf5',
  text:      '#1a2340',
  sub:       '#5a6a85',
  muted:     '#8898aa',
  star:      '#f59e0b',
};

// ── Carousel images (hero slides) ─────────────────────────────────────────────
// Using the doctor image asset — add more paths to the array for a real carousel
const HERO_IMAGES = [
  require('../../../assets/images/hero-doctor.jpg'),
  require('../../../assets/images/hero-doctor.jpg'), // swap in real additional images
];

// ── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { icon: 'people',    value: '116+', label: 'Patients'  },
  { icon: 'schedule',  value: '3+',   label: 'Years'     },
  { icon: 'star',      value: '4.9',  label: 'Rating'    },
  { icon: 'chat',      value: '90+',  label: 'Reviews'   },
];

// ── Quick-nav items ───────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Find Out\nMore',    route: 'About',    renderIcon: () => <Ionicons    name="information-circle-outline" size={26} color={C.primary} /> },
  { label: 'Our\nServices',     route: 'Services', renderIcon: () => <FontAwesome5 name="stethoscope"               size={22} color={C.primary} /> },
  { label: 'Our\nPackages',     route: 'Packages', renderIcon: () => <MaterialIcons name="medical-services"         size={26} color={C.primary} /> },
  { label: 'Book\nNow',         route: 'Book',     renderIcon: () => <MaterialIcons name="event-available"          size={26} color={C.primary} /> },
];

// ── About text ────────────────────────────────────────────────────────────────
const ABOUT_FULL =
  'Etta-Atlantic Memorial Hospital Lekki Lagos is the best hospital in Lagos, Nigeria. ' +
  'Our standards are in line with the World Health Organization and principled on ' +
  'evidence-based medicine. We have teamed up with highly qualified physicians and ' +
  'health professionals to provide excellent care to all our patients.';

// ── API ───────────────────────────────────────────────────────────────────────
const API_BASE = 'https://hospitalback-clean-0fre.onrender.com/api';

async function fetchLatestPost() {
  const res  = await fetch(`${API_BASE}/hospital/blog/latest/?limit=1`);
  if (!res.ok) throw new Error('Network error');
  const data = await res.json();
  const list = Array.isArray(data) ? data : (data.results ?? []);
  return list[0] ?? null;
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface HomeScreenProps {
  navigation?: any;
  onMenuPress?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation, onMenuPress }: HomeScreenProps) {
  const [activeIndex,    setActiveIndex]    = useState(0);
  const [isSaved,        setIsSaved]        = useState(false);
  const [aboutExpanded,  setAboutExpanded]  = useState(false);
  const [post,           setPost]           = useState<any>(null);
  const [loadingPost,    setLoadingPost]    = useState(true);

  const navigate = (route: string) => navigation?.navigate?.(route);

  // carousel scroll tracker
  const onCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  // blog post
  const loadPost = useCallback(async () => {
    try {
      setLoadingPost(true);
      setPost(await fetchLatestPost());
    } catch {
      setPost(null);
    } finally {
      setLoadingPost(false);
    }
  }, []);

  useEffect(() => { loadPost(); }, [loadPost]);

  const handleContact = () => {
    const msg = 'Hi! I\'d like to enquire about Etta-Atlantic Memorial Hospital services.';
    Linking.openURL(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`);
  };

  // OpenStreetMap embed URL
  const mapUrl =
    `https://www.openstreetmap.org/export/embed.html` +
    `?bbox=${HOSPITAL_LNG - 0.003}%2C${HOSPITAL_LAT - 0.003}` +
    `%2C${HOSPITAL_LNG + 0.003}%2C${HOSPITAL_LAT + 0.003}` +
    `&layer=mapnik&marker=${HOSPITAL_LAT}%2C${HOSPITAL_LNG}`;

  const isLongAbout   = ABOUT_FULL.length > 130;
  const displayAbout  = aboutExpanded ? ABOUT_FULL : ABOUT_FULL.slice(0, 130);

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ════════════════════════════════════════════════════════════
            HERO — full-width image carousel (Abeeshak pattern)
        ════════════════════════════════════════════════════════════ */}
        <View>
          <FlatList
            data={HERO_IMAGES}
            keyExtractor={(_, i) => i.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onCarouselScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <Image source={item} style={styles.heroImage} resizeMode="cover" />
            )}
          />

          {/* Image count badge — top-right */}
          <View style={styles.imageBadge}>
            <Text style={styles.imageBadgeText}>
              {activeIndex + 1}/{HERO_IMAGES.length}
            </Text>
          </View>

          {/* Dot indicators */}
          {HERO_IMAGES.length > 1 && (
            <View style={styles.dotsRow}>
              {HERO_IMAGES.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === activeIndex ? styles.dotActive : styles.dotInactive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Back + Save — overlaid on image (Abeeshak pattern) */}
          <SafeAreaView style={styles.heroOverlay}>
            <View style={styles.heroOverlayRow}>
              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => navigation?.goBack?.()}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={20} color={C.text} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => setIsSaved(v => !v)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isSaved ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isSaved ? C.red : C.text}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* ════════════════════════════════════════════════════════════
            CONTENT — white card area below image
        ════════════════════════════════════════════════════════════ */}
        <View style={styles.content}>

          {/* ── Badges row ── */}
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Hospital</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#fef9ee' }]}>
              <Text style={[styles.badgeText, { color: C.star }]}>⭐ Featured</Text>
            </View>
          </View>

          {/* ── Name + Specialty ── */}
          <Text style={styles.heroName}>Etta-Atlantic Memorial Hospital</Text>
          <Text style={styles.heroSpec}>Specialist Physicians · Ikate Lekki, Lagos</Text>

          {/* ── Rating pill ── */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={C.star} />
            <Text style={styles.ratingText}>4.9  </Text>
            <Text style={styles.ratingCount}>(96 reviews)</Text>
          </View>

          {/* ── Stats row (Abeeshak spec-row pattern) ── */}
          <View style={styles.statsCard}>
            {STATS.map((s, i) => (
              <View key={i} style={[styles.statItem, i < STATS.length - 1 && styles.statBorder]}>
                <View style={styles.statIconWrap}>
                  <MaterialIcons name={s.icon as any} size={18} color={C.primary} />
                </View>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* ── Quick-nav icon grid ── */}
          <View style={styles.navGrid}>
            {NAV_ITEMS.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.navItem}
                onPress={() => navigate(item.route)}
                activeOpacity={0.7}
              >
                <View style={styles.navIconCircle}>{item.renderIcon()}</View>
                <Text style={styles.navLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── About section ── */}
          <Text style={styles.sectionTitle}>About Us</Text>
          <View style={styles.sectionDivider} />
          <Text style={styles.aboutText}>
            {displayAbout}
            {!aboutExpanded && isLongAbout && (
              <Text onPress={() => setAboutExpanded(true)}>
                {'... '}
                <Text style={styles.link}>Read More</Text>
              </Text>
            )}
          </Text>
          {aboutExpanded && (
            <TouchableOpacity onPress={() => navigate('About')} activeOpacity={0.8}>
              <Text style={[styles.link, { marginTop: 6 }]}>View Full About Page →</Text>
            </TouchableOpacity>
          )}

          {/* ── About feature cards (horizontal scroll) ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.aboutCardsScroll}
            style={{ marginTop: 14 }}
          >
            {[
              { title: 'Professional Team',   icon: 'people',         desc: 'Highly qualified physicians and health professionals providing excellent care.',        bg: C.primary   },
              { title: 'Advanced Technology', icon: 'devices',        desc: 'Electronic medical records and telemedicine for fast, quality healthcare delivery.',    bg: C.secondary },
              { title: 'Great Facilities',    icon: 'local-hospital', desc: 'World-class equipment: BiPAP, CTG, ultrasound, ECG, cardiac monitors and more.',       bg: C.red       },
            ].map((card, i) => (
              <View key={i} style={[styles.aboutCard, { backgroundColor: card.bg }]}>
                <MaterialIcons name={card.icon as any} size={26} color={C.white} />
                <Text style={styles.aboutCardTitle}>{card.title}</Text>
                <Text style={styles.aboutCardDesc}>{card.desc}</Text>
              </View>
            ))}
          </ScrollView>

          {/* ── Contact / Book CTA (Abeeshak "Contact Agent" button) ── */}
          <TouchableOpacity style={styles.contactBtn} onPress={handleContact} activeOpacity={0.85}>
            <Ionicons name="logo-whatsapp" size={20} color={C.white} />
            <Text style={styles.contactBtnText}>Contact Us on WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => navigate('Book')}
            activeOpacity={0.85}
          >
            <MaterialIcons name="event-available" size={20} color={C.primary} />
            <Text style={styles.bookBtnText}>Book Appointment</Text>
          </TouchableOpacity>

          {/* ── Post of the Week ── */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Post of the Week</Text>
          <View style={styles.sectionDivider} />

          {loadingPost ? (
            <ActivityIndicator color={C.primary} style={{ marginVertical: 24 }} />
          ) : post ? (
            <View>
              {post.featured_image && (
                <Image
                  source={{ uri: post.featured_image }}
                  style={styles.blogImage}
                  resizeMode="cover"
                />
              )}
              <Text style={styles.blogTitle}>{post.title}</Text>
              <View style={styles.blogAccent} />
              <Text style={styles.blogDesc} numberOfLines={4}>
                {post.description ?? post.short_description ?? ''}
              </Text>
              {Array.isArray(post.subheadings) && post.subheadings[0] && (
                <View style={styles.subSection}>
                  <Text style={styles.subTitle}>{post.subheadings[0].title}</Text>
                  <Text style={styles.subDesc} numberOfLines={3}>
                    {post.subheadings[0].description}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.blogBtn}
                onPress={() => navigate('BlogPost')}
                activeOpacity={0.85}
              >
                <Text style={styles.blogBtnText}>GET MORE DETAILS!</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noPost}>
              <Text style={{ fontSize: 36 }}>📝</Text>
              <Text style={styles.noPostTitle}>No Blog Posts Yet</Text>
              <Text style={styles.noPostSub}>Check back soon for updates!</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() => navigate('Blog')}
            activeOpacity={0.85}
          >
            <Text style={styles.viewAllText}>View All Blog Posts</Text>
          </TouchableOpacity>

          {/* ── Location (Abeeshak map pattern) ── */}
          <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Location</Text>
          <View style={styles.sectionDivider} />

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={C.muted} />
            <Text style={styles.locationText}>
              Ikate Lekki, Lagos, Nigeria
            </Text>
          </View>

          {/* Map preview — tap to expand (Abeeshak pattern) */}
          <TouchableOpacity
            onPress={() => navigate('Map')}
            activeOpacity={0.9}
            style={styles.mapWrap}
          >
            <WebView
              source={{ uri: mapUrl }}
              style={{ flex: 1 }}
              scrollEnabled={false}
              pointerEvents="none"
            />
            <View style={styles.mapExpandBadge}>
              <Ionicons name="expand-outline" size={12} color="#374151" />
              <Text style={styles.mapExpandText}>Tap to expand</Text>
            </View>
          </TouchableOpacity>

        </View>
        {/* end content */}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.white },

  // ── Hero carousel ──
  heroImage: { width, height: 300 },
  imageBadge: {
    position: 'absolute', bottom: 12, right: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20,
  },
  imageBadgeText: { color: C.white, fontSize: 11, fontWeight: '600' },
  dotsRow: {
    position: 'absolute', bottom: 12,
    left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', gap: 5,
  },
  dot:         { height: 6, borderRadius: 3 },
  dotActive:   { width: 16, backgroundColor: C.white },
  dotInactive: { width: 6,  backgroundColor: 'rgba(255,255,255,0.45)' },

  // ── Overlay buttons ──
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  heroOverlayRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 8,
  },
  circleBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: C.white,
    justifyContent: 'center', alignItems: 'center',
    elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 4,
  },

  // ── Content area ──
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },

  // Badges
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  badge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { color: C.primary, fontSize: 11, fontWeight: '700' },

  // Name / spec
  heroName: { fontSize: 22, fontWeight: '800', color: C.text, lineHeight: 28, marginBottom: 4 },
  heroSpec: { fontSize: 13, color: C.sub, marginBottom: 8 },

  // Rating
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  ratingText: { fontSize: 13, fontWeight: '700', color: C.text, marginLeft: 4 },
  ratingCount: { fontSize: 12, color: C.muted },

  // Stats (Abeeshak spec-row)
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#f8faff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  statItem:   { flex: 1, alignItems: 'center', gap: 3 },
  statBorder: { borderRightWidth: 1, borderRightColor: C.border },
  statIconWrap: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#eff6ff',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 2,
  },
  statValue: { fontSize: 14, fontWeight: '700', color: C.text },
  statLabel: { fontSize: 10, color: C.muted },

  // Nav grid
  navGrid: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#f8faff',
    borderRadius: 16, paddingVertical: 16, paddingHorizontal: 8,
    marginBottom: 20,
  },
  navItem:       { alignItems: 'center', gap: 7 },
  navIconCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#eff6ff',
    justifyContent: 'center', alignItems: 'center',
  },
  navLabel: { fontSize: 10, color: C.sub, textAlign: 'center', fontWeight: '500', lineHeight: 15 },

  // Section heading
  sectionTitle:   { fontSize: 17, fontWeight: '700', color: C.text, marginBottom: 6 },
  sectionDivider: { width: 36, height: 3, backgroundColor: C.primary, borderRadius: 2, marginBottom: 12 },

  // About
  aboutText: { fontSize: 13, color: C.sub, lineHeight: 21 },
  link:      { color: C.primary, fontWeight: '600', fontSize: 13 },

  aboutCardsScroll: { gap: 10, paddingRight: 4 },
  aboutCard: {
    width: width * 0.60, borderRadius: 14,
    padding: 14, gap: 7, marginRight: 2,
  },
  aboutCardTitle: { color: C.white, fontWeight: '700', fontSize: 13 },
  aboutCardDesc:  { color: 'rgba(255,255,255,0.85)', fontSize: 11, lineHeight: 17 },

  // Contact (WhatsApp — Abeeshak style)
  contactBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#25D366',
    borderRadius: 16, paddingVertical: 15,
    marginTop: 18,
    elevation: 4,
    shadowColor: '#25D366', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
  },
  contactBtnText: { color: C.white, fontWeight: '700', fontSize: 15 },

  // Book btn (outlined — secondary action)
  bookBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: C.primary,
    borderRadius: 16, paddingVertical: 14,
    marginTop: 10,
  },
  bookBtnText: { color: C.primary, fontWeight: '700', fontSize: 15 },

  // Blog
  blogImage:   { width: '100%', height: 160, borderRadius: 14, marginBottom: 12 },
  blogTitle:   { fontSize: 19, fontWeight: '700', color: C.text, lineHeight: 25 },
  blogAccent:  { width: 40, height: 3, backgroundColor: C.primary, borderRadius: 2, marginVertical: 8 },
  blogDesc:    { fontSize: 13, color: C.sub, lineHeight: 20, marginBottom: 10 },
  subSection:  { backgroundColor: '#f8faff', borderRadius: 10, padding: 12, marginBottom: 12 },
  subTitle:    { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 4 },
  subDesc:     { fontSize: 12, color: C.sub, lineHeight: 18 },
  blogBtn: {
    backgroundColor: C.primary, borderRadius: 50,
    paddingVertical: 11, alignItems: 'center', marginBottom: 10,
  },
  blogBtnText: { color: C.white, fontWeight: '700', fontSize: 12, letterSpacing: 0.6 },
  noPost:      { alignItems: 'center', paddingVertical: 24 },
  noPostTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginTop: 8 },
  noPostSub:   { fontSize: 12, color: C.muted, marginTop: 4 },
  viewAllBtn: {
    borderWidth: 1.5, borderColor: C.primary,
    borderRadius: 50, paddingVertical: 11,
    alignItems: 'center', marginTop: 4, marginBottom: 4,
  },
  viewAllText: { color: C.primary, fontWeight: '700', fontSize: 13 },

  // Location
  locationRow:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  locationText: { fontSize: 13, color: C.sub, flex: 1 },

  // Map (Abeeshak pattern)
  mapWrap: {
    height: 200, borderRadius: 16,
    overflow: 'hidden', marginBottom: 6,
  },
  mapExpandBadge: {
    position: 'absolute', bottom: 10, right: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20,
  },
  mapExpandText: { fontSize: 11, color: '#374151', fontWeight: '500' },
  muted: { color: C.muted },
});