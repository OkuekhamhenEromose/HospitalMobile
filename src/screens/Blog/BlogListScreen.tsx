import React, { useState, useEffect, useCallback } from 'react';
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
  ActivityIndicator,
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

// ── API ───────────────────────────────────────────────────────────────────────
const API_BASE = 'https://hospitalback-clean-0fre.onrender.com/api';

async function fetchPosts(limit = 20): Promise<any[]> {
  try {
    const res  = await fetch(`${API_BASE}/hospital/blog/latest/?limit=${limit}`);
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.results ?? []);
    return list.map((p: any) => ({
      ...p,
      featured_image: p.featured_image_url ?? p.featured_image ?? null,
      description:    p.description ?? p.short_description ?? p.excerpt ?? '',
    }));
  } catch {
    return [];
  }
}

// ── Category tabs (mirror web Blog.tsx sidebar categories) ───────────────────
const CATEGORIES = [
  { label: 'All',             icon: 'grid-outline'         },
  { label: 'General Health',  icon: 'medical-outline'      },
  { label: 'Mental Wellness', icon: 'heart-outline'        },
  { label: 'Preventive Care', icon: 'shield-checkmark-outline' },
  { label: 'Med Updates',     icon: 'newspaper-outline'    },
  { label: 'Healthy Living',  icon: 'leaf-outline'         },
];

// ── Share platforms (web Blog.tsx handleShare) ────────────────────────────────
const SHARE_PLATFORMS = [
  { key: 'facebook', label: 'f' },
  { key: 'twitter',  label: '𝕏' },
  { key: 'linkedin', label: 'in' },
];

