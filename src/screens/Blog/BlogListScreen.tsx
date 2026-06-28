// src/screens/Blog/BlogScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
// ── CHANGE: added G to support the Mental Wellness icon ────────────────────────
import Svg, { Path, G } from 'react-native-svg';
import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');

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
  dark:      '#111827',
  green:     '#22c55e',
};

const DOCTOR_IMG = require('../../../assets/images/hero-doctor.jpg');

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK_POSTS = [
  {
    id: '1',
    title: 'Understanding Hypertension: Causes, Risks & Management',
    description:
      'Hypertension, or high blood pressure, is a common condition that affects millions of Nigerians. Left unmanaged, it can lead to stroke, heart failure, and kidney disease. Our specialists share practical tips to keep your blood pressure in check.',
    category: 'General Health',
    date: 'Jun 15, 2026',
    readTime: '6 min read',
    image: DOCTOR_IMG,
    slug: 'understanding-hypertension',
    subheadings: [
      { title: 'What is hypertension?',   description: 'Hypertension occurs when the force of blood against artery walls is consistently too high.' },
      { title: 'Risk factors in Nigeria', description: 'Excessive salt intake, stress, obesity, and genetics are primary risk factors.' },
      { title: 'Lifestyle modifications', description: 'Regular exercise, reduced sodium intake, and stress management can significantly lower blood pressure.' },
    ],
  },
  {
    id: '2',
    title: 'Malaria Prevention & Treatment in Lagos: What You Need to Know',
    description:
      'Malaria remains one of the leading causes of hospital visits in Lagos. Early diagnosis and prompt treatment are key to preventing complications. Learn about the latest guidelines and preventive measures recommended by our medical team.',
    category: 'Preventive Care',
    date: 'Jun 10, 2026',
    readTime: '5 min read',
    image: DOCTOR_IMG,
    slug: 'malaria-prevention-lagos',
    subheadings: [
      { title: 'Recognising malaria symptoms', description: 'Fever, chills, and headache are the earliest signs. Seek care within 24 hours.' },
      { title: 'Approved treatment regimens',  description: 'WHO-recommended artemisinin-based combination therapies are our first-line treatment.' },
    ],
  },
  {
    id: '3',
    title: 'Diabetes Management: Living Well with Type 2 Diabetes',
    description:
      'Type 2 diabetes is increasingly common in urban Nigeria. With the right diet, exercise, and medication plan, patients can live full, healthy lives. Our endocrinology team breaks down everything you need to know about blood sugar control.',
    category: 'General Health',
    date: 'Jun 5, 2026',
    readTime: '7 min read',
    image: DOCTOR_IMG,
    slug: 'diabetes-management',
    subheadings: [
      { title: 'Blood sugar monitoring',         description: 'Daily home monitoring helps you understand how food and activity affect your glucose levels.' },
      { title: 'Dietary recommendations',        description: 'Low glycaemic index foods, reduced refined carbs, and portion control are foundational.' },
      { title: 'Exercise & insulin sensitivity', description: 'Regular moderate exercise improves insulin sensitivity and reduces HbA1c.' },
    ],
  },
  {
    id: '4',
    title: 'Maternal Health: Antenatal Care at Etta-Atlantic',
    description:
      'Good antenatal care is the foundation of a safe pregnancy. Our obstetrics team provides comprehensive maternal healthcare from first trimester through delivery, ensuring the health of both mother and baby at every stage.',
    category: "Women's Health",
    date: 'May 28, 2026',
    readTime: '5 min read',
    image: DOCTOR_IMG,
    slug: 'maternal-health-antenatal',
    subheadings: [
      { title: 'First trimester checks',     description: 'Early screening for gestational diabetes, anaemia, and foetal abnormalities.' },
      { title: 'Nutrition during pregnancy', description: 'Folic acid, iron, and calcium supplementation are essential in all trimesters.' },
    ],
  },
  {
    id: '5',
    title: 'Sickle Cell Disease: Living Better with SCD',
    description:
      'Nigeria has the highest burden of sickle cell disease in the world. Our haematology unit offers comprehensive SCD care including crisis management, hydroxyurea therapy, and genetic counselling for families.',
    category: 'Med Updates',
    date: 'May 20, 2026',
    readTime: '8 min read',
    image: DOCTOR_IMG,
    slug: 'sickle-cell-disease-management',
    subheadings: [
      { title: 'Vaso-occlusive crisis', description: 'Pain crises require prompt hydration, analgesia, and oxygen therapy.' },
      { title: 'Hydroxyurea therapy',   description: 'Evidence shows hydroxyurea reduces crisis frequency by up to 50%.' },
      { title: 'Genetic counselling',   description: 'Carrier screening and counselling help families make informed reproductive decisions.' },
    ],
  },
  {
    id: '6',
    title: 'Mental Wellness in the Workplace: Breaking the Stigma',
    description:
      "Mental health challenges are rising in Lagos's fast-paced work environment. Anxiety, burnout, and depression are real and treatable conditions. Our team discusses practical strategies for managing mental wellness at work and at home.",
    category: 'Mental Wellness',
    date: 'May 12, 2026',
    readTime: '6 min read',
    image: DOCTOR_IMG,
    slug: 'mental-wellness-workplace',
    subheadings: [
      { title: 'Identifying burnout early',    description: 'Exhaustion, cynicism, and reduced efficacy are the three pillars of burnout.' },
      { title: 'Practical coping strategies', description: 'Mindfulness, structured breaks, and social connection are evidence-based interventions.' },
    ],
  },
  {
    id: '7',
    title: 'Heart Health: Reducing Your Cardiovascular Risk',
    description:
      'Cardiovascular disease is the leading cause of death worldwide. Understanding your personal risk factors and making targeted lifestyle changes can dramatically reduce your chance of a heart attack or stroke.',
    category: 'Healthy Living',
    date: 'May 5, 2026',
    readTime: '7 min read',
    image: DOCTOR_IMG,
    slug: 'heart-health-cardiovascular-risk',
    subheadings: [
      { title: 'Know your numbers',    description: 'Track blood pressure, cholesterol, blood sugar, and BMI regularly.' },
      { title: 'The role of exercise', description: '150 minutes of moderate aerobic activity per week is the minimum recommended dose.' },
    ],
  },
];

