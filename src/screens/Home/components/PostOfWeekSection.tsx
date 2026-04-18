import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@components/common/Button";
import { apiService } from "@/Services/Api";
import { COLORS, SIZES, SHADOWS } from "@constants/theme";
import type { BlogPost } from "@types/index";

interface PostOfWeekSectionProps {
  onPostClick?: (slug: string) => void;
  onViewAllPosts?: () => void;
  onPackagesClick?: () => void;
}

const PostOfWeekSection: React.FC<PostOfWeekSectionProps> = ({
  onPostClick,
  onViewAllPosts,
  onPackagesClick,
}) => {
  const [latestPost, setLatestPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadLatestPost();
  }, []);

  const loadLatestPost = async () => {
    try {
      setLoading(true);
      const posts = await apiService.getLatestBlogPosts(1);
      if (posts.length > 0) {
        setLatestPost(posts[0]);
      }
    } catch (error) {
      console.error("Error loading latest post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = () => {
    if (email.trim()) {
      alert("Thank you for subscribing!");
      setEmail("");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!latestPost) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📝</Text>
        <Text style={styles.emptyTitle}>No Blog Posts Yet</Text>
        <Text style={styles.emptyText}>
          We're working on creating valuable content for you. Check back soon!
        </Text>
        <Button
          title="Visit Blog"
          onPress={onViewAllPosts || (() => {})}
          variant="primary"
          style={styles.emptyButton}
        />
      </View>
    );
  }

  const firstTwoSubheadings =
    latestPost.first_two_subheadings ||
    latestPost.subheadings?.slice(0, 2) ||
    [];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Post of the Week</Text>

      <View style={styles.content}>
        {/* Main Post Content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>{latestPost.title}</Text>
          <Text style={styles.titleHighlight}>Connecting the Dots</Text>
          <View style={styles.underline} />

          <Text style={styles.description}>{latestPost.description}</Text>

          {latestPost.image_2 && (
            <Image
              source={{ uri: latestPost.image_2 }}
              style={styles.postImage}
              resizeMode="cover"
            />
          )}

          {/* Subheadings */}
          {firstTwoSubheadings[0] && (
            <View style={styles.subheadingContainer}>
              <View style={styles.subheadingContent}>
                <Text style={styles.subheadingTitle}>
                  {firstTwoSubheadings[0].title}
                </Text>
                <Text style={styles.subheadingDescription}>
                  {firstTwoSubheadings[0].description}
                </Text>
              </View>

              {latestPost.featured_image && (
                <Image
                  source={{ uri: latestPost.featured_image }}
                  style={styles.subheadingImage}
                  resizeMode="cover"
                />
              )}
            </View>
          )}

          {firstTwoSubheadings[1] && (
            <View style={styles.secondSubheading}>
              <Text style={styles.subheadingTitle}>
                {firstTwoSubheadings[1].title}
              </Text>
              <Text style={styles.subheadingDescription}>
                {firstTwoSubheadings[1].description}
              </Text>
              <Button
                title="GET MORE DETAILS!"
                onPress={() => onPostClick?.(latestPost.slug)}
                variant="primary"
                size="small"
                style={styles.detailsButton}
              />
            </View>
          )}
        </View>

        {/* Newsletter Sidebar */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          style={styles.sidebar}
        >
          <Text style={styles.sidebarTitle}>We Have Some Good News</Text>
          <View style={styles.sidebarUnderline} />

          <Text style={styles.sidebarText}>
            Don't hesitate – sign up for our newsletter now to stay informed
            about our services, gain valuable healthcare insights, and access
            exclusive offers from Etha-Atlantic Memorial Hospital in Lagos,
            Nigeria.
          </Text>

          <TextInput
            style={styles.emailInput}
            placeholder="Type in your email address"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Button
            title="Subscribe"
            onPress={handleSubscribe}
            variant="primary"
            style={styles.subscribeButton}
          />

          <View style={styles.divider} />

          <Text style={styles.packagesTitle}>
            We offer the Best Healthcare Plans
          </Text>
          <Text style={styles.packagesText}>
            Check out our different healthcare packages, ranging from health
            checks, lifestyle plans, UTI checks to sexual health.
          </Text>

          <Button
            title="OUR PACKAGES »"
            onPress={onPackagesClick || (() => {})}
            variant="secondary"
            style={styles.packagesButton}
          />
        </LinearGradient>
      </View>

      <View style={styles.footer}>
        <Button
          title="View All Blog Posts"
          onPress={onViewAllPosts || (() => {})}
          variant="primary"
          size="large"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SIZES.xl,
    backgroundColor: COLORS.white,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: "300",
    color: COLORS.textSecondary,
    marginBottom: SIZES.lg,
    paddingHorizontal: SIZES.paddingLg,
  },
  content: {
    paddingHorizontal: SIZES.paddingLg,
    marginBottom: SIZES.xl,
  },
  mainContent: {
    marginBottom: SIZES.xl,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: "300",
    color: COLORS.textPrimary,
    lineHeight: SIZES.h2 * 1.2,
  },
  titleHighlight: {
    fontSize: SIZES.h2,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: SIZES.sm,
    marginBottom: SIZES.sm,
  },
  underline: {
    width: 80,
    height: 3,
    backgroundColor: COLORS.primary,
    marginBottom: SIZES.md,
  },
  description: {
    fontSize: SIZES.body1,
    lineHeight: SIZES.body1 * 1.6,
    color: COLORS.textSecondary,
    marginBottom: SIZES.lg,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: SIZES.radiusMd,
    marginBottom: SIZES.lg,
  },
  subheadingContainer: {
    marginBottom: SIZES.lg,
  },
  subheadingContent: {
    marginBottom: SIZES.md,
  },
  subheadingTitle: {
    fontSize: SIZES.h4,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: SIZES.sm,
  },
  subheadingDescription: {
    fontSize: SIZES.body2,
    lineHeight: SIZES.body2 * 1.6,
    color: COLORS.textSecondary,
  },
  subheadingImage: {
    width: "100%",
    height: 180,
    borderRadius: SIZES.radiusMd,
  },
  secondSubheading: {
    marginTop: SIZES.md,
  },
  detailsButton: {
    marginTop: SIZES.md,
    alignSelf: "flex-start",
  },
  sidebar: {
    padding: SIZES.paddingLg,
    borderRadius: SIZES.radiusMd,
    ...SHADOWS.large,
  },
  sidebarTitle: {
    fontSize: SIZES.h4,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  sidebarUnderline: {
    width: 64,
    height: 3,
    backgroundColor: COLORS.white,
    marginBottom: SIZES.lg,
  },
  sidebarText: {
    fontSize: SIZES.body2,
    lineHeight: SIZES.body2 * 1.5,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: SIZES.lg,
  },
  emailInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: SIZES.paddingMd,
    paddingHorizontal: SIZES.paddingLg,
    borderRadius: SIZES.radiusFull,
    color: COLORS.white,
    fontSize: SIZES.body2,
    marginBottom: SIZES.md,
  },
  subscribeButton: {
    backgroundColor: COLORS.primary,
    marginBottom: SIZES.lg,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginVertical: SIZES.lg,
  },
  packagesTitle: {
    fontSize: SIZES.h5,
    fontWeight: "700",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: SIZES.sm,
  },
  packagesText: {
    fontSize: SIZES.body2,
    lineHeight: SIZES.body2 * 1.5,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: SIZES.lg,
  },
  packagesButton: {
    backgroundColor: COLORS.secondary,
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: SIZES.paddingLg,
  },
  loadingContainer: {
    paddingVertical: SIZES.xxl,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    paddingVertical: SIZES.xxl,
    paddingHorizontal: SIZES.paddingLg,
    alignItems: "center",
    backgroundColor: COLORS.gray[50],
    borderRadius: SIZES.radiusXl,
    margin: SIZES.paddingLg,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: SIZES.md,
  },
  emptyTitle: {
    fontSize: SIZES.h4,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: SIZES.sm,
  },
  emptyText: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: SIZES.lg,
  },
  emptyButton: {
    backgroundColor: COLORS.gray[600],
  },
});

export default PostOfWeekSection;
