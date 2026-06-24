// src/screens/Home/HomeScreen.tsx
// Change from original: back arrow replaced with SignOut SVG icon.
// Behaviour on press is identical — navigation.goBack() — leading back to the Auth/Sign-in screen.
// No useAuth / AuthContext dependency (to be wired up later).

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

// ── Hospital location ─────────────────────────────────────────────────────────
const HOSPITAL_LAT = 6.4281;
const HOSPITAL_LNG = 3.4219;
const WHATSAPP_NUM = '2348000000000';

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

// ── Hero carousel images ──────────────────────────────────────────────────────
const HERO_IMAGES = [
  require('../../../assets/images/hero-doctor.jpg'),
  require('../../../assets/images/hospitaldoctor4.png'),
  require('../../../assets/images/hospitaldoctor5.png'),
];

// ── Sign-out SVG icon ─────────────────────────────────────────────────────────
const SignOutIcon = ({ color = C.text }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path
      fill={color}
      d="M12.232 3.25H9.768c-.813 0-1.469 0-2 .043c-.546.045-1.026.14-1.47.366a3.75 3.75 0 0 0-1.64 1.639c-.226.444-.32.924-.365 1.47c-.043.531-.043 1.187-.043 2v6.464c0 .813 0 1.469.043 2c.045.546.14 1.026.366 1.47a3.75 3.75 0 0 0 1.639 1.64c.444.226.924.32 1.47.365c.531.043 1.187.043 2 .043h2.464c.813 0 1.469 0 2-.043c.546-.045 1.026-.14 1.47-.366a3.75 3.75 0 0 0 1.64-1.639c.226-.444.32-.924.365-1.47c.043-.531.043-1.187.043-2V15a.75.75 0 0 0-1.5 0v.2c0 .852 0 1.447-.038 1.91c-.038.453-.107.714-.207.912c-.216.423-.56.767-.983.983c-.198.1-.459.17-.913.207c-.462.037-1.056.038-1.909.038H9.8c-.852 0-1.447 0-1.91-.038c-.453-.038-.714-.107-.911-.207a2.25 2.25 0 0 1-.984-.983c-.1-.198-.17-.459-.207-.913c-.037-.462-.038-1.057-.038-1.909V8.8c0-.852 0-1.447.038-1.91c.037-.453.107-.714.207-.911a2.25 2.25 0 0 1 .984-.984c.197-.1.458-.17.912-.207c.462-.037 1.057-.038 1.909-.038h2.4c.853 0 1.447 0 1.91.038c.453.037.714.107.912.207c.423.216.767.56.983.984c.1.197.17.458.207.912c.037.462.038 1.057.038 1.909V9a.75.75 0 0 0 1.5 0v-.232c0-.813 0-1.469-.043-2c-.045-.546-.14-1.026-.366-1.47a3.75 3.75 0 0 0-1.639-1.64c-.444-.226-.924-.32-1.47-.365c-.531-.043-1.187-.043-2-.043"
    />
    <Path
      fill={color}
      d="M12.47 8.47a.75.75 0 1 1 1.06 1.06l-1.72 1.72H20a.75.75 0 0 1 0 1.5h-8.19l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06z"
    />
  </Svg>
);

// ── Notification bell SVG icon ────────────────────────────────────────────────
const NotificationIcon = ({ color = C.text }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path
      fill={color}
      fillRule="evenodd"
      d="M12 1a2 2 0 0 0-1.98 2.284A7 7 0 0 0 5 10v8H4a1 1 0 1 0 0 2h16a1 1 0 1 0 0-2h-1v-8a7 7 0 0 0-5.02-6.716Q14 3.144 14 3a2 2 0 0 0-2-2m2 21a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1"
      clipRule="evenodd"
    />
  </Svg>
);

// ── Profile / person SVG icon ─────────────────────────────────────────────────
const ProfileIcon = ({ color = C.text }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path
      fill={color}
      fillRule="evenodd"
      d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z"
      clipRule="evenodd"
    />
  </Svg>
);