// ── CHANGE: Mental Wellness SVG icon ──────────────────────────────────────────
// Ported from the mask-based SVG: the mask white areas become strokes/fills
// at the icon colour; the brain fill uses 33 % opacity to match the original
// mask's #555 gray value (85/255 ≈ 0.33).
const MentalWellnessIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <G fill="none" stroke={color}>
      {/* Speech-bubble outline */}
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={4.667}
        d="M19.036 44q-1.47-4.793-4.435-7.147c-2.965-2.353-7.676-.89-9.416-3.318s1.219-6.892 2.257-9.526s-3.98-3.565-3.394-4.313q.585-.748 7.609-4.316Q13.652 4 26.398 4C39.144 4 44 14.806 44 21.68c0 6.872-5.88 14.276-14.256 15.873q-1.123 1.636 3.24 6.447"
      />
      {/* Brain shape — semi-transparent fill mirrors the mask's #555 value */}
      <Path
        fill={color}
        fillOpacity={0.33}
        fillRule="evenodd"
        strokeLinejoin="round"
        strokeWidth={4}
        d="M19.5 14.5q-.981 3.801.583 5.339q1.563 1.537 5.328 2.01q-.855 4.903 2.083 4.6q2.937-.302 3.53-2.44q4.59 1.29 4.976-2.16c.385-3.45-1.475-6.201-2.238-6.201s-2.738-.093-2.738-1.148s-2.308-1.65-4.391-1.65s-.83-1.405-3.69-.85q-2.86.555-3.443 2.5Z"
      />
      {/* Stem line */}
      <Path
        strokeLinecap="round"
        strokeWidth={4}
        d="M30.5 25.5c-1.017.631-2.412 1.68-3 2.5c-1.469 2.05-2.66 3.298-2.92 4.608"
      />
    </G>
  </Svg>
);

