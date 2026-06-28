// src/screens/Blog/BlogPostDetail.tsx
// Full blog-post detail screen — mirrors the web BlogPostDetail.tsx
// Fetches the post from /hospital/blog/<slug>/ and renders images from S3.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  ActivityIndicator,
  Share,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { apiService } from '../../services/api';
import type { BlogPost, SubHeading, TableOfContentsItem } from '../../types';

const { width } = Dimensions.get('window');

// ── Colours ───────────────────────────────────────────────────────────────────
const C = {
  primary:   '#1378e5',
  white:     '#ffffff',
  bg:        '#f5f8ff',
  text:      '#1a2340',
  sub:       '#5a6a85',
  muted:     '#8898aa',
  border:    '#e2eaf5',
  dark:      '#111827',
  green:     '#22c55e',
  overlay:   'rgba(17,24,39,0.72)',
};

// ── Media URL normaliser ──────────────────────────────────────────────────────
const S3_BASE = 'https://etha-hospital-clone-app.s3.eu-north-1.amazonaws.com/media/';

function normalizeMediaUrl(url: string | null | undefined): string | null {
  if (!url || url.trim() === '') return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const clean = url.startsWith('media/') ? url.slice(6) : url;
  return `${S3_BASE}${clean}`;
}

function formatDate(raw?: string): string {
  if (!raw) return '';
  try {
    return new Date(raw).toLocaleDateString('en-US', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch { return raw; }
}

function readTime(post: BlogPost): string {
  const words = ((post.content ?? '') + ' ' + (post.description ?? '')).split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

// ── SVG share icons ───────────────────────────────────────────────────────────
const FacebookIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 256 256">
    <Path fill="#1877f2"
      d="M256 128C256 57.308 198.692 0 128 0S0 57.308 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.348-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.959 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445"
    />
    <Path fill="#fff"
      d="m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A129 129 0 0 0 128 256a129 129 0 0 0 20-1.555V165z"
    />
  </Svg>
);

const XIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 128 128">
    <Path fill={C.dark}
      d="M75.916 54.2L122.542 0h-11.05L71.008 47.06L38.672 0H1.376l48.898 71.164L1.376 128h11.05L55.18 78.303L89.328 128h37.296L75.913 54.2ZM60.782 71.79l-4.955-7.086l-39.42-56.386h16.972L65.19 53.824l4.954 7.086l41.353 59.15h-16.97L60.782 71.793Z"
    />
  </Svg>
);

const LinkedInIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 128 128">
    <Path fill="#0076b2"
      d="M116 3H12a8.91 8.91 0 0 0-9 8.8v104.42a8.91 8.91 0 0 0 9 8.78h104a8.93 8.93 0 0 0 9-8.81V11.77A8.93 8.93 0 0 0 116 3"
    />
    <Path fill="#fff"
      d="M21.06 48.73h18.11V107H21.06zm9.06-29a10.5 10.5 0 1 1-10.5 10.49a10.5 10.5 0 0 1 10.5-10.49m20.41 29h17.36v8h.24c2.42-4.58 8.32-9.41 17.13-9.41C103.6 47.28 107 59.35 107 75v32H88.89V78.65c0-6.75-.12-15.44-9.41-15.44s-10.87 7.36-10.87 15V107H50.53z"
    />
  </Svg>
);

// ── Back button ───────────────────────────────────────────────────────────────
const BackIcon = ({ color = C.white }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path fill={color} d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20z" />
  </Svg>
);

// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  navigation?: any;
  route?: {
    params?: {
      post?: BlogPost;   // shallow data passed from list
      slug?: string;     // or just the slug
    };
  };
}

