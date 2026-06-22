import React, { useState, useCallback } from 'react';
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
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

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

// ── LOCAL DOCTOR IMAGE (used as placeholder throughout) ───────────────────────
const DOCTOR_IMG = require('../../../assets/images/hero-doctor.jpg');

// ── MOCK DATA — no API needed ─────────────────────────────────────────────────
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
      { title: 'What is hypertension?',       description: 'Hypertension occurs when the force of blood against artery walls is consistently too high.' },
      { title: 'Risk factors in Nigeria',     description: 'Excessive salt intake, stress, obesity, and genetics are primary risk factors.' },
      { title: 'Lifestyle modifications',     description: 'Regular exercise, reduced sodium intake, and stress management can significantly lower blood pressure.' },
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
      { title: 'Approved treatment regimens', description: 'WHO-recommended artemisinin-based combination therapies are our first-line treatment.' },
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
    title: "Maternal Health: Antenatal Care at Etta-Atlantic",
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
      { title: 'Vaso-occlusive crisis',  description: 'Pain crises require prompt hydration, analgesia, and oxygen therapy.' },
      { title: 'Hydroxyurea therapy',    description: 'Evidence shows hydroxyurea reduces crisis frequency by up to 50%.' },
      { title: 'Genetic counselling',    description: 'Carrier screening and counselling help families make informed reproductive decisions.' },
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
      { title: 'Know your numbers',  description: 'Track blood pressure, cholesterol, blood sugar, and BMI regularly.' },
      { title: 'The role of exercise', description: '150 minutes of moderate aerobic activity per week is the minimum recommended dose.' },
    ],
  },
];

// ── Category tabs ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'All',             icon: 'grid-outline'              },
  { label: 'General Health',  icon: 'medical-outline'           },
  { label: 'Mental Wellness', icon: 'heart-outline'             },
  { label: 'Preventive Care', icon: 'shield-checkmark-outline'  },
  { label: 'Med Updates',     icon: 'newspaper-outline'         },
  { label: 'Healthy Living',  icon: 'leaf-outline'              },
];