// ── CHANGE: branded social-share SVG icons ────────────────────────────────────

const FacebookIcon = ({ size = 14 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256">
    <Path
      fill="#1877f2"
      d="M256 128C256 57.308 198.692 0 128 0S0 57.308 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.348-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.959 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445"
    />
    <Path
      fill="#fff"
      d="m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A129 129 0 0 0 128 256a129 129 0 0 0 20-1.555V165z"
    />
  </Svg>
);

const XIcon = ({ size = 14 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 128 128">
    <Path
      fill={C.dark}
      d="M75.916 54.2L122.542 0h-11.05L71.008 47.06L38.672 0H1.376l48.898 71.164L1.376 128h11.05L55.18 78.303L89.328 128h37.296L75.913 54.2ZM60.782 71.79l-4.955-7.086l-39.42-56.386h16.972L65.19 53.824l4.954 7.086l41.353 59.15h-16.97L60.782 71.793Z"
    />
  </Svg>
);

const LinkedInIcon = ({ size = 14 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 128 128">
    <Path
      fill="#0076b2"
      d="M116 3H12a8.91 8.91 0 0 0-9 8.8v104.42a8.91 8.91 0 0 0 9 8.78h104a8.93 8.93 0 0 0 9-8.81V11.77A8.93 8.93 0 0 0 116 3"
    />
    <Path
      fill="#fff"
      d="M21.06 48.73h18.11V107H21.06zm9.06-29a10.5 10.5 0 1 1-10.5 10.49a10.5 10.5 0 0 1 10.5-10.49m20.41 29h17.36v8h.24c2.42-4.58 8.32-9.41 17.13-9.41C103.6 47.28 107 59.35 107 75v32H88.89V78.65c0-6.75-.12-15.44-9.41-15.44s-10.87 7.36-10.87 15V107H50.53z"
    />
  </Svg>
);

// ── CHANGE: categories now use an optional SvgIcon field ──────────────────────
interface CategoryItem {
  label: string;
  icon?: string;
  SvgIcon?: React.FC<{ color: string; size: number }>;
}

const CATEGORIES: CategoryItem[] = [
  { label: 'All',             icon: 'grid-outline'             },
  { label: 'General Health',  icon: 'medical-outline'          },
  // ── CHANGE: Mental Wellness uses the new SVG icon instead of heart-outline ──
  { label: 'Mental Wellness', SvgIcon: MentalWellnessIcon      },
  { label: 'Preventive Care', icon: 'shield-checkmark-outline' },
  { label: 'Med Updates',     icon: 'newspaper-outline'        },
  { label: 'Healthy Living',  icon: 'leaf-outline'             },
];

// ── CHANGE: share platforms now carry icon components instead of text labels ──
interface SharePlatform {
  key: string;
  Icon: React.FC<{ size?: number }>;
}

const SHARE_PLATFORMS: SharePlatform[] = [
  { key: 'facebook', Icon: FacebookIcon },
  { key: 'twitter',  Icon: XIcon        },
  { key: 'linkedin', Icon: LinkedInIcon },
];

function sharePost(platform: string, post: typeof MOCK_POSTS[0]) {
  const url  = `https://ettaatlantic.com/blog/${post.slug}`;
  const urls: Record<string, string> = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter:  `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };
  if (urls[platform]) Linking.openURL(urls[platform]);
}

// ── Carousel constants ────────────────────────────────────────────────────────
const REAL_COUNT  = MOCK_POSTS.length;
const TOTAL       = REAL_COUNT * 100 * 2;
const START_INDEX = Math.floor(TOTAL / 2);
const CAROUSEL_DATA = Array.from({ length: TOTAL }, (_, i) => MOCK_POSTS[i % REAL_COUNT]);

// ── Overlay SVG icons (unchanged) ────────────────────────────────────────────
const SignOutIcon = ({ color = C.text }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path fill={color} d="M12.232 3.25H9.768c-.813 0-1.469 0-2 .043c-.546.045-1.026.14-1.47.366a3.75 3.75 0 0 0-1.64 1.639c-.226.444-.32.924-.365 1.47c-.043.531-.043 1.187-.043 2v6.464c0 .813 0 1.469.043 2c.045.546.14 1.026.366 1.47a3.75 3.75 0 0 0 1.639 1.64c.444.226.924.32 1.47.365c.531.043 1.187.043 2 .043h2.464c.813 0 1.469 0 2-.043c.546-.045 1.026-.14 1.47-.366a3.75 3.75 0 0 0 1.64-1.639c.226-.444.32-.924.365-1.47c.043-.531.043-1.187.043-2V15a.75.75 0 0 0-1.5 0v.2c0 .852 0 1.447-.038 1.91c-.038.453-.107.714-.207.912c-.216.423-.56.767-.983.983c-.198.1-.459.17-.913.207c-.462.037-1.056.038-1.909.038H9.8c-.852 0-1.447 0-1.91-.038c-.453-.038-.714-.107-.911-.207a2.25 2.25 0 0 1-.984-.983c-.1-.198-.17-.459-.207-.913c-.037-.462-.038-1.057-.038-1.909V8.8c0-.852 0-1.447.038-1.91c.037-.453.107-.714.207-.911a2.25 2.25 0 0 1 .984-.984c.197-.1.458-.17.912-.207c.462-.037 1.057-.038 1.909-.038h2.4c.853 0 1.447 0 1.91.038c.453.037.714.107.912.207c.423.216.767.56.983.984c.1.197.17.458.207.912c.037.462.038 1.057.038 1.909V9a.75.75 0 0 0 1.5 0v-.232c0-.813 0-1.469-.043-2c-.045-.546-.14-1.026-.366-1.47a3.75 3.75 0 0 0-1.639-1.64c-.444-.226-.924-.32-1.47-.365c-.531-.043-1.187-.043-2-.043" />
    <Path fill={color} d="M12.47 8.47a.75.75 0 1 1 1.06 1.06l-1.72 1.72H20a.75.75 0 0 1 0 1.5h-8.19l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06z" />
  </Svg>
);

const NotificationIcon = ({ color = C.text }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path fill={color} fillRule="evenodd" d="M12 1a2 2 0 0 0-1.98 2.284A7 7 0 0 0 5 10v8H4a1 1 0 1 0 0 2h16a1 1 0 1 0 0-2h-1v-8a7 7 0 0 0-5.02-6.716Q14 3.144 14 3a2 2 0 0 0-2-2m2 21a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1" clipRule="evenodd" />
  </Svg>
);

const ProfileIcon = ({ color = C.text }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path fill={color} fillRule="evenodd" d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z" clipRule="evenodd" />
  </Svg>
);

// ── Card dimensions ───────────────────────────────────────────────────────────
const CARD_IMG_W = width * 0.32;
const CARD_IMG_H = CARD_IMG_W * 1.18;

// ─────────────────────────────────────────────────────────────────────────────
interface BlogScreenProps { navigation?: any; }

export default function BlogScreen({ navigation }: BlogScreenProps) {
  const { logout } = useAuth();

  const currentIndexRef = useRef(START_INDEX);
  const flatListRef     = useRef<FlatList>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [search,     setSearch]     = useState('');
  const [activeTab,  setActiveTab]  = useState(0);
  const [expanded,   setExpanded]   = useState<Record<string, boolean>>({});

  // ── Auto-advance ──────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      const next = currentIndexRef.current + 1;
      currentIndexRef.current = next;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // ── Sign-out ──────────────────────────────────────────────────────────────
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setSigningOut(true);
            try   { await logout(); }
            catch { setSigningOut(false); }
          },
        },
      ],
    );
  };

  const handleProfilePress = () => navigation?.navigate?.('Dashboard');

  const toggleExpand = (key: string) =>
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const filteredPosts = MOCK_POSTS.filter(p => {
    const q           = search.toLowerCase();
    const cat         = CATEGORIES[activeTab].label;
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const matchCat    = cat === 'All' || p.category === cat;
    return matchSearch && matchCat;
  });

  // ── Carousel slide ────────────────────────────────────────────────────────
  const renderCarouselSlide = ({ item }: { item: typeof MOCK_POSTS[0] }) => (
    <TouchableOpacity
      style={h.slide}
      activeOpacity={0.95}
      onPress={() => navigation?.navigate?.('BlogPost', { post: item })}
    >
      <Image source={item.image} style={h.img} resizeMode="cover" />
      <View style={h.grad}>
        <View style={h.authorRow}>
          <Image source={DOCTOR_IMG} style={h.avatar} resizeMode="cover" />
          <View>
            <Text style={h.authorName}>Etha-Atlantic</Text>
            <Text style={h.authorDate}>{item.date}</Text>
          </View>
          <View style={h.catBadge}>
            <Text style={h.catBadgeTxt}>{item.category}</Text>
          </View>
        </View>
        <Text style={h.title} numberOfLines={2}>{item.title}</Text>
      </View>
      <View style={h.timePill}>
        <Ionicons name="time-outline" size={11} color={C.white} />
        <Text style={h.timeTxt}>{item.readTime}</Text>
      </View>
    </TouchableOpacity>
  );

  // ── Blog list card ────────────────────────────────────────────────────────
  const renderCard = ({ item }: { item: typeof MOCK_POSTS[0] }) => {
    const descKey = 'card_' + item.id;
    const isExp   = !!expanded[descKey];
    const SHORT   = 90;
    const isLong  = item.description.length > SHORT;
    const display = isExp || !isLong ? item.description : item.description.slice(0, SHORT);

    return (
      <TouchableOpacity
        style={bc.card}
        onPress={() => navigation?.navigate?.('BlogPost', { post: item })}
        activeOpacity={0.93}
      >
        <View style={bc.imgWrap}>
          <Image source={item.image} style={bc.img} resizeMode="cover" />
          <TouchableOpacity style={bc.bookmarkBtn} activeOpacity={0.8}>
            <Ionicons name="bookmark-outline" size={13} color={C.white} />
          </TouchableOpacity>
          <View style={bc.timeBadge}>
            <Ionicons name="time-outline" size={9} color={C.white} />
            <Text style={bc.timeTxt}>{item.readTime}</Text>
          </View>
        </View>

        <View style={bc.content}>
          <View style={bc.catBadge}>
            <Text style={bc.catBadgeTxt}>{item.category}</Text>
          </View>
          <Text style={bc.title} numberOfLines={2}>{item.title}</Text>
          <Text style={bc.desc}>
            {display}
            {isLong && !isExp && (
              <Text onPress={() => toggleExpand(descKey)}>
                {'  '}<Text style={bc.readMoreLink}>Read More</Text>
              </Text>
            )}
          </Text>
          {isExp && (
            <TouchableOpacity onPress={() => toggleExpand(descKey)} style={{ marginTop: 2 }}>
              <Text style={bc.readMoreLink}>Show less</Text>
            </TouchableOpacity>
          )}
          <View style={bc.metaRow}>
            <Ionicons name="calendar-outline" size={10} color={C.muted} />
            <Text style={bc.metaTxt}>{item.date}</Text>
          </View>

          {/* ── CHANGE: branded SVG share icons, no borders ───────────────── */}
          <View style={bc.footer}>
            <Text style={bc.shareLabel}>Share:</Text>
            <View style={bc.shareRow}>
              {SHARE_PLATFORMS.map(p => (
                <TouchableOpacity
                  key={p.key}
                  style={bc.shareBtn}
                  onPress={() => sharePost(p.key, item)}
                  activeOpacity={0.75}
                >
                  <p.Icon size={16} />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={bc.arrowBtn}
              onPress={() => navigation?.navigate?.('BlogPost', { post: item })}
              activeOpacity={0.85}
            >
              <Ionicons name="arrow-forward" size={13} color={C.white} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={s.root}>
      <FlatList
        data={filteredPosts}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
        ListHeaderComponent={(
          <>
            {/* ══ HERO ══════════════════════════════════════════════════════ */}
            <SafeAreaView style={s.heroSafeArea}>
              <View>
                <FlatList
                  ref={flatListRef}
                  data={CAROUSEL_DATA}
                  keyExtractor={(_, i) => i.toString()}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  initialScrollIndex={START_INDEX}
                  getItemLayout={(_, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                  })}
                  windowSize={3}
                  removeClippedSubviews
                  renderItem={renderCarouselSlide}
                  onMomentumScrollEnd={e => {
                    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                    currentIndexRef.current = idx;
                  }}
                />

                {/* Overlay */}
                <View style={s.heroOverlay}>
                  <View style={s.heroOverlayRow}>
                    <TouchableOpacity
                      style={s.iconBtn}
                      onPress={handleSignOut}
                      activeOpacity={0.7}
                      disabled={signingOut}
                    >
                      {signingOut
                        ? <ActivityIndicator size="small" color={C.primary} />
                        : <SignOutIcon color={C.text} />
                      }
                    </TouchableOpacity>

                    <View style={s.rightIconsRow}>
                      <TouchableOpacity
                        style={s.iconBtn}
                        onPress={() => navigation?.navigate?.('Notifications')}
                        activeOpacity={0.7}
                      >
                        <NotificationIcon color={C.text} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={s.iconBtn}
                        onPress={handleProfilePress}
                        activeOpacity={0.7}
                      >
                        <ProfileIcon color={C.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </SafeAreaView>

            {/* ══ SEARCH + CATEGORY TABS ════════════════════════════════════ */}
            <View style={s.searchOuter}>
              <View style={s.searchBar}>
                <Ionicons name="search-outline" size={17} color={C.muted} />
                <TextInput
                  style={s.searchInput}
                  placeholder="Search blog posts..."
                  placeholderTextColor={C.muted}
                  value={search}
                  onChangeText={setSearch}
                  returnKeyType="search"
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
                    <Ionicons name="close-circle" size={17} color={C.muted} />
                  </TouchableOpacity>
                )}
                <View style={s.filterBtn}>
                  <Ionicons name="options-outline" size={15} color={C.white} />
                </View>
              </View>

              {/* ── CHANGE: renders MentalWellnessIcon via SvgIcon when present ── */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.tabsRow}
                style={{ marginTop: 12 }}
              >
                {CATEGORIES.map((cat, i) => {
                  const isActive  = i === activeTab;
                  const iconColor = isActive ? C.white : C.sub;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[s.tab, isActive && s.tabOn]}
                      onPress={() => setActiveTab(i)}
                      activeOpacity={0.8}
                    >
                      {cat.SvgIcon ? (
                        <cat.SvgIcon color={iconColor} size={13} />
                      ) : (
                        <Ionicons name={cat.icon as any} size={13} color={iconColor} />
                      )}
                      <Text style={[s.tabTxt, isActive && s.tabTxtOn]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* ══ ARTICLES HEADER ═══════════════════════════════════════════ */}
            <View style={s.recHeader}>
              <Text style={s.recTitle}>Articles</Text>
              <Text style={s.recCount}>{filteredPosts.length} posts</Text>
            </View>

            {filteredPosts.length === 0 && (
              <View style={s.empty}>
                <Text style={{ fontSize: 38 }}>🔍</Text>
                <Text style={s.emptyTitle}>No posts found</Text>
                <Text style={s.emptySub}>Try a different search or category</Text>
                <TouchableOpacity
                  style={s.clearBtn}
                  onPress={() => { setSearch(''); setActiveTab(0); }}
                >
                  <Text style={s.clearBtnTxt}>Clear Filters</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
        renderItem={renderCard}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

// ── Hero slide styles ─────────────────────────────────────────────────────────
const h = StyleSheet.create({
  slide: {
    width,
    overflow: 'hidden',
    backgroundColor: C.bg,
    paddingTop: 56,
  },
  img: { width, height: 396 },
  grad: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(17,24,39,0.76)', padding: 16,
  },
  authorRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar:      { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: C.white },
  authorName:  { color: C.white, fontSize: 12, fontWeight: '700' },
  authorDate:  { color: 'rgba(255,255,255,0.65)', fontSize: 10, marginTop: 1 },
  catBadge: {
    marginLeft: 'auto',
    backgroundColor: C.primary, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  catBadgeTxt: { color: C.white, fontSize: 9, fontWeight: '800' },
  title:       { color: C.white, fontSize: 17, fontWeight: '800', lineHeight: 23 },
  timePill: {
    position: 'absolute', bottom: 14, right: 14,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20,
  },
  timeTxt: { color: C.white, fontSize: 10, fontWeight: '600' },
});

// ── Blog card styles ──────────────────────────────────────────────────────────
const bc = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: C.white,
    marginHorizontal: 16,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  imgWrap:  { width: CARD_IMG_W, height: CARD_IMG_H, position: 'relative' },
  img:      { width: '100%', height: '100%' },
  bookmarkBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.38)',
    justifyContent: 'center', alignItems: 'center',
  },
  timeBadge: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3,
    backgroundColor: 'rgba(0,0,0,0.5)', paddingVertical: 4,
  },
  timeTxt:      { color: C.white, fontSize: 9, fontWeight: '700' },
  content:      { flex: 1, padding: 11, justifyContent: 'space-between' },
  catBadge: {
    alignSelf: 'flex-start', backgroundColor: '#eff6ff',
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 5,
  },
  catBadgeTxt:  { color: C.primary, fontSize: 8, fontWeight: '800' },
  title:        { fontSize: 12, fontWeight: '800', color: C.text, lineHeight: 17, marginBottom: 5 },
  desc:         { fontSize: 10, color: C.sub, lineHeight: 15, marginBottom: 5, flexShrink: 1 },
  readMoreLink: { color: C.primary, fontWeight: '700', fontSize: 10 },
  metaRow:      { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 7 },
  metaTxt:      { fontSize: 10, color: C.muted },
  footer:       { flexDirection: 'row', alignItems: 'center', gap: 5 },
  shareLabel:   { fontSize: 9, color: C.muted, fontWeight: '600' },
  shareRow:     { flexDirection: 'row', gap: 5, flex: 1, alignItems: 'center' },
  // ── CHANGE: border removed — just a centred hit-target ────────────────────
  shareBtn: {
    width: 22, height: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  arrowBtn: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: C.primary,
    justifyContent: 'center', alignItems: 'center',
  },
});

// ── Root / overlay styles ─────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  heroSafeArea: { backgroundColor: C.bg },

  heroOverlay:    { position: 'absolute', top: 0, left: 0, right: 0 },
  heroOverlayRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 6,
  },
  rightIconsRow: { flexDirection: 'row', gap: 8 },
  iconBtn:       { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },

  // ── CHANGE: paddingTop reduced from 16 → 4 to close the gap to the hero ───
  searchOuter: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 4 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.white, borderRadius: 16,
    paddingHorizontal: 14, paddingVertical: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  searchInput: { flex: 1, fontSize: 14, color: C.text, padding: 0 },
  filterBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: C.primary,
    justifyContent: 'center', alignItems: 'center',
  },

  tabsRow: { paddingRight: 4, gap: 8 },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 13, paddingVertical: 8,
    borderRadius: 50, borderWidth: 1.5, borderColor: C.border,
    backgroundColor: C.white,
  },
  tabOn:    { backgroundColor: C.primary, borderColor: C.primary },
  tabTxt:   { fontSize: 11, fontWeight: '600', color: C.sub },
  tabTxtOn: { color: C.white },

  recHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 18, paddingBottom: 12,
  },
  recTitle: { fontSize: 17, fontWeight: '800', color: C.text },
  recCount: { fontSize: 12, color: C.muted, fontWeight: '500' },

  empty:       { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 32 },
  emptyTitle:  { fontSize: 17, fontWeight: '700', color: C.text, marginTop: 10 },
  emptySub:    { fontSize: 13, color: C.muted, marginTop: 4, marginBottom: 16, textAlign: 'center' },
  clearBtn:    { backgroundColor: C.primary, borderRadius: 50, paddingHorizontal: 24, paddingVertical: 11 },
  clearBtnTxt: { color: C.white, fontWeight: '700', fontSize: 13 },
});