export default function BlogPostDetail({ navigation, route }: Props) {
  const passedPost  = route?.params?.post;
  const passedSlug  = route?.params?.slug ?? passedPost?.slug;

  const [post,          setPost]         = useState<BlogPost | null>(passedPost ?? null);
  const [related,       setRelated]      = useState<BlogPost[]>([]);
  const [loading,       setLoading]      = useState(!passedPost);
  const [error,         setError]        = useState<string | null>(null);
  const [tocExpanded,   setTocExpanded]  = useState(false);
  const [copied,        setCopied]       = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const headerAnim = useRef(new Animated.Value(0)).current;

  // ── Load full post ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!passedSlug) { setError('No post specified.'); return; }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getBlogPost(passedSlug) as unknown as BlogPost;
        setPost(data);

        // Load related from same category
        const catSlug = (data as any).category?.slug;
        if (catSlug) {
          const cats = await apiService.getBlogPosts(catSlug) as unknown as BlogPost[];
          setRelated(cats.filter(p => p.slug !== passedSlug).slice(0, 4));
        } else {
          const latest = await apiService.getLatestBlogPosts(5) as unknown as BlogPost[];
          setRelated(latest.filter(p => p.slug !== passedSlug).slice(0, 4));
        }
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load post.');
      } finally {
        setLoading(false);
      }
    })();
  }, [passedSlug]);

  // ── Animated header on scroll ──────────────────────────────────────────────
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: headerAnim } } }],
    { useNativeDriver: false }
  );

  const headerBg = headerAnim.interpolate({
    inputRange: [0, 200],
    outputRange: ['rgba(17,24,39,0)', 'rgba(17,24,39,0.95)'],
    extrapolate: 'clamp',
  });

  // ── Share ──────────────────────────────────────────────────────────────────
  const openShare = useCallback((platform: string) => {
    if (!post) return;
    const url   = `https://ettaatlantic.com/blog/${post.slug}`;
    const title = post.title;
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter:  `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    if (urls[platform]) Linking.openURL(urls[platform]);
  }, [post]);

  const handleNativeShare = useCallback(async () => {
    if (!post) return;
    const url = `https://ettaatlantic.com/blog/${post.slug}`;
    try {
      await Share.share({ message: `${post.title}\n\n${url}`, url, title: post.title });
    } catch { /* ignore */ }
  }, [post]);

  const copyLink = useCallback(() => {
    if (!post) return;
    const url = `https://ettaatlantic.com/blog/${post.slug}`;
    // Clipboard API not always available; use Share instead on native
    Share.share({ message: url });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [post]);

  // ── Image sources ──────────────────────────────────────────────────────────
  function imgSrc(rawUrl?: string | null): any {
    const url = normalizeMediaUrl(rawUrl);
    return url ? { uri: url } : null;
  }

  const FALLBACK = require('../../../assets/images/hero-doctor.jpg');
  function safeImg(rawUrl?: string | null): any {
    return imgSrc(rawUrl) ?? FALLBACK;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LOADING / ERROR
  // ──────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={st.centered}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={st.loadingText}>Loading article…</Text>
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={st.centered}>
        <Text style={{ fontSize: 48 }}>📄</Text>
        <Text style={st.errorTitle}>Post Not Found</Text>
        <Text style={st.errorSub}>{error ?? 'This post may have been removed.'}</Text>
        <TouchableOpacity style={st.backBtn} onPress={() => navigation?.goBack()}>
          <Text style={st.backBtnTxt}>← Back to Blog</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // DATA
  // ──────────────────────────────────────────────────────────────────────────
  const featuredUrl  = (post as any).featured_image_url ?? (post as any).featured_image;
  const img1Url      = (post as any).image_1_url ?? (post as any).image_1;
  const img2Url      = (post as any).image_2_url ?? (post as any).image_2;
  const categoryName = (post as any).category?.name ?? 'General Health';
  const authorName   = (post as any).author_name ?? 'Etha-Atlantic';
  const tocItems: TableOfContentsItem[] = post.table_of_contents ?? [];
  const subheadings: SubHeading[]        = post.subheadings ?? [];
  const hasTOC = (post as any).enable_toc !== false && tocItems.length > 0;
  const postUrl = `https://ettaatlantic.com/blog/${post.slug}`;

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <View style={st.root}>

      {/* ── Floating header (animated) ─────────────────────────────────── */}
      <Animated.View style={[st.floatingHeader, { backgroundColor: headerBg }]}>
        <SafeAreaView edges={['top']}>
          <View style={st.floatingHeaderRow}>
            <TouchableOpacity style={st.headerBackBtn} onPress={() => navigation?.goBack()}>
              <BackIcon color={C.white} />
            </TouchableOpacity>
            <TouchableOpacity style={st.headerShareBtn} onPress={handleNativeShare}>
              <Ionicons name="share-outline" size={20} color={C.white} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* ── Scrollable body ──────────────────────────────────────────────── */}
      <Animated.ScrollView
        ref={scrollRef}
        style={st.scroll}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 60 }}
      >

        {/* ── Hero image ─────────────────────────────────────────────────── */}
        <View style={st.heroWrap}>
          <Image source={safeImg(featuredUrl)} style={st.heroImg} resizeMode="cover" />
          <View style={st.heroGrad}>
            {/* Category badge */}
            <View style={st.catBadge}>
              <Ionicons name="pricetag-outline" size={10} color={C.white} />
              <Text style={st.catBadgeTxt}>{categoryName}</Text>
            </View>
            {/* Title */}
            <Text style={st.heroTitle}>{post.title}</Text>
            {/* Author + date + read time */}
            <View style={st.heroMeta}>
              <View style={st.authorChip}>
                <View style={st.authorAvatar}>
                  <Text style={st.authorAvatarTxt}>EA</Text>
                </View>
                <Text style={st.authorName}>{authorName}</Text>
              </View>
              <View style={st.metaPill}>
                <Ionicons name="calendar-outline" size={11} color="rgba(255,255,255,0.75)" />
                <Text style={st.metaPillTxt}>{formatDate(post.created_at)}</Text>
              </View>
              <View style={st.metaPill}>
                <Ionicons name="time-outline" size={11} color="rgba(255,255,255,0.75)" />
                <Text style={st.metaPillTxt}>{readTime(post)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Body ──────────────────────────────────────────────────────── */}
        <View style={st.body}>

          {/* Description (italic intro) */}
          <View style={st.descBlock}>
            <View style={st.descAccent} />
            <Text style={st.descTxt}>{post.description}</Text>
          </View>

          {/* ── Table of Contents ──────────────────────────────────────── */}
          {hasTOC && (
            <View style={st.tocCard}>
              <TouchableOpacity
                style={st.tocHeader}
                onPress={() => setTocExpanded(p => !p)}
                activeOpacity={0.8}
              >
                <View style={st.tocIconWrap}>
                  <Ionicons name="list-outline" size={16} color={C.white} />
                </View>
                <Text style={st.tocTitle}>Table of Contents</Text>
                <Ionicons
                  name={tocExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
                  size={18} color={C.sub}
                />
              </TouchableOpacity>

              {tocExpanded && (
                <View style={st.tocBody}>
                  {tocItems.map((item, idx) => (
                    <View key={item.id ?? idx} style={st.tocRow}>
                      <View style={st.tocNum}>
                        <Text style={st.tocNumTxt}>{idx + 1}</Text>
                      </View>
                      <Text style={[
                        st.tocItemTxt,
                        item.level === 3 && { paddingLeft: 12, fontSize: 12 },
                        item.level === 4 && { paddingLeft: 20, fontSize: 11 },
                      ]}>
                        {item.title}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* ── Subheadings / sections ─────────────────────────────────── */}
          {subheadings.length > 0 && (
            <View style={st.sectionsWrap}>
              {subheadings.map((sh, idx) => (
                <View key={sh.id ?? idx} style={st.sectionCard}>
                  <View style={st.sectionNumBadge}>
                    <Text style={st.sectionNumTxt}>{idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={st.sectionTitle}>{sh.title}</Text>
                    {sh.description ? (
                      <Text style={st.sectionDesc}>{sh.description}</Text>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ── Additional images ─────────────────────────────────────── */}
          {(img1Url || img2Url) && (
            <View style={st.extraImgsRow}>
              {img1Url ? (
                <Image
                  source={{ uri: normalizeMediaUrl(img1Url)! }}
                  style={[st.extraImg, img2Url ? { marginRight: 8 } : { width: '100%' }]}
                  resizeMode="cover"
                />
              ) : null}
              {img2Url ? (
                <Image
                  source={{ uri: normalizeMediaUrl(img2Url)! }}
                  style={st.extraImg}
                  resizeMode="cover"
                />
              ) : null}
            </View>
          )}

          {/* ── Content (plain text fallback — RN can't render HTML) ───── */}
          {post.content ? (
            <View style={st.contentBlock}>
              <Text style={st.contentHint}>Full Article</Text>
              <Text style={st.contentTxt}>
                {/* Strip basic HTML tags for plain-text rendering */}
                {post.content.replace(/<[^>]+>/g, '').trim()}
              </Text>
            </View>
          ) : null}

          {/* ── Divider ───────────────────────────────────────────────── */}
          <View style={st.divider} />

          {/* ── Share bar ─────────────────────────────────────────────── */}
          <View style={st.shareSection}>
            <Text style={st.shareHeading}>Share this article</Text>
            <View style={st.shareRow}>
              <TouchableOpacity style={st.sharePlatformBtn} onPress={() => openShare('facebook')} activeOpacity={0.75}>
                <FacebookIcon />
              </TouchableOpacity>
              <TouchableOpacity style={st.sharePlatformBtn} onPress={() => openShare('twitter')} activeOpacity={0.75}>
                <XIcon />
              </TouchableOpacity>
              <TouchableOpacity style={st.sharePlatformBtn} onPress={() => openShare('linkedin')} activeOpacity={0.75}>
                <LinkedInIcon />
              </TouchableOpacity>
              <TouchableOpacity
                style={[st.sharePlatformBtn, copied && { borderColor: C.green }]}
                onPress={copyLink}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={copied ? 'checkmark-circle-outline' : 'link-outline'}
                  size={16}
                  color={copied ? C.green : C.sub}
                />
              </TouchableOpacity>
              <TouchableOpacity style={[st.sharePlatformBtn, { backgroundColor: C.primary, borderColor: C.primary }]} onPress={handleNativeShare} activeOpacity={0.75}>
                <Ionicons name="share-social-outline" size={16} color={C.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Filed under ───────────────────────────────────────────── */}
          <View style={st.filedRow}>
            <Text style={st.filedLabel}>Filed under:</Text>
            <View style={st.filedBadge}>
              <Ionicons name="pricetag-outline" size={11} color={C.primary} />
              <Text style={st.filedBadgeTxt}>{categoryName}</Text>
            </View>
          </View>

          {/* ── Author card ───────────────────────────────────────────── */}
          <View style={st.authorCard}>
            <View style={st.authorCardAvatar}>
              <Text style={st.authorCardAvatarTxt}>EA</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={st.authorCardName}>Etha-Atlantic Memorial Hospital</Text>
              <Text style={st.authorCardRole}>
                {(post as any).author_role ?? 'Medical Team'}
              </Text>
              <Text style={st.authorCardBio}>
                Evidence-based health information from our team of medical professionals.
              </Text>
            </View>
          </View>

          {/* ── Divider ───────────────────────────────────────────────── */}
          {related.length > 0 && <View style={st.divider} />}

          {/* ── Related posts ─────────────────────────────────────────── */}
          {related.length > 0 && (
            <View style={st.relatedSection}>
              <Text style={st.relatedHeading}>Related Articles</Text>
              {related.map(r => {
                const rImg = normalizeMediaUrl((r as any).featured_image_url ?? (r as any).featured_image);
                return (
                  <TouchableOpacity
                    key={r.id}
                    style={st.relatedCard}
                    onPress={() => navigation?.navigate?.('BlogPost', { post: r, slug: r.slug })}
                    activeOpacity={0.85}
                  >
                    {rImg ? (
                      <Image source={{ uri: rImg }} style={st.relatedImg} resizeMode="cover" />
                    ) : (
                      <View style={[st.relatedImg, { backgroundColor: C.primary + '33' }]}>
                        <Ionicons name="document-text-outline" size={24} color={C.primary} />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={st.relatedTitle} numberOfLines={2}>{r.title}</Text>
                      <Text style={st.relatedDate}>{formatDate(r.created_at)}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={C.muted} />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* ── Back to blog ──────────────────────────────────────────── */}
          <TouchableOpacity
            style={st.backToBlog}
            onPress={() => navigation?.goBack()}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-back" size={16} color={C.primary} />
            <Text style={st.backToBlogTxt}>Back to Blog</Text>
          </TouchableOpacity>

        </View>
      </Animated.ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const HERO_H = width * 0.72;

const st = StyleSheet.create({
  root:        { flex: 1, backgroundColor: C.bg },
  scroll:      { flex: 1 },
  centered:    { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: C.bg },
  loadingText: { marginTop: 12, color: C.sub, fontSize: 14 },
  errorTitle:  { fontSize: 22, fontWeight: '800', color: C.text, marginTop: 12 },
  errorSub:    { fontSize: 13, color: C.muted, textAlign: 'center', marginTop: 6, marginBottom: 20 },
  backBtn:     { backgroundColor: C.primary, borderRadius: 50, paddingHorizontal: 24, paddingVertical: 12 },
  backBtnTxt:  { color: C.white, fontWeight: '700', fontSize: 14 },

  // ── Floating header ──────────────────────────────────────────────────────
  floatingHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
  },
  floatingHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  headerBackBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerShareBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
  },

  // ── Hero ─────────────────────────────────────────────────────────────────
  heroWrap:  { width, height: HERO_H, position: 'relative' },
  heroImg:   { width: '100%', height: '100%' },
  heroGrad:  {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: C.overlay,
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24,
  },
  catBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: C.primary, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4, marginBottom: 10,
  },
  catBadgeTxt: { color: C.white, fontSize: 10, fontWeight: '700' },
  heroTitle:   { color: C.white, fontSize: 20, fontWeight: '800', lineHeight: 28, marginBottom: 14 },
  heroMeta:    { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  authorChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  authorAvatar: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: C.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  authorAvatarTxt: { color: C.white, fontSize: 8, fontWeight: '800' },
  authorName:      { color: C.white, fontSize: 11, fontWeight: '700' },
  metaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20, paddingHorizontal: 9, paddingVertical: 4,
  },
  metaPillTxt: { color: 'rgba(255,255,255,0.85)', fontSize: 10 },

  // ── Body ─────────────────────────────────────────────────────────────────
  body: { paddingHorizontal: 18, paddingTop: 22 },

  descBlock: { flexDirection: 'row', marginBottom: 22, gap: 12 },
  descAccent: { width: 4, borderRadius: 4, backgroundColor: C.primary, flexShrink: 0 },
  descTxt: { flex: 1, fontSize: 14, color: C.sub, lineHeight: 22, fontStyle: 'italic' },

  // ── TOC ──────────────────────────────────────────────────────────────────
  tocCard: {
    backgroundColor: C.white, borderRadius: 16,
    borderWidth: 1, borderColor: C.border,
    overflow: 'hidden', marginBottom: 22,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  tocHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14,
  },
  tocIconWrap: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: C.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  tocTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: C.text },
  tocBody:  { paddingHorizontal: 14, paddingBottom: 14, gap: 4 },
  tocRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 6 },
  tocNum: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: C.primary + '1A',
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  tocNumTxt:  { fontSize: 10, fontWeight: '800', color: C.primary },
  tocItemTxt: { fontSize: 13, color: C.text, lineHeight: 20, flex: 1 },

  // ── Sections ─────────────────────────────────────────────────────────────
  sectionsWrap: { gap: 12, marginBottom: 22 },
  sectionCard: {
    backgroundColor: C.white, borderRadius: 14,
    padding: 14, flexDirection: 'row', gap: 12,
    borderLeftWidth: 3, borderLeftColor: C.primary,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  sectionNumBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: C.primary,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  sectionNumTxt:  { color: C.white, fontWeight: '800', fontSize: 12 },
  sectionTitle:   { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 4 },
  sectionDesc:    { fontSize: 12, color: C.sub, lineHeight: 18 },

  // ── Extra images ──────────────────────────────────────────────────────────
  extraImgsRow: { flexDirection: 'row', marginBottom: 22 },
  extraImg: {
    flex: 1, height: 160, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },

  // ── Content block ─────────────────────────────────────────────────────────
  contentBlock: { marginBottom: 22 },
  contentHint: {
    fontSize: 11, fontWeight: '700', color: C.muted,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
  },
  contentTxt: { fontSize: 14, color: C.text, lineHeight: 23 },

  // ── Divider ───────────────────────────────────────────────────────────────
  divider: { height: 1, backgroundColor: C.border, marginVertical: 22 },

  // ── Share ─────────────────────────────────────────────────────────────────
  shareSection: { marginBottom: 22 },
  shareHeading: { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 12 },
  shareRow:     { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  sharePlatformBtn: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 1.5, borderColor: C.border,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: C.white,
  },

  // ── Filed under ───────────────────────────────────────────────────────────
  filedRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 22 },
  filedLabel:   { fontSize: 12, color: C.muted },
  filedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#eff6ff', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  filedBadgeTxt: { color: C.primary, fontSize: 12, fontWeight: '700' },

  // ── Author card ───────────────────────────────────────────────────────────
  authorCard: {
    backgroundColor: C.white, borderRadius: 16,
    padding: 16, flexDirection: 'row', gap: 14,
    borderWidth: 1, borderColor: C.border,
    marginBottom: 22,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  authorCardAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: C.primary,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
    borderWidth: 2, borderColor: '#eff6ff',
  },
  authorCardAvatarTxt: { color: C.white, fontWeight: '800', fontSize: 14 },
  authorCardName:      { fontSize: 14, fontWeight: '800', color: C.text, marginBottom: 2 },
  authorCardRole:      { fontSize: 11, fontWeight: '600', color: C.primary, marginBottom: 6 },
  authorCardBio:       { fontSize: 12, color: C.sub, lineHeight: 18 },

  // ── Related ───────────────────────────────────────────────────────────────
  relatedSection: { marginBottom: 22 },
  relatedHeading: { fontSize: 16, fontWeight: '800', color: C.text, marginBottom: 14 },
  relatedCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: C.white, borderRadius: 14,
    padding: 12, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  relatedImg: {
    width: 64, height: 64, borderRadius: 10,
    backgroundColor: C.border,
    justifyContent: 'center', alignItems: 'center',
  },
  relatedTitle: { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 4, flex: 1 },
  relatedDate:  { fontSize: 11, color: C.muted },

  // ── Back to blog ──────────────────────────────────────────────────────────
  backToBlog: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    justifyContent: 'center',
    paddingVertical: 14, marginTop: 4,
    borderWidth: 1.5, borderColor: C.primary,
    borderRadius: 50,
  },
  backToBlogTxt: { color: C.primary, fontWeight: '700', fontSize: 14 },
});