// ── Share ─────────────────────────────────────────────────────────────────────
const SHARE_PLATFORMS = [
  { key: 'facebook', label: 'f' },
  { key: 'twitter',  label: '𝕏' },
  { key: 'linkedin', label: 'in' },
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

const HERO_H   = 260;
const FEATURED = MOCK_POSTS.slice(0, 3);
const OTHERS   = MOCK_POSTS.slice(3);

// ── Card image dimensions (image LEFT, content RIGHT) ─────────────────────────
const CARD_IMG_W = width * 0.32;
const CARD_IMG_H = CARD_IMG_W * 1.18;   // slightly taller than wide

// ─────────────────────────────────────────────────────────────────────────────
interface BlogScreenProps { navigation?: any; }

export default function BlogScreen({ navigation }: BlogScreenProps) {
  const [search,    setSearch]    = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [expanded,  setExpanded]  = useState<Record<string, boolean>>({});

  const onHeroScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setHeroIndex(Math.round(e.nativeEvent.contentOffset.x / width));

  const toggleExpand = (key: string) =>
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const filteredOthers = OTHERS.filter(p => {
    const q   = search.toLowerCase();
    const cat = CATEGORIES[activeTab].label;
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const matchCat    = cat === 'All' || p.category === cat;
    return matchSearch && matchCat;
  });

  const featuredPost = FEATURED[heroIndex] ?? FEATURED[0];

  // ── Hero slide ──────────────────────────────────────────────────────────────
  const renderHeroSlide = ({ item }: { item: typeof MOCK_POSTS[0] }) => (
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

  // ── Blog list card — image LEFT, content RIGHT ──────────────────────────────
  const renderCard = ({ item }: { item: typeof MOCK_POSTS[0] }) => {
    const descKey = 'card_' + item.id;
    const isExp   = !!expanded[descKey];
    const SHORT   = 90;
    const isLong  = item.description.length > SHORT;
    const display = isExp || !isLong
      ? item.description
      : item.description.slice(0, SHORT);

    return (
      <TouchableOpacity
        style={bc.card}
        onPress={() => navigation?.navigate?.('BlogPost', { post: item })}
        activeOpacity={0.93}
      >
        {/* ── LEFT — image ── */}
        <View style={bc.imgWrap}>
          <Image source={item.image} style={bc.img} resizeMode="cover" />

          {/* Bookmark top-right corner of image */}
          <TouchableOpacity style={bc.bookmarkBtn} activeOpacity={0.8}>
            <Ionicons name="bookmark-outline" size={13} color={C.white} />
          </TouchableOpacity>

          {/* Read-time badge pinned to bottom of image */}
          <View style={bc.timeBadge}>
            <Ionicons name="time-outline" size={9} color={C.white} />
            <Text style={bc.timeTxt}>{item.readTime}</Text>
          </View>
        </View>

        {/* ── RIGHT — content ── */}
        <View style={bc.content}>
          {/* Category pill */}
          <View style={bc.catBadge}>
            <Text style={bc.catBadgeTxt}>{item.category}</Text>
          </View>

          {/* Title */}
          <Text style={bc.title} numberOfLines={2}>{item.title}</Text>

          {/* Description with inline Read More */}
          <Text style={bc.desc}>
            {display}
            {isLong && !isExp && (
              <Text onPress={() => toggleExpand(descKey)}>
                {'  '}
                <Text style={bc.readMoreLink}>Read More</Text>
              </Text>
            )}
          </Text>
          {isExp && (
            <TouchableOpacity onPress={() => toggleExpand(descKey)} style={{ marginTop: 2 }}>
              <Text style={bc.readMoreLink}>Show less</Text>
            </TouchableOpacity>
          )}

          {/* Date row */}
          <View style={bc.metaRow}>
            <Ionicons name="calendar-outline" size={10} color={C.muted} />
            <Text style={bc.metaTxt}>{item.date}</Text>
          </View>

          {/* Footer: share buttons */}
          <View style={bc.footer}>
            <Text style={bc.shareLabel}>Share:</Text>
            <View style={bc.shareRow}>
              {SHARE_PLATFORMS.map(p => (
                <TouchableOpacity
                  key={p.key}
                  style={bc.shareBtn}
                  onPress={() => sharePost(p.key, item)}
                  activeOpacity={0.8}
                >
                  <Text style={bc.shareTxt}>{p.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Continue reading arrow */}
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

  // ── Main ────────────────────────────────────────────────────────────────────
  return (
    <View style={s.root}>

      {/* Top bar */}
      <SafeAreaView style={s.topBar}>
        <TouchableOpacity style={s.iconBtn} onPress={() => navigation?.goBack?.()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color={C.text} />
        </TouchableOpacity>
        <Text style={s.topTitle}>Our Blog</Text>
        <TouchableOpacity style={s.iconBtn} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={20} color={C.text} />
        </TouchableOpacity>
      </SafeAreaView>

      <FlatList
        data={filteredOthers}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
        ListHeaderComponent={(
          <>
            {/* ══════════════════════════════════════════
                SECTION 1 — Featured hero carousel
            ══════════════════════════════════════════ */}
            <View style={s.heroWrap}>
              <FlatList
                data={FEATURED}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onHeroScroll}
                scrollEventThrottle={16}
                renderItem={renderHeroSlide}
              />
              <View style={s.dotsRow}>
                {FEATURED.map((_, i) => (
                  <View key={i} style={[s.dot, i === heroIndex ? s.dotOn : s.dotOff]} />
                ))}
              </View>
            </View>

            {/* Featured brief card */}
            <View style={s.briefCard}>
              <View style={s.catTagRow}>
                <MaterialIcons name="grid-view" size={13} color={C.muted} />
                <Text style={s.catTagTxt}>{featuredPost.category}</Text>
                <View style={s.catTagLine} />
              </View>

              <Text style={s.briefTitle}>{featuredPost.title}</Text>

              {(() => {
                const key    = 'hero_' + featuredPost.id;
                const isExp  = !!expanded[key];
                const SHORT  = 130;
                const desc   = featuredPost.description;
                const isLong = desc.length > SHORT;
                return (
                  <Text style={s.briefDesc}>
                    {isExp || !isLong ? desc : desc.slice(0, SHORT)}
                    {isLong && !isExp && (
                      <Text onPress={() => toggleExpand(key)}>
                        {'  '}
                        <Text style={s.link}>Read More</Text>
                      </Text>
                    )}
                  </Text>
                );
              })()}

              {featuredPost.subheadings?.slice(0, 2).map((sub, si) => (
                <View key={si} style={s.tocRow}>
                  <View style={s.tocBullet} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.tocTitle}>{sub.title}</Text>
                    <Text style={s.tocDesc} numberOfLines={2}>{sub.description}</Text>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={s.briefCta}
                onPress={() => navigation?.navigate?.('BlogPost', { post: featuredPost })}
                activeOpacity={0.88}
              >
                <Text style={s.briefCtaTxt}>CONTINUE READING</Text>
                <Ionicons name="arrow-forward" size={14} color={C.white} />
              </TouchableOpacity>

              <View style={s.heroShareRow}>
                <Text style={s.heroShareLabel}>Share:</Text>
                {SHARE_PLATFORMS.map(p => (
                  <TouchableOpacity
                    key={p.key}
                    style={s.heroShareBtn}
                    onPress={() => sharePost(p.key, featuredPost)}
                    activeOpacity={0.8}
                  >
                    <Text style={s.heroShareTxt}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ══════════════════════════════════════════
                SECTION 2 — Search + Category tabs
            ══════════════════════════════════════════ */}
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

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.tabsRow}
                style={{ marginTop: 12 }}
              >
                {CATEGORIES.map((cat, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[s.tab, i === activeTab && s.tabOn]}
                    onPress={() => setActiveTab(i)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={13}
                      color={i === activeTab ? C.white : C.sub}
                    />
                    <Text style={[s.tabTxt, i === activeTab && s.tabTxtOn]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* ══════════════════════════════════════════
                SECTION 3 header
            ══════════════════════════════════════════ */}
            <View style={s.recHeader}>
              <Text style={s.recTitle}>Other Articles</Text>
              <Text style={s.recCount}>{filteredOthers.length} posts</Text>
            </View>

            {filteredOthers.length === 0 && (
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
  slide:      { width, height: HERO_H, position: 'relative' },
  img:        { width: '100%', height: '100%' },
  grad: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(17,24,39,0.76)', padding: 16,
  },
  authorRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar:     { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: C.white },
  authorName: { color: C.white, fontSize: 12, fontWeight: '700' },
  authorDate: { color: 'rgba(255,255,255,0.65)', fontSize: 10, marginTop: 1 },
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

// ── Blog card styles — image LEFT, content RIGHT ──────────────────────────────
const bc = StyleSheet.create({
  card: {
    flexDirection: 'row',                   // ← horizontal layout
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

  // ── LEFT — image ──────────────────────────────────────────────────────────
  imgWrap: {
    width: CARD_IMG_W,
    height: CARD_IMG_H,
    position: 'relative',
  },
  img: { width: '100%', height: '100%' },

  bookmarkBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.38)',
    justifyContent: 'center', alignItems: 'center',
  },

  timeBadge: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 4,
  },
  timeTxt: { color: C.white, fontSize: 9, fontWeight: '700' },

  // ── RIGHT — content ───────────────────────────────────────────────────────
  content: {
    flex: 1,
    padding: 11,
    justifyContent: 'space-between',
  },

  catBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3,
    marginBottom: 5,
  },
  catBadgeTxt: { color: C.primary, fontSize: 8, fontWeight: '800' },

  title: {
    fontSize: 12,
    fontWeight: '800',
    color: C.text,
    lineHeight: 17,
    marginBottom: 5,
  },

  desc:         { fontSize: 10, color: C.sub, lineHeight: 15, marginBottom: 5, flexShrink: 1 },
  readMoreLink: { color: C.primary, fontWeight: '700', fontSize: 10 },

  metaRow:  { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 7 },
  metaTxt:  { fontSize: 10, color: C.muted },

  footer:     { flexDirection: 'row', alignItems: 'center', gap: 5 },
  shareLabel: { fontSize: 9, color: C.muted, fontWeight: '600' },
  shareRow:   { flexDirection: 'row', gap: 4, flex: 1 },
  shareBtn: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.2, borderColor: C.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  shareTxt: { color: C.primary, fontSize: 8, fontWeight: '800' },

  arrowBtn: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: C.primary,
    justifyContent: 'center', alignItems: 'center',
  },
});

// ── Root styles ───────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  topBar:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 10, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  iconBtn:  { width: 38, height: 38, borderRadius: 19, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' },
  topTitle: { fontSize: 17, fontWeight: '700', color: C.text },

  heroWrap: { backgroundColor: C.dark },
  dotsRow:  { flexDirection: 'row', justifyContent: 'center', gap: 5, paddingVertical: 10, backgroundColor: C.dark },
  dot:      { height: 6, borderRadius: 3 },
  dotOn:    { width: 18, backgroundColor: C.white },
  dotOff:   { width: 6,  backgroundColor: 'rgba(255,255,255,0.3)' },

  briefCard: {
    backgroundColor: C.white,
    marginHorizontal: 16, marginTop: 16,
    borderRadius: 20, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    marginBottom: 6,
  },
  catTagRow:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  catTagTxt:  { fontSize: 11, color: C.muted, fontWeight: '600' },
  catTagLine: { width: 24, height: 2, backgroundColor: C.red, borderRadius: 1, marginLeft: 4 },
  briefTitle: { fontSize: 16, fontWeight: '800', color: C.primary, lineHeight: 22, marginBottom: 8 },
  briefDesc:  { fontSize: 13, color: C.sub, lineHeight: 20, marginBottom: 12 },
  link:       { color: C.primary, fontWeight: '700' },

  tocRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  tocBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.primary, marginTop: 5 },
  tocTitle:  { fontSize: 12, fontWeight: '700', color: C.text, marginBottom: 2 },
  tocDesc:   { fontSize: 11, color: C.sub, lineHeight: 16 },

  briefCta: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: C.primary, borderRadius: 50,
    paddingVertical: 11, paddingHorizontal: 20,
    alignSelf: 'flex-start', marginTop: 4, marginBottom: 12,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28, shadowRadius: 8, elevation: 4,
  },
  briefCtaTxt: { color: C.white, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },

  heroShareRow:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroShareLabel: { fontSize: 12, color: C.muted, fontWeight: '600' },
  heroShareBtn: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 1.5, borderColor: C.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  heroShareTxt: { color: C.primary, fontSize: 10, fontWeight: '800' },

  searchOuter: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 },
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

  recHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 18, paddingBottom: 12 },
  recTitle:  { fontSize: 17, fontWeight: '800', color: C.text },
  recCount:  { fontSize: 12, color: C.muted, fontWeight: '500' },

  empty:       { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 32 },
  emptyTitle:  { fontSize: 17, fontWeight: '700', color: C.text, marginTop: 10 },
  emptySub:    { fontSize: 13, color: C.muted, marginTop: 4, marginBottom: 16, textAlign: 'center' },
  clearBtn:    { backgroundColor: C.primary, borderRadius: 50, paddingHorizontal: 24, paddingVertical: 11 },
  clearBtnTxt: { color: C.white, fontWeight: '700', fontSize: 13 },
});