// ── Stat SVG icons ────────────────────────────────────────────────────────────
const PatientStatIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 512 512">
    <Path fill={color} d="M336 256c-20.56 0-40.44-9.18-56-25.84c-15.13-16.25-24.37-37.92-26-61c-1.74-24.62 5.77-47.26 21.14-63.76S312 80 336 80c23.83 0 45.38 9.06 60.7 25.52c15.47 16.62 23 39.22 21.26 63.63c-1.67 23.11-10.9 44.77-26 61C376.44 246.82 356.57 256 336 256m131.83 176H204.18a27.71 27.71 0 0 1-22-10.67a30.22 30.22 0 0 1-5.26-25.79c8.42-33.81 29.28-61.85 60.32-81.08C264.79 297.4 299.86 288 336 288c36.85 0 71 9 98.71 26.05c31.11 19.13 52 47.33 60.38 81.55a30.27 30.27 0 0 1-5.32 25.78A27.68 27.68 0 0 1 467.83 432M147 260c-35.19 0-66.13-32.72-69-72.93c-1.42-20.6 5-39.65 18-53.62c12.86-13.83 31-21.45 51-21.45s38 7.66 50.93 21.57c13.1 14.08 19.5 33.09 18 53.52c-2.87 40.2-33.8 72.91-68.93 72.91m65.66 31.45c-17.59-8.6-40.42-12.9-65.65-12.9c-29.46 0-58.07 7.68-80.57 21.62c-25.51 15.83-42.67 38.88-49.6 66.71a27.39 27.39 0 0 0 4.79 23.36A25.32 25.32 0 0 0 41.72 400h111a8 8 0 0 0 7.87-6.57c.11-.63.25-1.26.41-1.88c8.48-34.06 28.35-62.84 57.71-83.82a8 8 0 0 0-.63-13.39c-1.57-.92-3.37-1.89-5.42-2.89" />
  </Svg>
);

const YearsStatIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path fill={color} d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7z" />
  </Svg>
);

const RatingStatIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path fill={color} d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z" />
  </Svg>
);

const ReviewsStatIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 2048 2048">
    <Path fill={color} d="m448 768l-320 320V768H0V128h1664v640zm-64 256h1664v640h-128v320l-320-320H384z" />
  </Svg>
);

// ── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { Icon: PatientStatIcon, value: '116+', label: 'Patients' },
  { Icon: YearsStatIcon,   value: '3+',   label: 'Years'    },
  { Icon: RatingStatIcon,  value: '4.9',  label: 'Rating'   },
  { Icon: ReviewsStatIcon, value: '90+',  label: 'Reviews'  },
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
export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [activeIndex,   setActiveIndex]   = useState(0);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [post,          setPost]          = useState<any>(null);
  const [loadingPost,   setLoadingPost]   = useState(true);

  const flatListRef = useRef<FlatList>(null);

  const navigate = (route: string) => navigation?.navigate?.(route);

  // ── Auto-slide every 4 s ──────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % HERO_IMAGES.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const onCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  // ── Blog post ─────────────────────────────────────────────────────────────
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
    const msg = "Hi! I'd like to enquire about Etta-Atlantic Memorial Hospital services.";
    Linking.openURL(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`);
  };

  const mapUrl =
    `https://www.openstreetmap.org/export/embed.html` +
    `?bbox=${HOSPITAL_LNG - 0.003}%2C${HOSPITAL_LAT - 0.003}` +
    `%2C${HOSPITAL_LNG + 0.003}%2C${HOSPITAL_LAT + 0.003}` +
    `&layer=mapnik&marker=${HOSPITAL_LAT}%2C${HOSPITAL_LNG}`;

  const isLongAbout  = ABOUT_FULL.length > 130;
  const displayAbout = aboutExpanded ? ABOUT_FULL : ABOUT_FULL.slice(0, 130);

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ══ HERO carousel ═══════════════════════════════════════════════════ */}
        <SafeAreaView style={styles.heroSafeArea}>
        <View>
          <FlatList
            ref={flatListRef}
            data={HERO_IMAGES}
            keyExtractor={(_, i) => i.toString()}
            horizontal pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onCarouselScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <View style={styles.heroSlide}>
                <Image source={item} style={styles.heroImage} resizeMode="cover" />
              </View>
            )}
          />

          {/* Image count badge */}
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

          {/* ── Overlay: SignOut (left) │ Notification + Profile (right) ── */}
          <View style={styles.heroOverlay}>
            <View style={styles.heroOverlayRow}>

              {/* LEFT — sign out, navigates back to sign-in */}
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => navigation?.goBack?.()}
                activeOpacity={0.7}
              >
                <SignOutIcon color={C.text} />
              </TouchableOpacity>

              {/* RIGHT — notification + profile, side by side */}
              <View style={styles.rightIconsRow}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => navigate('Notifications')}
                  activeOpacity={0.7}
                >
                  <NotificationIcon color={C.text} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => navigate('Profile')}
                  activeOpacity={0.7}
                >
                  <ProfileIcon color={C.text} />
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </View>
        </SafeAreaView>

        {/* ══ CONTENT ═════════════════════════════════════════════════════════ */}
        <View style={styles.content}>

          {/* Badges */}
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Hospital</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#fef9ee' }]}>
              <Text style={[styles.badgeText, { color: C.star }]}>⭐ Featured</Text>
            </View>
          </View>

          {/* Name + Specialty */}
          <Text style={styles.heroName}>Etta-Atlantic Memorial Hospital</Text>
          <Text style={styles.heroSpec}>Specialist Physicians · Ikate Lekki, Lagos</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={C.star} />
            <Text style={styles.ratingText}>4.9  </Text>
            <Text style={styles.ratingCount}>(96 reviews)</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsCard}>
            {STATS.map(({ Icon, value, label }, i) => (
              <View key={i} style={[styles.statItem, i < STATS.length - 1 && styles.statBorder]}>
                <View style={styles.statIconWrap}>
                  <Icon color={C.primary} />
                </View>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>

          {/* About */}
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

          {/* About feature cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.aboutCardsScroll}
            style={{ marginTop: 14 }}
          >
            {[
              { title: 'Professional Team',   icon: 'people',         desc: 'Highly qualified physicians and health professionals providing excellent care.',      bg: C.primary   },
              { title: 'Advanced Technology', icon: 'devices',        desc: 'Electronic medical records and telemedicine for fast, quality healthcare delivery.',  bg: C.secondary },
              { title: 'Great Facilities',    icon: 'local-hospital', desc: 'World-class equipment: BiPAP, CTG, ultrasound, ECG, cardiac monitors and more.',     bg: C.red       },
            ].map((card, i) => (
              <View key={i} style={[styles.aboutCard, { backgroundColor: card.bg }]}>
                <MaterialIcons name={card.icon as any} size={26} color={C.white} />
                <Text style={styles.aboutCardTitle}>{card.title}</Text>
                <Text style={styles.aboutCardDesc}>{card.desc}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Contact / Book CTAs */}
          <TouchableOpacity style={styles.contactBtn} onPress={handleContact} activeOpacity={0.85}>
            <Ionicons name="logo-whatsapp" size={20} color={C.white} />
            <Text style={styles.contactBtnText}>Contact Us on WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bookBtn} onPress={() => navigate('Book')} activeOpacity={0.85}>
            <MaterialIcons name="event-available" size={20} color={C.primary} />
            <Text style={styles.bookBtnText}>Book Appointment</Text>
          </TouchableOpacity>

          {/* Post of the Week */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Post of the Week</Text>
          <View style={styles.sectionDivider} />

          {loadingPost ? (
            <ActivityIndicator color={C.primary} style={{ marginVertical: 24 }} />
          ) : post ? (
            <View>
              {post.featured_image && (
                <Image source={{ uri: post.featured_image }} style={styles.blogImage} resizeMode="cover" />
              )}
              <Text style={styles.blogTitle}>{post.title}</Text>
              <View style={styles.blogAccent} />
              <Text style={styles.blogDesc} numberOfLines={4}>
                {post.description ?? post.short_description ?? ''}
              </Text>
              {Array.isArray(post.subheadings) && post.subheadings[0] && (
                <View style={styles.subSection}>
                  <Text style={styles.subTitle}>{post.subheadings[0].title}</Text>
                  <Text style={styles.subDesc} numberOfLines={3}>{post.subheadings[0].description}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.blogBtn} onPress={() => navigate('BlogPost')} activeOpacity={0.85}>
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

          <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigate('Blog')} activeOpacity={0.85}>
            <Text style={styles.viewAllText}>View All Blog Posts</Text>
          </TouchableOpacity>

          {/* Location */}
          <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Location</Text>
          <View style={styles.sectionDivider} />
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={C.muted} />
            <Text style={styles.locationText}>Ikate Lekki, Lagos, Nigeria</Text>
          </View>

          <TouchableOpacity onPress={() => navigate('Map')} activeOpacity={0.9} style={styles.mapWrap}>
            <WebView source={{ uri: mapUrl }} style={{ flex: 1 }} scrollEnabled={false} pointerEvents="none" />
            <View style={styles.mapExpandBadge}>
              <Ionicons name="expand-outline" size={12} color="#374151" />
              <Text style={styles.mapExpandText}>Tap to expand</Text>
            </View>
          </TouchableOpacity>

        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.white },

  // Wraps the entire hero block so the status-bar inset is respected,
  // pushing the image section down exactly like BlogScreen's SafeAreaView top bar.
  heroSafeArea: {
    backgroundColor: C.bg,
  },

  // paddingTop: 56 clears the floating icon row (≈ safe-area + icon height).
  // overflow: hidden keeps the image flush inside the slide bounds.
  heroSlide: {
    width,
    overflow: 'hidden',
    backgroundColor: C.bg,
    paddingTop: 56,
  },

  // Raw height raised by the same 56 px so the visible portrait area stays
  // at 340 px and nothing gets cropped.
  heroImage: { width, height: 396 },

  imageBadge: {
    position: 'absolute', bottom: 12, right: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  imageBadgeText: { color: C.white, fontSize: 11, fontWeight: '600' },

  dotsRow: {
    position: 'absolute', bottom: 12, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', gap: 5,
  },
  dot:         { height: 6, borderRadius: 3 },
  dotActive:   { width: 16, backgroundColor: C.white },
  dotInactive: { width: 6,  backgroundColor: 'rgba(255,255,255,0.45)' },

  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  heroOverlayRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 6,
  },

  rightIconsRow: {
    flexDirection: 'row',
    gap: 8,
  },

  // FIX 2 — stripped backgroundColor, elevation, and all shadow props.
  //          Only size + alignment remain so icons render bare over the image.
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },

  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  badge: { backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: C.primary, fontSize: 11, fontWeight: '700' },

  heroName: { fontSize: 22, fontWeight: '800', color: C.text, lineHeight: 28, marginBottom: 4 },
  heroSpec: { fontSize: 13, color: C.sub, marginBottom: 8 },

  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  ratingText:  { fontSize: 13, fontWeight: '700', color: C.text, marginLeft: 4 },
  ratingCount: { fontSize: 12, color: C.muted },

  statsCard: {
    flexDirection: 'row', backgroundColor: '#f8faff',
    borderRadius: 16, padding: 14, marginBottom: 16,
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

  sectionTitle:   { fontSize: 17, fontWeight: '700', color: C.text, marginBottom: 6 },
  sectionDivider: { width: 36, height: 3, backgroundColor: C.primary, borderRadius: 2, marginBottom: 12 },

  aboutText: { fontSize: 13, color: C.sub, lineHeight: 21 },
  link:      { color: C.primary, fontWeight: '600', fontSize: 13 },

  aboutCardsScroll: { gap: 10, paddingRight: 4 },
  aboutCard: { width: width * 0.60, borderRadius: 14, padding: 14, gap: 7, marginRight: 2 },
  aboutCardTitle: { color: C.white, fontWeight: '700', fontSize: 13 },
  aboutCardDesc:  { color: 'rgba(255,255,255,0.85)', fontSize: 11, lineHeight: 17 },

  contactBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#25D366', borderRadius: 16, paddingVertical: 15, marginTop: 18,
    elevation: 4, shadowColor: '#25D366', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
  },
  contactBtnText: { color: C.white, fontWeight: '700', fontSize: 15 },

  bookBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: C.primary, borderRadius: 16, paddingVertical: 14, marginTop: 10,
  },
  bookBtnText: { color: C.primary, fontWeight: '700', fontSize: 15 },

  blogImage:  { width: '100%', height: 160, borderRadius: 14, marginBottom: 12 },
  blogTitle:  { fontSize: 19, fontWeight: '700', color: C.text, lineHeight: 25 },
  blogAccent: { width: 40, height: 3, backgroundColor: C.primary, borderRadius: 2, marginVertical: 8 },
  blogDesc:   { fontSize: 13, color: C.sub, lineHeight: 20, marginBottom: 10 },
  subSection: { backgroundColor: '#f8faff', borderRadius: 10, padding: 12, marginBottom: 12 },
  subTitle:   { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 4 },
  subDesc:    { fontSize: 12, color: C.sub, lineHeight: 18 },
  blogBtn: {
    backgroundColor: C.primary, borderRadius: 50,
    paddingVertical: 11, alignItems: 'center', marginBottom: 10,
  },
  blogBtnText: { color: C.white, fontWeight: '700', fontSize: 12, letterSpacing: 0.6 },
  noPost:      { alignItems: 'center', paddingVertical: 24 },
  noPostTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginTop: 8 },
  noPostSub:   { fontSize: 12, color: C.muted, marginTop: 4 },

  viewAllBtn: {
    borderWidth: 1.5, borderColor: C.primary, borderRadius: 50,
    paddingVertical: 11, alignItems: 'center', marginTop: 4, marginBottom: 4,
  },
  viewAllText: { color: C.primary, fontWeight: '700', fontSize: 13 },

  locationRow:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  locationText: { fontSize: 13, color: C.sub, flex: 1 },

  mapWrap: { height: 200, borderRadius: 16, overflow: 'hidden', marginBottom: 6 },
  mapExpandBadge: {
    position: 'absolute', bottom: 10, right: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  mapExpandText: { fontSize: 11, color: '#374151', fontWeight: '500' },
});