function sharePost(platform: string, post: any) {
  const url  = `https://hospitalback-clean-0fre.onrender.com/blog/${post.slug ?? ''}`;
  const urls: Record<string, string> = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter:  `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title ?? '')}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };
  if (urls[platform]) Linking.openURL(urls[platform]);
}

// ── Hero carousel for featured post ──────────────────────────────────────────
const HERO_H = 280;

// ── Props ─────────────────────────────────────────────────────────────────────
interface BlogScreenProps { navigation?: any; }

// ─────────────────────────────────────────────────────────────────────────────
export default function BlogScreen({ navigation }: BlogScreenProps) {
  const [posts,       setPosts]       = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [activeTab,   setActiveTab]   = useState(0);
  const [heroIndex,   setHeroIndex]   = useState(0);
  const [expanded,    setExpanded]    = useState<Record<string, boolean>>({});

  // ── Fetch ──
  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchPosts(20);
    setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Derived ──
  const featured    = posts.slice(0, 3);           // first 3 → hero carousel
  const others      = posts.slice(3);              // rest   → recommended list

  const filteredOthers = others.filter(p => {
    const q = search.toLowerCase();
    return (
      !q ||
      (p.title ?? '').toLowerCase().includes(q) ||
      (p.description ?? '').toLowerCase().includes(q)
    );
  });

  const onHeroScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setHeroIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const toggleExpand = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const navigateToPost = (post: any) =>
    navigation?.navigate?.('BlogPost', { slug: post.slug, post });

  // ── Render helpers ────────────────────────────────────────────────────────

  // Featured hero card (carousel slide — web Blog.tsx desktop featured image style)
  const renderHeroSlide = ({ item }: { item: any }) => {
    const isExp = !!expanded[item.id];
    return (
      <View style={h.slide}>
        {/* Image */}
        <Image
          source={
            item.featured_image
              ? { uri: item.featured_image }
              : require('../../../assets/images/hero-doctor.jpg')
          }
          style={h.slideImage}
          resizeMode="cover"
        />

        {/* Dark gradient overlay — web Blog.tsx "Logo Overlay Bottom" pattern */}
        <View style={h.slideGrad}>
          {/* Author row (web: Etha-Atlantic logo + date) */}
          <View style={h.authorRow}>
            <Image
              source={require('../../../assets/images/hero-doctor.jpg')}
              style={h.authorAvatar}
              resizeMode="cover"
            />
            <View>
              <Text style={h.authorName}>Etha-Atlantic</Text>
              <Text style={h.authorDate}>
                {item.created_at
                  ? new Date(item.created_at).toLocaleDateString('en-US', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })
                  : 'Recent'}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text style={h.slideTitle} numberOfLines={2}>{item.title}</Text>
        </View>

        {/* Rating pill (Abeeshak bottom-right pattern) */}
        <View style={h.ratingPill}>
          <Ionicons name="star" size={11} color="#f59e0b" />
          <Text style={h.ratingTxt}>4.9 (96)</Text>
        </View>
      </View>
    );
  };

  // Brief description card below hero (web Blog.tsx description + "Continue Reading")
  const featuredPost = featured[heroIndex] ?? featured[0];

  // Recommended blog card (Abeeshak PropertyCard pattern — image + details)
  const renderBlogCard = ({ item }: { item: any }) => {
    const isExp   = !!expanded[item.id];
    const desc    = item.description ?? '';
    const SHORT   = 100;
    const isLong  = desc.length > SHORT;
    const display = isExp || !isLong ? desc : desc.slice(0, SHORT);

    return (
      <TouchableOpacity
        style={bc.card}
        onPress={() => navigateToPost(item)}
        activeOpacity={0.92}
      >
        {/* Image (Abeeshak card image style) */}
        <View style={bc.imgWrap}>
          <Image
            source={
              item.featured_image
                ? { uri: item.featured_image }
                : require('../../../assets/images/hero-doctor.jpg')
            }
            style={bc.img}
            resizeMode="cover"
          />
          {/* Category badge top-left (Abeeshak badge style) */}
          <View style={bc.catBadge}>
            <Text style={bc.catBadgeTxt}>General Health</Text>
          </View>
          {/* Save icon top-right (Abeeshak heart) */}
          <TouchableOpacity style={bc.heartBtn} activeOpacity={0.8}>
            <Ionicons name="bookmark-outline" size={16} color={C.white} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={bc.body}>
          {/* Title */}
          <Text style={bc.title} numberOfLines={2}>{item.title}</Text>

          {/* Meta row: date + read time */}
          <View style={bc.metaRow}>
            <Ionicons name="time-outline" size={12} color={C.muted} />
            <Text style={bc.metaTxt}>
              {item.created_at
                ? new Date(item.created_at).toLocaleDateString('en-US', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })
                : 'Recent'}
            </Text>
            <View style={bc.metaDot} />
            <Text style={bc.metaTxt}>5 min read</Text>
          </View>

          {/* Description with read more (web Blog.tsx description + "Continue Reading") */}
          <Text style={bc.desc}>
            {display}
            {isLong && !isExp && (
              <Text
                style={bc.readMore}
                onPress={() => toggleExpand(item.id)}
              >
                {' '}...{' '}
                <Text style={bc.readMoreLink}>Read More</Text>
              </Text>
            )}
          </Text>
          {isExp && isLong && (
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text style={[bc.readMoreLink, { marginTop: 4 }]}>Show less</Text>
            </TouchableOpacity>
          )}

          <View style={bc.sep} />

          {/* Bottom row: Continue Reading + Share (web Blog.tsx footer) */}
          <View style={bc.footer}>
            <TouchableOpacity
              style={bc.continueBtn}
              onPress={() => navigateToPost(item)}
              activeOpacity={0.88}
            >
              <Text style={bc.continueBtnTxt}>CONTINUE READING</Text>
            </TouchableOpacity>

            {/* Share buttons (web Blog.tsx social share row) */}
            <View style={bc.shareRow}>
              {SHARE_PLATFORMS.map(p => (
                <TouchableOpacity
                  key={p.key}
                  style={bc.shareBtn}
                  onPress={() => sharePost(p.key, item)}
                  activeOpacity={0.8}
                >
                  <Text style={bc.shareBtnTxt}>{p.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <View style={s.root}>
      {/* ── Top bar ── */}
      <SafeAreaView style={s.topBar}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation?.goBack?.()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={C.text} />
        </TouchableOpacity>
        <Text style={s.topBarTitle}>Our Blog</Text>
        <TouchableOpacity style={s.backBtn} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={20} color={C.text} />
        </TouchableOpacity>
      </SafeAreaView>

      {loading ? (
        <View style={s.loadingWrap}>
          <ActivityIndicator size="large" color={C.primary} />
          <Text style={s.loadingTxt}>Loading posts…</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOthers}
          keyExtractor={item => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListHeaderComponent={(
            <>
              {/* ════════════════════════════════════════════════
                  SECTION 1 — Featured hero carousel
                  (screenshot: full-width image card with dots)
              ════════════════════════════════════════════════ */}
              <View style={s.heroSection}>
                <FlatList
                  data={featured.length ? featured : [{ id: 'mock', title: 'Etha-Atlantic Health Tips', description: 'Stay informed about your health.' }]}
                  keyExtractor={item => String(item.id)}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={onHeroScroll}
                  scrollEventThrottle={16}
                  renderItem={renderHeroSlide}
                />

                {/* Dot indicators */}
                <View style={s.dotsRow}>
                  {(featured.length || 1) > 0 && Array.from({ length: Math.max(featured.length, 1) }).map((_, i) => (
                    <View
                      key={i}
                      style={[s.dot, i === heroIndex ? s.dotActive : s.dotOff]}
                    />
                  ))}
                </View>
              </View>

              {/* Featured post brief + CTA (web Blog.tsx description section) */}
              {featuredPost && (
                <View style={s.featuredBrief}>
                  {/* Category tag (web Blog.tsx category row) */}
                  <View style={s.catTagRow}>
                    <MaterialIcons name="grid-view" size={14} color={C.muted} />
                    <Text style={s.catTagTxt}>General Health</Text>
                    <View style={s.catTagLine} />
                  </View>

                  <Text style={s.featuredTitle}>{featuredPost.title ?? 'Latest from Etha-Atlantic'}</Text>

                  {/* Brief description with read more */}
                  {(() => {
                    const desc  = featuredPost.description ?? '';
                    const isExp = !!expanded['hero_' + featuredPost.id];
                    const SHORT = 120;
                    const isLong = desc.length > SHORT;
                    return (
                      <Text style={s.featuredDesc}>
                        {isExp || !isLong ? desc : desc.slice(0, SHORT)}
                        {isLong && !isExp && (
                          <Text onPress={() => toggleExpand('hero_' + featuredPost.id)}>
                            {'... '}
                            <Text style={s.readMoreLink}>Read More</Text>
                          </Text>
                        )}
                      </Text>
                    );
                  })()}

                  {/* Continue reading CTA */}
                  <TouchableOpacity
                    style={s.featuredCta}
                    onPress={() => navigateToPost(featuredPost)}
                    activeOpacity={0.88}
                  >
                    <Text style={s.featuredCtaTxt}>CONTINUE READING</Text>
                    <Ionicons name="arrow-forward" size={14} color={C.white} />
                  </TouchableOpacity>
                </View>
              )}

              {/* ════════════════════════════════════════════════
                  SECTION 2 — Search bar
                  (screenshot: "Where to?" Airbnb search style)
              ════════════════════════════════════════════════ */}
              <View style={s.searchWrap}>
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
                  {/* Filter icon (screenshot right-side filter btn) */}
                  <TouchableOpacity style={s.filterBtn} activeOpacity={0.8}>
                    <Ionicons name="options-outline" size={15} color={C.white} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Category tabs (screenshot horizontal tab row) */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.tabsRow}
                style={{ marginBottom: 16 }}
              >
                {CATEGORIES.map((cat, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[s.catTab, i === activeTab && s.catTabActive]}
                    onPress={() => setActiveTab(i)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={14}
                      color={i === activeTab ? C.white : C.sub}
                    />
                    <Text style={[s.catTabTxt, i === activeTab && s.catTabTxtActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* ════════════════════════════════════════════════
                  SECTION 3 header — "Other Articles" 
                  (Abeeshak "Recommended" heading)
              ════════════════════════════════════════════════ */}
              <View style={s.recHeader}>
                <Text style={s.recTitle}>Other Articles</Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={s.recSeeAll}>See all</Text>
                </TouchableOpacity>
              </View>

              {/* Empty state */}
              {filteredOthers.length === 0 && !loading && (
                <View style={s.emptyWrap}>
                  <Text style={{ fontSize: 36 }}>🔍</Text>
                  <Text style={s.emptyTitle}>No posts found</Text>
                  <Text style={s.emptySub}>Try a different search term</Text>
                  <TouchableOpacity onPress={() => setSearch('')} style={s.clearBtn}>
                    <Text style={s.clearBtnTxt}>Clear Search</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          // ── SECTION 3 — Recommended blog cards (Abeeshak PropertyCard layout) ──
          renderItem={renderBlogCard}
          ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
        />
      )}
    </View>
  );
}

// ── Hero slide styles ─────────────────────────────────────────────────────────
const h = StyleSheet.create({
  slide:       { width, height: HERO_H, position: 'relative' },
  slideImage:  { width: '100%', height: '100%' },
  slideGrad: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(17,24,39,0.72)',
    padding: 16,
  },
  authorRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  authorAvatar:{ width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: C.white },
  authorName:  { color: C.white, fontSize: 13, fontWeight: '700' },
  authorDate:  { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 1 },
  slideTitle:  { color: C.white, fontSize: 18, fontWeight: '800', lineHeight: 24 },
  ratingPill: {
    position: 'absolute', bottom: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20,
  },
  ratingTxt:   { color: C.white, fontSize: 11, fontWeight: '600' },
});

// ── Blog card styles (Abeeshak PropertyCard) ──────────────────────────────────
const bc = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  imgWrap:    { width: '100%', height: 190, position: 'relative' },
  img:        { width: '100%', height: '100%' },
  catBadge: {
    position: 'absolute', top: 12, left: 12,
    backgroundColor: 'rgba(19,120,229,0.85)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  catBadgeTxt: { color: C.white, fontSize: 10, fontWeight: '700' },
  heartBtn: {
    position: 'absolute', top: 10, right: 10,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center', alignItems: 'center',
  },
  body:     { padding: 14 },
  title:    { fontSize: 15, fontWeight: '800', color: C.text, marginBottom: 6, lineHeight: 21 },
  metaRow:  { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  metaTxt:  { fontSize: 11, color: C.muted },
  metaDot:  { width: 3, height: 3, borderRadius: 2, backgroundColor: C.muted },
  desc:     { fontSize: 13, color: C.sub, lineHeight: 20, marginBottom: 4 },
  readMore: { fontSize: 13, color: C.sub },
  readMoreLink: { color: C.primary, fontWeight: '600' },
  sep:      { height: 1, backgroundColor: C.border, marginVertical: 12 },
  footer:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  continueBtn: {
    backgroundColor: C.primary,
    borderRadius: 50, paddingHorizontal: 14, paddingVertical: 9,
  },
  continueBtnTxt: { color: C.white, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  shareRow:   { flexDirection: 'row', gap: 6 },
  shareBtn: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 1.5, borderColor: C.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  shareBtnTxt: { color: C.primary, fontSize: 11, fontWeight: '700' },
});

// ── Root styles ───────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Top bar
  topBar:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 10, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  backBtn:     { width: 38, height: 38, borderRadius: 19, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' },
  topBarTitle: { fontSize: 17, fontWeight: '700', color: C.text },

  // Loading
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingTxt:  { color: C.muted, fontSize: 13 },

  // Hero
  heroSection: { backgroundColor: C.dark },
  dotsRow:     { flexDirection: 'row', justifyContent: 'center', gap: 5, paddingVertical: 10, backgroundColor: C.dark },
  dot:         { height: 6, borderRadius: 3 },
  dotActive:   { width: 18, backgroundColor: C.white },
  dotOff:      { width: 6,  backgroundColor: 'rgba(255,255,255,0.35)' },

  // Featured brief card (between hero and search)
  featuredBrief: {
    backgroundColor: C.white,
    marginHorizontal: 16, marginTop: 16,
    borderRadius: 20, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    marginBottom: 6,
  },
  catTagRow:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  catTagTxt:   { fontSize: 12, color: C.muted, fontWeight: '600' },
  catTagLine:  { width: 28, height: 2, backgroundColor: C.red, borderRadius: 1, marginLeft: 4 },
  featuredTitle:{ fontSize: 17, fontWeight: '800', color: C.primary, marginBottom: 8, lineHeight: 24 },
  featuredDesc: { fontSize: 13, color: C.sub, lineHeight: 20, marginBottom: 14 },
  readMoreLink: { color: C.primary, fontWeight: '600', fontSize: 13 },
  featuredCta: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.primary, borderRadius: 50,
    paddingVertical: 11, paddingHorizontal: 20,
    alignSelf: 'flex-start',
    shadowColor: C.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  featuredCtaTxt: { color: C.white, fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },

  // Search (screenshot "Where to?" Airbnb style)
  searchWrap: { paddingHorizontal: 16, paddingVertical: 14 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.white,
    borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  searchInput: { flex: 1, fontSize: 14, color: C.text, padding: 0 },
  filterBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: C.primary,
    justifyContent: 'center', alignItems: 'center',
  },

  // Category tabs (screenshot horizontal tabs)
  tabsRow:    { paddingHorizontal: 16, gap: 8 },
  catTab: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 50, borderWidth: 1.5, borderColor: C.border,
    backgroundColor: C.white,
  },
  catTabActive:    { backgroundColor: C.primary, borderColor: C.primary },
  catTabTxt:       { fontSize: 12, fontWeight: '600', color: C.sub },
  catTabTxtActive: { color: C.white },

  // Recommended header (Abeeshak "Recommended" pattern)
  recHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 14 },
  recTitle:   { fontSize: 17, fontWeight: '800', color: C.text },
  recSeeAll:  { fontSize: 13, color: C.primary, fontWeight: '600' },

  // Empty
  emptyWrap:  { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: C.text, marginTop: 12 },
  emptySub:   { fontSize: 13, color: C.muted, marginTop: 4, marginBottom: 16 },
  clearBtn:   { backgroundColor: C.primary, borderRadius: 50, paddingHorizontal: 24, paddingVertical: 11 },
  clearBtnTxt:{ color: C.white, fontWeight: '700', fontSize: 13 },
});